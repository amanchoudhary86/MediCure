const Portfolio = () => {
    // Generate array of 27 images
    const images = Array.from({ length: 27 }, (_, i) => `/gallery/gallery-${i + 1}.jpeg`);

    return (
        <section className="portfolio section" style={{ paddingBottom: '0' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>We Maintain Cleanliness Rules Inside Our Hospital</h2>
                            <img src="/static/img/section-img.png" alt="#" />
                            <p>
                                Our hospital follows advanced sanitation protocols, ensuring a
                                safe and infection-free environment for all patients and
                                visitors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid" style={{ padding: 0 }}>
                <div className="marquee-container">
                    <div className="marquee-content">
                        {/* Original Set */}
                        {images.map((src, index) => (
                            <div key={`orig-${index}`} className="marquee-item">
                                <img src={src} alt={`Gallery Image ${index + 1}`} />
                            </div>
                        ))}
                        {/* Duplicate Set for Seamless Loop */}
                        {images.map((src, index) => (
                            <div key={`dup-${index}`} className="marquee-item">
                                <img src={src} alt={`Gallery Image ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
