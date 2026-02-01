import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Use Postgres if DATABASE_URL is set, otherwise fall back to SQLite for local dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cafeteria.db")

if DATABASE_URL.startswith("postgres"):
    # Postgres connection with proper isolation level for transactions
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using
        isolation_level="READ COMMITTED"  # Standard isolation level
    )
else:
    # SQLite connection (for local dev without Postgres)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        isolation_level="SERIALIZABLE"  # SQLite default, prevents race conditions
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
