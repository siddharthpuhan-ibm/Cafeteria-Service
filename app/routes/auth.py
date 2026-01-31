from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, TokenResponse
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.w3_id == payload.w3_id).first()

    if not user:
        user = User(
            w3_id=payload.w3_id,
            name=payload.name,
            manager_w3_id=payload.manager_w3_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"w3_id": user.w3_id})

    return {
        "access_token": token,
        "token_type": "bearer",
    }
