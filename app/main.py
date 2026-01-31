from fastapi import FastAPI
from .database import engine, Base
from . import models
from app.routes import auth

app = FastAPI(title="Cafeteria Reservation Service")
app.include_router(auth.router)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Cafeteria Service Running!"}
