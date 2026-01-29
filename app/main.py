from fastapi import FastAPI

app = FastAPI(title="Cafeteria Reservation Service")

@app.get("/")
def root():
    return {"message": "Cafeteria Service Running!"}