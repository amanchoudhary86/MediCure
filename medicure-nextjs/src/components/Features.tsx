const Features = () => {
    return (
        <section className="Feautes section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>We Are Always Ready to Help You & Your Family</h2>
                            <img src="/static/img/section-img.png" alt="#" />
                            <p>
                                At SmartCare, we believe healthcare should be accessible,
                                efficient, and compassionate. Our advanced system ensures timely
                                care, real-time updates, and seamless coordination — bringing
                                healthcare closer to you and your loved ones.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-12">
                        {/* Start Single features */}
                        <div className="single-features">
                            <div className="signle-icon">
                                <i className="icofont icofont-ambulance-cross"></i>
                            </div>
                            <h3>Emergency Help</h3>
                            <p>
                                In times of crisis, speed, accuracy, coordination, technology,
                                care, and ensure that every life gets the attention it deserves.
                            </p>
                        </div>
                        {/* End Single features */}
                    </div>
                    <div className="col-lg-4 col-12">
                        {/* Start Single features */}
                        <div className="single-features">
                            <div className="signle-icon">
                                <i className="icofont icofont-stretcher"></i>
                            </div>
                            <h3>Bed Availability</h3>
                            <p>
                                We provide real-time information, allocation, and efficient
                                management of hospital beds to ensure immediate patient admission.
                            </p>
                        </div>
                        {/* End Single features */}
                    </div>
                    <div className="col-lg-4 col-12">
                        {/* Start Single features */}
                        <div className="single-features last">
                            <div className="signle-icon">
                                <i className="icofont icofont-blood"></i>
                            </div>
                            <h3>Blood Donation</h3>
                            <p>
                                Connecting donors with patients in need, ensuring a safe and
                                ready supply of blood for all medical emergencies and procedures.
                            </p>
                        </div>
                        {/* End Single features */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
