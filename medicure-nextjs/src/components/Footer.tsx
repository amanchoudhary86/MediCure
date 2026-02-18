const Footer = () => {
    return (
        <footer id="footer" className="footer">
            {/* Footer Top */}
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="single-footer">
                                <h2>About Us</h2>
                                <p>
                                    We provide real-time hospital bed availability, digital
                                    patient records, and advanced healthcare insights to ensure
                                    faster and smarter medical services.
                                </p>
                                {/* Social */}
                                <ul className="social">
                                    <li>
                                        <a href="mailto:nicdelhi2024@gmail.com">
                                            <i className="icofont-google-plus"></i>
                                        </a>
                                    </li>
                                </ul>
                                {/* End Social */}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="single-footer f-link">
                                <h2>Quick Links</h2>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <ul>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Home</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>About Us</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Services</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Our Cases</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Other Links</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <ul>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Consuling</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Finance</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Testimonials</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>FAQ</a>
                                            </li>
                                            <li>
                                                <a href="#"><i className="fa fa-caret-right" aria-hidden="true"></i>Contact Us</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="single-footer">
                                <h2>Open Hours</h2>
                                <p>
                                    We are available 24/7 to assist you with real-time bed
                                    availability, patient records, and emergency care services.
                                </p>
                                <ul className="time-sidual">
                                    <li className="day">Mon - Sun <span>8am - 5pm</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* / End Footer Top */}
            {/* Copyright */}
            <div className="copyright">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="copyright-content">
                                <p>
                                    © Copyright 2025 | All Rights Reserved by{" "}
                                    <a href="https://www.Smart Hospital.com" target="_blank">Smart Hospital Team.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* / End Copyright */}
        </footer>
    );
};

export default Footer;
