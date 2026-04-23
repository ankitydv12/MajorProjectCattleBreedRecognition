# CattleAI Features Report

## Table of Contents
1. [Breed Profile Tab](#breed-profile-tab)
2. [Diet & Nutrition Tab](#diet--nutrition-tab)
3. [Diseases & Remedies Tab](#diseases--remedies-tab)
4. [Seasonal Diet Tab](#seasonal-diet-tab)
5. [Disease Symptom Checker](#disease-symptom-checker)
6. [Nearby Veterinarian Finder](#nearby-veterinarian-finder)
7. [AI Chatbot Assistant](#ai-chatbot-assistant)
8. [Multi-Language Support](#multi-language-support)
9. [PostgreSQL Database](#postgresql-database)
10. [Docker Deployment](#docker-deployment)
11. [Complete API Reference](#complete-api-reference)
12. [Database Schema](#database-schema)
13. [Technology Stack Summary](#technology-stack-summary)
14. [Data Flow Diagram](#data-flow-diagram)
15. [Known Issues and Limitations](#known-issues-and-limitations)

---
## 1. Breed Profile Tab
### What it does (for non-technical reader)
The Breed Profile tab provides a comprehensive overview of a specific cattle breed. It displays where the breed originated, its physical characteristics (like weight and height), special traits (like milk yield or drought resistance), and its current conservation status.

### How it works technically
When a user views a breed or gets a prediction, the frontend requests summary data for that breed. The backend queries the `breed_summary` database table, formats the response (converting comma-separated strings to arrays where necessary), and returns it to the frontend via a REST API endpoint.

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/PredictPage.jsx`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/breed_details.py`

### API endpoints used
- `GET /breeds/{breed_name}/summary`
- `GET /breeds/{breed_name}/full` (used for bulk loading info tabs)

### Database tables used
- `breed_summary`

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `sqlalchemy`

### Screenshots description (describe what user sees)
The user sees a clean, card-based interface containing the breed name at the top. Below, a grid displays key stats like "Body Weight (Male)", "Height", and "Population Estimate". Paragraphs of text describe the physical description and special traits, clearly organized with headings.

### Limitations or known issues
- The data is static and depends on the initial database seeding; there is no admin interface to update breed details dynamically.

---
## 2. Diet & Nutrition Tab
### What it does (for non-technical reader)
This tab gives farmers a detailed feeding guide for the selected cattle breed. It outlines the required amount of dry and green fodder, concentrates, and water. It also lists recommended foods, feeding schedules, and importantly, foods to avoid.

### How it works technically
The frontend calls the backend API to fetch diet data. The backend queries the `breed_diet` table. The `parse_list` utility function in Python takes comma-separated string fields from the database (e.g., "Sorghum, Maize, Napier grass") and converts them into JSON arrays so the React frontend can easily map over them and render lists.

```python
# Code snippet for parse_list logic
def parse_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [x.strip() for x in str(value).split(',') if x.strip()]
```

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/PredictPage.jsx`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/breed_details.py`

### API endpoints used
- `GET /breeds/{breed_name}/diet`
- `GET /breeds/{breed_name}/full`

### Database tables used
- `breed_diet`

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `sqlalchemy`

### Screenshots description (describe what user sees)
The user sees quantitative metrics in highlighted blocks (e.g., "Dry Fodder: 5-7 kg"). Below this, bulleted lists outline "Recommended Fodder", "Foods to Avoid", and "Feeding Schedule", making the information highly skimmable.

### Limitations or known issues
- Diet recommendations are generalized per breed and do not account for the specific age, weight, or lactation status of individual animals.

---
## 3. Diseases & Remedies Tab
### What it does (for non-technical reader)
This tab lists common diseases that the specific breed is susceptible to. For each disease, it provides symptoms to watch out for, preventative measures, recommended remedies, and a severity warning (e.g., Critical, High, Medium, Low).

### How it works technically
The frontend fetches the diseases associated with a breed. The data is displayed using an accordion-style UI component. The frontend maintains state (e.g., `expandedDisease`) to track which disease card is currently open, expanding or collapsing the details when clicked. Severity is visually represented using color-coding.

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/PredictPage.jsx`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/breed_details.py`

### API endpoints used
- `GET /breeds/{breed_name}/diseases`
- `GET /breeds/{breed_name}/full`

### Database tables used
- `breed_diseases`

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `sqlalchemy`

### Screenshots description (describe what user sees)
The user sees a list of disease names. Each disease has a colored badge indicating its severity (Red for Critical, Orange for High). Clicking on a disease expands a panel revealing bullet points for "Symptoms", "Prevention", and "Remedy", along with any emergency notes.

### Limitations or known issues
- Accordion expand/collapse might be sluggish if a breed has a very large number of diseases listed. Severity colors are hardcoded in the frontend.

---
## 4. Seasonal Diet Tab
### What it does (for non-technical reader)
Because cattle dietary needs change with the weather, this tab provides tailored feeding recommendations based on the current season (Summer, Monsoon, or Winter). It includes specific management tips for the weather, like providing shade in summer.

### How it works technically
The frontend uses JavaScript's `Date().getMonth()` to determine the current month and maps it to a season (Summer: Mar-Jun, Monsoon: Jul-Oct, Winter: Nov-Feb). It then calls the seasonal diet API endpoint passing the breed name and the auto-detected season. The backend queries the `seasonal_diet` table and returns the specific seasonal plan.

```javascript
// Code snippet for getting the season
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 6) return 'summer';
  if (month >= 7 && month <= 10) return 'monsoon';
  return 'winter';
}
```

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/PredictPage.jsx`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/breed_details.py`

### API endpoints used
- `GET /breeds/{breed_name}/seasonal-diet?season={season}`

### Database tables used
- `seasonal_diet`

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `sqlalchemy`

### Screenshots description (describe what user sees)
The user sees an icon indicating the season (☀️, 🌧️, or ❄️) alongside the season name and months. Below, colored boxes show fodder and water requirements for that season, followed by lists of "Special Fodder", "Management Tips" (with checkmarks), and highlighted "Health Alerts" specific to the weather conditions.

### Limitations or known issues
- The season calculation is hardcoded to Indian seasonal patterns and might be inaccurate for users in different hemispheres or climates.

---
## 5. Disease Symptom Checker
### What it does (for non-technical reader)
This tool allows farmers to select symptoms their animal is experiencing from a checklist. It then analyzes the symptoms and suggests possible diseases, ranked by how closely they match, along with the severity and recommended actions.

### How it works technically
The frontend fetches a unique list of all available symptoms on load. When the user selects symptoms and clicks check, the frontend sends an array of strings to the backend via POST. The backend uses a SQL `ARRAY_AGG` and `GROUP BY` query to find diseases that have those symptoms, counting the matches (`match_count`), and orders the results by the highest match count.

```python
# Query snippet
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
```

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/SymptomCheckerPage.jsx`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/breed_details.py`

### API endpoints used
- `GET /symptoms`
- `POST /symptoms/check`

### Database tables used
- `symptoms_lookup`

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `sqlalchemy`

### Screenshots description (describe what user sees)
The user sees a grid of symptom checkboxes. After selecting some and clicking "Check Diseases", a results section appears below. It shows cards for possible diseases sorted by match probability. Each card displays the disease name, severity badge, a list of matched symptoms, and text for remedy and prevention.

### Limitations or known issues
- The matching algorithm is basic (simple count of matched symptoms) and does not weight certain pathognomonic symptoms higher than general ones like "fever".

---
## 6. Nearby Veterinarian Finder
### What it does (for non-technical reader)
This feature helps farmers locate veterinary clinics near them. It uses the device's location to find vets within a specific radius and displays them on an interactive map and as a list. It also provides an option to get driving directions to the clinic.

### How it works technically
The frontend requests the user's location via the browser's Geolocation API. It then sends a query to the Overpass API (OpenStreetMap) to find nodes tagged with `amenity=veterinary` around the user's coordinates within the chosen radius. The map is rendered using Leaflet.js, displaying custom markers. The "Get Directions" button constructs a Google Maps URL using the vet's coordinates. There is also a manual search fallback using the Nominatim API to geocode a city name.

```javascript
// Querying Overpass API
const query = `
  [out:json];
  (
    node["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
    way["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
    relation["amenity"="veterinary"](around:${radius},${userLoc.lat},${userLoc.lng});
  );
  out center;
`;
```

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/pages/VetFinderPage.jsx`

### API endpoints used
- Overpass API (External): `https://overpass-api.de/api/interpreter`
- Nominatim API (External): `https://nominatim.openstreetmap.org/search`

### Database tables used
- None (Uses external OpenStreetMap data)

### Libraries/packages used
- **Frontend:** `react`, `leaflet`, `react-leaflet`

### Screenshots description (describe what user sees)
The user sees a map taking up the top half of the screen, with a blue marker for their location and green markers for vets. Below the map, a list of veterinarian clinics is displayed, showing the clinic name, distance, address, phone number (if available), and a "Get Directions" button.

### Limitations or known issues
- Relies on OpenStreetMap data, which might be incomplete or outdated in rural Indian areas.
- The browser geolocation requires HTTPS or localhost to function.

---
## 7. AI Chatbot Assistant
### What it does (for non-technical reader)
A floating chat assistant available on every page. Farmers can type questions about cattle breeds, diet, or diseases, and get instant, farmer-friendly answers powered by Artificial Intelligence.

### How it works technically
The frontend contains a floating action button that opens a chat interface. It maintains a local array of chat messages. When a user sends a message, it POSTs the message to the backend. The backend uses the Ollama API (running locally via Docker) with the `llama3.2` model. A system prompt ensures the AI acts as an expert on 26 Indian cattle breeds and keeps responses concise.

```python
SYSTEM_PROMPT = """You are CattleAI Assistant, an expert on Indian
indigenous cattle and buffalo breeds. You help farmers with breed
identification, diet, diseases, and management tips for these 26 breeds..."""
```

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/components/ChatBot.jsx`, `frontend/src/components/ChatBot.css`, `frontend/src/services/api.js`
- **Backend:** `backend/app/api/routes/metadata.py`, `backend/app/services/chatbot.py`

### API endpoints used
- `POST /chat`
- Local Ollama API: `http://ollama:11434/api/chat`

### Database tables used
- None

### Libraries/packages used
- **Frontend:** `react`
- **Backend:** `fastapi`, `requests`

### Screenshots description (describe what user sees)
A floating chat bubble icon sits in the corner. When clicked, it opens a chat window. The welcome message includes clickable suggestion chips like "What is the best breed for milk production?". The chat interface shows user messages on the right and bot responses on the left, with a typing indicator while waiting for the AI.

### Limitations or known issues
- The frontend currently only sends the last 5 messages as history, and the backend implementation (`get_chat_response`) in `chatbot.py` currently only appends the latest user message without properly integrating the passed history into the Ollama payload.
- Ollama might be slow depending on the host machine's resources.

---
## 8. Multi-Language Support
### What it does (for non-technical reader)
The app can be used in 22 different regional Indian languages. When a user first visits the site, they are asked to select their preferred language. The entire interface, including menus and buttons, translates instantly.

### How it works technically
The frontend uses the `react-i18next` library. Translations are stored in JSON files under `frontend/src/i18n/locales/`. On the first visit, `LanguageSelectionPage` is shown. The selected language is saved in `localStorage` so it persists across sessions. A navbar switcher allows changing the language later. The app also dynamically supports Right-to-Left (RTL) rendering for languages like Urdu, Kashmiri, and Sindhi by toggling CSS classes and the `dir` attribute on the HTML tag.

### Files involved (frontend + backend)
- **Frontend:** `frontend/src/App.jsx`, `frontend/src/LanguageSelectionPage.jsx`, `frontend/src/LanguageSwitcher.jsx`, `frontend/src/i18n/index.js`, `frontend/src/languages.js`

### API endpoints used
- None (Handled purely on the frontend)

### Database tables used
- None

### Libraries/packages used
- **Frontend:** `react-i18next`, `i18next`, `i18next-browser-languagedetector`

### Screenshots description (describe what user sees)
On first load, a full-screen grid displays 22 language options with their native scripts (e.g., हिन्दी, বাংলা, தமிழ்). In the main app, a dropdown in the navigation bar with a globe icon allows language switching. When an RTL language is selected, the layout mirrors (e.g., navigation links move to the opposite side).

### Limitations or known issues
- Currently, many language JSON files only have English placeholders, meaning full translations are not yet provided for all 22 languages.
- Database content (like breed descriptions and disease info) is not currently translated, only the UI shell is.

---
## 9. PostgreSQL Database
### What it does (for non-technical reader)
The database is the central storage system for all the information about cattle breeds, their diets, and diseases. It ensures data is organized, searchable, and safely stored even if the server restarts.

### How it works technically
The application uses PostgreSQL 15. The database schema and initial data are defined in `database/init.sql`. On the first run, the Docker container executes this SQL script to create tables and insert data for 26 breeds. The FastAPI backend connects to it using SQLAlchemy. In `backend/app/main.py`, the `lifespan` event also patches the database, creating the `symptoms_lookup` and `seasonal_diet` tables if they don't exist and seeding them with data. A retry logic ensures that the backend handles instances where the DB container might be slower to initialize than the backend process.

```python
# Connection retry logic
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
```

### Files involved (frontend + backend)
- **Backend:** `backend/app/database.py`, `backend/app/main.py`
- **Database:** `database/init.sql`

### API endpoints used
- N/A

### Database tables used
- `breed_summary`, `breed_diet`, `breed_diseases`, `symptoms_lookup`, `seasonal_diet`

### Libraries/packages used
- **Backend:** `sqlalchemy`, `psycopg2-binary`

### Screenshots description (describe what user sees)
N/A - This is a backend infrastructure component.

### Limitations or known issues
- Initialization logic is split between `init.sql` and `main.py`, which can make schema management slightly fragmented.

---
## 10. Docker Deployment
### What it does (for non-technical reader)
Docker packages the entire CattleAI application—frontend, backend, AI model, and database—into standardized units called containers. This makes it incredibly easy to install and run the app on any computer without complex setup steps.

### How it works technically
The `docker-compose.yml` defines the multi-container architecture. It orchestrates four services: `db` (Postgres), `ollama` (for local AI), `backend` (FastAPI), and `frontend` (Vite/React). They communicate over a custom bridge network (`cattle-network`). Volume mounts are used to persist Postgres data (`postgres_data`) and Ollama models so data isn't lost when containers stop. Port mappings expose the frontend on port 3000 and the backend on 8000.

### Files involved (frontend + backend)
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`

### API endpoints used
- N/A

### Database tables used
- N/A

### Libraries/packages used
- `docker`, `docker-compose`

### Screenshots description (describe what user sees)
N/A - Infrastructure. The developer sees the application startup logs in the terminal via `docker-compose up`.

### Limitations or known issues
- The backend container depends on `db` and `ollama`, but it might attempt to connect before the services are fully ready to accept connections (lack of explicit healthchecks in compose).

---
## Complete API Reference

### GET /breeds
- **Purpose:** List all breeds
- **URL:** `/breeds?animal_type={type}&search={query}`
- **Response format:** JSON object with `total` count and `breeds` array.
- **Example request:** `GET /breeds?animal_type=Cow`
- **Example response:**
  ```json
  {
    "total": 1,
    "breeds": [
      {
        "breed_id": 1,
        "breed_name": "Gir",
        "animal_type": "Cow",
        "region": "Gujarat",
        "primary_use": "Milk"
      }
    ]
  }
  ```

### GET /breeds/{breed_name}/summary
- **Purpose:** Get summary info for a breed
- **URL:** `/breeds/Gir/summary`
- **Response format:** JSON object
- **Example response:** `{"breed_name": "Gir", "origin": "Gujarat, India", "also_known_as": ["Bhodali", "Desan"], ...}`

### GET /breeds/{breed_name}/diet
- **Purpose:** Get diet info for a breed
- **URL:** `/breeds/Gir/diet`
- **Response format:** JSON object
- **Example response:** `{"dry_fodder_kg": "5-7", "recommended_fodder": ["Sorghum", "Maize"], ...}`

### GET /breeds/{breed_name}/diseases
- **Purpose:** Get diseases for a breed
- **URL:** `/breeds/Gir/diseases`
- **Response format:** JSON array of disease objects
- **Example response:** `[{"disease_name": "Foot and Mouth Disease (FMD)", "severity": "High", "symptoms": ["Blisters", "fever"], ...}]`

### GET /breeds/{breed_name}/full
- **Purpose:** Get summary, diet, and diseases in one call
- **URL:** `/breeds/Gir/full`
- **Response format:** JSON object containing `summary`, `diet`, and `diseases` objects.

### GET /breeds/{breed_name}/seasonal-diet
- **Purpose:** Get seasonal diet for a breed
- **URL:** `/breeds/Gir/seasonal-diet?season=summer`
- **Response format:** JSON object
- **Example response:** `{"season": "summer", "dry_fodder_kg": "5-7", "special_fodder": ["Napier grass"], ...}`

### GET /symptoms
- **Purpose:** Get a list of all distinct symptoms
- **URL:** `/symptoms`
- **Response format:** JSON array of strings
- **Example response:** `["Abortion", "Blisters on mouth", "Bloating", ...]`

### POST /symptoms/check
- **Purpose:** Check selected symptoms against diseases
- **URL:** `/symptoms/check`
- **Request body:**
  ```json
  {
    "symptoms": ["High fever", "Lameness"]
  }
  ```
- **Response format:** JSON array of matched diseases sorted by match count
- **Example response:**
  ```json
  [
    {
      "disease_name": "Foot and Mouth Disease",
      "severity": "High",
      "remedy": "Symptomatic treatment",
      "prevention": "Biannual vaccination",
      "match_count": 2,
      "matched_symptoms": ["high fever", "lameness"]
    }
  ]
  ```

### POST /chat
- **Purpose:** Send message to AI Chatbot
- **URL:** `/chat`
- **Request body:**
  ```json
  {
    "message": "What is Gir cow yield?",
    "history": []
  }
  ```
- **Response format:** JSON object
- **Example response:** `{"response": "The Gir cow is known for high milk yield, typically..."}`

---
## Database Schema

### Table: `breed_summary`
- **Purpose:** Stores general information and physical traits of cattle breeds.
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `breed_name` (VARCHAR UNIQUE)
  - `origin` (TEXT)
  - `also_known_as` (TEXT)
  - `physical_description` (TEXT)
  - `body_weight_male_kg` (VARCHAR)
  - `body_weight_female_kg` (VARCHAR)
  - `height_cm` (VARCHAR)
  - `special_traits` (TEXT)
  - `conservation_status` (VARCHAR)
  - `population_estimate` (VARCHAR)

### Table: `breed_diet`
- **Purpose:** Stores standard dietary requirements per breed.
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `breed_name` (VARCHAR UNIQUE)
  - `dry_fodder_kg` (VARCHAR)
  - `green_fodder_kg` (VARCHAR)
  - `concentrate_kg` (VARCHAR)
  - `water_liters` (VARCHAR)
  - `recommended_fodder` (TEXT)
  - `recommended_concentrate` (TEXT)
  - `minerals_supplements` (TEXT)
  - `feeding_schedule` (TEXT)
  - `foods_to_avoid` (TEXT)
  - `special_notes` (TEXT)

### Table: `breed_diseases`
- **Purpose:** Maps specific diseases, symptoms, and remedies to breeds.
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `breed_name` (VARCHAR)
  - `disease_name` (VARCHAR)
  - `disease_type` (VARCHAR)
  - `symptoms` (TEXT)
  - `prevention` (TEXT)
  - `remedy` (TEXT)
  - `severity` (VARCHAR)
  - `is_contagious` (BOOLEAN)
  - `emergency_note` (TEXT)

### Table: `symptoms_lookup`
- **Purpose:** Stores mappings of symptoms to diseases for the Symptom Checker.
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `symptom` (VARCHAR)
  - `disease_name` (VARCHAR)
  - `breed_type` (VARCHAR)
  - `severity` (VARCHAR)
  - `remedy` (TEXT)
  - `prevention` (TEXT)

### Table: `seasonal_diet`
- **Purpose:** Stores season-specific dietary adjustments for breeds.
- **Columns:**
  - `id` (SERIAL PRIMARY KEY)
  - `breed_name` (VARCHAR)
  - `season` (VARCHAR)
  - `dry_fodder_kg` (VARCHAR)
  - `green_fodder_kg` (VARCHAR)
  - `concentrate_kg` (VARCHAR)
  - `water_liters` (VARCHAR)
  - `special_fodder` (TEXT)
  - `management_tips` (TEXT)
  - `health_alerts` (TEXT)

**Relationships:** All tables relate to each other implicitly via the `breed_name` column, functioning as a foreign key conceptually, though explicit constraints are not defined in the schema.

---
## Technology Stack Summary

### Frontend
- **Framework:** React 19.2.4 (via Vite)
- **State/Routing:** React Router DOM v7
- **Mapping:** Leaflet 1.9.4, React-Leaflet 5.0.0
- **Internationalization:** i18next, react-i18next

### Backend
- **Framework:** Python, FastAPI
- **Database ORM:** SQLAlchemy
- **Machine Learning:** PyTorch, torchvision, timm

### Database
- **Engine:** PostgreSQL 15
- **Driver:** psycopg2-binary

### AI & Services
- **Chatbot:** Local Ollama (Model: llama3.2)
- **Maps API:** Overpass API, Nominatim

### Containerization
- **Tools:** Docker, Docker Compose (Version 3.9)

---
## Data Flow Diagram

```text
User uploads image or enters query
      │
      ▼
React Frontend (Vite)
      │
      ├── [Image] ──► POST /predict
      │                    │
      │                    ▼
      │              FastAPI Backend
      │                    │
      │                    ▼
      │              PyTorch (ResNet50 Model)
      │                    │
      │                    ▼
      │              Predicts Breed Name
      │
      ├── [Query] ──► GET /breeds/{name}/full
      │                    │
      │                    ▼
      │              FastAPI Backend
      │                    │
      │                    ▼
      │              SQLAlchemy connects to PostgreSQL
      │                    │
      │                    ▼
      │              Fetches summary, diet, diseases
      │
      ▼
React Frontend receives JSON payload
      │
      ▼
UI Renders Data (Breed Profile, Diet, Diseases tabs)
```

---
## Known Issues and Limitations

1. **Chatbot History:** The frontend sends chat history, but the backend implementation in `chatbot.py` only passes the current message and the system prompt to Ollama, effectively ignoring the conversation history.
2. **Database Initialization:** Initialization is split between `database/init.sql` and `backend/app/main.py` (FastAPI lifespan event). This can cause confusion during maintenance.
3. **Translation Completeness:** While the UI is set up for 22 languages with `react-i18next`, many translation files currently use English placeholders. Furthermore, database content is not translated.
4. **Geolocation Requirements:** The Vet Finder feature relies on browser geolocation, which fails if the site is not served over HTTPS (or localhost).
5. **Static Content:** Breed data is static; there is no admin portal to update or add new breed details or diseases.
