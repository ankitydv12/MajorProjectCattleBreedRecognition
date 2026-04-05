import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="page">
            <section className="hero">
                <h1>
                    Identify Your <span className="accent">Cattle Breed</span> in Seconds
                </h1>
                <p>
                    AI-powered breed classification for 26 indigenous Indian cattle and buffalo breeds.
                    Upload a photo, point your camera, or paste a URL — get instant results.
                </p>
                <Link to="/predict">
                    <button className="hero-cta">
                        🔍 Start Classifying
                    </button>
                </Link>

                {/* SVG Rolling Hills Divider */}
                <div className="hero-divider">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.86,122.9,165.7,112.5,237.1,89.5,265.81,80.3,293.4,69.5,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>
            </section>

            <section className="features-grid">
                <div className="card feature-card">
                    <div className="feature-icon">📸</div>
                    <h3>Multiple Input Modes</h3>
                    <p>Upload images, capture from camera, or paste a URL. Works on any device with a browser.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>Deep Learning Models</h3>
                    <p>Trained and compared 4 architectures — MLP, CNN, ResNet50, and Vision Transformer — to find the best.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">📋</div>
                    <h3>Breed Information</h3>
                    <p>Get detailed metadata: region, milk yield, lifespan, primary use, and physical characteristics.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🌾</div>
                    <h3>Farmer-Friendly</h3>
                    <p>Designed for real-world use. Clear confidence indicators, image quality tips, and easy navigation.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Fast & Reliable</h3>
                    <p>Sub-second predictions with confidence scores. Know when to trust the result.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🐃</div>
                    <h3>26 Breeds</h3>
                    <p>Covers major indigenous cow and buffalo breeds from across India with verified metadata.</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
