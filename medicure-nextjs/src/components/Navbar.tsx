"use client";

import Link from "next/link";

const Navbar = () => {
    return (
        <header className="header sticky">
            <style jsx global>{`
            /* Navbar CSS Overrides for "Professional" look */
            .header {
                background-color: rgba(240, 240, 240, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                padding: 5px 0;
                transition: all 0.3s ease;
                z-index: 1000;
                width: 100%;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }
            
            .header .logo a {
                font-family: 'Poppins', sans-serif;
                font-size: 28px;
                font-weight: 700;
                color: #1A76D1;
                text-decoration: none;
                letter-spacing: -0.5px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .header .logo a img {
                height: 50px;
                width: auto;
                object-fit: contain;
                margin-top: -8px;
                margin-left: 20px;
            }

            .main-menu .nav {
                display: flex;
                gap: 30px; 
                margin: 0;
                padding: 0;
                list-style: none;
            }
            
            .main-menu .nav li {
                position: relative;
                display: inline-block;
            }

            .main-menu .nav li a {
                display: block;
                font-size: 16px;
                font-weight: 500;
                color: #111;
                padding: 25px 0;
                text-transform: capitalize;
                text-decoration: none;
                position: relative;
                transition: color 0.3s ease;
            }

            /* Hover Effect: Animated underline from center */
            .main-menu .nav li a::after {
                content: '';
                position: absolute;
                width: 0%;
                height: 2.5px;
                bottom: 18px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(90deg, #1A76D1, #00C6FF);
                transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                border-radius: 4px;
            }
            
            .main-menu .nav li:hover a::after,
            .main-menu .nav li.active a::after {
                width: 80%;
            }

            .main-menu .nav li:hover a, 
            .main-menu .nav li.active a {
                color: #1A76D1;
                
            }
            
            .header-actions {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            /* Login Button - Modern Ghost style */
            .login-btn {
                font-size: 15px;
                font-weight: 600;
                color: #1A76D1;
                background: transparent;
                padding: 10px 24px;
                border: 2px solid #1A76D1;
                border-radius: 50px;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .login-btn:hover {
                background: #1A76D1;
                color: #fff;
                box-shadow: 0 4px 12px rgba(26, 118, 209, 0.2);
                transform: translateY(-1px);
            }

            /* Appointment Button - Gradient CTA */
            .btn-appointment {
                font-size: 15px;
                font-weight: 700;
                color: #ffffff !important;
                background: linear-gradient(45deg, #1A76D1, #00C6FF);
                padding: 12px 28px;
                border-radius: 50px;
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(26, 118, 209, 0.3);
                border: none;
            }
            
            .btn-appointment:hover {
                background: linear-gradient(45deg, #155bb5, #009ecf);
                box-shadow: 0 6px 20px rgba(26, 118, 209, 0.4);
                transform: translateY(-2px);
            }

            /* Override template hover bg */
            .header .nav li:hover a,
            .header .nav li.active a {
                background: none !important;
                box-shadow: none !important;
            }
         `}</style>

            <div className="header-inner">
                <div className="container-fluid">
                    <div className="inner">
                        <div className="row align-items-center justify-content-between">
                            {/* Logo Section */}
                            <div className="col-auto">
                                <div className="logo">
                                    <Link href="/"><img src="/logo.png" alt="MediCure" /></Link>
                                </div>
                            </div>

                            {/* Main Menu (Centered) */}
                            <div className="col-auto d-none d-lg-block">
                                <div className="main-menu">
                                    <nav className="navigation">
                                        <ul className="nav menu">
                                            <li><Link href="/">Home</Link></li>
                                            <li><Link href="/bed_status">Bed Availability</Link></li>
                                            <li><Link href="/blood_availability">Blood Availability</Link></li>
                                            <li><Link href="/contact">Contact Us</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            {/* Right Buttons (Book Appt + Login) */}
                            <div className="col-auto">
                                <div className="header-actions">
                                    <Link href="/login" className="login-btn">Login</Link>
                                    <Link href="/appointment" className="btn-appointment">Book Appointment</Link>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <div className="col-auto d-lg-none">
                                <div className="mobile-nav"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
