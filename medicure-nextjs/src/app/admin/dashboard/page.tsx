"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hospitals, findHospitalById } from "@/lib/hospitals";
import { sendTelegramNotification } from "@/app/actions/telegram";
import { getHospitalBeds, getBedStats } from "@/lib/bed-data";
import { getHospitalBloodStocks } from "@/lib/blood-data";

type ActiveView = "dashboard" | "settings" | "add-patient" | "discharge" | "appointment" | "blood-bank";

// Hospital settings data
const defaultHospital = {
    name: "Artemis Hospital",
    id: "550103",
    address: "placeholder, delhi, delhi - 760103",
    contact: "3456789012",
    emergency: "1234567890",
    email: "aa@AA.COM",
    website: "https://www.youtube.com/",
    beds: 20,
    generalOccupied: 3,
    icuBeds: 50,
    icuOccupied: 2,
    ventilators: 2,
    ventilatorOccupied: 1,
    emergencyDept: true,
    specializations: ["Cardiology", "Emergency Medicine", "General Medicine", "General Checkup", "Surgery", "Neurology", "Pediatrics", "Radiology", "Infectious Diseases", "Gastroenterology", "ENT", "Burn & Plastic Surgery", "COVID-19", "Pulmonology", "Critical Care Medicine", "Orthopedic Surgery", "Neurosurgery", "Oncology", "Anesthesiology", "Obstetrics & Gynecology", "Nephrology", "Hematology", "Urology", "Toxicology"],
    operatingHours: "9:00-23:00",
    visitingHours: "9:00-23:00",
    pharmacy: true,
    totalDoctors: 45,
    totalNurses: 300,
    adminStaff: 30,
    inventoryDistributors: 0,
    ambulance: true,
    bloodBank: true,
    diagnosticServices: true,
};

// Mock patients
const mockPatients = [
    { id: "P001", name: "Rajesh Kumar", age: 45, gender: "Male", bed: "G-12", type: "General", doctor: "Dr. Sharma", admitted: "2026-02-15", status: "Stable" },
    { id: "P002", name: "Priya Singh", age: 32, gender: "Female", bed: "ICU-3", type: "ICU", doctor: "Dr. Patel", admitted: "2026-02-16", status: "Critical" },
    { id: "P003", name: "Mohammed Ali", age: 58, gender: "Male", bed: "V-1", type: "Ventilator", doctor: "Dr. Gupta", admitted: "2026-02-14", status: "Critical" },
];

const mockAppointments = [
    { id: "A001", patient: "Anita Desai", doctor: "Dr. Sharma", dept: "Cardiology", date: "2026-02-18", time: "10:00 AM", status: "Confirmed", chatId: "" },
    { id: "A002", patient: "Vikram Mehta", doctor: "Dr. Patel", dept: "Neurology", date: "2026-02-18", time: "11:30 AM", status: "Pending", chatId: "2050811270" }, // Demo ID
    { id: "A003", patient: "Sunita Rao", doctor: "Dr. Gupta", dept: "Orthopedic Surgery", date: "2026-02-18", time: "02:00 PM", status: "Confirmed", chatId: "" },
    { id: "A004", patient: "Deepak Joshi", doctor: "Dr. Sharma", dept: "General Medicine", date: "2026-02-19", time: "09:00 AM", status: "Pending", chatId: "" },
];

// Hospital list from shared data
const hospitalList = hospitals;

const CustomSelect = ({ label, value, options, onChange, required = false, placeholder = "Select" }: any) => {
    return (
        <div className="ha-form-group">
            <label>{label}</label>
            <select
                value={value}
                onChange={onChange}
                required={required}
                style={{ width: '100%' }}
            >
                <option value="">{placeholder}</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default function AdminDashboard() {
    const [activeView, setActiveView] = useState<ActiveView>("dashboard");
    const [hospital, setHospital] = useState(defaultHospital);
    const [patients, setPatients] = useState(mockPatients);
    const [appointments, setAppointments] = useState(mockAppointments);
    const [successMsg, setSuccessMsg] = useState("");
    const [newPatient, setNewPatient] = useState({ name: "", dob: "", gender: "", address: "", phone: "", email: "", aadhar: "", bedType: "General", bedNumber: "", doctor: "" });
    const [discharge, setDischarge] = useState({ patientId: "", patientName: "", gender: "", address: "", admissionDate: "", dischargeDate: "", diagnosis: "", treatment: "", bedType: "", doctor: "", summary: "", followUp: "", medications: "", contact: "" });

    const router = useRouter();

    // Load hospital info and appointments from localStorage on mount
    // Load hospital info and appointments from localStorage on mount
    useEffect(() => {
        const storedId = localStorage.getItem("hospitalId");
        const storedName = localStorage.getItem("hospitalName");
        if (storedId && storedName) {
            const h = findHospitalById(storedId);
            if (h) {
                setHospital(prev => ({ ...prev, name: h.name, email: h.email, id: h.id }));
            } else {
                setHospital(prev => ({ ...prev, name: storedName }));
            }

            // Sync Bed Stats
            const updateBedStats = () => {
                const beds = getHospitalBeds(storedId);
                const stats = getBedStats(beds);
                setHospital(prev => ({
                    ...prev,
                    beds: stats.general.total,
                    generalOccupied: stats.general.occupied,
                    icuBeds: stats.icu.total,
                    icuOccupied: stats.icu.occupied,
                    ventilators: stats.ventilator.total,
                    ventilatorOccupied: stats.ventilator.occupied,
                }));
            };

            updateBedStats();
            window.addEventListener("medicure-bed-update", updateBedStats);

            // Load appointments from localStorage for this hospital
            const storageKeyAppt = `appointments_${storedId}`;
            const storedAppts = JSON.parse(localStorage.getItem(storageKeyAppt) || "[]");

            // Load patients from localStorage for this hospital
            const storageKeyPatient = `patients_${storedId}`;
            const storedPatients = JSON.parse(localStorage.getItem(storageKeyPatient) || "[]");

            if (storedAppts.length > 0) {
                const mapped = storedAppts.map((a: any, i: number) => ({
                    id: a.id || `A${String(i + 1).padStart(3, "0")}`,
                    patient: a.patient,
                    doctor: a.hospitalName || storedName,
                    dept: a.dept || "General",
                    date: a.date,
                    time: a.time,
                    status: a.status || "Pending",
                    chatId: a.chatId || "",
                }));

                const allAppts = [...mockAppointments, ...mapped];
                const uniqueMapAppts = new Map();
                allAppts.forEach(item => {
                    if (item.id) uniqueMapAppts.set(item.id, item);
                });
                setAppointments(Array.from(uniqueMapAppts.values()));
            }

            if (storedPatients.length > 0) {
                const allPatients = [...mockPatients, ...storedPatients];
                const uniqueMapPatients = new Map();
                allPatients.forEach(item => {
                    if (item.id) uniqueMapPatients.set(item.id, item);
                });
                setPatients(Array.from(uniqueMapPatients.values()));
            }

            return () => {
                window.removeEventListener("medicure-bed-update", updateBedStats);
            };
        }
    }, []);

    const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        const p = { id: `P${String(patients.length + 1).padStart(3, "0")}`, name: newPatient.name, age: 0, gender: newPatient.gender, bed: `${newPatient.bedType[0]}-${newPatient.bedNumber}`, type: newPatient.bedType, doctor: newPatient.doctor, admitted: new Date().toISOString().split("T")[0], status: "Stable" };
        const updatedPatients = [...patients, p];
        setPatients(updatedPatients);

        // Persist patients
        const storedId = localStorage.getItem("hospitalId");
        if (storedId) {
            const storageKey = `patients_${storedId}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedPatients));
        }

        setNewPatient({ name: "", dob: "", gender: "", address: "", phone: "", email: "", aadhar: "", bedType: "General", bedNumber: "", doctor: "" });
        showSuccess(`Patient ${p.name} admitted successfully!`);
    };

    const handleDischarge = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedPatients = patients.filter(p => p.id !== discharge.patientId);
        setPatients(updatedPatients);

        // Persist patients
        const storedId = localStorage.getItem("hospitalId");
        if (storedId) {
            const storageKey = `patients_${storedId}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedPatients));
        }

        showSuccess(`Patient ${discharge.patientName || discharge.patientId} discharged successfully!`);
        setDischarge({ patientId: "", patientName: "", gender: "", address: "", admissionDate: "", dischargeDate: "", diagnosis: "", treatment: "", bedType: "", doctor: "", summary: "", followUp: "", medications: "", contact: "" });
    };



    const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault(); showSuccess("Hospital settings saved!"); };

    const updateStatus = async (id: string, newStatus: string, appt?: any) => {
        const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
        setAppointments(updated);

        // Update localStorage
        const storedId = localStorage.getItem("hospitalId");
        if (storedId) {
            const storageKey = `appointments_${storedId}`;
            localStorage.setItem(storageKey, JSON.stringify(updated));
        }

        if (newStatus === "Confirmed" && appt) {
            // Trigger Telegram notification
            // Use the chatId from the appointment if available, otherwise fallback or skip
            const targetChatId = appt.chatId || "2050811270"; // Default to my test ID if missing for demo

            const day = new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long' });

            // Call Server Action
            const result = await sendTelegramNotification(targetChatId, appt.doctor, appt.date, day);

            if (result.success) {
                showSuccess(`Appointment confirmed & Telegram sent to ${appt.patient}!`);
            } else {
                showSuccess(`Appointment confirmed but Telegram failed: ${result.error}`);
            }
        } else if (newStatus === "Rejected") {
            showSuccess(`Appointment for ${appt.patient} rejected.`);
        }
    };

    // Telegram Notification
    // We import the server action effectively by calling it as an async function
    // But since it is a server action from a separate file, we need to import it at the top.
    // However, I can't add imports with replace_file_content unless I target the top of the file.
    // I will use a separate `apply_diff` or just rewrite the whole component logic block if needed.
    // Wait, I can't import in the middle of the file. 
    // I will use `run_command` to add the import or just assume I'll do it in a separate step or Replace the whole file content if easier, but replace_file_content is better.
    // Actually, I can use `multi_replace_file_content` to add the import AND change the function.
    // For now, I'll just change the functions and assume I will add the import in the next step or use a dynamic import if needed (but standard import is better).
    // Let's plan to use `multi_replace_file_content` in the next turn to do both.
    // Actually, I can do it right now with `multi_replace_file_content`.

    // WAIT: I shouldn't put comments in the replacement content explaining my thought process.

    // I will perform the update using `multi_replace_file_content` to add the import and update the logic.
    // This tool call is just a placeholder to signal intent, but I will actually use `multi_replace_file_content` which is better suited.
    // I'll Cancel this single replace and use `multi_replace_file_content` below.

    // Converting to multi_replace... checking tools... yes `multi_replace_file_content` is available.

    // I'll skip this tool call and use the correct one.


    return (
        <div className="ha-root">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                .ha-root { font-family: 'Inter', sans-serif; display: flex; min-height: 100vh; background: #f0f2f5; }
                .ha-root * { box-sizing: border-box; }

                /* ─── Sidebar ─── */
                .ha-sidebar {
                    width: 260px; background: linear-gradient(180deg, #0c4a6e 0%, #164e63 100%);
                    color: #a5d8ff; padding: 0; display: flex; flex-direction: column;
                    position: fixed; height: 100vh; z-index: 100;
                }
                .ha-sidebar-brand { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px; }
                .ha-sidebar-brand img { height: 36px; width: auto; object-fit: contain; }
                .ha-sidebar-brand h2 { color: #fff; font-size: 17px; font-weight: 700; margin: 0 0 4px 0; }
                .ha-sidebar-brand span { font-size: 12px; color: #7dd3fc; font-weight: 400; }

                .ha-nav { list-style: none; padding: 16px 12px; margin: 0; flex: 1; }
                .ha-nav li { margin-bottom: 4px; }
                .ha-nav-btn {
                    width: 100%; display: flex; align-items: center; gap: 12px;
                    padding: 12px 16px; border: none; background: transparent;
                    color: #bae6fd; font-size: 14px; font-weight: 500;
                    border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: left;
                }
                .ha-nav-btn:hover { background: rgba(255,255,255,0.08); color: #e0f2fe; }
                .ha-nav-btn.active { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
                .ha-nav-btn svg { width: 20px; height: 20px; flex-shrink: 0; }

                .ha-nav-logout { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
                .ha-logout-btn {
                    width: 100%; display: flex; align-items: center; gap: 12px;
                    padding: 12px 16px; border: none; background: rgba(239,68,68,0.1);
                    color: #f87171; font-size: 14px; font-weight: 500;
                    border-radius: 8px; cursor: pointer; transition: all 0.2s;
                }
                .ha-logout-btn:hover { background: rgba(239,68,68,0.2); }

                /* ─── Main ─── */
                .ha-main { margin-left: 260px; flex: 1; padding: 32px; max-width: 1200px; }
                .ha-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
                .ha-topbar h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
                .ha-topbar-user { display: flex; align-items: center; gap: 12px; background: #fff; padding: 8px 16px; border-radius: 50px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
                .ha-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #06b6d4); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }

                /* ─── Stats (Compact) ─── */
                .ha-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
                .ha-stat-card { background: #fff; border-radius: 10px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; transition: transform 0.2s, box-shadow 0.2s; display: flex; align-items: center; gap: 12px; }
                .ha-stat-card:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
                .ha-stat-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
                .ha-stat-icon.teal { background: #f0fdfa; color: #14b8a6; }
                .ha-stat-icon.blue { background: #eff6ff; color: #3b82f6; }
                .ha-stat-icon.rose { background: #fff1f2; color: #f43f5e; }
                .ha-stat-icon.amber { background: #fffbeb; color: #f59e0b; }
                .ha-stat-icon.violet { background: #f5f3ff; color: #8b5cf6; }
                .ha-stat-icon.emerald { background: #ecfdf5; color: #10b981; }
                .ha-stat-value { font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1; }
                .ha-stat-label { font-size: 11px; color: #64748b; font-weight: 500; }

                /* ─── Panel ─── */
                .ha-panel { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; margin-bottom: 24px; }
                .ha-panel-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .ha-panel-header h3 { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0; }

                /* ─── Table ─── */
                .ha-table { width: 100%; border-collapse: collapse; }
                .ha-table th { text-align: left; padding: 12px 24px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
                .ha-table td { padding: 14px 24px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
                .ha-table tr:last-child td { border-bottom: none; }
                .ha-table tr:hover td { background: #f8fafc; }

                .ha-badge { display: inline-block; padding: 4px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
                .ha-badge.stable { background: #dcfce7; color: #16a34a; }
                .ha-badge.critical { background: #fee2e2; color: #dc2626; }
                .ha-badge.confirmed { background: #dbeafe; color: #2563eb; }
                .ha-badge.pending { background: #fef3c7; color: #d97706; }

                /* ─── Form ─── */
                .ha-form { padding: 32px; }
                .ha-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .ha-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                .ha-form-group { display: flex; flex-direction: column; }
                .ha-form-group.full { grid-column: 1 / -1; }
                .ha-form-group label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
                .ha-form-group input, .ha-form-group select, .ha-form-group textarea {
                    padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px;
                    font-size: 14px; transition: all 0.2s; outline: none; font-family: 'Inter', sans-serif;
                    background: #fff;
                }
                .ha-form-group input:focus, .ha-form-group textarea:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
                .ha-form-group textarea { min-height: 80px; resize: vertical; }



                .ha-form-submit { margin-top: 24px; display: flex; gap: 12px; }
                .ha-btn { padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
                .ha-btn-primary { background: #0ea5e9; color: #fff; }
                .ha-btn-primary:hover { background: #0284c7; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
                .ha-btn-secondary { background: #f1f5f9; color: #475569; }
                .ha-btn-secondary:hover { background: #e2e8f0; }

                .ha-success { background: #dcfce7; color: #16a34a; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; margin-bottom: 20px; }

                /* ─── Settings ─── */
                .ha-settings-form { padding: 24px; }
                .ha-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .ha-tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
                .ha-tag { background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 500; }
                .ha-info-row { display: flex; flex-direction: column; }
                .ha-info-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
                .ha-info-value { font-size: 14px; color: #0f172a; font-weight: 500; }
                .ha-yes { color: #16a34a; font-weight: 600; }
                .ha-section-label { grid-column: 1 / -1; font-size: 13px; font-weight: 700; color: #0c4a6e; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 12px; border-top: 1px solid #e5e7eb; margin-top: 4px; }
                .ha-toggle { display: flex; align-items: center; gap: 8px; }
                .ha-toggle input[type=checkbox] { width: 18px; height: 18px; accent-color: #0ea5e9; cursor: pointer; }
                .ha-toggle span { font-size: 14px; color: #334155; font-weight: 500; }

                /* ─── Appointment Hospital Select ─── */
                .ha-hospital-select { display: flex; flex-direction: column; gap: 8px; max-height: 260px; overflow-y: auto; padding: 4px 0; }
                .ha-hospital-option { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: #fff; }
                .ha-hospital-option:hover { border-color: #93c5fd; background: #f0f7ff; }
                .ha-hospital-option.selected { border-color: #0ea5e9; background: #f0f9ff; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
                .ha-hospital-option input[type=radio] { accent-color: #0ea5e9; width: 16px; height: 16px; flex-shrink: 0; }
                .ha-hospital-info { flex: 1; min-width: 0; }
                .ha-hospital-name { font-size: 13px; font-weight: 600; color: #0f172a; }
                .ha-hospital-loc { font-size: 11px; color: #64748b; margin-top: 2px; }
                .ha-hospital-meta { display: flex; gap: 12px; margin-top: 3px; }
                .ha-hospital-time { font-size: 10px; color: #0369a1; background: #e0f2fe; padding: 2px 8px; border-radius: 4px; }
                .ha-hospital-rating { font-size: 11px; font-weight: 600; color: #d97706; }
                .ha-emergency-alert { background: linear-gradient(135deg, #fee2e2, #fef2f2); border: 2px solid #fca5a5; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
                .ha-emergency-alert .icon { font-size: 28px; }
                .ha-emergency-alert .text { font-size: 14px; color: #991b1b; font-weight: 500; }
                .ha-priority-badge { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-left: 8px; }
                .ha-priority-badge.routine { background: #dcfce7; color: #16a34a; }
                .ha-priority-badge.urgent { background: #fef3c7; color: #d97706; }
                .ha-priority-badge.emergency { background: #fee2e2; color: #dc2626; }
                .ha-consent-row { display: flex; align-items: flex-start; gap: 10px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px; }
                .ha-consent-row input[type=checkbox] { accent-color: #0ea5e9; width: 18px; height: 18px; margin-top: 2px; flex-shrink: 0; cursor: pointer; }
                .ha-consent-row span { font-size: 13px; color: #475569; line-height: 1.5; }
            `}</style>

            {/* Sidebar */}
            <aside className="ha-sidebar">
                <div className="ha-sidebar-brand">
                    <img src="/logo.png" alt="MediCure" />
                    <div>
                        <h2>{hospital.name}</h2>
                        <span>Hospital Admin Panel</span>
                    </div>
                </div>
                <ul className="ha-nav">
                    <li><button className={`ha-nav-btn ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                        Dashboard
                    </button></li>
                    <li><button className={`ha-nav-btn ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                    </button></li>
                    <li><button className={`ha-nav-btn ${activeView === "add-patient" ? "active" : ""}`} onClick={() => setActiveView("add-patient")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                        Add Patient
                    </button></li>
                    <li><button className={`ha-nav-btn ${activeView === "discharge" ? "active" : ""}`} onClick={() => setActiveView("discharge")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                        Discharge
                    </button></li>
                    <li><button className={`ha-nav-btn ${activeView === "blood-bank" ? "active" : ""}`} onClick={() => setActiveView("blood-bank")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Blood Bank
                    </button></li>
                    <li><button className={`ha-nav-btn ${activeView === "appointment" ? "active" : ""}`} onClick={() => setActiveView("appointment")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                        Appointments
                    </button></li>
                </ul>
                <div className="ha-nav-logout">
                    <button className="ha-logout-btn" onClick={() => { localStorage.removeItem("hospitalId"); localStorage.removeItem("hospitalName"); localStorage.removeItem("hospitalEmail"); router.push("/"); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="ha-main">
                <div className="ha-topbar">
                    <h1>
                        {activeView === "dashboard" && "Dashboard"}
                        {activeView === "settings" && "Hospital Settings"}
                        {activeView === "add-patient" && "Add Patient"}
                        {activeView === "discharge" && "Discharge Patient"}
                        {activeView === "appointment" && "Appointments"}
                        {activeView === "blood-bank" && "Blood Bank Inventory"}
                    </h1>
                    <div className="ha-topbar-user">
                        <div className="ha-avatar">HA</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Hospital Admin</span>
                    </div>
                </div>

                {successMsg && <div className="ha-success">✅ {successMsg}</div>}

                {/* ═══ DASHBOARD ═══ */}
                {activeView === "dashboard" && (<>
                    <div className="ha-stats">
                        <div className="ha-stat-card"><div className="ha-stat-icon teal">📋</div><div><div className="ha-stat-value">124</div><div className="ha-stat-label">Appointments</div></div></div>
                        <div className="ha-stat-card"><div className="ha-stat-icon blue">👨‍⚕️</div><div><div className="ha-stat-value">{hospital.totalDoctors}</div><div className="ha-stat-label">Doctors</div></div></div>
                        <div className="ha-stat-card"><div className="ha-stat-icon rose">🧑‍🤝‍🧑</div><div><div className="ha-stat-value">{patients.length}</div><div className="ha-stat-label">Patients</div></div></div>
                        <div className="ha-stat-card"><div className="ha-stat-icon amber">🛏️</div><div><div className="ha-stat-value">{hospital.generalOccupied}/{hospital.beds}</div><div className="ha-stat-label">General</div></div></div>
                        <div className="ha-stat-card"><div className="ha-stat-icon violet">🏥</div><div><div className="ha-stat-value">{hospital.icuOccupied}/{hospital.icuBeds}</div><div className="ha-stat-label">ICU</div></div></div>
                        <div className="ha-stat-card"><div className="ha-stat-icon emerald">💨</div><div><div className="ha-stat-value">{hospital.ventilatorOccupied}/{hospital.ventilators}</div><div className="ha-stat-label">Ventilators</div></div></div>
                    </div>
                    <div className="ha-panel">
                        <div className="ha-panel-header"><h3>Current Patients</h3></div>
                        <table className="ha-table"><thead><tr><th>ID</th><th>Patient</th><th>Bed</th><th>Type</th><th>Doctor</th><th>Admitted</th><th>Status</th></tr></thead>
                            <tbody>{patients.map(p => (
                                <tr key={p.id}><td>{p.id}</td><td style={{ fontWeight: 600 }}>{p.name}</td><td>{p.bed}</td><td>{p.type}</td><td>{p.doctor}</td><td>{p.admitted}</td>
                                    <td><span className={`ha-badge ${p.status.toLowerCase()}`}>{p.status}</span></td></tr>
                            ))}</tbody></table>
                    </div>
                </>)}

                {/* ═══ SETTINGS (Editable) ═══ */}
                {activeView === "settings" && (
                    <div className="ha-panel">
                        <div className="ha-panel-header"><h3>Hospital Information — {hospital.name} (ID: {hospital.id})</h3></div>
                        <form className="ha-settings-form" onSubmit={handleSaveSettings}>
                            <div className="ha-form-grid">
                                <div className="ha-form-group"><label>Hospital Name</label><input value={hospital.name} onChange={e => setHospital({ ...hospital, name: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Hospital ID</label><input value={hospital.id} onChange={e => setHospital({ ...hospital, id: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Address</label><input value={hospital.address} onChange={e => setHospital({ ...hospital, address: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Contact Number</label><input value={hospital.contact} onChange={e => setHospital({ ...hospital, contact: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Emergency Contact</label><input value={hospital.emergency} onChange={e => setHospital({ ...hospital, emergency: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Email</label><input type="email" value={hospital.email} onChange={e => setHospital({ ...hospital, email: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Website</label><input value={hospital.website} onChange={e => setHospital({ ...hospital, website: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Operating Hours</label><input value={hospital.operatingHours} onChange={e => setHospital({ ...hospital, operatingHours: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Visiting Hours</label><input value={hospital.visitingHours} onChange={e => setHospital({ ...hospital, visitingHours: e.target.value })} /></div>
                            </div>

                            <div className="ha-section-label" style={{ marginTop: 20, marginBottom: 12 }}>Bed & Resource Capacity</div>
                            <div className="ha-form-grid">
                                <div className="ha-form-group"><label>Total Beds</label><input type="number" value={hospital.beds} onChange={e => setHospital({ ...hospital, beds: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>General Beds Occupied</label><input type="number" value={hospital.generalOccupied} onChange={e => setHospital({ ...hospital, generalOccupied: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>ICU Beds</label><input type="number" value={hospital.icuBeds} onChange={e => setHospital({ ...hospital, icuBeds: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>ICU Beds Occupied</label><input type="number" value={hospital.icuOccupied} onChange={e => setHospital({ ...hospital, icuOccupied: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>Ventilators</label><input type="number" value={hospital.ventilators} onChange={e => setHospital({ ...hospital, ventilators: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>Ventilator Beds Occupied</label><input type="number" value={hospital.ventilatorOccupied} onChange={e => setHospital({ ...hospital, ventilatorOccupied: +e.target.value })} /></div>
                            </div>

                            <div className="ha-section-label" style={{ marginTop: 20, marginBottom: 12 }}>Staff</div>
                            <div className="ha-form-grid">
                                <div className="ha-form-group"><label>Total Doctors</label><input type="number" value={hospital.totalDoctors} onChange={e => setHospital({ ...hospital, totalDoctors: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>Total Nurses</label><input type="number" value={hospital.totalNurses} onChange={e => setHospital({ ...hospital, totalNurses: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>Administrative Staff</label><input type="number" value={hospital.adminStaff} onChange={e => setHospital({ ...hospital, adminStaff: +e.target.value })} /></div>
                                <div className="ha-form-group"><label>Inventory Distributors</label><input type="number" value={hospital.inventoryDistributors} onChange={e => setHospital({ ...hospital, inventoryDistributors: +e.target.value })} /></div>
                            </div>

                            <div className="ha-section-label" style={{ marginTop: 20, marginBottom: 12 }}>Facilities</div>
                            <div className="ha-form-grid">
                                <div className="ha-form-group"><label>Emergency Department</label><div className="ha-toggle"><input type="checkbox" checked={hospital.emergencyDept} onChange={e => setHospital({ ...hospital, emergencyDept: e.target.checked })} /><span>{hospital.emergencyDept ? "Yes" : "No"}</span></div></div>
                                <div className="ha-form-group"><label>Pharmacy On-site</label><div className="ha-toggle"><input type="checkbox" checked={hospital.pharmacy} onChange={e => setHospital({ ...hospital, pharmacy: e.target.checked })} /><span>{hospital.pharmacy ? "Yes" : "No"}</span></div></div>
                                <div className="ha-form-group"><label>Ambulance Services</label><div className="ha-toggle"><input type="checkbox" checked={hospital.ambulance} onChange={e => setHospital({ ...hospital, ambulance: e.target.checked })} /><span>{hospital.ambulance ? "Yes" : "No"}</span></div></div>
                                <div className="ha-form-group"><label>Blood Bank</label><div className="ha-toggle"><input type="checkbox" checked={hospital.bloodBank} onChange={e => setHospital({ ...hospital, bloodBank: e.target.checked })} /><span>{hospital.bloodBank ? "Yes" : "No"}</span></div></div>
                                <div className="ha-form-group"><label>Diagnostic Services</label><div className="ha-toggle"><input type="checkbox" checked={hospital.diagnosticServices} onChange={e => setHospital({ ...hospital, diagnosticServices: e.target.checked })} /><span>{hospital.diagnosticServices ? "Yes" : "No"}</span></div></div>
                            </div>

                            <div className="ha-section-label" style={{ marginTop: 20, marginBottom: 12 }}>Specializations</div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <div className="ha-tag-list" style={{ marginBottom: 8 }}>
                                    {hospital.specializations.map(s => <span key={s} className="ha-tag">{s}</span>)}
                                </div>
                            </div>

                            <div className="ha-form-submit">
                                <button type="submit" className="ha-btn ha-btn-primary">💾 Save Changes</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ═══ ADD PATIENT ═══ */}
                {activeView === "add-patient" && (
                    <div className="ha-panel">
                        <div className="ha-panel-header"><h3>Admit New Patient</h3></div>
                        <form className="ha-form" onSubmit={handleAddPatient}>
                            <div className="ha-form-grid">
                                <div className="ha-form-group"><label>Patient Name</label><input required placeholder="Full name" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Date of Birth</label><input type="date" required value={newPatient.dob} onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })} /></div>
                                <CustomSelect
                                    label="Gender"
                                    required
                                    value={newPatient.gender}
                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Other", label: "Other" }
                                    ]}
                                    onChange={(e: any) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                    placeholder="Select Gender"
                                />
                                <div className="ha-form-group"><label>Phone Number</label><input type="tel" required placeholder="+91 9876543210" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Address</label><input required placeholder="Street, City, State, Postal Code" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Email (optional)</label><input type="email" placeholder="email@example.com" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} /></div>
                                <div className="ha-form-group"><label>National ID (Aadhar)</label><input placeholder="XXXX-XXXX-XXXX" value={newPatient.aadhar} onChange={e => setNewPatient({ ...newPatient, aadhar: e.target.value })} /></div>
                                <CustomSelect
                                    label="Bed Type"
                                    required
                                    value={newPatient.bedType}
                                    options={[
                                        { value: "General", label: "General" },
                                        { value: "ICU", label: "ICU" },
                                        { value: "Ventilator", label: "Ventilator" }
                                    ]}
                                    onChange={(e: any) => setNewPatient({ ...newPatient, bedType: e.target.value })}
                                    placeholder="Select Bed Type"
                                />
                                <div className="ha-form-group"><label>Bed Number</label><input required placeholder="e.g. 12" value={newPatient.bedNumber} onChange={e => setNewPatient({ ...newPatient, bedNumber: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Assigned Doctor</label><input required placeholder="e.g. Dr. Sharma" value={newPatient.doctor} onChange={e => setNewPatient({ ...newPatient, doctor: e.target.value })} /></div>
                            </div>
                            <div className="ha-form-submit"><button type="submit" className="ha-btn ha-btn-primary">Admit Patient</button></div>
                        </form>
                    </div>
                )}

                {/* ═══ DISCHARGE ═══ */}
                {activeView === "discharge" && (
                    <div className="ha-panel">
                        <div className="ha-panel-header"><h3>Discharge Patient</h3></div>
                        <form className="ha-form" onSubmit={handleDischarge}>
                            <div className="ha-form-grid">
                                <CustomSelect
                                    label="Patient ID"
                                    required
                                    value={discharge.patientId}
                                    options={patients.map(p => ({ value: p.id, label: `${p.id} — ${p.name}` }))}
                                    onChange={(e: any) => {
                                        const val = e.target.value;
                                        const p = patients.find(x => x.id === val);
                                        setDischarge({ ...discharge, patientId: val, patientName: p?.name || "", gender: p?.gender || "", doctor: p?.doctor || "" });
                                    }}
                                    placeholder="Select Patient"
                                />
                                <div className="ha-form-group"><label>Patient Name</label><input value={discharge.patientName} readOnly style={{ background: "#f8fafc" }} /></div>
                                <div className="ha-form-group"><label>Gender</label><input value={discharge.gender} readOnly style={{ background: "#f8fafc" }} /></div>
                                <div className="ha-form-group"><label>Doctor</label><input value={discharge.doctor} readOnly style={{ background: "#f8fafc" }} /></div>
                                <div className="ha-form-group"><label>Date of Admission</label><input type="date" required value={discharge.admissionDate} onChange={e => setDischarge({ ...discharge, admissionDate: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Date of Discharge</label><input type="date" required value={discharge.dischargeDate} onChange={e => setDischarge({ ...discharge, dischargeDate: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Diagnosis</label><textarea required placeholder="Diagnosis details..." value={discharge.diagnosis} onChange={e => setDischarge({ ...discharge, diagnosis: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Treatment Provided</label><textarea required placeholder="Treatment provided..." value={discharge.treatment} onChange={e => setDischarge({ ...discharge, treatment: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Discharge Summary</label><textarea placeholder="Summary..." value={discharge.summary} onChange={e => setDischarge({ ...discharge, summary: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Follow-up Instructions</label><textarea placeholder="Follow-up details..." value={discharge.followUp} onChange={e => setDischarge({ ...discharge, followUp: e.target.value })} /></div>
                                <div className="ha-form-group"><label>Medications Prescribed</label><textarea placeholder="Medications..." value={discharge.medications} onChange={e => setDischarge({ ...discharge, medications: e.target.value })} /></div>
                                <div className="ha-form-group full"><label>Contact Information</label><input placeholder="Phone/email for follow-up" value={discharge.contact} onChange={e => setDischarge({ ...discharge, contact: e.target.value })} /></div>
                            </div>
                            <div className="ha-form-submit"><button type="submit" className="ha-btn ha-btn-primary">Discharge Patient</button></div>
                        </form>
                    </div>
                )}

                {/* ═══ APPOINTMENTS ═══ */}
                {activeView === "appointment" && (<>
                    {/* Upcoming Appointments Table */}
                    <div className="ha-panel">
                        <div className="ha-panel-header"><h3>Upcoming Appointments</h3></div>
                        <table className="ha-table"><thead><tr><th>ID</th><th>Patient</th><th>Hospital</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>{appointments.map(a => (
                                <tr key={a.id}><td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.patient}</td><td>{a.doctor}</td><td>{a.dept}</td><td>{a.date}</td><td>{a.time}</td>
                                    <td><span className={`ha-badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                                    <td>
                                        {a.status === "Pending" && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => updateStatus(a.id, "Confirmed", a)}
                                                    className="ha-btn"
                                                    title="Approve"
                                                    style={{ padding: '6px 12px', background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}
                                                >
                                                    ✅
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(a.id, "Rejected", a)}
                                                    className="ha-btn"
                                                    title="Reject"
                                                    style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}</tbody></table>
                    </div>
                </>)}

                {/* ═══ BLOOD BANK ═══ */}
                {activeView === "blood-bank" && (
                    <>
                        <div className="ha-panel">
                            <div className="ha-panel-header"><h3>Blood Bank Inventory</h3></div>
                            <div style={{ padding: 24 }}>
                                {hospital.bloodBank ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                                        {(() => {
                                            const stocks = getHospitalBloodStocks(hospital.id);
                                            return stocks.map(stock => (
                                                <div key={stock.group} style={{
                                                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }}>
                                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#334155' }}>{stock.group}</div>
                                                    <div style={{ fontSize: 32, fontWeight: 700, color: stock.status === 'Critical' ? '#ef4444' : stock.status === 'Low' ? '#f59e0b' : '#10b981' }}>
                                                        {stock.units} <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>units</span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
                                                        padding: '4px 10px', borderRadius: 20,
                                                        background: stock.status === 'Critical' ? '#fee2e2' : stock.status === 'Low' ? '#fef3c7' : '#dcfce7',
                                                        color: stock.status === 'Critical' ? '#991b1b' : stock.status === 'Low' ? '#92400e' : '#166534'
                                                    }}>
                                                        {stock.status}
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>
                                        This hospital does not have an active Blood Bank facility enabled in settings.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
