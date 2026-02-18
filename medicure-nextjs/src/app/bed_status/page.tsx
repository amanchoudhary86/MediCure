"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { hospitals } from "@/lib/hospitals";

type BedStatus = "free" | "occupied" | "requested";
interface Bed {
    id: string;
    label: string;
    status: BedStatus;
}

function generateBeds(prefix: string, total: number, available: number): Bed[] {
    const beds: Bed[] = [];
    // Create array of indices and shuffle to randomize which are free
    const indices = Array.from({ length: total }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const freeSet = new Set(indices.slice(0, available));

    for (let i = 0; i < total; i++) {
        beds.push({
            id: `${prefix}${i + 1}`,
            label: `${prefix}${i + 1}`,
            status: freeSet.has(i) ? "free" : "occupied",
        });
    }
    return beds;
}

export default function BedStatus() {
    const [selectedHospital, setSelectedHospital] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [hasChecked, setHasChecked] = useState(false);
    const [stats, setStats] = useState({
        general: { available: 12, total: 20 },
        ventilator: { available: 6, total: 10 },
        icu: { available: 4, total: 10 },
    });

    // Search per ward
    const [searchGeneral, setSearchGeneral] = useState("");
    const [searchICU, setSearchICU] = useState("");
    const [searchVentilator, setSearchVentilator] = useState("");

    // Bed arrays
    const [generalBeds, setGeneralBeds] = useState<Bed[]>([]);
    const [icuBeds, setIcuBeds] = useState<Bed[]>([]);
    const [ventilatorBeds, setVentilatorBeds] = useState<Bed[]>([]);

    // Request modal
    const [requestModal, setRequestModal] = useState<{ bed: Bed; ward: string } | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheck = () => {
        if (!selectedHospital) return;
        const newStats = {
            general: { available: Math.floor(Math.random() * 14) + 4, total: 20 },
            ventilator: { available: Math.floor(Math.random() * 7) + 2, total: 10 },
            icu: { available: Math.floor(Math.random() * 7) + 2, total: 10 },
        };
        setStats(newStats);
        setGeneralBeds(generateBeds("G", newStats.general.total, newStats.general.available));
        setIcuBeds(generateBeds("ICU", newStats.icu.total, newStats.icu.available));
        setVentilatorBeds(generateBeds("V", newStats.ventilator.total, newStats.ventilator.available));
        setHasChecked(true);
        setSearchGeneral("");
        setSearchICU("");
        setSearchVentilator("");
    };

    const handleRequestBed = (bed: Bed, ward: string) => {
        if (bed.status !== "free") return;
        setRequestModal({ bed, ward });
    };

    const confirmRequest = () => {
        if (!requestModal) return;
        const { bed, ward } = requestModal;
        const updateBeds = (beds: Bed[]) =>
            beds.map((b) => (b.id === bed.id ? { ...b, status: "requested" as BedStatus } : b));
        if (ward === "general") setGeneralBeds(updateBeds);
        if (ward === "icu") setIcuBeds(updateBeds);
        if (ward === "ventilator") setVentilatorBeds(updateBeds);
        setRequestModal(null);
    };

    const filterBeds = (beds: Bed[], search: string) => {
        if (!search.trim()) return beds;
        const q = search.toLowerCase();
        return beds.filter(
            (b) => b.label.toLowerCase().includes(q) || b.status.toLowerCase().includes(q)
        );
    };

    const selectedHospitalData = hospitals.find((h) => h.id === selectedHospital);

    return (
        <div className="bed-status-page" suppressHydrationWarning>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

                .bed-status-page {
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    position: relative;
                    overflow-x: hidden;
                }

                /* ── Video Background ── */
                .bed-video-bg {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover;
                    z-index: 0;
                }
                .bed-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(50, 50, 50, 0.6);
                    z-index: 1;
                }

                /* ── Navbar ── */
                .bed-nav {
                    background: #1a1f2e;
                    padding: 14px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
                }
                .bed-nav-logo {
                    font-size: 24px; font-weight: 700; color: #fff;
                    text-decoration: none; letter-spacing: -0.5px;
                    display: flex; align-items: center; gap: 10px;
                }
                .bed-nav-logo img { height: 45px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
                .bed-nav-links { display: flex; gap: 28px; align-items: center; }
                .bed-nav-links a {
                    font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.85);
                    text-decoration: none; position: relative; padding: 4px 0;
                    transition: color 0.3s ease;
                }
                .bed-nav-links a::after {
                    content: ''; position: absolute; width: 0%; height: 2.5px;
                    bottom: -2px; left: 50%; transform: translateX(-50%);
                    background: linear-gradient(90deg, #e1f2c2, #a8e063);
                    transition: width 0.4s cubic-bezier(0.25,0.8,0.25,1);
                    border-radius: 4px;
                }
                .bed-nav-links a:hover::after { width: 100%; }
                .bed-nav-links a:hover { color: #e1f2c2; }

                /* ── Content Wrapper ── */
                .bed-content-wrap {
                    position: relative; z-index: 10;
                    min-height: calc(100vh - 73px);
                    display: flex; flex-direction: column;
                    align-items: center;
                    padding: 40px 20px 60px;
                }

                /* ── Page Title ── */
                .bed-title { text-align: center; margin-bottom: 36px; }
                .bed-title h1 { font-size: 40px; font-weight: 700; color: #fff; margin: 0 0 10px; letter-spacing: -0.5px; }
                .bed-title h1 span { color: #e1f2c2; }
                .bed-title p { font-size: 16px; color: rgba(255,255,255,0.75); margin: 0; max-width: 600px; }

                /* ── Hospital Select Area ── */
                .bed-select-area {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 16px; margin-bottom: 36px; width: 100%; max-width: 750px;
                }
                .bed-dropdown-wrapper { position: relative; width: 100%; }
                .bed-dropdown-trigger {
                    width: 100%; padding: 20px 52px 20px 24px;
                    font-size: 18px; font-weight: 500; font-family: 'Poppins', sans-serif;
                    border: 2px solid rgba(255,255,255,0.25); border-radius: 14px;
                    background: rgba(30,37,54,0.95); color: #fff; cursor: pointer;
                    text-align: left; box-shadow: 0 4px 24px rgba(0,0,0,0.2);
                    transition: all 0.3s ease; position: relative;
                }
                .bed-dropdown-trigger::after {
                    content: ''; position: absolute; right: 20px; top: 50%;
                    transform: translateY(-50%) rotate(0deg);
                    width: 0; height: 0;
                    border-left: 7px solid transparent; border-right: 7px solid transparent;
                    border-top: 8px solid #e1f2c2;
                    transition: transform 0.3s ease;
                }
                .bed-dropdown-trigger.open::after { transform: translateY(-50%) rotate(180deg); }
                .bed-dropdown-trigger:hover, .bed-dropdown-trigger.open {
                    border-color: #e1f2c2;
                    box-shadow: 0 0 0 3px rgba(225,242,194,0.15), 0 4px 24px rgba(0,0,0,0.25);
                }
                .bed-dropdown-trigger .placeholder { color: rgba(255,255,255,0.5); }
                .bed-dropdown-list {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 100%;
                    max-height: 380px; overflow-y: auto;
                    background: rgba(26,31,46,0.98);
                    border: 2px solid rgba(225,242,194,0.25);
                    border-radius: 14px; box-shadow: 0 12px 48px rgba(0,0,0,0.4);
                    z-index: 50; padding: 8px;
                    display: flex; flex-direction: column; gap: 4px;
                }
                .bed-dropdown-list::-webkit-scrollbar { width: 6px; }
                .bed-dropdown-list::-webkit-scrollbar-track { background: transparent; }
                .bed-dropdown-list::-webkit-scrollbar-thumb { background: rgba(225,242,194,0.3); border-radius: 3px; }
                .bed-dropdown-item {
                    padding: 14px 18px; border-radius: 10px; cursor: pointer;
                    transition: all 0.2s ease; border: 1px solid transparent;
                }
                .bed-dropdown-item:hover { background: rgba(225,242,194,0.08); border-color: rgba(225,242,194,0.15); }
                .bed-dropdown-item.selected { background: rgba(225,242,194,0.12); border-color: rgba(225,242,194,0.3); }
                .bed-dropdown-item-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
                .bed-dropdown-item-loc { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
                .bed-dropdown-item-meta { display: flex; gap: 12px; align-items: center; }
                .bed-dropdown-item-time { font-size: 11px; color: #7dd3fc; background: rgba(125,211,252,0.1); padding: 2px 8px; border-radius: 4px; }
                .bed-dropdown-item-rating { font-size: 12px; font-weight: 600; color: #fbbf24; }

                .bed-check-btn {
                    font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600;
                    color: #1a3a1a; background: linear-gradient(45deg, #e1f2c2, #a8e063);
                    padding: 14px 32px; border-radius: 12px; border: none; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(168,224,99,0.3); transition: all 0.3s ease;
                    white-space: nowrap;
                }
                .bed-check-btn:hover {
                    background: linear-gradient(45deg, #d4e8b0, #96d44f);
                    box-shadow: 0 6px 20px rgba(168,224,99,0.45);
                    transform: translateY(-2px);
                }

                /* ── Hospital Info ── */
                .bed-selected-info {
                    text-align: center; margin-bottom: 28px; padding: 12px 24px;
                    background: rgba(225,242,194,0.1); border-radius: 12px;
                    border: 1px solid rgba(225,242,194,0.2);
                    max-width: 750px; width: 100%;
                }
                .bed-selected-info span { font-size: 14px; color: rgba(255,255,255,0.75); }
                .bed-selected-info strong { color: #e1f2c2; font-weight: 600; }

                /* ═══ WARD SECTIONS ═══ */
                .ward-sections {
                    width: 100%; max-width: 1100px;
                    display: flex; flex-direction: column; gap: 36px;
                }

                .ward-section {
                    background: rgba(26, 31, 46, 0.92);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    padding: 28px 28px 32px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.25);
                }

                .ward-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
                }
                .ward-header h2 {
                    font-size: 22px; font-weight: 700; margin: 0;
                    display: flex; align-items: center; gap: 10px;
                }
                .ward-header h2 .ward-icon { font-size: 26px; }

                .ward-header.general h2 { color: #e1f2c2; }
                .ward-header.icu h2 { color: #c4b5fd; }
                .ward-header.ventilator h2 { color: #99f6e4; }

                .ward-summary {
                    display: flex; gap: 16px; align-items: center;
                }
                .ward-badge {
                    padding: 6px 16px; border-radius: 50px;
                    font-size: 13px; font-weight: 600;
                }
                .ward-badge.free-badge { background: rgba(34,197,94,0.15); color: #4ade80; }
                .ward-badge.total-badge { background: rgba(148,163,184,0.15); color: #94a3b8; }

                /* ── Ward Search ── */
                .ward-search {
                    display: flex; gap: 10px; margin-bottom: 20px;
                    align-items: center;
                }
                .ward-search input {
                    flex: 1; padding: 12px 18px;
                    font-size: 14px; font-family: 'Poppins', sans-serif;
                    border: 1.5px solid rgba(255,255,255,0.15);
                    border-radius: 10px;
                    background: rgba(255,255,255,0.06);
                    color: #fff; outline: none;
                    transition: border-color 0.3s ease;
                }
                .ward-search input::placeholder { color: rgba(255,255,255,0.35); }
                .ward-search input:focus {
                    border-color: rgba(225,242,194,0.4);
                    box-shadow: 0 0 0 2px rgba(225,242,194,0.1);
                }
                .ward-search-btn {
                    padding: 12px 24px; border: none; border-radius: 10px;
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px; font-weight: 600;
                    background: #3b82f6; color: #fff;
                    cursor: pointer; transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .ward-search-btn:hover { background: #2563eb; transform: translateY(-1px); }

                /* ── Bed Grid ── */
                .ward-grid {
                    display: flex; flex-wrap: wrap; gap: 12px;
                    justify-content: flex-start;
                }

                .bed-tile {
                    width: 72px; height: 82px;
                    border-radius: 12px;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    cursor: default;
                    transition: all 0.2s ease;
                    border: 2px solid rgba(255,255,255,0.1);
                    position: relative; gap: 4px;
                    backdrop-filter: blur(4px);
                }

                .bed-tile .bed-tile-icon {
                    width: 28px; height: 28px;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                }
                .bed-tile .bed-tile-label {
                    font-size: 11px; font-weight: 700; color: #fff;
                    line-height: 1; letter-spacing: 0.3px;
                }
                .bed-tile .bed-tile-status {
                    font-size: 8px; font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* Free */
                .bed-tile.free {
                    background: linear-gradient(145deg, #22c55e 0%, #15803d 100%);
                    cursor: pointer;
                    box-shadow: 0 3px 10px rgba(34,197,94,0.3);
                    border-color: rgba(74, 222, 128, 0.3);
                }
                .bed-tile.free:hover {
                    transform: translateY(-3px) scale(1.06);
                    box-shadow: 0 6px 20px rgba(34,197,94,0.5);
                    border-color: #4ade80;
                }

                /* Occupied */
                .bed-tile.occupied {
                    background: linear-gradient(145deg, #dc2626 0%, #991b1b 100%);
                    box-shadow: 0 3px 10px rgba(239,68,68,0.2);
                    border-color: rgba(248, 113, 113, 0.2);
                    opacity: 0.8;
                }

                /* Requested */
                .bed-tile.requested {
                    background: linear-gradient(145deg, #f59e0b 0%, #b45309 100%);
                    box-shadow: 0 3px 10px rgba(245,158,11,0.3);
                    border-color: rgba(251, 191, 36, 0.3);
                }

                /* ═══ REQUEST MODAL ═══ */
                .bed-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(6px);
                    z-index: 200;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .bed-modal {
                    background: #1e2536;
                    border: 1px solid rgba(225,242,194,0.2);
                    border-radius: 20px;
                    padding: 36px 40px;
                    max-width: 440px; width: 100%;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
                    text-align: center;
                }
                .bed-modal-icon { font-size: 48px; margin-bottom: 16px; }
                .bed-modal h3 {
                    font-size: 20px; font-weight: 700; color: #fff;
                    margin: 0 0 8px;
                }
                .bed-modal p {
                    font-size: 14px; color: rgba(255,255,255,0.65);
                    margin: 0 0 28px; line-height: 1.6;
                }
                .bed-modal p strong { color: #e1f2c2; }
                .bed-modal-actions {
                    display: flex; gap: 12px; justify-content: center;
                }
                .bed-modal-confirm {
                    padding: 12px 32px; border: none; border-radius: 10px;
                    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
                    background: linear-gradient(45deg, #e1f2c2, #a8e063);
                    color: #1a3a1a; cursor: pointer;
                    transition: all 0.2s ease;
                }
                .bed-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(168,224,99,0.4); }
                .bed-modal-cancel {
                    padding: 12px 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
                    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
                    background: transparent; color: rgba(255,255,255,0.7); cursor: pointer;
                    transition: all 0.2s ease;
                }
                .bed-modal-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

                /* ── Legend ── */
                .bed-legend {
                    display: flex; gap: 24px; align-items: center;
                    justify-content: center; margin-bottom: 32px;
                    flex-wrap: wrap;
                }
                .bed-legend-item {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);
                }
                .bed-legend-dot {
                    width: 16px; height: 16px; border-radius: 4px;
                }
                .bed-legend-dot.free { background: #22c55e; }
                .bed-legend-dot.occupied { background: #ef4444; }
                .bed-legend-dot.requested { background: #f59e0b; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .bed-title h1 { font-size: 28px; }
                    .bed-nav { padding: 12px 20px; }
                    .ward-section { padding: 20px 16px 24px; }
                    .ward-header h2 { font-size: 18px; }
                    .bed-tile { width: 60px; height: 70px; }
                    .bed-tile .bed-tile-icon { width: 22px; height: 22px; }
                    .bed-tile .bed-tile-label { font-size: 10px; }
                    .bed-tile .bed-tile-status { font-size: 7px; }
                    .ward-grid { gap: 8px; }
                }
            `}</style>

            {/* Video Background */}
            <video autoPlay loop muted playsInline className="bed-video-bg">
                <source src="/hero-vid.mp4" type="video/mp4" />
            </video>
            <div className="bed-overlay" />

            {/* Navbar */}
            <nav className="bed-nav">
                <Link href="/" className="bed-nav-logo">
                    <img src="/logo.png" alt="MediCure" />
                </Link>
                <div className="bed-nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/bed_status">Bed Availability</Link>
                    <Link href="/blood_availability">Blood Availability</Link>
                    <Link href="/contact">Contact Us</Link>
                    <Link href="/login">Login</Link>
                </div>
            </nav>

            {/* Content */}
            <div className="bed-content-wrap">
                {/* Title */}
                <div className="bed-title">
                    <h1>Real-Time <span>Bed Availability</span> Dashboard</h1>
                    <p>Check real-time bed availability across government hospitals in Jaipur</p>
                </div>

                {/* Hospital Dropdown */}
                <div className="bed-select-area">
                    <div className="bed-dropdown-wrapper" ref={dropdownRef}>
                        <div
                            className={`bed-dropdown-trigger ${isOpen ? "open" : ""}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {selectedHospitalData ? (
                                selectedHospitalData.name
                            ) : (
                                <span className="placeholder">Select Hospital</span>
                            )}
                        </div>
                        {isOpen && (
                            <div className="bed-dropdown-list">
                                {hospitals.map((hospital) => (
                                    <div
                                        key={hospital.id}
                                        className={`bed-dropdown-item ${selectedHospital === hospital.id ? "selected" : ""}`}
                                        onClick={() => {
                                            setSelectedHospital(hospital.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="bed-dropdown-item-name">{hospital.name}</div>
                                        <div className="bed-dropdown-item-loc">📍 {hospital.location}</div>
                                        <div className="bed-dropdown-item-meta">
                                            <span className="bed-dropdown-item-time">🕐 {hospital.timings}</span>
                                            <span className="bed-dropdown-item-rating">⭐ {hospital.rating}/5</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="button" className="bed-check-btn" onClick={handleCheck}>
                        Check Availability
                    </button>
                </div>

                {/* Selected Hospital Info */}
                {selectedHospitalData && hasChecked && (
                    <div className="bed-selected-info">
                        <span>
                            Showing results for{" "}
                            <strong>{selectedHospitalData.name}</strong>
                            {" — "}{selectedHospitalData.location}
                        </span>
                    </div>
                )}

                {/* Legend */}
                {hasChecked && (
                    <div className="bed-legend">
                        <div className="bed-legend-item">
                            <div className="bed-legend-dot free" />
                            Free — Click to Request
                        </div>
                        <div className="bed-legend-item">
                            <div className="bed-legend-dot occupied" />
                            Occupied
                        </div>
                        <div className="bed-legend-item">
                            <div className="bed-legend-dot requested" />
                            Requested
                        </div>
                    </div>
                )}

                {/* Ward Sections */}
                {hasChecked && (
                    <div className="ward-sections">

                        {/* ── GENERAL WARD ── */}
                        <div className="ward-section">
                            <div className="ward-header general">
                                <h2><span className="ward-icon">🏥</span> GENERAL WARD</h2>
                                <div className="ward-summary">
                                    <span className="ward-badge free-badge">
                                        {generalBeds.filter(b => b.status === "free").length} Free
                                    </span>
                                    <span className="ward-badge total-badge">
                                        {stats.general.total} Total
                                    </span>
                                </div>
                            </div>
                            <div className="ward-search">
                                <input
                                    type="text"
                                    placeholder="Search bed by number or status..."
                                    value={searchGeneral}
                                    onChange={(e) => setSearchGeneral(e.target.value)}
                                />
                                <button className="ward-search-btn" type="button">Search</button>
                            </div>
                            <div className="ward-grid">
                                {filterBeds(generalBeds, searchGeneral).map((bed) => (
                                    <div
                                        key={bed.id}
                                        className={`bed-tile ${bed.status}`}
                                        onClick={() => handleRequestBed(bed, "general")}
                                        title={bed.status === "free" ? "Click to request this bed" : bed.status === "requested" ? "Bed requested" : "Bed occupied"}
                                    >
                                        <svg className="bed-tile-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="14" width="28" height="10" rx="2" fill="white" fillOpacity="0.25" />
                                            <rect x="3" y="10" width="10" height="6" rx="2" fill="white" fillOpacity="0.4" />
                                            <path d="M2 24V14C2 12.9 2.9 12 4 12H28C29.1 12 30 12.9 30 14V24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M1 24H31" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="4" y1="24" x2="4" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="28" y1="24" x2="28" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="bed-tile-label">{bed.label}</span>
                                        <span className="bed-tile-status">
                                            {bed.status === "free" ? "Free" : bed.status === "occupied" ? "Occupy" : "Req"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── ICU WARD ── */}
                        <div className="ward-section">
                            <div className="ward-header icu">
                                <h2><span className="ward-icon">🫀</span> ICU WARD</h2>
                                <div className="ward-summary">
                                    <span className="ward-badge free-badge">
                                        {icuBeds.filter(b => b.status === "free").length} Free
                                    </span>
                                    <span className="ward-badge total-badge">
                                        {stats.icu.total} Total
                                    </span>
                                </div>
                            </div>
                            <div className="ward-search">
                                <input
                                    type="text"
                                    placeholder="Search bed by number or status..."
                                    value={searchICU}
                                    onChange={(e) => setSearchICU(e.target.value)}
                                />
                                <button className="ward-search-btn" type="button">Search</button>
                            </div>
                            <div className="ward-grid">
                                {filterBeds(icuBeds, searchICU).map((bed) => (
                                    <div
                                        key={bed.id}
                                        className={`bed-tile ${bed.status}`}
                                        onClick={() => handleRequestBed(bed, "icu")}
                                        title={bed.status === "free" ? "Click to request this bed" : bed.status === "requested" ? "Bed requested" : "Bed occupied"}
                                    >
                                        <svg className="bed-tile-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="14" width="28" height="10" rx="2" fill="white" fillOpacity="0.25" />
                                            <rect x="3" y="10" width="10" height="6" rx="2" fill="white" fillOpacity="0.4" />
                                            <path d="M2 24V14C2 12.9 2.9 12 4 12H28C29.1 12 30 12.9 30 14V24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M1 24H31" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="4" y1="24" x2="4" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="28" y1="24" x2="28" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="bed-tile-label">{bed.label}</span>
                                        <span className="bed-tile-status">
                                            {bed.status === "free" ? "Free" : bed.status === "occupied" ? "Occupy" : "Req"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── VENTILATOR WARD ── */}
                        <div className="ward-section">
                            <div className="ward-header ventilator">
                                <h2><span className="ward-icon">💨</span> VENTILATOR WARD</h2>
                                <div className="ward-summary">
                                    <span className="ward-badge free-badge">
                                        {ventilatorBeds.filter(b => b.status === "free").length} Free
                                    </span>
                                    <span className="ward-badge total-badge">
                                        {stats.ventilator.total} Total
                                    </span>
                                </div>
                            </div>
                            <div className="ward-search">
                                <input
                                    type="text"
                                    placeholder="Search bed by number or status..."
                                    value={searchVentilator}
                                    onChange={(e) => setSearchVentilator(e.target.value)}
                                />
                                <button className="ward-search-btn" type="button">Search</button>
                            </div>
                            <div className="ward-grid">
                                {filterBeds(ventilatorBeds, searchVentilator).map((bed) => (
                                    <div
                                        key={bed.id}
                                        className={`bed-tile ${bed.status}`}
                                        onClick={() => handleRequestBed(bed, "ventilator")}
                                        title={bed.status === "free" ? "Click to request this bed" : bed.status === "requested" ? "Bed requested" : "Bed occupied"}
                                    >
                                        <svg className="bed-tile-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="14" width="28" height="10" rx="2" fill="white" fillOpacity="0.25" />
                                            <rect x="3" y="10" width="10" height="6" rx="2" fill="white" fillOpacity="0.4" />
                                            <path d="M2 24V14C2 12.9 2.9 12 4 12H28C29.1 12 30 12.9 30 14V24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M1 24H31" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="4" y1="24" x2="4" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="28" y1="24" x2="28" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="bed-tile-label">{bed.label}</span>
                                        <span className="bed-tile-status">
                                            {bed.status === "free" ? "Free" : bed.status === "occupied" ? "Occupy" : "Req"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Request Modal ── */}
            {requestModal && (
                <div className="bed-modal-overlay" onClick={() => setRequestModal(null)}>
                    <div className="bed-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="bed-modal-icon">🛏️</div>
                        <h3>Request Bed {requestModal.bed.label}?</h3>
                        <p>
                            You are requesting bed <strong>{requestModal.bed.label}</strong> in the{" "}
                            <strong>{requestModal.ward === "general" ? "General" : requestModal.ward === "icu" ? "ICU" : "Ventilator"} Ward</strong>
                            {selectedHospitalData && (
                                <> at <strong>{selectedHospitalData.name}</strong></>
                            )}
                            . This request will be sent to the hospital for confirmation.
                        </p>
                        <div className="bed-modal-actions">
                            <button className="bed-modal-confirm" onClick={confirmRequest}>
                                ✅ Confirm Request
                            </button>
                            <button className="bed-modal-cancel" onClick={() => setRequestModal(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
