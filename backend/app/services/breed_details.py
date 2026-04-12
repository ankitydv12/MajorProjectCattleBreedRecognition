from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.orm import Session

def clean_breed_name(breed_name: str) -> str:
    name = breed_name.strip()
    for suffix in [' Cow', ' Buffalo', ' Bull', ' cow', ' buffalo', ' bull']:
        if name.endswith(suffix):
            name = name[:-len(suffix)].strip()
    return name

def parse_list(value):
    """Convert string to list if needed."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [x.strip() for x in str(value).split(',') if x.strip()]

def get_breed_summary(db: Session, breed_name: str):
    name = clean_breed_name(breed_name)
    result = db.execute(
        text("SELECT * FROM breed_summary WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": name}
    ).fetchone()
    if not result:
        return None
    data = dict(result._mapping)
    data['also_known_as'] = parse_list(data.get('also_known_as'))
    data['special_traits'] = parse_list(data.get('special_traits'))
    return data

def get_breed_diet(db: Session, breed_name: str):
    name = clean_breed_name(breed_name)
    result = db.execute(
        text("SELECT * FROM breed_diet WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": name}
    ).fetchone()
    if not result:
        return None
    data = dict(result._mapping)
    data['recommended_fodder'] = parse_list(data.get('recommended_fodder'))
    data['recommended_concentrate'] = parse_list(data.get('recommended_concentrate'))
    data['minerals_supplements'] = parse_list(data.get('minerals_supplements'))
    data['feeding_schedule'] = parse_list(data.get('feeding_schedule'))
    data['foods_to_avoid'] = parse_list(data.get('foods_to_avoid'))
    return data

def get_breed_diseases(db: Session, breed_name: str):
    name = clean_breed_name(breed_name)
    results = db.execute(
        text("SELECT * FROM breed_diseases WHERE LOWER(breed_name) = LOWER(:name)"),
        {"name": name}
    ).fetchall()
    diseases = []
    for r in results:
        data = dict(r._mapping)
        data['symptoms'] = parse_list(data.get('symptoms'))
        data['prevention'] = parse_list(data.get('prevention'))
        data['remedy'] = parse_list(data.get('remedy'))
        diseases.append(data)
    return diseases

def get_breed_full(db: Session, breed_name: str):
    return {
        "summary": get_breed_summary(db, breed_name),
        "diet": get_breed_diet(db, breed_name),
        "diseases": get_breed_diseases(db, breed_name)
    }

def get_all_symptoms(db):
    results = db.execute(
        text("SELECT DISTINCT symptom FROM symptoms_lookup ORDER BY symptom")
    ).fetchall()
    return [r[0] for r in results]

def check_symptoms(db, symptoms: list):
    results = db.execute(
        text("""
            SELECT disease_name, severity, remedy, prevention,
            COUNT(*) as match_count,
            ARRAY_AGG(symptom) as matched_symptoms
            FROM symptoms_lookup
            WHERE LOWER(symptom) = ANY(:symptoms)
            GROUP BY disease_name, severity, remedy, prevention
            ORDER BY match_count DESC
        """),
        {"symptoms": [s.lower() for s in symptoms]}
    ).fetchall()
    return [dict(r._mapping) for r in results]

def get_seasonal_diet(db: Session, breed_name: str, season: str):
    name = clean_breed_name(breed_name)
    result = db.execute(
        text("""SELECT * FROM seasonal_diet
                WHERE LOWER(breed_name) = LOWER(:name)
                AND LOWER(season) = LOWER(:season)"""),
        {"name": name, "season": season}
    ).fetchone()
    if not result:
        return None
    data = dict(result._mapping)
    data['special_fodder'] = parse_list(data.get('special_fodder'))
    data['management_tips'] = parse_list(data.get('management_tips'))
    data['health_alerts'] = parse_list(data.get('health_alerts'))
    return data
