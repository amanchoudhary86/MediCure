const Schedule = () => {
    return (
        <section className="schedule">
            <div className="container">
                <div className="schedule-inner" style={{ position: 'relative', zIndex: 50 }}>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-12">
                            {/* single-schedule */}
                            <div className="single-schedule first">
                                <div className="inner">
                                    <div className="icon">
                                        <i className="fa fa-bed"></i>
                                    </div>
                                    <div className="single-content">
                                        <span>Real-Time Status</span>
                                        <h4>Bed Availability</h4>
                                        <p>
                                            Instant visibility into ICU, General, Paediatric, and Isolation
                                            beds across government hospitals — saving lives when every
                                            second counts.
                                        </p>
                                        <a href="/bed_status">
                                            CHECK NOW<i className="fa fa-long-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12">
                            {/* single-schedule */}
                            <div className="single-schedule middle">
                                <div className="inner">
                                    <div className="icon">
                                        <i className="fa fa-tint"></i>
                                    </div>
                                    <div className="single-content">
                                        <span>Live Inventory</span>
                                        <h4>Blood Bank Stock</h4>
                                        <p>
                                            Real-time tracking of blood stock levels across all districts.
                                            Ensure critical supplies are available for emergency cases
                                            without delay.
                                        </p>
                                        <a href="#">
                                            VIEW STOCK<i className="fa fa-long-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-12">
                            {/* single-schedule */}
                            <div className="single-schedule last">
                                <div className="inner">
                                    <div className="icon">
                                        <i className="fa fa-ambulance"></i>
                                    </div>
                                    <div className="single-content">
                                        <span>24/7 Support</span>
                                        <h4>Emergency Contacts</h4>
                                        <p>
                                            Direct access to ambulance dispatchers and critical care
                                            hotlines. Immediate response coordination for urgent
                                            medical situations.
                                        </p>
                                        <a href="/contact">
                                            GET HELP<i className="fa fa-long-arrow-right"></i>
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

export default Schedule;
