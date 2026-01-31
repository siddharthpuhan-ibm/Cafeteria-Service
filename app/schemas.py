from pydantic import BaseModel
from datetime import datetime
from typing import List

# login request schemas
class LoginRequest(BaseModel):
    w3_id: str
    name: str
    manager_w3_id: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# seat schemas
class SeatResponse(BaseModel):
    seat_number: int
    status: str

    class Config:
        orm_mode = True


# booking schemas
# request
class BookingCreate(BaseModel):
    seat_number: int
    start_time: datetime
    end_time: datetime

# response
class BookingResponse(BaseModel):
    id: int
    user_id: int
    seat_number: int
    start_time: datetime
    end_time: datetime
    timestamp: datetime

    class Config:
        orm_mode = True


# user schema
class UserResponse(BaseModel):
    w3_id: str
    name: str
    manager_w3_id: str

    class Config:
        orm_mode = True