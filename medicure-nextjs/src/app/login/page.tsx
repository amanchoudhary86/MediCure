"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { findHospitalByEmail } from "@/lib/hospitals";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

export default function Login() {
    const [activeTab, setActiveTab] = useState<'central' | 'hospital'>('central');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const togglePasswordVisibility = (id: string) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        // 1. Central Control (Super Admin)
        if (cleanEmail === 'admin@medicure.com' && cleanPassword === 'Medicure@Admin2026') {
            router.push("/super_admin_dashboard");
            return;
        }

        // 2. Hospital Admin — check against all 11 hospitals (works on any tab)
        const hospital = findHospitalByEmail(cleanEmail);
        if (hospital && hospital.password === cleanPassword) {
            localStorage.setItem("hospitalId", hospital.id);
            localStorage.setItem("hospitalName", hospital.name);
            localStorage.setItem("hospitalEmail", hospital.email);
            router.push("/admin/dashboard");
            return;
        }

        // 3. Try Firebase Auth only if API key is configured (not placeholder)
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (cleanEmail.includes('@') && apiKey && apiKey !== 'your_api_key') {
            try {
                await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
                if (activeTab === 'central') {
                    router.push("/super_admin_dashboard");
                } else {
                    router.push("/admin/dashboard");
                }
            } catch (err: any) {
                console.error("Firebase Login Error:", err);
                setError("Invalid credentials. Please try again.");
            }
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-body">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

                .login-body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #1a1f2e 0%, #232940 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                }

                /* Animated background elements */
                .login-body::before, .login-body::after {
                    content: '';
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(26, 118, 209, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
                    z-index: 0;
                    animation: float 10s infinite ease-in-out alternate;
                }

                .login-body::before {
                    top: -200px;
                    left: -200px;
                }

                .login-body::after {
                    bottom: -200px;
                    right: -200px;
                    animation-delay: -5s;
                }

                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                .login-container {
                    position: relative;
                    z-index: 2;
                    background: rgba(30, 37, 54, 0.75);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    width: 100%;
                    max-width: 480px;
                    padding: 45px;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .login-header {
                    margin-bottom: 35px;
                }

                .login-header h2 {
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 28px;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .login-header p {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 15px;
                }

                .toggle-container {
                    display: flex;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 50px;
                    margin-bottom: 35px;
                    padding: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .toggle-btn {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 12px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }

                .toggle-btn:hover {
                    color: #fff;
                }

                .toggle-btn.active {
                    background: linear-gradient(90deg, #1A76D1, #00C6FF);
                    color: #fff;
                    box-shadow: 0 4px 15px rgba(26, 118, 209, 0.3);
                    font-weight: 600;
                }

                .form-group {
                    margin-bottom: 24px;
                    text-align: left;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 14px;
                    font-weight: 500;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 14px 16px 14px 45px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: #ffffff;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .input-wrapper input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .input-wrapper input:focus {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: #1A76D1;
                    box-shadow: 0 0 0 4px rgba(26, 118, 209, 0.15);
                }

                .input-wrapper i.icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 16px;
                    transition: color 0.3s;
                }

                .input-wrapper input:focus ~ i.icon {
                    color: #1A76D1;
                }

                .input-wrapper i.toggle-password {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .input-wrapper i.toggle-password:hover {
                    color: #fff;
                }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(90deg, #1A76D1, #00C6FF);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                    box-shadow: 0 4px 15px rgba(26, 118, 209, 0.3);
                }

                .submit-btn:hover {
                    background: linear-gradient(90deg, #155bb5, #009ecf);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(26, 118, 209, 0.4);
                }

                .submit-btn:active {
                    transform: translateY(0);
                }

                .form-section {
                    display: none;
                    animation: fadeIn 0.4s ease;
                }

                .form-section.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .home-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 25px;
                    color: rgba(255, 255, 255, 0.5);
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.3s;
                }

                .home-link:hover {
                    color: #ffffff;
                }

                /* Demo Credentials Box */
                .demo-credentials {
                    margin-top: 30px;
                    text-align: left;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .demo-credentials h4 {
                    margin-bottom: 10px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .demo-credentials code {
                    display: block;
                    margin-bottom: 6px;
                    color: #4ade80;
                    font-family: 'Consolas', monospace;
                    font-size: 12px;
                    background: rgba(74, 222, 128, 0.1);
                    padding: 6px 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(74, 222, 128, 0.15);
                }

                .download-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 15px;
                    color: #fff;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s;
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    width: 100%;
                    justify-content: center;
                }

                .download-link:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.3);
                }
            `}</style>

            {/* FontAwesome */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="login-container">
                <div className="login-header">
                    <h2>Portal Login</h2>
                    <p>Select your role to access the dashboard</p>
                </div>

                <div className="toggle-container">
                    <button
                        className={`toggle-btn ${activeTab === 'central' ? 'active' : ''}`}
                        onClick={() => setActiveTab('central')}
                    >
                        Central Control
                    </button>
                    <button
                        className={`toggle-btn ${activeTab === 'hospital' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hospital')}
                    >
                        Hospital Admin
                    </button>
                </div>

                {/* Central Control Login Form */}
                <div id="central-form" className={`form-section ${activeTab === 'central' ? 'active' : ''}`}>
                    <form onSubmit={handleLogin} autoComplete="off">
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-user icon"></i>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    required
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock icon"></i>
                                <input
                                    type={showPassword['central-pass'] ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    autoComplete="new-password"
                                    id="central-pass"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i
                                    className={`fa-solid ${showPassword['central-pass'] ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => togglePasswordVisibility('central-pass')}
                                ></i>
                            </div>
                        </div>
                        {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '15px', fontWeight: 500, background: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>{error}</p>}
                        <button type="submit" className="submit-btn">Login as Central Admin</button>
                    </form>

                    <div className="demo-credentials">
                        <h4>🔑 Central Control Demo:</h4>
                        <code>User: admin@medicure.com</code>
                        <code>Pass: Medicure@Admin2026</code>
                    </div>
                </div>

                {/* Hospital Admin Login Form */}
                <div id="hospital-form" className={`form-section ${activeTab === 'hospital' ? 'active' : ''}`}>
                    <form onSubmit={handleLogin} autoComplete="off">
                        <div className="form-group">
                            <label>Username (Email)</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-envelope icon"></i>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter hospital email"
                                    required
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock icon"></i>
                                <input
                                    type={showPassword['hospital-pass'] ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    autoComplete="new-password"
                                    id="hospital-pass"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i
                                    className={`fa-solid ${showPassword['hospital-pass'] ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => togglePasswordVisibility('hospital-pass')}
                                ></i>
                            </div>
                        </div>
                        {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '15px', fontWeight: 500, background: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>{error}</p>}
                        <button type="submit" className="submit-btn">Login as Hospital Admin</button>
                    </form>

                    <div className="demo-credentials">
                        <h4>🛠️ Hospital Admin Access (Demo):</h4>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '15px', lineHeight: '1.5' }}>
                            <strong>Note:</strong> Use these credentials to test appointment booking for specific hospitals.
                            Download the PDF below for the full list of hospital logins.
                        </p>
                        <code>User: citycare@medicure.com | Pass: CityCare@2026</code>
                        <code>User: apex@medicure.com | Pass: Apex@2026</code>

                        <a href="/hospital-details.xlsx" download className="download-link">
                            <i className="fa-solid fa-file-excel"></i> Download Full Credentials List (Excel)
                        </a>
                    </div>
                </div>

                <Link href="/" className="home-link"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
            </div>
        </div>
    );
}
