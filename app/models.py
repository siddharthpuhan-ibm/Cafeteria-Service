from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    w3_id = Column(String, unique=True, index=True)
    name = Column(String)
    manager_name = Column(String)

    bookings = relationship("Booking", back_populates="user")


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    seat_number = Column(Integer, unique=True)
    is_available = Column(Boolean, default=True)

    bookings = relationship("Booking", back_populates="seat")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    seat_id = Column(Integer, ForeignKey("seats.id"))
    timeslot = Column(String)
    date = Column(String)

    user = relationship("User", back_populates="bookings")
    seat = relationship("Seat", back_populates="bookings")


class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    balance = Column(Integer, default=0)
