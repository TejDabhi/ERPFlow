import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for local testing if DATABASE_URL is not set in the environment
if not DATABASE_URL:
    DATABASE_URL = "postgresql://erpflow_db_user:IEzBKobuIz4fsS7wQGi1q5j9dIYHXebT@dpg-dap2183tqb8s73f27l60-a.oregon-postgres.render.com/erpflow_db"

# Ensure compatibility with SQLAlchemy dialects
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()