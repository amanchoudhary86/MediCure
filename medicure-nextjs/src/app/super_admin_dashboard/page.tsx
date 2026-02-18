"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hospitals } from "@/lib/hospitals";
import { getHospitalBeds, getBedStats } from "@/lib/bed-data";

type ActiveView = "dashboard" | "add-hospital" | "hospital-status";

export default function SuperAdminDashboard() {
    const [activeView, setActiveView] = useState<ActiveView>("dashboard");
    // We use the static list + local state for any "newly added" hospitals in this session
    // For a real app, this would be a DB fetch.
    const [hospitalList, setHospitalList] = useState(hospitals);
    const [newHospital, setNewHospital] = useState({ name: "", city: "", beds: "", contact: "", email: "" });
    const [successMsg, setSuccessMsg] = useState("");

    // Stats State
    const [stats, setStats] = useState({
        activeHospitals: 0,
        totalBeds: 0,
        avgOccupancy: 0,
    });
    const [hydrated, setHydrated] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setHydrated(true);
        // Calculate totals based on real bed data
        let totalBeds = 0;
        let totalOccupied = 0;

        hospitalList.forEach(h => {
            const beds = getHospitalBeds(h.id);
            // If beds are not generated yet, getHospitalBeds generates them.
            // But we need to know the COUNT.
            // getHospitalBeds returns the array.
            totalBeds += beds.length;
            totalOccupied += beds.filter(b => b.status === "occupied").length;
        });

        const activeHospitals = hospitalList.length;
        const avgOcc = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

        setStats({
            activeHospitals,
            totalBeds,
            avgOccupancy: avgOcc
        });

        // Listen for updates
        const handleUpdate = () => {
            // Re-calculate
            let tBeds = 0;
            let tOcc = 0;
            hospitalList.forEach(h => {
                const beds = getHospitalBeds(h.id);
                tBeds += beds.length;
                tOcc += beds.filter(b => b.status === "occupied").length;
            });
            setStats({
                activeHospitals: hospitalList.length,
                totalBeds: tBeds,
                avgOccupancy: tBeds > 0 ? Math.round((tOcc / tBeds) * 100) : 0
            });
        };

        window.addEventListener("medicure-bed-update", handleUpdate);
        return () => window.removeEventListener("medicure-bed-update", handleUpdate);
    }, [hospitalList]);


    const handleAddHospital = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we would push to DB. Here we just push to local state for demo.
        const newH = {
            id: `hosp_${Date.now()}`,
            name: newHospital.name,
            location: newHospital.city, // mapping city to location for consistency
            timings: "24 Hours",
            rating: 0,
            email: newHospital.email,
            password: "default_password"
        };
        setHospitalList([...hospitalList, newH]);
        setNewHospital({ name: "", city: "", beds: "", contact: "", email: "" });
        setSuccessMsg(`${newH.name} added successfully! (Session only)`);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const handleLogout = () => {
        router.push("/");
    };

    if (!hydrated) return null; // Prevent hydration mismatch on localStorage

    return (
        <div className="sa-root">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                .sa-root {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    min-height: 100vh;
                    background: #f0f2f5;
                }

                /* ─── Sidebar ─── */
                .sa-sidebar {
                    width: 260px;
                    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                    color: #94a3b8;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 100;
                }

                .sa-sidebar-brand {
                    padding: 24px 24px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sa-sidebar-brand img {
                    height: 36px;
                    width: auto;
                    object-fit: contain;
                }

                .sa-sidebar-brand h2 {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.3px;
                }

                .sa-sidebar-brand span {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 400;
                }

                .sa-nav {
                    list-style: none;
                    padding: 16px 12px;
                    margin: 0;
                    flex: 1;
                }

                .sa-nav li {
                    margin-bottom: 4px;
                }

                .sa-nav-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: none;
                    background: transparent;
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                }

                .sa-nav-btn:hover {
                    background: rgba(255,255,255,0.06);
                    color: #e2e8f0;
                }

                .sa-nav-btn.active {
                    background: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                }

                .sa-nav-btn svg {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }

                .sa-nav-logout {
                    padding: 16px 12px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }

                .sa-logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: none;
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .sa-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                }

                /* ─── Main Content ─── */
                .sa-main {
                    margin-left: 260px;
                    flex: 1;
                    padding: 32px;
                    max-width: 1200px;
                }

                .sa-topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .sa-topbar h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }

                .sa-topbar-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #fff;
                    padding: 8px 16px;
                    border-radius: 50px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                }

                .sa-avatar {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-weight: 700;
                    font-size: 14px;
                }

                /* ─── Stats Cards ─── */
                .sa-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .sa-stat-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: 1px solid #e5e7eb;
                }

                .sa-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .sa-stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    font-size: 20px;
                }

                .sa-stat-icon.blue { background: #eff6ff; color: #3b82f6; }
                .sa-stat-icon.green { background: #f0fdf4; color: #22c55e; }
                .sa-stat-icon.orange { background: #fff7ed; color: #f97316; }

                .sa-stat-value {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 4px;
                    line-height: 1;
                }

                .sa-stat-label {
                    font-size: 13px;
                    color: #64748b;
                    font-weight: 500;
                }

                /* ─── Table ─── */
                .sa-panel {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                }

                .sa-panel-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .sa-panel-header h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #0f172a;
                    margin: 0;
                }

                .sa-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .sa-table th {
                    text-align: left;
                    padding: 12px 24px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                }

                .sa-table td {
                    padding: 14px 24px;
                    font-size: 14px;
                    color: #334155;
                    border-bottom: 1px solid #f1f5f9;
                }

                .sa-table tr:last-child td { border-bottom: none; }

                .sa-table tr:hover td {
                    background: #f8fafc;
                }

                .sa-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .sa-badge.active { background: #dcfce7; color: #16a34a; }
                .sa-badge.maintenance { background: #fef3c7; color: #d97706; }

                .sa-occ-bar {
                    width: 100px;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                    overflow: hidden;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8px;
                }

                .sa-occ-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.3s;
                }

                /* ─── Form ─── */
                .sa-form {
                    padding: 32px;
                }

                .sa-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .sa-form-group {
                    display: flex;
                    flex-direction: column;
                }

                .sa-form-group.full-width {
                    grid-column: 1 / -1;
                }

                .sa-form-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                .sa-form-group input {
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                }

                .sa-form-group input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .sa-form-submit {
                    margin-top: 24px;
                    display: flex;
                    gap: 12px;
                }

                .sa-btn-primary {
                    padding: 10px 24px;
                    background: #3b82f6;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: 'Inter', sans-serif;
                }

                .sa-btn-primary:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .sa-success-msg {
                    background: #dcfce7;
                    color: #16a34a;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>

            {/* Sidebar */}
            <aside className="sa-sidebar">
                <div className="sa-sidebar-brand">
                    <img src="/logo.png" alt="MediCure" />
                    <div>
                        <h2>MediCure</h2>
                        <span>Central Control Panel</span>
                    </div>
                </div>
                <ul className="sa-nav">
                    <li>
                        <button className={`sa-nav-btn ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button className={`sa-nav-btn ${activeView === "add-hospital" ? "active" : ""}`} onClick={() => setActiveView("add-hospital")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add Hospital
                        </button>
                    </li>
                    <li>
                        <button className={`sa-nav-btn ${activeView === "hospital-status" ? "active" : ""}`} onClick={() => setActiveView("hospital-status")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                            Hospital Status
                        </button>
                    </li>
                </ul>
                <div className="sa-nav-logout">
                    <button className="sa-logout-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="sa-main">
                <div className="sa-topbar">
                    <h1>
                        {activeView === "dashboard" && "Dashboard"}
                        {activeView === "add-hospital" && "Add New Hospital"}
                        {activeView === "hospital-status" && "Hospital Status"}
                    </h1>
                    <div className="sa-topbar-user">
                        <div className="sa-avatar">SA</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Super Admin</span>
                    </div>
                </div>

                {/* ─── Dashboard View ─── */}
                {activeView === "dashboard" && (
                    <>
                        <div className="sa-stats">
                            <div className="sa-stat-card">
                                <div className="sa-stat-icon blue">🏥</div>
                                <div className="sa-stat-value">{stats.activeHospitals}</div>
                                <div className="sa-stat-label">Active Hospitals</div>
                            </div>
                            <div className="sa-stat-card">
                                <div className="sa-stat-icon green">🛏️</div>
                                <div className="sa-stat-value">{stats.totalBeds.toLocaleString()}</div>
                                <div className="sa-stat-label">Total Beds</div>
                            </div>
                            <div className="sa-stat-card">
                                <div className="sa-stat-icon orange">📊</div>
                                <div className="sa-stat-value">{stats.avgOccupancy}%</div>
                                <div className="sa-stat-label">Avg Occupancy</div>
                            </div>
                        </div>

                        <div className="sa-panel">
                            <div className="sa-panel-header">
                                <h3>Registered Hospitals</h3>
                            </div>
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th>Hospital</th>
                                        <th>Location</th>
                                        <th>Total Beds</th>
                                        <th>Occupancy</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hospitalList.map((h) => {
                                        const beds = getHospitalBeds(h.id);
                                        const count = beds.length || 220; // fallback just in case
                                        const occupied = beds.filter(b => b.status === "occupied").length;
                                        const occPct = count > 0 ? Math.round((occupied / count) * 100) : 0;

                                        return (
                                            <tr key={h.id}>
                                                <td style={{ fontWeight: 600 }}>{h.name}</td>
                                                <td>{h.location}</td>
                                                <td>{count.toLocaleString()}</td>
                                                <td>
                                                    <span className="sa-occ-bar">
                                                        <span className="sa-occ-fill" style={{
                                                            width: `${occPct}%`,
                                                            background: occPct > 85 ? '#ef4444' : occPct > 70 ? '#f59e0b' : '#22c55e'
                                                        }} />
                                                    </span>
                                                    {occPct}%
                                                </td>
                                                <td>
                                                    <span className={`sa-badge active`}>
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ─── Add Hospital View ─── */}
                {activeView === "add-hospital" && (
                    <div className="sa-panel">
                        <div className="sa-panel-header">
                            <h3>Register a New Hospital</h3>
                        </div>
                        <form className="sa-form" onSubmit={handleAddHospital}>
                            {successMsg && <div className="sa-success-msg">✅ {successMsg}</div>}
                            <div className="sa-form-grid">
                                <div className="sa-form-group">
                                    <label>Hospital Name</label>
                                    <input type="text" required placeholder="e.g. City General Hospital" value={newHospital.name} onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })} />
                                </div>
                                <div className="sa-form-group">
                                    <label>City / Location</label>
                                    <input type="text" required placeholder="e.g. New Delhi" value={newHospital.city} onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })} />
                                </div>
                                <div className="sa-form-group">
                                    <label>Contact Number</label>
                                    <input type="tel" required placeholder="e.g. +91 9876543210" value={newHospital.contact} onChange={(e) => setNewHospital({ ...newHospital, contact: e.target.value })} />
                                </div>
                                <div className="sa-form-group full-width">
                                    <label>Email Address</label>
                                    <input type="email" required placeholder="e.g. admin@hospital.com" value={newHospital.email} onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="sa-form-submit">
                                <button type="submit" className="sa-btn-primary">Add Hospital</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ─── Hospital Status View ─── */}
                {activeView === "hospital-status" && (
                    <div className="sa-panel">
                        <div className="sa-panel-header">
                            <h3>All Hospital Status Overview</h3>
                        </div>
                        <table className="sa-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Hospital</th>
                                    <th>Location</th>
                                    <th>Total Beds</th>
                                    <th>Occupancy</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospitalList.map((h, i) => {
                                    const beds = getHospitalBeds(h.id);
                                    const count = beds.length || 220;
                                    const occupied = beds.filter(b => b.status === "occupied").length;
                                    const occPct = count > 0 ? Math.round((occupied / count) * 100) : 0;

                                    return (
                                        <tr key={h.id}>
                                            <td>{i + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{h.name}</td>
                                            <td>{h.location}</td>
                                            <td>{count.toLocaleString()}</td>
                                            <td>
                                                <span className="sa-occ-bar">
                                                    <span className="sa-occ-fill" style={{
                                                        width: `${occPct}%`,
                                                        background: occPct > 85 ? '#ef4444' : occPct > 70 ? '#f59e0b' : '#22c55e'
                                                    }} />
                                                </span>
                                                {occPct}%
                                            </td>
                                            <td>
                                                <span className={`sa-badge active`}>
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
