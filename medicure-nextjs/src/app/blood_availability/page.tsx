"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    hospitalBloodBanks,
    donationCamps,
    getCityWideSummary,
    getTotalUnits,
    getCriticalCount,
    type BloodGroup,
} from "@/lib/bloodBanks";
import { getHospitalBloodStocks } from "@/lib/blood-data";
import {
    Droplets,
    AlertTriangle,
    Tent,
    Hospital,
    Microscope,
    MapPin,
    Phone,
    AlertCircle,
    Activity,
    Search,
    ChevronDown,
    Calendar,
    User,
    ClipboardList
} from "lucide-react";

export default function BloodAvailability() {
    const [selectedBank, setSelectedBank] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [campSearch, setCampSearch] = useState("");
    const [campTypeFilter, setCampTypeFilter] = useState("All");

    // Local State for Blood Data (Synced)
    const [allBloodBanks, setAllBloodBanks] = useState(hospitalBloodBanks);
    // We initialize with static layout, but content will update Effect

    // Urgent request form
    const [urgentModal, setUrgentModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [urgentForm, setUrgentForm] = useState({
        bloodGroup: "" as BloodGroup | "",
        units: 1,
        hospital: "",
        patientName: "",
        contact: "",
    });

    // Load fresh data
    useEffect(() => {
        const loadData = () => {
            // Map static hospitals to their dynamic data
            const dynamicBanks = hospitalBloodBanks.map(bank => {
                const freshStocks = getHospitalBloodStocks(bank.hospitalId);
                return { ...bank, stocks: freshStocks };
            });
            setAllBloodBanks(dynamicBanks);
        };

        loadData();
        window.addEventListener("medicure-blood-update", loadData);
        return () => window.removeEventListener("medicure-blood-update", loadData);
    }, []);

    // close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Summary stats (derived from dynamic state)
    const citySummary = getCityWideSummary(allBloodBanks);
    const totalUnits = getTotalUnits(allBloodBanks);
    const criticalCount = getCriticalCount(allBloodBanks);
    const activeCamps = donationCamps.length;

    const selectedBankData = allBloodBanks.find((b) => b.hospitalId === selectedBank);

    // Filter camps
    const campTypes = ["All", ...Array.from(new Set(donationCamps.map((c) => c.type)))];
    const filteredCamps = donationCamps.filter((camp) => {
        const matchesSearch =
            camp.name.toLowerCase().includes(campSearch.toLowerCase()) ||
            camp.location.toLowerCase().includes(campSearch.toLowerCase());
        const matchesType = campTypeFilter === "All" || camp.type === campTypeFilter;
        return matchesSearch && matchesType;
    });

    const handleUrgentSubmit = () => {
        setUrgentModal(false);
        setSuccessModal(true);
        setUrgentForm({ bloodGroup: "", units: 1, hospital: "", patientName: "", contact: "" });
    };

    return (
        <div className="blood-page" suppressHydrationWarning>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

                .blood-page {
                    font-family: 'Poppins', sans-serif;
                    margin: 0; padding: 0;
                    min-height: 100vh;
                    position: relative;
                    overflow-x: hidden;
                }

                /* ── Video BG ── */
                .blood-video-bg {
                    position: fixed; top: 0; left: 0;
                    width: 100%; height: 100%;
                    object-fit: cover; z-index: 0;
                }
                .blood-overlay {
                    position: fixed; top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(135deg, rgba(30,10,10,0.75) 0%, rgba(50,20,30,0.7) 100%);
                    z-index: 1;
                }

                /* ── Nav ── */
                .blood-nav {
                    background: #1a1f2e;
                    padding: 14px 40px;
                    display: flex; align-items: center; justify-content: space-between;
                    position: sticky; top: 0; z-index: 100;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
                }
                .blood-nav-logo {
                    font-size: 24px; font-weight: 700; color: #fff;
                    text-decoration: none; letter-spacing: -0.5px;
                    display: flex; align-items: center; gap: 10px;
                }
                .blood-nav-logo img { height: 45px; width: auto; filter: brightness(0) invert(1); }
                .blood-nav-links { display: flex; gap: 28px; align-items: center; }
                .blood-nav-links a {
                    font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.85);
                    text-decoration: none; position: relative; padding: 4px 0;
                    transition: color 0.3s ease;
                }
                .blood-nav-links a::after {
                    content: ''; position: absolute; width: 0%; height: 2.5px;
                    bottom: -2px; left: 50%; transform: translateX(-50%);
                    background: linear-gradient(90deg, #ff6b6b, #ee5a24);
                    transition: width 0.4s cubic-bezier(0.25,0.8,0.25,1);
                    border-radius: 4px;
                }
                .blood-nav-links a:hover::after { width: 100%; }
                .blood-nav-links a:hover { color: #ff8a8a; }

                /* ── Content ── */
                .blood-content {
                    position: relative; z-index: 10;
                    min-height: calc(100vh - 73px);
                    display: flex; flex-direction: column; align-items: center;
                    padding: 40px 20px 60px;
                }

                /* ── Title ── */
                .blood-title { text-align: center; margin-bottom: 36px; }
                .blood-title h1 {
                    font-size: 40px; font-weight: 800; color: #fff;
                    margin: 0 0 10px; letter-spacing: -0.5px;
                }
                .blood-title h1 span { color: #ff6b6b; }
                .blood-title p {
                    font-size: 16px; color: rgba(255,255,255,0.7); margin: 0; max-width: 640px;
                }

                /* ══ SUMMARY CARDS ══ */
                .blood-summary-grid {
                    display: grid; grid-template-columns: repeat(4, 1fr);
                    gap: 20px; width: 100%; max-width: 1100px; margin-bottom: 40px;
                }
                .blood-summary-card {
                    background: rgba(26, 31, 46, 0.92);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; padding: 28px 24px; text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                    transition: all 0.3s ease;
                }
                .blood-summary-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(255,107,107,0.15);
                    border-color: rgba(255,107,107,0.2);
                }
                .blood-summary-icon { 
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 12px; 
                }
                .blood-summary-value {
                    font-size: 36px; font-weight: 800; margin: 0 0 4px;
                }
                .blood-summary-value.red { color: #ff6b6b; }
                .blood-summary-value.green { color: #4ade80; }
                .blood-summary-value.blue { color: #60a5fa; }
                .blood-summary-value.amber { color: #fbbf24; }
                .blood-summary-label {
                    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6);
                    text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* ══ CITY-WIDE BLOOD GROUP GRID ══ */
                .blood-group-section {
                    width: 100%; max-width: 1100px; margin-bottom: 40px;
                }
                .blood-section-title {
                    font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 20px;
                    display: flex; align-items: center; gap: 10px;
                }
                .blood-section-title .section-icon { 
                    color: #ff6b6b;
                    display: flex; align-items: center; justify-content: center;
                }
                .blood-group-grid {
                    display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px;
                }
                .blood-group-card {
                    background: rgba(26, 31, 46, 0.92);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px; padding: 20px 12px; text-align: center;
                    transition: all 0.3s ease;
                }
                .blood-group-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                }
                .blood-group-card .bg-label {
                    font-size: 22px; font-weight: 800; margin-bottom: 8px;
                }
                .blood-group-card .bg-label.available { color: #4ade80; }
                .blood-group-card .bg-label.low { color: #fbbf24; }
                .blood-group-card .bg-label.critical { color: #ff6b6b; }
                .blood-group-card .bg-units {
                    font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 4px;
                }
                .blood-group-card .bg-status {
                    font-size: 10px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.8px; padding: 3px 10px; border-radius: 50px;
                    display: inline-block;
                }
                .blood-group-card .bg-status.available { background: rgba(74,222,128,0.15); color: #4ade80; }
                .blood-group-card .bg-status.low { background: rgba(251,191,36,0.15); color: #fbbf24; }
                .blood-group-card .bg-status.critical { background: rgba(255,107,107,0.15); color: #ff6b6b; }

                /* ══ HOSPITAL BLOOD BANK SECTION ══ */
                .blood-hospital-section {
                    width: 100%; max-width: 1100px; margin-bottom: 40px;
                }
                .blood-hosp-select {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 16px; margin-bottom: 24px; width: 100%; max-width: 750px;
                    margin-left: auto; margin-right: auto;
                }
                .blood-dropdown-wrapper { position: relative; width: 100%; }
                .blood-dropdown-trigger {
                    width: 100%; padding: 18px 52px 18px 24px;
                    font-size: 17px; font-weight: 500; font-family: 'Poppins', sans-serif;
                    border: 2px solid rgba(255,255,255,0.2); border-radius: 14px;
                    background: rgba(30,37,54,0.95); color: #fff; cursor: pointer;
                    text-align: left; box-shadow: 0 4px 24px rgba(0,0,0,0.2);
                    transition: all 0.3s ease; position: relative;
                }
                .blood-dropdown-trigger::after {
                    content: ''; position: absolute; right: 20px; top: 50%;
                    transform: translateY(-50%) rotate(0deg);
                    width: 0; height: 0;
                    border-left: 7px solid transparent; border-right: 7px solid transparent;
                    border-top: 8px solid #ff6b6b;
                    transition: transform 0.3s ease;
                }
                .blood-dropdown-trigger.open::after { transform: translateY(-50%) rotate(180deg); }
                .blood-dropdown-trigger:hover, .blood-dropdown-trigger.open {
                    border-color: #ff6b6b;
                    box-shadow: 0 0 0 3px rgba(255,107,107,0.15), 0 4px 24px rgba(0,0,0,0.25);
                }
                .blood-dropdown-trigger .placeholder { color: rgba(255,255,255,0.5); }
                .blood-dropdown-list {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 100%;
                    max-height: 340px; overflow-y: auto;
                    background: rgba(26,31,46,0.98);
                    border: 2px solid rgba(255,107,107,0.25);
                    border-radius: 14px; box-shadow: 0 12px 48px rgba(0,0,0,0.4);
                    z-index: 50; padding: 8px;
                    display: flex; flex-direction: column; gap: 4px;
                }
                .blood-dropdown-list::-webkit-scrollbar { width: 6px; }
                .blood-dropdown-list::-webkit-scrollbar-thumb { background: rgba(255,107,107,0.3); border-radius: 3px; }
                .blood-dd-item {
                    padding: 14px 18px; border-radius: 10px; cursor: pointer;
                    transition: all 0.2s ease; border: 1px solid transparent;
                }
                .blood-dd-item:hover { background: rgba(255,107,107,0.08); border-color: rgba(255,107,107,0.15); }
                .blood-dd-item.selected { background: rgba(255,107,107,0.12); border-color: rgba(255,107,107,0.3); }
                .blood-dd-item-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px; }
                .blood-dd-item-loc { font-size: 12px; color: rgba(255,255,255,0.55); }

                /* ── Stock Table ── */
                .blood-stock-table-wrap {
                    overflow-x: auto; border-radius: 16px;
                    background: rgba(26, 31, 46, 0.92);
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                }
                .blood-stock-table {
                    width: 100%; border-collapse: collapse;
                    font-size: 14px;
                }
                .blood-stock-table th {
                    padding: 16px 18px; text-align: left;
                    font-weight: 600; font-size: 12px; text-transform: uppercase;
                    letter-spacing: 0.8px; color: rgba(255,255,255,0.5);
                    background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .blood-stock-table td {
                    padding: 14px 18px; color: #fff;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                .blood-stock-table tr:last-child td { border-bottom: none; }
                .blood-stock-table tr:hover td { background: rgba(255,107,107,0.04); }
                .stock-group-label {
                    font-size: 18px; font-weight: 700;
                }
                .stock-units { font-size: 20px; font-weight: 700; }
                .stock-badge {
                    padding: 4px 14px; border-radius: 50px;
                    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .stock-badge.available { background: rgba(74,222,128,0.15); color: #4ade80; }
                .stock-badge.low { background: rgba(251,191,36,0.15); color: #fbbf24; }
                .stock-badge.critical { background: rgba(255,107,107,0.15); color: #ff6b6b; }
                .stock-updated { font-size: 12px; color: rgba(255,255,255,0.4); }
                .stock-bar-wrap {
                    width: 100%; height: 6px; background: rgba(255,255,255,0.08);
                    border-radius: 3px; overflow: hidden;
                }
                .stock-bar {
                    height: 100%; border-radius: 3px; transition: width 0.6s ease;
                }
                .stock-bar.available { background: #4ade80; }
                .stock-bar.low { background: #fbbf24; }
                .stock-bar.critical { background: #ff6b6b; }

                .blood-hosp-info {
                    text-align: center; margin-bottom: 20px; padding: 12px 24px;
                    background: rgba(255,107,107,0.08); border-radius: 12px;
                    border: 1px solid rgba(255,107,107,0.15);
                }
                .blood-hosp-info span { font-size: 14px; color: rgba(255,255,255,0.75); }
                .blood-hosp-info strong { color: #ff8a8a; font-weight: 600; }

                /* ══ DONATION CAMPS ══ */
                .blood-camps-section {
                    width: 100%; max-width: 1100px; margin-bottom: 40px;
                }
                .camps-controls {
                    display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
                }
                .camps-search {
                    flex: 1; min-width: 240px; padding: 14px 20px;
                    font-size: 14px; font-family: 'Poppins', sans-serif;
                    border: 1.5px solid rgba(255,255,255,0.15); border-radius: 12px;
                    background: rgba(255,255,255,0.06); color: #fff; outline: none;
                    transition: border-color 0.3s ease;
                }
                .camps-search::placeholder { color: rgba(255,255,255,0.35); }
                .camps-search:focus {
                    border-color: rgba(255,107,107,0.4);
                    box-shadow: 0 0 0 2px rgba(255,107,107,0.1);
                }
                .camps-type-select {
                    padding: 14px 20px; font-size: 14px; font-family: 'Poppins', sans-serif;
                    border: 1.5px solid rgba(255,255,255,0.15); border-radius: 12px;
                    background: rgba(30,37,54,0.95); color: #fff; outline: none; cursor: pointer;
                    min-width: 180px;
                }
                .camps-type-select option { background: #1e2536; color: #fff; }

                .camps-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 16px;
                }
                .camp-card {
                    background: rgba(26, 31, 46, 0.92);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px; padding: 24px;
                    transition: all 0.3s ease;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .camp-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 32px rgba(255,107,107,0.12);
                    border-color: rgba(255,107,107,0.2);
                }
                .camp-card-header {
                    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
                }
                .camp-card-name {
                    font-size: 16px; font-weight: 700; color: #fff; margin: 0;
                    line-height: 1.3;
                }
                .camp-card-type {
                    padding: 4px 12px; border-radius: 50px;
                    font-size: 10px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.5px; white-space: nowrap;
                    background: rgba(255,107,107,0.12); color: #ff8a8a;
                    flex-shrink: 0;
                }
                .camp-card-loc {
                    font-size: 13px; color: rgba(255,255,255,0.55);
                    display: flex; align-items: center; gap: 6px;
                }
                .camp-card-desc {
                    font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.5;
                    margin: 0;
                }
                .camp-card-contact {
                    font-size: 12px; color: #60a5fa;
                    display: flex; align-items: center; gap: 6px;
                }

                /* ══ URGENT REQUEST ══ */
                .blood-urgent-section {
                    width: 100%; max-width: 1100px; margin-bottom: 40px;
                    text-align: center;
                }
                .blood-urgent-btn {
                    font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700;
                    color: #fff; background: linear-gradient(45deg, #dc2626, #ff6b6b);
                    padding: 16px 40px; border-radius: 14px; border: none; cursor: pointer;
                    box-shadow: 0 4px 20px rgba(220,38,38,0.35);
                    transition: all 0.3s ease;
                    display: inline-flex; align-items: center; gap: 10px;
                }
                .blood-urgent-btn:hover {
                    background: linear-gradient(45deg, #b91c1c, #ef4444);
                    box-shadow: 0 6px 28px rgba(220,38,38,0.5);
                    transform: translateY(-3px);
                }
                .blood-urgent-btn .pulse-dot {
                    width: 10px; height: 10px; border-radius: 50%;
                    background: #fff; animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                }

                /* ── Modals ── */
                .blood-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
                    z-index: 200; display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .blood-modal {
                    background: #1e2536;
                    border: 1px solid rgba(255,107,107,0.2);
                    border-radius: 20px; padding: 36px 40px;
                    max-width: 500px; width: 100%;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
                }
                .blood-modal h3 {
                    font-size: 22px; font-weight: 700; color: #fff;
                    margin: 0 0 6px; text-align: center;
                }
                .blood-modal .modal-subtitle {
                    font-size: 14px; color: rgba(255,255,255,0.55);
                    margin: 0 0 24px; text-align: center;
                }
                .blood-form-group {
                    margin-bottom: 16px;
                }
                .blood-form-group label {
                    display: block; font-size: 12px; font-weight: 600;
                    color: rgba(255,255,255,0.6); margin-bottom: 6px;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .blood-form-group input,
                .blood-form-group select {
                    width: 100%; padding: 12px 16px;
                    font-size: 14px; font-family: 'Poppins', sans-serif;
                    border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px;
                    background: rgba(255,255,255,0.06); color: #fff; outline: none;
                    transition: border-color 0.3s ease;
                    box-sizing: border-box;
                }
                .blood-form-group input:focus,
                .blood-form-group select:focus {
                    border-color: rgba(255,107,107,0.5);
                }
                .blood-form-group select option { background: #1e2536; color: #fff; }
                .blood-form-row {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                }
                .blood-modal-actions {
                    display: flex; gap: 12px; justify-content: center; margin-top: 24px;
                }
                .blood-modal-submit {
                    padding: 12px 32px; border: none; border-radius: 10px;
                    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
                    background: linear-gradient(45deg, #dc2626, #ff6b6b);
                    color: #fff; cursor: pointer; transition: all 0.2s ease;
                }
                .blood-modal-submit:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(220,38,38,0.4); }
                .blood-modal-cancel {
                    padding: 12px 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
                    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
                    background: transparent; color: rgba(255,255,255,0.7); cursor: pointer;
                    transition: all 0.2s ease;
                }
                .blood-modal-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

                /* Success modal */
                .success-modal { text-align: center; }
                .success-modal .success-icon { font-size: 56px; margin-bottom: 16px; }
                .success-modal h3 { color: #4ade80; }
                .success-modal p { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.6; margin: 0 0 24px; }
                .success-modal-btn {
                    padding: 12px 36px; border: none; border-radius: 10px;
                    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
                    background: linear-gradient(45deg, #22c55e, #4ade80);
                    color: #052e16; cursor: pointer; transition: all 0.2s ease;
                }
                .success-modal-btn:hover { transform: translateY(-1px); }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .blood-summary-grid { grid-template-columns: repeat(2, 1fr); }
                    .blood-group-grid { grid-template-columns: repeat(4, 1fr); }
                }
                @media (max-width: 768px) {
                    .blood-title h1 { font-size: 28px; }
                    .blood-nav { padding: 12px 20px; }
                    .blood-summary-grid { grid-template-columns: 1fr 1fr; }
                    .blood-group-grid { grid-template-columns: repeat(4, 1fr); }
                    .camps-grid { grid-template-columns: 1fr; }
                    .blood-form-row { grid-template-columns: 1fr; }
                    .blood-nav-links { gap: 16px; }
                    .blood-nav-links a { font-size: 13px; }
                }
                @media (max-width: 480px) {
                    .blood-group-grid { grid-template-columns: repeat(2, 1fr); }
                    .blood-summary-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Video BG */}
            <video autoPlay loop muted playsInline className="blood-video-bg">
                <source src="/hero-vid.mp4" type="video/mp4" />
            </video>
            <div className="blood-overlay" />

            {/* Nav */}
            <nav className="blood-nav">
                <Link href="/" className="blood-nav-logo">
                    <img src="/logo.png" alt="MediCure" />
                </Link>
                <div className="blood-nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/bed_status">Bed Availability</Link>
                    <Link href="/blood_availability">Blood Availability</Link>
                    <Link href="/contact">Contact Us</Link>
                    <Link href="/login">Login</Link>
                </div>
            </nav>

            {/* Content */}
            <div className="blood-content">
                {/* Title */}
                <div className="blood-title">
                    <h1>Real-Time <span>Blood Availability</span> Dashboard</h1>
                    <p>Live blood bank inventory across government hospitals & nearby donation camps in Jaipur</p>
                </div>

                {/* ══ SUMMARY CARDS ══ */}
                <div className="blood-summary-grid">
                    <div className="blood-summary-card">
                        <div className="blood-summary-icon">
                            <Droplets size={40} color="#ff6b6b" fill="#ff6b6b" fillOpacity={0.2} />
                        </div>
                        <p className="blood-summary-value red">{totalUnits}</p>
                        <p className="blood-summary-label">Total Units Available</p>
                    </div>
                    <div className="blood-summary-card">
                        <div className="blood-summary-icon">
                            <AlertTriangle size={40} color="#fbbf24" fill="#fbbf24" fillOpacity={0.2} />
                        </div>
                        <p className="blood-summary-value amber">{criticalCount}</p>
                        <p className="blood-summary-label">Critical Shortages</p>
                    </div>
                    <div className="blood-summary-card">
                        <div className="blood-summary-icon">
                            <Tent size={40} color="#60a5fa" fill="#60a5fa" fillOpacity={0.2} />
                        </div>
                        <p className="blood-summary-value blue">{activeCamps}</p>
                        <p className="blood-summary-label">Active Donation Camps</p>
                    </div>
                    <div className="blood-summary-card">
                        <div className="blood-summary-icon">
                            <Hospital size={40} color="#4ade80" fill="#4ade80" fillOpacity={0.2} />
                        </div>
                        <p className="blood-summary-value green">{allBloodBanks.length}</p>
                        <p className="blood-summary-label">Blood Banks Online</p>
                    </div>
                </div>

                {/* ══ CITY-WIDE BLOOD GROUP OVERVIEW ══ */}
                <div className="blood-group-section">
                    <h2 className="blood-section-title">
                        <span className="section-icon"><Microscope size={28} /></span> City-Wide Blood Group Inventory
                    </h2>
                    <div className="blood-group-grid">
                        {citySummary.map((item) => (
                            <div key={item.group} className="blood-group-card">
                                <div className={`bg-label ${item.status.toLowerCase()}`}>{item.group}</div>
                                <div className="bg-units">{item.totalUnits}</div>
                                <span className={`bg-status ${item.status.toLowerCase()}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══ HOSPITAL BLOOD BANK INVENTORY ══ */}
                <div className="blood-hospital-section">
                    <h2 className="blood-section-title">
                        <span className="section-icon"><Hospital size={28} /></span> Hospital Blood Bank Stock
                    </h2>

                    <div className="blood-hosp-select">
                        <div className="blood-dropdown-wrapper" ref={dropdownRef}>
                            <div
                                className={`blood-dropdown-trigger ${isOpen ? "open" : ""}`}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {selectedBankData ? (
                                    selectedBankData.bloodBankName
                                ) : (
                                    <span className="placeholder">Select a Hospital Blood Bank</span>
                                )}
                                <ChevronDown className={`dropdown-chevron ${isOpen ? "open" : ""}`} size={20} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', transition: 'transform 0.3s ease', color: '#ff6b6b' }} />
                            </div>
                            {isOpen && (
                                <div className="blood-dropdown-list">
                                    {allBloodBanks.map((bank) => (
                                        <div
                                            key={bank.hospitalId}
                                            className={`blood-dd-item ${selectedBank === bank.hospitalId ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelectedBank(bank.hospitalId);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className="blood-dd-item-name">{bank.bloodBankName}</div>
                                            <div className="blood-dd-item-loc">
                                                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> {bank.location} — <Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> {bank.contact}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedBankData && (
                        <>
                            <div className="blood-hosp-info">
                                <span>
                                    Showing stock for <strong>{selectedBankData.bloodBankName}</strong> — {selectedBankData.location}
                                </span>
                            </div>
                            <div className="blood-stock-table-wrap">
                                <table className="blood-stock-table">
                                    <thead>
                                        <tr>
                                            <th>Blood Group</th>
                                            <th>Units Available</th>
                                            <th>Status</th>
                                            <th>Stock Level</th>
                                            <th>Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedBankData.stocks.map((stock) => (
                                            <tr key={stock.group}>
                                                <td>
                                                    <span className={`stock-group-label ${stock.status.toLowerCase()}`} style={{ color: stock.status === "Available" ? "#4ade80" : stock.status === "Low" ? "#fbbf24" : "#ff6b6b", display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Droplets size={18} fill={stock.status === "Available" ? "#4ade80" : stock.status === "Low" ? "#fbbf24" : "#ff6b6b"} fillOpacity={0.2} /> {stock.group}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="stock-units">{stock.units}</span>
                                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: 4 }}>units</span>
                                                </td>
                                                <td>
                                                    <span className={`stock-badge ${stock.status.toLowerCase()}`}>{stock.status}</span>
                                                </td>
                                                <td>
                                                    <div className="stock-bar-wrap">
                                                        <div
                                                            className={`stock-bar ${stock.status.toLowerCase()}`}
                                                            style={{ width: `${Math.min((stock.units / 40) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td><span className="stock-updated">{stock.lastUpdated}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* ══ URGENT BLOOD REQUEST ══ */}
                <div className="blood-urgent-section">
                    <button className="blood-urgent-btn" onClick={() => setUrgentModal(true)}>
                        <Activity size={20} /> Urgent Blood Request
                    </button>
                </div>

                {/* ══ DONATION CAMPS & COMMUNITIES ══ */}
                <div className="blood-camps-section">
                    <h2 className="blood-section-title">
                        <span className="section-icon"><Calendar size={28} /></span> Blood Donation Camps & Communities — Jaipur
                    </h2>

                    <div className="camps-controls">
                        <input
                            type="text"
                            className="camps-search"
                            placeholder="Search by name or location..."
                            value={campSearch}
                            onChange={(e) => setCampSearch(e.target.value)}
                        />
                        <select
                            className="camps-type-select"
                            value={campTypeFilter}
                            onChange={(e) => setCampTypeFilter(e.target.value)}
                        >
                            {campTypes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="camps-grid">
                        {filteredCamps.map((camp) => (
                            <div key={camp.id} className="camp-card">
                                <div className="camp-card-header">
                                    <h3 className="camp-card-name">{camp.name}</h3>
                                    <span className="camp-card-type">{camp.type}</span>
                                </div>
                                <div className="camp-card-loc"><MapPin size={14} /> {camp.location}</div>
                                <p className="camp-card-desc">{camp.description}</p>
                                {camp.contact && (
                                    <div className="camp-card-contact"><Phone size={14} /> {camp.contact}</div>
                                )}
                            </div>
                        ))}
                        {filteredCamps.length === 0 && (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "rgba(255,255,255,0.5)" }}>
                                No camps found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Urgent Request Modal ── */}
            {urgentModal && (
                <div className="blood-modal-overlay" onClick={() => setUrgentModal(false)}>
                    <div className="blood-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <AlertCircle color="#ff6b6b" /> Urgent Blood Request
                        </h3>
                        <p className="modal-subtitle">Submit an urgent request — nearby blood banks will be notified immediately.</p>

                        <div className="blood-form-row">
                            <div className="blood-form-group">
                                <label>Blood Group Required</label>
                                <select
                                    value={urgentForm.bloodGroup}
                                    onChange={(e) => setUrgentForm({ ...urgentForm, bloodGroup: e.target.value as BloodGroup })}
                                >
                                    <option value="">Select</option>
                                    {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="blood-form-group">
                                <label>Units Required</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={urgentForm.units}
                                    onChange={(e) => setUrgentForm({ ...urgentForm, units: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>

                        <div className="blood-form-group">
                            <label>Hospital Name</label>
                            <input
                                type="text"
                                placeholder="Enter hospital name"
                                value={urgentForm.hospital}
                                onChange={(e) => setUrgentForm({ ...urgentForm, hospital: e.target.value })}
                            />
                        </div>

                        <div className="blood-form-row">
                            <div className="blood-form-group">
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter patient name"
                                    value={urgentForm.patientName}
                                    onChange={(e) => setUrgentForm({ ...urgentForm, patientName: e.target.value })}
                                />
                            </div>
                            <div className="blood-form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91-XXXXXXXXXX"
                                    value={urgentForm.contact}
                                    onChange={(e) => setUrgentForm({ ...urgentForm, contact: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="blood-modal-actions">
                            <button className="blood-modal-submit" onClick={handleUrgentSubmit}>
                                🚨 Submit Urgent Request
                            </button>
                            <button className="blood-modal-cancel" onClick={() => setUrgentModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Success Modal ── */}
            {successModal && (
                <div className="blood-modal-overlay" onClick={() => setSuccessModal(false)}>
                    <div className="blood-modal success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="success-icon">✅</div>
                        <h3>Request Submitted!</h3>
                        <p>
                            Your urgent blood request has been broadcast to all nearby blood banks and donation centres.
                            You will receive a confirmation call shortly.
                        </p>
                        <button className="success-modal-btn" onClick={() => setSuccessModal(false)}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
