import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .database import engine, Base
from . import models
from app.routes import auth, reservations, admin
from app.seed import seed_initial_data, seed_managers

# Load session secret from environment
SESSION_SECRET = os.getenv("APP_SESSION_SECRET", "dev-secret-key-change-in-production")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    seed_managers()
    yield
    # Shutdown (if needed)


app = FastAPI(
    title="Cafeteria Reservation Service - Blu-Reserve",
    description="""
    Complete cafeteria seat booking system with OIDC authentication.
    
    ## Features
    
    * 🔐 **OIDC Authentication** - IBM w3id SSO integration
    * 🪑 **100 Seats** - Grid-based seat selection (A1-J10)
    * ⏰ **Timeslot Management** - 30-minute booking slots
    * 💰 **Blu-Dollar Charging** - Automatic manager account deduction
    * 🚫 **Double-Booking Prevention** - Database-level constraints
    * 📊 **Real-time Availability** - Live seat status updates
    
    ## Quick Start
    
    1. Start backend: `uvicorn app.main:app --reload`
    2. Access Swagger: http://localhost:8000/docs
    3. Start frontend: `cd Frontend && npm run dev`
    4. Open: http://localhost:3000
    
    ## Documentation
    
    * [API Documentation](./API_DOCUMENTATION.md)
    * [Verification Guide](./VERIFICATION_GUIDE.md)
    * [Testing Guide](./TESTING_GUIDE.md)
    * [Database Setup](./DATABASE_SETUP.md)
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# Add session middleware (required for OAuth state/nonce tracking)
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    max_age=86400,  # 24 hours
    same_site="lax",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(reservations.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Cafeteria Service Running!"}
