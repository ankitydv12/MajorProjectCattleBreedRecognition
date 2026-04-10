import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBreedFullDetails } from '../services/api';
import './BreedTabs.css';

export default function BreedTabs({ breedBasicInfo, breedName, defaultTab }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(defaultTab || 'profile');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!breedName) return;
      setLoading(true);
      try {
        const data = await getBreedFullDetails(breedName);
        setDetails(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (!details && !loading && !error) {
       fetchDetails();
    }
  }, [breedName]);

  return (
    <div className="breed-tabs-container">
      <div className="breed-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          🐄 {t('tabs.profile', 'Breed Profile')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'diet' ? 'active' : ''}`}
          onClick={() => setActiveTab('diet')}
        >
          🌾 {t('tabs.diet', 'Diet & Nutrition')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          🏥 {t('tabs.health', 'Health & Diseases')}
        </button>
      </div>

      <div className="breed-tab-content">
        {loading && <div className="tab-loading">{t('common.loading', 'Loading data...')}</div>}

        {error && !loading && (
          <div className="tab-error">
            {t('tabs.error', 'Detailed information is currently unavailable for this breed.')}
          </div>
        )}

        {!loading && details && activeTab === 'profile' && (
          <div className="tab-pane profile-pane slide-up">
            <p className="profile-desc">{details.summary?.physical_description}</p>

            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-icon">⚖️</span>
                <div>
                  <div className="stat-label">{t('tabs.weight_male', 'Weight (Male)')}</div>
                  <div className="stat-val">{details.summary?.body_weight_male_kg} kg</div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⚖️</span>
                <div>
                  <div className="stat-label">{t('tabs.weight_female', 'Weight (Female)')}</div>
                  <div className="stat-val">{details.summary?.body_weight_female_kg} kg</div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📏</span>
                <div>
                  <div className="stat-label">{t('tabs.height', 'Height')}</div>
                  <div className="stat-val">{details.summary?.height_cm} cm</div>
                </div>
              </div>
            </div>

            <div className="traits-section">
              <h4 className="section-title">{t('tabs.special_traits', 'Special Traits')}</h4>
              <div className="traits-chips">
                {details.summary?.special_traits?.map((trait, idx) => (
                  <span key={idx} className="trait-chip">{trait}</span>
                ))}
              </div>
            </div>

            {details.summary?.conservation_status && (
              <div className="conservation-badge">
                <strong>{t('tabs.status', 'Status')}:</strong> {details.summary.conservation_status}
              </div>
            )}
          </div>
        )}

        {!loading && details && activeTab === 'diet' && (
          <div className="tab-pane diet-pane slide-up">

            <div className="diet-grid">
              <div className="diet-card requirements">
                <h4 className="section-title">📊 {t('tabs.daily_feed', 'Daily Feed Requirements')}</h4>
                <ul>
                  <li><span>🌾 {t('tabs.dry_fodder', 'Dry Fodder')}:</span> <strong>{details.diet?.daily_feed_requirements?.dry_fodder_kg} kg</strong></li>
                  <li><span>🌿 {t('tabs.green_fodder', 'Green Fodder')}:</span> <strong>{details.diet?.daily_feed_requirements?.green_fodder_kg} kg</strong></li>
                  <li><span>🧆 {t('tabs.concentrate', 'Concentrate')}:</span> <strong>{details.diet?.daily_feed_requirements?.concentrate_kg} kg</strong></li>
                  <li><span>💧 {t('tabs.water', 'Water')}:</span> <strong>{details.diet?.daily_feed_requirements?.water_liters} L</strong></li>
                </ul>
              </div>

              <div className="diet-card">
                <h4 className="section-title">🌿 {t('tabs.recommended_fodder', 'Recommended Fodder')}</h4>
                <ul className="bullet-list">
                  {details.diet?.recommended_fodder?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="diet-card schedule-card">
                <h4 className="section-title">⏱️ {t('tabs.schedule', 'Feeding Schedule')}</h4>
                <ul className="timeline">
                  {details.diet?.feeding_schedule?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="diet-card warning-card">
                <h4 className="section-title warning-text">⚠️ {t('tabs.avoid', 'Foods to Avoid')}</h4>
                <ul className="bullet-list">
                  {details.diet?.foods_to_avoid?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>

            {details.diet?.special_notes && (
                <div className="special-notes">
                    <strong>💡 {t('tabs.note', 'Note')}:</strong> {details.diet.special_notes}
                </div>
            )}
          </div>
        )}

        {!loading && details && activeTab === 'health' && (
          <div className="tab-pane health-pane slide-up">
            <div className="diseases-list">
              {details.diseases?.map((disease, idx) => (
                <details key={idx} className="disease-card">
                  <summary className="disease-header">
                    <div className="disease-title">
                      <h5>{disease.name}</h5>
                      <span className="disease-type">{disease.type}</span>
                    </div>
                    <div className="disease-badges">
                      {disease.is_contagious && <span className="badge contagious">{t('tabs.contagious', 'Contagious')}</span>}
                      <span className={`badge severity-${disease.severity.toLowerCase()}`}>
                        {disease.severity}
                      </span>
                    </div>
                  </summary>
                  <div className="disease-body">
                    {disease.severity.toLowerCase() === 'critical' && (
                      <div className="critical-warning">
                        ⚠️ {t('tabs.call_vet', 'Contact your veterinarian immediately!')}
                      </div>
                    )}

                    <div className="disease-section">
                      <h6>🩺 {t('tabs.symptoms', 'Symptoms')}</h6>
                      <ul className="check-list">
                        {disease.symptoms?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div className="disease-section">
                      <h6>🛡️ {t('tabs.prevention', 'Prevention')}</h6>
                      <ol className="num-list">
                        {disease.prevention?.map((p, i) => <li key={i}>{p}</li>)}
                      </ol>
                    </div>

                    <div className="disease-section">
                      <h6>💊 {t('tabs.remedy', 'Remedy / Treatment')}</h6>
                      <ul className="bullet-list">
                        {disease.remedy?.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}