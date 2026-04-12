import os

# breed_details.py
bd_path = "backend/app/services/breed_details.py"
with open(bd_path, "r") as f:
    content = f.read()

new_func = """
def get_seasonal_diet(breed_name: str, season: str, db: Session):
    query = text(\"\"\"
        SELECT dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters,
               special_fodder, management_tips, health_alerts
        FROM seasonal_diet
        WHERE breed_name = :breed_name AND season = :season
    \"\"\")
    result = db.execute(query, {"breed_name": breed_name, "season": season}).fetchone()
    if result:
        return {
            "dry_fodder_kg": result[0],
            "green_fodder_kg": result[1],
            "concentrate_kg": result[2],
            "water_liters": result[3],
            "special_fodder": result[4],
            "management_tips": result[5],
            "health_alerts": result[6]
        }
    return None
"""

content = content.replace("from sqlalchemy import text", "from sqlalchemy import text\nfrom sqlalchemy.orm import Session")
if "get_seasonal_diet" not in content:
    content += new_func

with open(bd_path, "w") as f:
    f.write(content)


# metadata.py
md_path = "backend/app/api/routes/metadata.py"
with open(md_path, "r") as f:
    md_content = f.read()

md_new_route = """
@router.get("/breeds/{breed_name}/seasonal-diet")
async def get_diet(breed_name: str, season: str, db: Session = Depends(get_db)):
    from app.services.breed_details import get_seasonal_diet
    diet = get_seasonal_diet(breed_name, season.lower(), db)
    if not diet:
        raise HTTPException(status_code=404, detail=f"Seasonal diet not found for breed {breed_name} in season {season}")
    return diet
"""

if "/seasonal-diet" not in md_content:
    md_content += md_new_route

with open(md_path, "w") as f:
    f.write(md_content)

print("Backend patched.")
