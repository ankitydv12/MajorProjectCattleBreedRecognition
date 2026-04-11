from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os, time, logging

logger = logging.getLogger(__name__)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cattleuser:cattlepass@db:5432/cattledb")
Base = declarative_base()

def get_engine(retries=5, delay=3):
    for i in range(retries):
        try:
            engine = create_engine(DATABASE_URL, pool_pre_ping=True)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Database connected successfully")
            return engine
        except Exception as e:
            logger.warning(f"DB connection attempt {i+1} failed: {e}")
            time.sleep(delay)
    raise Exception("Could not connect to database")

engine = get_engine()
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
