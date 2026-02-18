const Services = () => {
    return (
        <section className="services section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>Explore Our Smart Healthcare Services</h2>
                            <img src="/static/img/section-img.png" alt="#" />
                            <p>
                                Our smart hospital offers advanced technology-driven services to
                                ensure seamless healthcare delivery and patient satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="fa-solid fa-bed-pulse"></i>
                            <h4><a href="#">Real-time Bed Availability</a></h4>
                            <p>
                                Instant updates on available beds across departments, helping
                                patients and doctors manage admissions efficiently.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-box"></i>
                            <h4><a href="#">Inventory Management</a></h4>
                            <p>
                                Track and manage medical supplies, medicines, and equipment in
                                real-time to avoid shortages and ensure smooth operations.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-users"></i>
                            <h4><a href="#">Queue Management</a></h4>
                            <p>
                                Smart queue management system that minimizes waiting times and
                                ensures smooth patient flow across hospital services.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-notification"></i>
                            <h4><a href="#">Emergency Notifications</a></h4>
                            <p>
                                Instant alerts to doctors and staff for emergency cases,
                                ensuring quick response and life-saving action.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-stethoscope"></i>
                            <h4><a href="#">Doctor Availability Tracker</a></h4>
                            <p>
                                Real-time scheduling and availability of doctors for better
                                appointment management and patient care.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-dashboard-web"></i>
                            <h4><a href="#">Dashboard Analytics</a></h4>
                            <p>
                                Centralized dashboard for hospital admins to monitor bed status,
                                patient inflow, stock levels, and service efficiency.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        {/* Start Single Service */}
                        <div className="single-service">
                            <i className="icofont icofont-patient-file"></i>
                            <h4><a href="#">Digital Patient Records</a></h4>
                            <p>
                                Complete digital medical history of patients, enabling faster
                                diagnosis and better treatment plans.
                            </p>
                        </div>
                        {/* End Single Service */}
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="single-service">
                            <i className="icofont icofont-calendar"></i>
                            <h4><a href="#">Remote Appointment Booking</a></h4>
                            <p>
                                Patients can easily book appointments online, reducing
                                unnecessary hospital visits and optimizing doctor schedules.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="single-service">
                            <i className="icofont icofont-video-alt"></i>
                            <h4><a href="#">Telemedicine Services</a></h4>
                            <p>
                                Patients can consult with doctors via video calls, enhancing
                                accessibility and reducing hospital congestion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
