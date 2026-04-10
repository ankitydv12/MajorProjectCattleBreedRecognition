import { useTranslation } from 'react-i18next';
function AboutPage() {
  const { t } = useTranslation();
    return (
        <div className="page">
            <h2 className="section-title">{t('about.title')}</h2>
            <p className="section-subtitle">
                {t('about.subtitle')}
            </p>

            <div className="about-grid">
                <div className="card about-card">
                    <h3>{t('about.models_title')}</h3>
                    <p>{t('about.models_desc')}</p>
                    <ul>
                        <li>{t('about.model_mlp')}</li>
                        <li>{t('about.model_cnn')}</li>
                        <li>{t('about.model_resnet')}</li>
                        <li>{t('about.model_vit')}</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>
                        {t('about.model_selection')}
                    </p>
                </div>

                <div className="card about-card">
                    <h3>{t('about.dataset_title')}</h3>
                    <p>
                        {t('about.dataset_desc')}
                    </p>
                    <ul>
                        <li>{t('about.dataset_li1')}</li>
                        <li>{t('about.dataset_li2')}</li>
                        <li>{t('about.dataset_li3')}</li>
                        <li>{t('about.dataset_li4')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.tech_title')}</h3>
                    <ul>
                        <li>{t('about.tech_li1')}</li>
                        <li>{t('about.tech_li2')}</li>
                        <li>{t('about.tech_li3')}</li>
                        <li>{t('about.tech_li4')}</li>
                        <li>{t('about.tech_li5')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.best_model_title')}</h3>
                    <p>{t('about.best_model_desc')}</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <div className="breed-card-detail"><span className="label">{t('about.metric_f1')}</span><span className="value">50%</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.metric_acc')}</span><span className="value">20%</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.metric_latency')}</span><span className="value">15%</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.metric_size')}</span><span className="value">10%</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.metric_calib')}</span><span className="value">5%</span></div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>{t('about.farmers_title')}</h3>
                    <p>
                        {t('about.farmers_desc')}
                    </p>
                    <ul>
                        <li>{t('about.farmers_li1')}</li>
                        <li>{t('about.farmers_li2')}</li>
                        <li>{t('about.farmers_li3')}</li>
                        <li>{t('about.farmers_li4')}</li>
                        <li>{t('about.farmers_li5')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.creator_title')}</h3>
                    <p>
                        {t('about.creator_source')}
                        <a href="https://github.com/ankitydv12/MajorProjectCattleBreedRecognition" target="_blank" rel="noreferrer">
                            GitHub
                        </a>.
                    </p>
                    <ul style={{ marginTop: '0.5rem' }}>
                        <li>{t('about.creator_li1')}</li>
                        <li>{t('about.creator_li2')}</li>
                        <li>{t('about.creator_li3')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
