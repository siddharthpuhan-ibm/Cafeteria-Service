from fastapi import FastAPI
from .database import engine, Base
from . import models

app = FastAPI(title="Cafeteria Reservation Service")

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Cafeteria Service Running!"}
