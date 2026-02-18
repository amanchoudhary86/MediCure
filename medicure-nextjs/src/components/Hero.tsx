const Hero = () => {
    return (
        <section className="slider" style={{ position: 'relative', overflow: 'hidden', height: '100vh', minHeight: '600px' }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 10,
                }}
            >
                <source src="/hero-vid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(50, 50, 50, 0.6)', // Grayish overlay
                    zIndex: 20,
                }}
            />

            <div className="hero-content-wrapper" style={{ position: 'relative', zIndex: 30, height: '100%' }}>
                <div className="single-slider" style={{ background: 'transparent', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="text" style={{ position: 'relative', zIndex: 40, marginTop: 0, opacity: 1, visibility: 'visible', animation: 'none' }}>
                                    <p style={{
                                        color: '#f0d27a',
                                        fontStyle: 'italic',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.05em',
                                        marginBottom: '2.5rem',
                                        marginTop: '-1rem',
                                        fontWeight: 500,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    }}>
                                        &quot; शरीरमाद्यं खलु धर्मसाधनम् । &quot;
                                    </p>
                                    <h1 style={{ color: '#fff' }}>
                                        Real-Time <span style={{ color: '#e1f2c2' }}>Bed & Blood</span> Availability{" "}
                                        Dashboard
                                    </h1>
                                    <p style={{ color: '#fff' }}>
                                        Closing the gap in critical care. Instant visibility into ICU,
                                        general, and specialist bed availability across government
                                        hospitals — saving lives when every second counts.
                                    </p>
                                    <div className="button">
                                        <a href="/appointment" className="btn">
                                            Get Appointment
                                        </a>
                                        <a href="/about" className="btn primary">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
