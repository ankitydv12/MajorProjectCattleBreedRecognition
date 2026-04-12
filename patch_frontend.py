import re

# api.js
api_path = "frontend/src/services/api.js"
with open(api_path, "r") as f:
    api_content = f.read()

api_new_func = """
export async function getSeasonalDiet(breedName, season) {
    try {
        const response = await fetch(`${API_BASE_URL}/breeds/${encodeURIComponent(breedName)}/seasonal-diet?season=${season}`);
        if (!response.ok) {
            throw new Error('Failed to fetch seasonal diet');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching seasonal diet:', error);
        return null;
    }
}
"""

if "getSeasonalDiet" not in api_content:
    api_content += api_new_func

with open(api_path, "w") as f:
    f.write(api_content)


# PredictPage.jsx
page_path = "frontend/src/pages/PredictPage.jsx"
with open(page_path, "r") as f:
    page_content = f.read()

page_content = page_content.replace(
    "import { predictFromFile, predictFromURL, predictFromBase64, getBreedFull } from '../services/api';",
    "import { predictFromFile, predictFromURL, predictFromBase64, getBreedFull, getSeasonalDiet } from '../services/api';"
)

state_vars = """    const [dietData, setDietData] = useState(null);
    const [currentSeason, setCurrentSeason] = useState('');"""

if "const [dietData" not in page_content:
    page_content = page_content.replace(
        "const [activeResultTab, setActiveResultTab] = useState('overview');",
        "const [activeResultTab, setActiveResultTab] = useState('overview');\n" + state_vars
    )

season_detect_func = """    const detectSeason = () => {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 6) return 'summer';
        if (month >= 7 && month <= 10) return 'monsoon';
        return 'winter';
    };"""

if "const detectSeason" not in page_content:
    page_content = page_content.replace(
        "const fileInputRef = useRef(null);",
        "const fileInputRef = useRef(null);\n\n" + season_detect_func
    )

fetch_logic_old = """                    const info = await getBreedFull(data.breed);
                    setBreedInfo(info);"""

fetch_logic_new = """                    const info = await getBreedFull(data.breed);
                    setBreedInfo(info);
                    const season = detectSeason();
                    setCurrentSeason(season);
                    const diet = await getSeasonalDiet(data.breed, season);
                    setDietData(diet);"""

page_content = page_content.replace(fetch_logic_old, fetch_logic_new)

tab_button = """                                    <button className={`result-tab ${activeResultTab === 'characteristics' ? 'active' : ''}`}
                                        onClick={() => setActiveResultTab('characteristics')}>
                                        {t('predict.characteristics')}
                                    </button>
                                    <button className={`result-tab ${activeResultTab === 'seasonal_diet' ? 'active' : ''}`}
                                        onClick={() => setActiveResultTab('seasonal_diet')}>
                                        🌦️ Seasonal Diet
                                    </button>"""

page_content = re.sub(
    r'<button className={`result-tab \${activeResultTab === \'characteristics\' \? \'active\' : \'\'}`}\s*onClick=\{\(\) => setActiveResultTab\(\'characteristics\'\)\}>\s*\{t\(\'predict.characteristics\'\)\}\s*</button>',
    tab_button,
    page_content
)

diet_tab_content = """                                {/* Characteristics Tab */}
                                {activeResultTab === 'seasonal_diet' && dietData && (
                                    <div className="tab-pane characteristics-pane fade-in">
                                        <div className="info-card">
                                            <h4>Current Season: {currentSeason === 'summer' ? '☀️ Summer' : currentSeason === 'monsoon' ? '🌧️ Monsoon' : '❄️ Winter'}</h4>

                                            <div style={{ marginTop: '15px' }}>
                                                <strong>Feed Requirements:</strong>
                                                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                                    <li>Dry Fodder: {dietData.dry_fodder_kg} kg</li>
                                                    <li>Green Fodder: {dietData.green_fodder_kg} kg</li>
                                                    <li>Concentrate: {dietData.concentrate_kg} kg</li>
                                                    <li>Water: {dietData.water_liters} liters</li>
                                                </ul>
                                            </div>

                                            <div style={{ marginTop: '15px' }}>
                                                <strong>Special Fodder:</strong>
                                                <p style={{ marginTop: '5px' }}>{dietData.special_fodder}</p>
                                            </div>

                                            <div style={{ marginTop: '15px', background: 'rgba(59, 130, 246, 0.08)', padding: '10px', borderRadius: '8px' }}>
                                                <strong>Management Tips:</strong>
                                                <p style={{ marginTop: '5px' }}>{dietData.management_tips}</p>
                                            </div>

                                            <div style={{ marginTop: '15px', background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: '8px', color: '#ef4444' }}>
                                                <strong>Health Alerts:</strong>
                                                <p style={{ marginTop: '5px' }}>{dietData.health_alerts}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}"""

if "activeResultTab === 'seasonal_diet'" not in page_content:
    page_content = page_content.replace(
        "{/* Characteristics Tab */}",
        diet_tab_content
    )


with open(page_path, "w") as f:
    f.write(page_content)

print("Frontend patched.")
