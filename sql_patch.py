import re

breeds = [
    "Amritmahal", "Bachaur", "Bargur", "Bhadawari", "Dangi", "Deoni",
    "Gaolao", "Gir", "Hallikar", "Hariana", "Kangayam", "Kankrej",
    "Kenkattha", "Khillari", "Krishna Valley", "Malvi", "Mewati",
    "Murrah", "Nagori", "Nimari", "Ongole", "Ponwar", "Red Sindhi",
    "Sahiwal", "Siri", "Tharparkar"
]

sql_to_add = """
CREATE TABLE IF NOT EXISTS seasonal_diet (
    id SERIAL PRIMARY KEY,
    breed_name VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL,
    dry_fodder_kg VARCHAR(50),
    green_fodder_kg VARCHAR(50),
    concentrate_kg VARCHAR(50),
    water_liters VARCHAR(50),
    special_fodder TEXT,
    management_tips TEXT,
    health_alerts TEXT
);

"""

for breed in breeds:
    sql_to_add += f"""
INSERT INTO seasonal_diet (breed_name, season, dry_fodder_kg, green_fodder_kg, concentrate_kg, water_liters, special_fodder, management_tips, health_alerts)
VALUES
('{breed}', 'summer', '3-4', '15-20', '1.5-2', '60-80', 'Provide cooling green fodder if available.', 'Reduce outdoor time between 11am-4pm. Provide shade.', 'Watch for heat stress and dehydration.'),
('{breed}', 'monsoon', '4-5', '10-15', '1.5-2', '40-50', 'Limit green fodder to reduce bloat risk.', 'Ensure dry shelter. Provide anti-tick treatment.', 'Watch for foot rot and fungal infections.'),
('{breed}', 'winter', '5-6', '10-15', '2-2.5', '30-40', 'Increase dry fodder and concentrate for energy.', 'Provide warm shelter. Avoid cold drafts.', 'Watch for respiratory issues.');
"""

with open("database/init.sql", "a") as f:
    f.write(sql_to_add)

print("SQL patch applied.")
