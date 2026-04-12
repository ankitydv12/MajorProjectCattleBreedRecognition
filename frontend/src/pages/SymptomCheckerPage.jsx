import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllSymptoms, checkSymptoms } from '../services/api';
import './SymptomCheckerPage.css'; // Optional CSS file if needed

function SymptomCheckerPage() {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [animalType, setAnimalType] = useState('both'); // cow, buffalo, both
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSymptoms() {
      try {
        const data = await getAllSymptoms();
        setSymptoms(data);
      } catch (err) {
        setError('Failed to load symptoms');
      } finally {
        setLoading(false);
      }
    }
    fetchSymptoms();
  }, []);

  const handleToggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
    // Reset results when symptoms change
    setResults(null);
  };

  const handleCheckDiseases = async () => {
    if (selectedSymptoms.length === 0) return;
    setChecking(true);
    setError(null);
    try {
      const resultData = await checkSymptoms(selectedSymptoms);
      setResults(resultData);
    } catch (err) {
      setError('Failed to check diseases');
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setResults(null);
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#ef4444'; // Red
      case 'high': return '#f97316'; // Orange
      case 'medium': return '#f59e0b'; // Amber
      case 'low': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'rgba(239, 68, 68, 0.15)';
      case 'high': return 'rgba(249, 115, 22, 0.15)';
      case 'medium': return 'rgba(245, 158, 11, 0.15)';
      case 'low': return 'rgba(16, 185, 129, 0.15)';
      default: return 'rgba(107, 114, 128, 0.15)';
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="container">
        <div className="header-section text-center" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">🔍 Symptom Checker</h1>
          <p className="page-subtitle">Select symptoms your animal is showing</p>
        </div>

        {error && (
          <div className="prediction-warning" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Animal Type Filter (Currently UI-only, but ready if needed to filter DB) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
          {['both', 'cow', 'buffalo'].map(type => (
            <button
              key={type}
              onClick={() => setAnimalType(type)}
              className={animalType === type ? 'btn-primary' : 'btn-outline'}
              style={{ textTransform: 'capitalize', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)' }}
            >
              {type === 'both' ? 'Both' : type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading symptoms...</p>
          </div>
        ) : (
          <div className="symptoms-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {symptoms.map((symptom, idx) => (
              <label
                key={idx}
                className={`glass-card ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  padding: '1rem',
                  border: selectedSymptoms.includes(symptom) ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  margin: 0
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleToggleSymptom(symptom)}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-accent)' }}
                />
                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{symptom}</span>
              </label>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <button
            className="btn-primary"
            onClick={handleCheckDiseases}
            disabled={selectedSymptoms.length === 0 || checking}
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
          >
            {checking ? 'Checking...' : 'Check Diseases'}
          </button>
          <button
            className="btn-outline"
            onClick={handleReset}
            disabled={selectedSymptoms.length === 0 && !results}
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
          >
            Clear
          </button>
        </div>

        {results && (
          <div className="results-section fade-in" style={{ marginTop: '2rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Possible Diseases</h2>

            {results.length === 0 ? (
              <div className="glass-card text-center" style={{ padding: '3rem' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>No specific diseases found matching all selected symptoms.</p>
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>However, please consult a veterinarian if symptoms persist.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {results.map((disease, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-primary)' }}>
                        {disease.disease_name}
                      </h3>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: getSeverityColor(disease.severity),
                        background: getSeverityBgColor(disease.severity),
                        display: 'inline-block'
                      }}>
                        {disease.severity} Severity
                      </span>
                    </div>

                    {(disease.severity === 'Critical' || disease.severity === 'High') && (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', padding: '10px 15px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️</span> Consult veterinarian immediately
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Matched Symptoms ({disease.match_count})</h4>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--color-text-secondary)' }}>
                          {disease.matched_symptoms.map((symp, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{symp}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Remedy</h4>
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{disease.remedy}</p>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Prevention</h4>
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{disease.prevention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomCheckerPage;
