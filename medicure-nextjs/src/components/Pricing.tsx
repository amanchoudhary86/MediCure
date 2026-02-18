const Pricing = () => {
    return (
        <section className="pricing-table section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>
                                We Provide You The Best Healthcare Services at Reasonable Prices
                            </h2>
                            <img src="/static/img/section-img.png" alt="#" />
                            <p>
                                Our platform offers advanced hospital management services
                                ensuring better care, faster processes, and transparent pricing.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* Single Table - Real-time Bed Availability */}
                    <div className="col-lg-4 col-md-12 col-12">
                        <div className="single-table">
                            <div className="table-head">
                                <div className="icon">
                                    <i className="fa-solid fa-bed-pulse"></i>
                                </div>
                                <h4 className="title">Real-time Bed Availability</h4>
                            </div>
                            <ul className="table-list">
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Live Bed Status
                                    Updates
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>ICU & General Ward
                                    Info
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Department-wise
                                    Filtering
                                </li>
                                <li className="cross">
                                    <i className="icofont icofont-ui-close"></i>Manual Availability
                                    Check
                                </li>
                                <li className="cross">
                                    <i className="icofont icofont-ui-close"></i>Outdated Data Issues
                                </li>
                            </ul>
                            <div className="table-bottom">
                                <a className="btn" href="#">Check Now</a>
                            </div>
                        </div>
                    </div>
                    {/* End Single Table */}

                    {/* Single Table - Queue Management System */}
                    <div className="col-lg-4 col-md-12 col-12">
                        <div className="single-table">
                            <div className="table-head">
                                <div className="icon">
                                    <i className="icofont icofont-users-social"></i>
                                </div>
                                <h4 className="title">Queue Management</h4>
                            </div>
                            <ul className="table-list">
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Real-time Queue
                                    Updates
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Department-wise Queues
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Token Generation
                                    System
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Priority Patient
                                    Handling
                                </li>
                                <li className="cross">
                                    <i className="icofont icofont-ui-close"></i>Manual Queue
                                    Management
                                </li>
                            </ul>
                            <div className="table-bottom">
                                <a className="btn" href="#">Explore Now</a>
                            </div>
                        </div>
                    </div>
                    {/* End Single Table */}

                    {/* Single Table - Inventory Management */}
                    <div className="col-lg-4 col-md-12 col-12">
                        <div className="single-table">
                            <div className="table-head">
                                <div className="icon">
                                    <i className="icofont icofont-box"></i>
                                </div>
                                <h4 className="title">Inventory Management</h4>
                            </div>
                            <ul className="table-list">
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Medicine Stock
                                    Tracking
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Medical Equipment
                                    Monitoring
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Auto Restock Alerts
                                </li>
                                <li>
                                    <i className="icofont icofont-ui-check"></i>Supplier Management
                                </li>
                                <li className="cross">
                                    <i className="icofont icofont-ui-close"></i>Manual Stock Checks
                                </li>
                            </ul>
                            <div className="table-bottom">
                                <a className="btn" href="#">View Inventory</a>
                            </div>
                        </div>
                    </div>
                    {/* End Single Table */}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
