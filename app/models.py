from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime
from .database import Base
import enum

class SeatStatus(enum.Enum):
    available = "available"
    reserved = "reserved"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    w3_id = Column(String, unique=True, index=True)
    name = Column(String)
    manager_w3_id = Column(String)

    bookings = relationship("Booking", back_populates="user")

class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    seat_number = Column(Integer, unique=True)
    status = Column(Enum(SeatStatus), default=SeatStatus.available)

    bookings = relationship("Booking", back_populates="seat")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    seat_id = Column(Integer, ForeignKey("seats.id"))

    start_time = Column(DateTime)
    end_time = Column(DateTime)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
    seat = relationship("Seat", back_populates="bookings")


class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    w3_id = Column(String, unique=True, index=True)
    balance = Column(Integer, default=0)
