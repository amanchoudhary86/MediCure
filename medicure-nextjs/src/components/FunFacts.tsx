const FunFacts = () => {
    return (
        <div
            id="fun-facts"
            className="fun-facts section"
            style={{
                backgroundColor: '#0d7377',
                backgroundImage: 'none',
            }}
        >
            <div className="container">
                <div className="row justify-content-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="col-lg-4 col-md-6 col-12" style={{ display: 'flex', justifyContent: 'center' }}>
                        {/* Start Single Fun */}
                        <div className="single-fun" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <i className="icofont icofont-stretcher" style={{ position: 'static', marginTop: 0 }}></i>
                            <div className="content">
                                <span className="counter">3468</span>
                                <p>Hospital Beds</p>
                            </div>
                        </div>
                        {/* End Single Fun */}
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" style={{ display: 'flex', justifyContent: 'center' }}>
                        {/* Start Single Fun */}
                        <div className="single-fun" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <i className="icofont icofont-blood" style={{ position: 'static', marginTop: 0 }}></i>
                            <div className="content">
                                <span className="counter">4379</span>
                                <p>Blood Units Available</p>
                            </div>
                        </div>
                        {/* End Single Fun */}
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" style={{ display: 'flex', justifyContent: 'center' }}>
                        {/* Start Single Fun */}
                        <div className="single-fun" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <i className="icofont icofont-ambulance-cross" style={{ position: 'static', marginTop: 0 }}></i>
                            <div className="content">
                                <span className="counter">32</span>
                                <p>Daily Emergencies</p>
                            </div>
                        </div>
                        {/* End Single Fun */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunFacts;
