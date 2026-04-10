import { useTranslation } from 'react-i18next';
import BreedTabs from '../components/BreedTabs';
import { useState, useEffect } from 'react';
import { getBreeds } from '../services/api';

// Static breed data (used when API is not available)
const STATIC_BREEDS = [
    { breed_id: 1, breed_name: 'Alambadi Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-3', lifespan_years: '15-18', description: 'Hardy draught breed from Tamil Nadu adapted to dry semi-arid conditions.' },
    { breed_id: 2, breed_name: 'Amritmahal Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', lifespan_years: '18-20', description: 'Elite draught breed from Karnataka known for speed and endurance.' },
    { breed_id: 3, breed_name: 'Banni Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '10-14', lifespan_years: '20-25', description: 'High-yielding buffalo breed from the Banni grasslands of Kutch.' },
    { breed_id: 4, breed_name: 'Bargur Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-3', lifespan_years: '15-18', description: 'Agile draught breed from the Bargur hills of Erode district.' },
    { breed_id: 5, breed_name: 'Dangi Cow', animal_type: 'Cow', region: 'Maharashtra, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '1-3', lifespan_years: '15-18', description: 'Hardy breed from the hilly Dangs region. Tolerant to heavy rainfall.' },
    { breed_id: 6, breed_name: 'Deoni Cow', animal_type: 'Cow', region: 'Maharashtra / Karnataka, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '3-5', lifespan_years: '15-18', description: 'Dual-purpose breed from the Deccan plateau.' },
    { breed_id: 7, breed_name: 'Gir Cow', animal_type: 'Cow', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '6-10', lifespan_years: '12-15', description: 'Principal dairy breed of India. Highly heat tolerant with excellent disease resistance.' },
    { breed_id: 8, breed_name: 'Hallikar Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', lifespan_years: '18-20', description: 'Premier draught breed of South India known for compact muscular build.' },
    { breed_id: 9, breed_name: 'Jaffrabadi Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', lifespan_years: '20-25', description: 'Heaviest Indian buffalo breed from Gir forests of Gujarat.' },
    { breed_id: 10, breed_name: 'Kangayam Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', lifespan_years: '18-20', description: 'Powerful draught breed from Tamil Nadu known for endurance.' },
    { breed_id: 11, breed_name: 'Kankrej Cow', animal_type: 'Cow', region: 'Gujarat / Rajasthan, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '5-8', lifespan_years: '15-18', description: 'Large dual-purpose breed. Known for heavy build and fast trotting gait.' },
    { breed_id: 12, breed_name: 'Kasaragod Cow', animal_type: 'Cow', region: 'Kerala, India', primary_use: 'Dwarf Cattle', avg_milk_liters_per_day: '2-3', lifespan_years: '15-18', description: 'Small-sized cattle breed adapted to the tropical coastal climate.' },
    { breed_id: 13, breed_name: 'Kenkatha Cow', animal_type: 'Cow', region: 'Uttar Pradesh / Madhya Pradesh, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', lifespan_years: '15-18', description: 'Compact draught breed from the Ken river valley of Bundelkhand.' },
    { breed_id: 14, breed_name: 'Kherigarh Cow', animal_type: 'Cow', region: 'Uttar Pradesh, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '3-5', lifespan_years: '15-18', description: 'Medium-sized dual-purpose breed from the Kheri district of UP.' },
    { breed_id: 15, breed_name: 'Malnad gidda Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Dairy (small-scale)', avg_milk_liters_per_day: '1-3', lifespan_years: '18-20', description: 'Smallest Indian cattle breed from the Western Ghats of Karnataka.' },
    { breed_id: 16, breed_name: 'Mehsana Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', lifespan_years: '20-25', description: 'Important dairy buffalo from North Gujarat. Consistent milk producer.' },
    { breed_id: 17, breed_name: 'Nagori Cow', animal_type: 'Cow', region: 'Rajasthan, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', lifespan_years: '15-18', description: 'Tall well-built draught breed from Nagaur district of Rajasthan.' },
    { breed_id: 18, breed_name: 'Nagpuri Buffalo', animal_type: 'Buffalo', region: 'Maharashtra, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '5-7', lifespan_years: '20-25', description: 'Distinctive buffalo breed known for extremely long horns.' },
    { breed_id: 19, breed_name: 'Nili ravi Buffalo', animal_type: 'Buffalo', region: 'Punjab, India / Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '8-14', lifespan_years: '20-25', description: 'Premier dairy buffalo breed from the Punjab region.' },
    { breed_id: 20, breed_name: 'Nimari Cow', animal_type: 'Cow', region: 'Madhya Pradesh, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '2-4', lifespan_years: '15-18', description: 'Medium-sized dual-purpose breed from the Nimar valley.' },
    { breed_id: 21, breed_name: 'Pulikulam Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught / Sport', avg_milk_liters_per_day: '1-2', lifespan_years: '15-18', description: 'Small agile breed traditionally used in Jallikattu.' },
    { breed_id: 22, breed_name: 'Rathi Cow', animal_type: 'Cow', region: 'Rajasthan, India', primary_use: 'Dairy', avg_milk_liters_per_day: '6-8', lifespan_years: '15-18', description: 'One of the best dairy breeds of Rajasthan.' },
    { breed_id: 23, breed_name: 'Sahiwal Cow', animal_type: 'Cow', region: 'Punjab, India / Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', lifespan_years: '15-18', description: 'One of the best dairy breeds of the Indian subcontinent. Highly heat-tolerant.' },
    { breed_id: 24, breed_name: 'Shurti Buffalo', animal_type: 'Buffalo', region: 'Karnataka, India', primary_use: 'Dairy', avg_milk_liters_per_day: '4-6', lifespan_years: '20-25', description: 'Small to medium dairy buffalo from North Karnataka.' },
    { breed_id: 25, breed_name: 'Tharparkar Cow', animal_type: 'Cow', region: 'Rajasthan, India / Sindh, Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '6-10', lifespan_years: '18-20', description: 'Hardy dual-purpose breed from the Thar desert.' },
    { breed_id: 26, breed_name: 'Umblachery Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', lifespan_years: '15-18', description: 'Compact draught breed from the Cauvery delta region.' },
];

function BreedExplorerPage() {
  const { t } = useTranslation();
    const [breeds, setBreeds] = useState(STATIC_BREEDS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [expandedBreed, setExpandedBreed] = useState(null);

    useEffect(() => {
        async function fetchBreeds() {
            try {
                const data = await getBreeds();
                if (data.breeds && data.breeds.length > 0) {
                    setBreeds(data.breeds);
                }
            } catch {
                // Use static data
            }
        }
        fetchBreeds();
    }, []);

    const filtered = breeds.filter(b => {
        const matchesSearch = !searchTerm || b.breed_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || b.animal_type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesType;
    });

    return (
        <div className="page">
            <div className="breed-explorer-header">
                <h2 className="section-title">{t('breeds.title')}</h2>
                <p className="section-subtitle">
                    {t('breeds.subtitle')}
                </p>
            </div>

            <div className="breed-filters">
                <input
                    type="text"
                    placeholder={t('breeds.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, minWidth: '200px' }}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">{t('breeds.all_types')}</option>
                    <option value="Cow">🐄 {t('breeds.cow')}</option>
                    <option value="Buffalo">🐃 {t('breeds.buffalo')}</option>
                </select>
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {t('breeds.showing', { filtered: filtered.length, total: breeds.length })}
            </p>

            <div className="breeds-grid">
                {filtered.map((breed) => (
                    <div className="card" key={breed.breed_id}>
                        <div className="breed-card-header">
                            <span className="breed-card-name">{breed.breed_name}</span>
                            <span className={`breed-type-badge ${breed.animal_type.toLowerCase()}`}>
                                {breed.animal_type}
                            </span>
                        </div>
                        <div className="breed-card-detail">
                            <span className="label">{t('predict.region')}</span>
                            <span className="value">{breed.region}</span>
                        </div>
                        <div className="breed-card-detail">
                            <span className="label">{t('predict.primary_use')}</span>
                            <span className="value">{breed.primary_use}</span>
                        </div>
                        {breed.avg_milk_liters_per_day && (
                            <div className="breed-card-detail">
                                <span className="label">{t('predict.milk_yield')}</span>
                                <span className="value">{breed.avg_milk_liters_per_day} {t('predict.milk_unit')}</span>
                            </div>
                        )}
                        {breed.lifespan_years && (
                            <div className="breed-card-detail">
                                <span className="label">{t('predict.lifespan')}</span>
                                <span className="value">{breed.lifespan_years} {t('predict.lifespan_unit')}</span>
                            </div>
                        )}
                        {breed.description && (
                            <p className="breed-card-description">
                                {breed.description}
                            </p>
                        )}
                        <button
                            className="btn-secondary"
                            style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem', padding: '8px' }}
                            onClick={() => setExpandedBreed(breed.breed_id)}
                        >
                            ℹ️ Detailed Info
                        </button>
                    </div>
                ))}
            </div>

            {expandedBreed && (
                <div className="modal-overlay" onClick={() => setExpandedBreed(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setExpandedBreed(null)}>✕</button>
                        <BreedTabs
                            breedBasicInfo={breeds.find(b => b.breed_id === expandedBreed)}
                            breedName={breeds.find(b => b.breed_id === expandedBreed)?.breed_name}
                            defaultTab="profile"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BreedExplorerPage;