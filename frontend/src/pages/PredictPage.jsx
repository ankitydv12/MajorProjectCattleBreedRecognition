import { useTranslation } from 'react-i18next';
import { useState, useRef, useCallback } from 'react';
import { predictFromFile, predictFromURL, predictFromBase64, getBreedFull } from '../services/api';
import { usePredictionHistory } from '../hooks/usePredictionHistory';

function PredictPage() {
  const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('upload');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);

    const [fullBreedInfo, setFullBreedInfo] = useState(null);
    const [infoLoading, setInfoLoading] = useState(false);
    const [infoError, setInfoError] = useState(null);
    const [infoTab, setInfoTab] = useState('overview'); // overview, profile, diet, diseases
    const [expandedDisease, setExpandedDisease] = useState(null);

    const fetchFullInfo = async (breedName) => {
        setInfoLoading(true);
        setInfoError(null);
        try {
            const data = await getBreedFull(breedName);
            setFullBreedInfo(data);
        } catch (err) {
            setInfoError('Details not available');
        } finally {
            setInfoLoading(false);
        }
    };


    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const { history, addPrediction } = usePredictionHistory();

    // File upload handlers
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        setSelectedFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    // Camera handlers
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraActive(true);
            setError(null);
        } catch (err) {
            setError('Could not access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        setCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        stopCamera();
    };

    // Clear
    const clearImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        setResult(null);
        setFullBreedInfo(null);
        setInfoError(null);
        setInfoTab('overview');
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Predict
    const handlePredict = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setFullBreedInfo(null);
        setInfoError(null);
        setInfoTab('overview');

        try {
            let response;
            if (activeTab === 'upload' && selectedFile) {
                response = await predictFromFile(selectedFile);
            } else if (activeTab === 'url' && imageUrl) {
                response = await predictFromURL(imageUrl);
            } else if (activeTab === 'camera' && imagePreview) {
                response = await predictFromBase64(imagePreview);
            } else {
                setError('Please provide an image first');
                setLoading(false);
                return;
            }

            setResult(response);
            addPrediction(response, imagePreview);
            if (response.predicted_breed) {
                fetchFullInfo(response.predicted_breed);
            }

        } catch (err) {
            setError(err.message || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedFile, imageUrl, imagePreview, addPrediction]);

    const getConfidenceClass = (conf) => {
        if (conf >= 0.75) return 'high';
        if (conf >= 0.5) return 'medium';
        return 'low';
    };

    const canPredict = (activeTab === 'upload' && selectedFile) ||
        (activeTab === 'url' && imageUrl.trim()) ||
        (activeTab === 'camera' && imagePreview);

    return (
        <div className="page">
            <h2 className="section-title">Predict Breed</h2>
            <p className="section-subtitle">Upload an image, use your camera, or paste a URL to identify the breed.</p>

            <div className="predict-layout">
                {/* Left: Input panel */}
                <div className="glass-card">
                    <div className="input-tabs">
                        <button className={`input-tab ${activeTab === 'upload' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('upload'); stopCamera(); }}>
                            📁 Upload
                        </button>
                        <button className={`input-tab ${activeTab === 'camera' ? 'active' : ''}`}
                            onClick={() => setActiveTab('camera')}>
                            📷 Camera
                        </button>
                        <button className={`input-tab ${activeTab === 'url' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('url'); stopCamera(); }}>
                            🔗 URL
                        </button>
                    </div>

                    {/* Upload tab */}
                    {activeTab === 'upload' && (
                        <>
                            <div className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}>
                                <div className="icon">📤</div>
                                <p><strong>Click to upload</strong> or drag & drop</p>
                                <p className="hint">JPG, PNG, WebP — max 10MB</p>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
                        </>
                    )}

                    {/* Camera tab */}
                    {activeTab === 'camera' && (
                        <>
                            {!cameraActive && !imagePreview && (
                                <div className="upload-zone" onClick={startCamera}>
                                    <div className="icon">📷</div>
                                    <p><strong>Click to open camera</strong></p>
                                    <p className="hint">Allow camera access when prompted</p>
                                </div>
                            )}
                            {cameraActive && (
                                <div className="camera-container">
                                    <video ref={videoRef} playsInline muted />
                                    <div className="camera-controls">
                                        <button className="camera-capture-btn" onClick={capturePhoto} title="Capture Photo" />
                                        <button className="btn-secondary" onClick={stopCamera}>Cancel</button>
                                    </div>
                                </div>
                            )}
                            <canvas ref={canvasRef} hidden />
                        </>
                    )}

                    {/* URL tab */}
                    {activeTab === 'url' && (
                        <>
                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{t('predict.image_url')}</label>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    placeholder="https://example.com/cow-image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                                />
                            </div>
                        </>
                    )}

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button className="remove-btn" onClick={clearImage}>✕</button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="prediction-warning" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Predict button */}
                    <button className="btn-primary predict-btn" onClick={handlePredict}
                        disabled={!canPredict || loading}>
                        {loading ? '⏳ Analyzing...' : '🔍 Classify Breed'}
                    </button>

                    {/* Tips */}
                    <div className="tips-box">
                        <h4>📸 Tips for Better Results</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>• Use a clear side-view photo of the animal</li>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>• Ensure good lighting and minimal background clutter</li>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>• Show the full body including head and horns</li>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>• Avoid photos with multiple animals</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Results panel */}
                <div>
                    {loading && (
                        <div className="glass-card loading-spinner">
                            <div className="spinner" />
                            <p style={{ color: 'var(--color-text-secondary)' }}>Analyzing image...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="glass-card result-card">
                            <div className="result-header">
                                <h3 className="result-breed-name">{result.predicted_breed}</h3>
                                <span className={`result-badge ${getConfidenceClass(result.confidence)}`}>
                                    {(result.confidence * 100).toFixed(1)}%
                                </span>
                            </div>

                            {/* Confidence bar */}
                            <div className="confidence-bar-container">
                                <div className="confidence-bar-label">
                                    <span>{t('predict.confidence')}</span>
                                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="confidence-bar">
                                    <div className="confidence-bar-fill" style={{ width: `${result.confidence * 100}%` }} />
                                </div>
                            </div>

                            {/* Top K predictions */}
                            {result.top_k && result.top_k.length > 1 && (
                                <div className="topk-list">
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                        {t('predict.top_prediction')}s
                                    </h4>
                                    {result.top_k.map((item, idx) => (
                                        <div className="topk-item" key={idx}>
                                            <span className={`topk-rank ${idx === 0 ? 'first' : ''}`}>{idx + 1}</span>
                                            <span className="topk-name">{item.breed}</span>
                                            <span className="topk-conf">{(item.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}


                            {/* Breed info */}
                            {result.breed_info && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    {/* Tabs */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem', overflowX: 'auto', gap: '1rem' }}>
                                        <button
                                            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontWeight: 600, color: infoTab === 'overview' ? '#d97706' : 'var(--color-text-secondary)', borderBottom: infoTab === 'overview' ? '2px solid #d97706' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            onClick={() => setInfoTab('overview')}
                                        >
                                            📋 Overview
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontWeight: 600, color: infoTab === 'profile' ? '#d97706' : 'var(--color-text-secondary)', borderBottom: infoTab === 'profile' ? '2px solid #d97706' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            onClick={() => setInfoTab('profile')}
                                        >
                                            🐄 Breed Profile
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontWeight: 600, color: infoTab === 'diet' ? '#d97706' : 'var(--color-text-secondary)', borderBottom: infoTab === 'diet' ? '2px solid #d97706' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            onClick={() => setInfoTab('diet')}
                                        >
                                            🌾 Diet & Nutrition
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontWeight: 600, color: infoTab === 'diseases' ? '#d97706' : 'var(--color-text-secondary)', borderBottom: infoTab === 'diseases' ? '2px solid #d97706' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            onClick={() => setInfoTab('diseases')}
                                        >
                                            🏥 Diseases
                                        </button>
                                    </div>

                                    {/* Content Area */}
                                    <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                        {infoTab === 'overview' && (
                                            <>
                                                <div className="breed-info-grid">
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">{t('predict.region')}</div>
                                                        <div className="breed-info-value">{result.breed_info.region}</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Type</div>
                                                        <div className="breed-info-value">{result.breed_info.animal_type}</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">{t('predict.milk_yield')}</div>
                                                        <div className="breed-info-value">{result.breed_info.avg_milk_liters_per_day} {t('predict.milk_unit')}</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">{t('predict.lifespan')}</div>
                                                        <div className="breed-info-value">{result.breed_info.lifespan_years} {t('predict.lifespan_unit')}</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">{t('predict.primary_use')}</div>
                                                        <div className="breed-info-value">{result.breed_info.primary_use}</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Inference</div>
                                                        <div className="breed-info-value">{result.inference_time_ms} ms</div>
                                                    </div>
                                                </div>
                                                {result.breed_info.description && (
                                                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                                        {result.breed_info.description}
                                                    </p>
                                                )}
                                            </>
                                        )}

                                        {infoTab !== 'overview' && infoLoading && (
                                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                                <div className="spinner" style={{ margin: '0 auto', width: '24px', height: '24px', borderTopColor: '#d97706' }} />
                                                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Loading details...</p>
                                            </div>
                                        )}

                                        {infoTab !== 'overview' && !infoLoading && infoError && (
                                            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-secondary)' }}>
                                                <p>Details not available</p>
                                            </div>
                                        )}

                                        {infoTab === 'profile' && !infoLoading && fullBreedInfo && fullBreedInfo.profile && (
                                            <div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                                                    {fullBreedInfo.profile.physical_description}
                                                </p>

                                                {fullBreedInfo.profile.special_traits && fullBreedInfo.profile.special_traits.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                                                        {fullBreedInfo.profile.special_traits.map((trait, idx) => (
                                                            <span key={idx} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 }}>
                                                                {trait}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="breed-info-grid">
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Male Weight</div>
                                                        <div className="breed-info-value">{fullBreedInfo.profile.avg_weight_male_kg} kg</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Female Weight</div>
                                                        <div className="breed-info-value">{fullBreedInfo.profile.avg_weight_female_kg} kg</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Height</div>
                                                        <div className="breed-info-value">{fullBreedInfo.profile.avg_height_cm} cm</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Population</div>
                                                        <div className="breed-info-value">{fullBreedInfo.profile.estimated_population}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {infoTab === 'diet' && !infoLoading && fullBreedInfo && fullBreedInfo.diet && (
                                            <div>
                                                <div className="breed-info-grid" style={{ marginBottom: '1.5rem' }}>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Dry Fodder</div>
                                                        <div className="breed-info-value">{fullBreedInfo.diet.dry_fodder_kg_per_day} kg/day</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Green Fodder</div>
                                                        <div className="breed-info-value">{fullBreedInfo.diet.green_fodder_kg_per_day} kg/day</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Concentrate</div>
                                                        <div className="breed-info-value">{fullBreedInfo.diet.concentrate_kg_per_day} kg/day</div>
                                                    </div>
                                                    <div className="breed-info-item">
                                                        <div className="breed-info-label">Water</div>
                                                        <div className="breed-info-value">{fullBreedInfo.diet.water_liters_per_day} L/day</div>
                                                    </div>
                                                </div>

                                                <div style={{ marginBottom: '1rem' }}>
                                                    <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Recommended Fodder</h5>
                                                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                                        {fullBreedInfo.diet.recommended_fodder && fullBreedInfo.diet.recommended_fodder.map((item, idx) => (
                                                            <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Feeding Schedule</h5>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                                                        <div style={{ marginBottom: '4px' }}><strong>Morning:</strong> {fullBreedInfo.diet.feeding_schedule_morning}</div>
                                                        <div style={{ marginBottom: '4px' }}><strong>Afternoon:</strong> {fullBreedInfo.diet.feeding_schedule_afternoon}</div>
                                                        <div><strong>Evening:</strong> {fullBreedInfo.diet.feeding_schedule_evening}</div>
                                                    </div>
                                                </div>

                                                {fullBreedInfo.diet.foods_to_avoid && fullBreedInfo.diet.foods_to_avoid.length > 0 && (
                                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '10px', borderRadius: '4px' }}>
                                                        <h5 style={{ fontSize: '0.85rem', color: '#b91c1c', marginBottom: '0.5rem', marginTop: 0 }}>⚠️ Foods to Avoid</h5>
                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#991b1b' }}>
                                                            {fullBreedInfo.diet.foods_to_avoid.map((item, idx) => (
                                                                <li key={idx} style={{ marginBottom: '2px' }}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {infoTab === 'diseases' && !infoLoading && fullBreedInfo && fullBreedInfo.diseases && (
                                            <div>
                                                {fullBreedInfo.diseases.map((disease, idx) => {
                                                    const isExpanded = expandedDisease === idx;
                                                    let severityColor = '#10b981'; // low
                                                    let severityBg = 'rgba(16, 185, 129, 0.15)';
                                                    if (disease.severity === 'Critical') { severityColor = '#ef4444'; severityBg = 'rgba(239, 68, 68, 0.15)'; }
                                                    else if (disease.severity === 'High') { severityColor = '#f97316'; severityBg = 'rgba(249, 115, 22, 0.15)'; }
                                                    else if (disease.severity === 'Medium') { severityColor = '#f59e0b'; severityBg = 'rgba(245, 158, 11, 0.15)'; }

                                                    return (
                                                        <div key={idx} style={{ marginBottom: '10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                                            <div
                                                                onClick={() => setExpandedDisease(isExpanded ? null : idx)}
                                                                style={{ padding: '12px', background: 'var(--color-bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                                            >
                                                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{disease.disease_name}</h4>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '12px', color: severityColor, background: severityBg }}>
                                                                        {disease.severity}
                                                                    </span>
                                                                    <span style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>{isExpanded ? '−' : '+'}</span>
                                                                </div>
                                                            </div>

                                                            {isExpanded && (
                                                                <div style={{ padding: '12px', background: '#fff' }}>
                                                                    {disease.severity === 'Critical' && (
                                                                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                                                                            ⚠️ Contact your veterinarian immediately
                                                                        </div>
                                                                    )}

                                                                    <div style={{ marginBottom: '1rem' }}>
                                                                        <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Symptoms</h5>
                                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                                                            {disease.symptoms && disease.symptoms.map((item, i) => (
                                                                                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div style={{ marginBottom: '1rem' }}>
                                                                        <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Prevention</h5>
                                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                                                            {disease.prevention && disease.prevention.map((item, i) => (
                                                                                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div>
                                                                        <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Remedy</h5>
                                                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                                                            {disease.remedy && disease.remedy.map((item, i) => (
                                                                                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Warning */}
                            {result.warning && (
                                <div className="prediction-warning">
                                    ⚠️ {result.warning}
                                </div>
                            )}
                        </div>
                    )}

                    {/* History */}
                    {!result && !loading && history.length > 0 && (
                        <div className="glass-card">
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>{t('predict.recent_predictions')}</h4>
                            {history.slice(0, 5).map((entry) => (
                                <div key={entry.id} className="topk-item">
                                    <span className="topk-name">{entry.predictedBreed}</span>
                                    <span className="topk-conf">
                                        {(entry.confidence * 100).toFixed(1)}% · {new Date(entry.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PredictPage;
