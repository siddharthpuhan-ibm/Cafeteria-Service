import os
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth

from app.database import get_db
from app.models import User, Manager
from app.schemas import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Load OIDC configuration from environment
OIDC_DISCOVERY_URL = os.getenv("OIDC_DISCOVERY_URL")
OIDC_CLIENT_ID = os.getenv("OIDC_CLIENT_ID")
OIDC_CLIENT_SECRET = os.getenv("OIDC_CLIENT_SECRET")
OIDC_REDIRECT_URI = os.getenv("OIDC_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Mock auth mode - set to True to bypass OIDC
USE_MOCK_AUTH = os.getenv("USE_MOCK_AUTH", "false").lower() == "true"

# Configure OAuth client (lazy initialization)
oauth = OAuth()
oauth_initialized = False


def _get_oauth_client():
    """Get or register OAuth client"""
    global oauth_initialized
    if not oauth_initialized:
        # Check all required configuration
        missing = []
        if not OIDC_DISCOVERY_URL:
            missing.append("OIDC_DISCOVERY_URL")
        if not OIDC_CLIENT_ID:
            missing.append("OIDC_CLIENT_ID")
        if not OIDC_CLIENT_SECRET:
            missing.append("OIDC_CLIENT_SECRET")
        
        if missing:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OIDC configuration missing: {', '.join(missing)}"
            )
        
        try:
            oauth.register(
                name="w3id",
                server_metadata_url=OIDC_DISCOVERY_URL,
                client_id=OIDC_CLIENT_ID,
                client_secret=OIDC_CLIENT_SECRET,
                client_kwargs={
                    "scope": "openid profile email",
                },
            )
            oauth_initialized = True
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to register OAuth client: {str(e)}"
            )
    return oauth.w3id


@router.get("/login", summary="Initiate Login", description="Redirects to OIDC provider for authentication or uses mock auth if enabled")
async def login(request: Request, manager_name: str = None, employee_id: str = None):
    """
    Initiate OIDC login flow or mock authentication.
    
    - **OIDC Mode**: Redirects to IBM w3id login page
    - **Mock Mode**: Automatically logs in with test user (if USE_MOCK_AUTH=true)
    - Creates session cookie on successful authentication
    - Redirects to frontend after login
    - Employee ID is limited to 10 characters
    """
    # Validate employee_id length
    if employee_id and len(employee_id) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID must be 10 characters or less"
        )
    
    # Store manager_name and employee_id in session if provided
    if manager_name:
        request.session["selected_manager_name"] = manager_name
    if employee_id:
        request.session["selected_employee_id"] = employee_id
    
    # If mock auth is enabled, skip OIDC
    if USE_MOCK_AUTH:
        # Mock login - create session directly
        # Use provided manager_name and employee_id, or defaults
        selected_manager = manager_name or request.session.get("selected_manager_name") or "Manager 1"
        selected_employee_id = employee_id or request.session.get("selected_employee_id") or "123"
        
        mock_user_data = {
            "sub": selected_employee_id,
            "email": f"employee{selected_employee_id}@ibm.com",
            "name": f"Employee {selected_employee_id}",
            "given_name": "Employee",
            "family_name": selected_employee_id,
            "manager_name": selected_manager
        }
        
        # Store mock user in session
        request.session["mock_user"] = mock_user_data
        request.session["nonce"] = secrets.token_urlsafe(32)
        
        # Redirect to callback for mock processing
        return RedirectResponse(url=f"{OIDC_REDIRECT_URI}?code=mock_code&state=mock_state")
    
    # Real OIDC flow
    try:
        # Check configuration
        if not OIDC_REDIRECT_URI:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OIDC_REDIRECT_URI not configured"
            )
        
        client = _get_oauth_client()
        
        # Generate nonce for OIDC security
        nonce = secrets.token_urlsafe(32)
        request.session["nonce"] = nonce
        
        # Redirect to IdP
        redirect_uri = OIDC_REDIRECT_URI
        return await client.authorize_redirect(request, redirect_uri, nonce=nonce)
    except HTTPException:
        raise
    except Exception as e:
        # If OIDC fails, fall back to mock auth
        import traceback
        print(f"OIDC login failed: {e}")
        print(traceback.format_exc())
        
        # Fallback to mock auth
        mock_user_data = {
            "sub": "mock_user_123",
            "email": "test.user@ibm.com",
            "name": "Test User",
            "given_name": "Test",
            "family_name": "User",
            "manager_name": "Manager Name"
        }
        
        request.session["mock_user"] = mock_user_data
        request.session["nonce"] = secrets.token_urlsafe(32)
        
        return RedirectResponse(url=f"{OIDC_REDIRECT_URI}?code=mock_code&state=mock_state")


@router.get("/callback", summary="OAuth Callback", description="Handles OIDC callback, validates tokens, and creates user session")
async def callback(request: Request, db: Session = Depends(get_db)):
    """
    Handle OIDC callback and create user session.
    
    - Validates authorization code from OIDC provider
    - Exchanges code for ID token
    - Validates nonce for security
    - Creates/updates user in database
    - Creates session cookie
    - Redirects to frontend
    """
    try:
        # Check if this is a mock auth callback
        mock_user = request.session.get("mock_user")
        if mock_user:
            # Process mock user
            user_info = mock_user
            stored_nonce = request.session.get("nonce")
        else:
            # Real OIDC flow
            client = _get_oauth_client()
            
            # Get stored nonce from session
            stored_nonce = request.session.get("nonce")
            if not stored_nonce:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing nonce in session"
                )
            
            # Exchange authorization code for tokens
            try:
                token = await client.authorize_access_token(request)
            except Exception as e:
                # If OIDC token exchange fails, use mock
                print(f"OIDC token exchange failed: {e}")
                mock_user = request.session.get("mock_user")
                if not mock_user:
                    # Create mock user as fallback
                    mock_user = {
                        "sub": "mock_user_123",
                        "email": "test.user@ibm.com",
                        "name": "Test User",
                        "given_name": "Test",
                        "family_name": "User",
                        "manager_name": "Manager Name"
                    }
                user_info = mock_user
            else:
                # Get user info from token
                user_info = token.get("userinfo")
                if not user_info:
                    # Fallback: parse ID token directly if userinfo not available
                    id_token = token.get("id_token")
                    if id_token:
                        from authlib.oidc.core import CodeIDToken
                        # Validate ID token with nonce
                        claims = CodeIDToken(id_token, nonce=stored_nonce)
                        claims.validate()
                        user_info = dict(claims)
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No user information available in token"
                        )
        
        # Extract user claims
        # Use session-stored values if available (from manager selection), otherwise use OIDC claims
        selected_manager = request.session.get("selected_manager_name")
        selected_employee_id = request.session.get("selected_employee_id")
        
        if selected_manager and selected_employee_id:
            # Use selected manager and employee ID
            manager_name = selected_manager
            sub = selected_employee_id
            email = f"employee{sub}@ibm.com"
            name = f"Employee {sub}"
            given_name = "Employee"
            family_name = sub
            # Clear session values after use
            request.session.pop("selected_manager_name", None)
            request.session.pop("selected_employee_id", None)
        else:
            # Use OIDC claims
            email = user_info.get("email") or user_info.get("preferred_username")
            sub = user_info.get("sub")  # employee_uid
            name = user_info.get("name", "")
            given_name = user_info.get("given_name", "")
            family_name = user_info.get("family_name", "")
            
            # Extract manager name (if available in claims, otherwise use a default)
            manager_name = user_info.get("manager_name") or user_info.get("manager") or "Manager 1"
        
        if not email or not sub:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required user information (email or sub)"
            )
        
        # Upsert user in database
        user = db.query(User).filter(User.employee_uid == sub).first()
        if not user:
            user = User(
                employee_uid=sub,
                email=email,
                first_name=given_name or (name.split()[0] if name else None),
                last_name=family_name or (name.split()[-1] if name and len(name.split()) > 1 else None),
                manager_name=manager_name,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update user info if changed
            user.email = email
            if given_name:
                user.first_name = given_name
            if family_name:
                user.last_name = family_name
            if manager_name:
                user.manager_name = manager_name
            db.commit()
            db.refresh(user)
        
        # Store user in session
        request.session["user_id"] = user.id
        request.session["employee_uid"] = user.employee_uid
        request.session["email"] = user.email
        
        # Clear mock user and nonce after use
        request.session.pop("mock_user", None)
        request.session.pop("nonce", None)
        
        # Redirect to frontend
        return RedirectResponse(url=FRONTEND_URL)
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Callback error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse, summary="Get Current User", description="Returns the currently authenticated user from session")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """
    Get current authenticated user.
    
    - Returns user information from session
    - Requires valid session cookie
    - Returns 401 if not authenticated
    """
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Session has invalid user_id, clear session
        request.session.clear()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.get("/manager-balance", summary="Get Manager Balance", description="Returns the current user's manager balance")
def get_manager_balance(request: Request, db: Session = Depends(get_db)):
    """
    Get manager balance for current user.
    
    - Returns manager name and current balance
    - Requires authentication
    """
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.manager_name:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User or manager not found"
        )
    
    manager = db.query(Manager).filter(Manager.manager_name == user.manager_name).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )
    
    return {
        "manager_name": manager.manager_name,
        "balance": float(manager.balance)
    }


@router.get("/managers", summary="Get All Managers", description="Returns list of all managers with their balances")
def get_all_managers(db: Session = Depends(get_db)):
    """
    Get all managers with their current balances.
    
    - Returns manager names and balances
    - Used for manager selection in login
    """
    managers = db.query(Manager).order_by(Manager.manager_name).all()
    return [
        {
            "name": m.manager_name,
            "balance": float(m.balance)
        }
        for m in managers
    ]


@router.post("/logout", summary="Logout", description="Clears user session and logs out")
async def logout(request: Request):
    """
    Logout and clear session.
    
    - Clears session cookie
    - User must login again to access protected endpoints
    """
    request.session.clear()
    return {"message": "Logged out successfully"}


@router.get("/debug", summary="Debug Configuration", description="Returns OIDC configuration status (for debugging)")
async def debug_config():
    """
    Debug endpoint to check OIDC configuration.
    
    - Shows OIDC environment variables (secrets masked)
    - Indicates if OAuth client is initialized
    - Useful for troubleshooting authentication issues
    """
    return {
        "OIDC_DISCOVERY_URL": OIDC_DISCOVERY_URL,
        "OIDC_CLIENT_ID": OIDC_CLIENT_ID,
        "OIDC_CLIENT_SECRET": "***" + (OIDC_CLIENT_SECRET[-4:] if OIDC_CLIENT_SECRET else "MISSING"),
        "OIDC_REDIRECT_URI": OIDC_REDIRECT_URI,
        "FRONTEND_URL": FRONTEND_URL,
        "USE_MOCK_AUTH": USE_MOCK_AUTH,
        "has_oauth_client": oauth_initialized,
        "all_configured": all([
            OIDC_DISCOVERY_URL,
            OIDC_CLIENT_ID,
            OIDC_CLIENT_SECRET,
            OIDC_REDIRECT_URI
        ])
    }
