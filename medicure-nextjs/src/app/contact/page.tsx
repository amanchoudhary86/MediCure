"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    return (
        <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                .contact-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    padding: 80px 0 100px;
                    text-align: center;
                    position: relative;
                }

                .contact-hero h1 {
                    font-size: 42px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    letter-spacing: -0.5px;
                }

                .contact-hero p {
                    font-size: 18px;
                    color: #94a3b8;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .contact-wrapper {
                    max-width: 1200px;
                    margin: -60px auto 80px;
                    padding: 0 24px;
                    position: relative;
                    z-index: 10;
                }

                .contact-card {
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    overflow: hidden;
                }

                .contact-form-section {
                    padding: 48px;
                }

                .contact-info-section {
                    background: #f1f5f9;
                    padding: 48px;
                    border-left: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .form-header h2 {
                    font-size: 28px;
                    color: #0f172a;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .form-header p {
                    color: #64748b;
                    margin-bottom: 32px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group.full {
                    grid-column: span 2;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #334155;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .form-input, .form-textarea {
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #0f172a;
                    background: #fff;
                    transition: all 0.2s;
                    font-family: inherit;
                    width: 100%;
                }

                .form-input:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                }

                .submit-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 14px 32px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 16px;
                }

                .submit-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                }

                .info-item {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }

                .info-icon {
                    width: 48px;
                    height: 48px;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #3b82f6;
                    font-size: 24px; // Replaced icofont with unicode/svg ideally, but kept cleaner
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    flex-shrink: 0;
                }

                .info-content h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #0f172a;
                    margin: 0 0 4px;
                }

                .info-content p {
                    color: #64748b;
                    font-size: 15px;
                    line-height: 1.5;
                    margin: 0;
                }

                .map-container {
                    border-radius: 16px;
                    overflow: hidden;
                    height: 250px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 4px solid white;
                    margin-top: auto;
                }

                @media (max-width: 992px) {
                    .contact-card {
                        grid-template-columns: 1fr;
                    }
                    .contact-info-section {
                        order: -1;
                        padding: 32px;
                    }
                    .contact-form-section {
                        padding: 32px;
                    }
                }
            `}</style>

            <div className="contact-hero">
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <h1 style={{ color: 'white' }}>Get in Touch</h1>
                    <p>Have questions about bed availability or blood stocks? We're here to help you 24/7.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="contact-wrapper">
                <div className="contact-card">
                    {/* Form Section */}
                    <div className="contact-form-section">
                        <div className="form-header">
                            <h2>Send us a Message</h2>
                            <p>Fill out the form below and we'll get back to you shortly.</p>
                        </div>
                        <form action="#">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" className="form-input" placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" className="form-input" placeholder="john@example.com" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" className="form-input" placeholder="+91 98765 43210" required />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input type="text" className="form-input" placeholder="Inquiry about..." required />
                                </div>
                                <div className="form-group full">
                                    <label>Message</label>
                                    <textarea className="form-textarea" placeholder="How can we help you?" required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="submit-btn" style={{ backgroundColor: '#1a76d1' }}>Send Message</button>
                        </form>
                    </div>

                    {/* Info Side */}
                    <div className="contact-info-section">
                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                                <h3>Visit Us</h3>
                                <p>Amity University, Jaipur<br />Rajasthan, India</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div className="info-content">
                                <h3>Call Us</h3>
                                <p>+91 74183 33256<br />+91 (000) 123 4567</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div className="info-content">
                                <h3>Email Us</h3>
                                <p>amity@medicure.com<br />medicure@medicure.com</p>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="map-container" id="myMap">
                            <iframe
                                src="https://maps.google.com/maps?q=Amity%20University%20Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                aria-hidden="false"
                                tabIndex={0}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
