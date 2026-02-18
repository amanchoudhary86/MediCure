import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    return (
        <main className="min-h-screen">
            <Navbar />
            {/* Breadcrumbs */}
            <div className="breadcrumbs overlay">
                <div className="container">
                    <div className="bread-inner">
                        <div className="row">
                            <div className="col-12">
                                <h2>Contact Us</h2>
                                <ul className="bread-list">
                                    <li><a href="/">Home</a></li>
                                    <li><i className="icofont-simple-right"></i></li>
                                    <li className="active">Contact Us</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Breadcrumbs */}

            {/* Start Contact Us */}
            <section className="contact-us section">
                <div className="container">
                    <div className="inner">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="contact-us-left">
                                    {/* Start Google-map */}
                                    <div id="myMap">
                                        <iframe
                                            src="https://maps.google.com/maps?q=New%20Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            aria-hidden="false"
                                            tabIndex={0}
                                        ></iframe>
                                    </div>
                                    {/* End Google-map */}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="contact-us-form">
                                    <h2>Contact With Us</h2>
                                    <p>If you have any questions please fell free to contact with us.</p>
                                    {/* Form */}
                                    <form className="form" method="post" action="mail/mail.php">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" name="name" placeholder="Name" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="email" name="email" placeholder="Email" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" name="phone" placeholder="Phone" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" name="subject" placeholder="Subject" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <textarea name="message" placeholder="Your Message" required></textarea>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group login-btn">
                                                    <button className="btn" type="submit">Send</button>
                                                </div>
                                                <div className="checkbox">
                                                    <label className="checkbox-inline" htmlFor="2"><input name="news" id="2" type="checkbox" />Do you want to subscribe our Newsletter ?</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/* End Form */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-info">
                        <div className="row">
                            {/* single-info */}
                            <div className="col-lg-4 col-12 ">
                                <div className="single-info">
                                    <i className="icofont icofont-ui-call"></i>
                                    <div className="content">
                                        <h3>+(000) 1234 56789</h3>
                                        <p>info@company.com</p>
                                    </div>
                                </div>
                            </div>
                            {/* single-info */}
                            <div className="col-lg-4 col-12 ">
                                <div className="single-info">
                                    <i className="icofont icofont-google-map"></i>
                                    <div className="content">
                                        <h3>2 Fir e Brigade Road</h3>
                                        <p>Chittagonj, Lakshmipur</p>
                                    </div>
                                </div>
                            </div>
                            {/* single-info */}
                            <div className="col-lg-4 col-12 ">
                                <div className="single-info">
                                    <i className="icofont icofont-wall-clock"></i>
                                    <div className="content">
                                        <h3>Mon - Sat: 8am - 5pm</h3>
                                        <p>Sunday Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* / End Contact Us */}
            <Footer />
        </main>
    );
}
