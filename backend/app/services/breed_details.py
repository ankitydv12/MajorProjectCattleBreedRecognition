from sqlalchemy.orm import Session
from sqlalchemy import text

def get_breed_summary(db: Session, breed_name: str):
    result = db.execute(
        text("SELECT * FROM breed_summary WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": breed_name}
    ).fetchone()
    return dict(result._mapping) if result else None

def get_breed_diet(db: Session, breed_name: str):
    result = db.execute(
        text("SELECT * FROM breed_diet WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": breed_name}
    ).fetchone()
    return dict(result._mapping) if result else None

def get_breed_diseases(db: Session, breed_name: str):
    results = db.execute(
        text("SELECT * FROM breed_diseases WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": breed_name}
    ).fetchall()
    return [dict(r._mapping) for r in results] if results else []

def get_breed_full(db: Session, breed_name: str):
    return {
        "summary": get_breed_summary(db, breed_name),
        "diet": get_breed_diet(db, breed_name),
        "diseases": get_breed_diseases(db, breed_name)
    }
