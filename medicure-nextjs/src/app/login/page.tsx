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
        if (cleanEmail === 'superadmin' && cleanPassword === 'admin') {
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
                .login-body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f4f7f6;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-image: url('/static/img/slider2.jpg');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .login-body::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(26, 118, 209, 0.85); /* Proper overlay color matches brand */
                    z-index: 1;
                }

                .login-container {
                    position: relative;
                    z-index: 2;
                    background: #fff;
                    width: 100%;
                    max-width: 450px;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                    text-align: center;
                }

                .login-header {
                    margin-bottom: 30px;
                }

                .login-header h2 {
                    color: #2C2D3F;
                    font-weight: 600;
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .toggle-container {
                    display: flex;
                    background: #f1f1f1;
                    border-radius: 30px;
                    margin-bottom: 30px;
                    position: relative;
                    padding: 4px;
                }

                .toggle-btn {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 12px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .toggle-btn.active {
                    background: #1A76D1;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(26, 118, 209, 0.3);
                }

                .form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #2C2D3F;
                    font-size: 14px;
                    font-weight: 500;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 12px 15px 12px 40px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.3s;
                    outline: none;
                }

                .input-wrapper input:focus {
                    border-color: #1A76D1;
                    box-shadow: 0 0 0 3px rgba(26, 118, 209, 0.1);
                }

                .input-wrapper i.icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }

                .input-wrapper i.toggle-password {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                    cursor: pointer;
                }

                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: #1A76D1;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.3s;
                    margin-top: 10px;
                }

                .submit-btn:hover {
                    background: #2C2D3F;
                }

                .form-section {
                    display: none;
                    animation: fadeIn 0.4s ease;
                }

                .form-section.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .home-link {
                    display: inline-block;
                    margin-top: 20px;
                    color: #666;
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.3s;
                }

                .home-link:hover {
                    color: #1A76D1;
                }

                .demo-credentials {
                    margin-top: 25px;
                    font-size: 12px;
                    text-align: left;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                }

                .demo-credentials h4 {
                    margin-bottom: 8px;
                    color: #555;
                    font-size: 13px;
                }

                .demo-credentials code {
                    display: block;
                    margin-bottom: 4px;
                    color: #1A76D1;
                    background: rgba(26, 118, 209, 0.1);
                    padding: 2px 5px;
                    border-radius: 4px;
                }
            `}</style>

            {/* FontAwesome */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="login-container">
                <div className="login-header">
                    <h2>Portal Login</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Select your role to continue</p>
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
                        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
                        <button type="submit" className="submit-btn">Login as Central Admin</button>
                    </form>

                    <div className="demo-credentials">
                        <h4>🔑 Central Control Demo:</h4>
                        <code>User: superadmin</code>
                        <code>Pass: admin</code>
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
                                    placeholder="Enter email"
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
                        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
                        <button type="submit" className="submit-btn">Login as Hospital Admin</button>
                    </form>

                    <div className="demo-credentials">
                        <h4>🛠️ Hospital Admin Demo:</h4>
                        <code>User: ashwini@gmail.com | Pass: Ashwini2025</code>
                        <code>User: artemis@gmail.com | Pass: Artemis2025</code>
                    </div>
                </div>

                <Link href="/" className="home-link"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
            </div>
        </div>
    );
}
