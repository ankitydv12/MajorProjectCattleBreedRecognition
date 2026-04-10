import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="page">
            <section className="hero">
                <h1>
                    {t('home.title')}
                </h1>
                <p>
                    {t('home.subtitle')}
                </p>
                <Link to="/predict">
                    <button className="hero-cta">
                        🔍 {t('home.cta')}
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
                    <h3>{t('home.feature4_title')}</h3>
                    <p>{t('home.feature4_desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>{t('home.feature3_title')}</h3>
                    <p>{t('home.feature3_desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">📋</div>
                    <h3>{t('home.feature5_title')}</h3>
                    <p>{t('home.feature5_desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🌾</div>
                    <h3>{t('home.feature6_title')}</h3>
                    <p>{t('home.feature6_desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>{t('home.feature1_title')}</h3>
                    <p>{t('home.feature1_desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🐃</div>
                    <h3>{t('home.feature2_title')}</h3>
                    <p>{t('home.feature2_desc')}</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
