"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User, Calendar, Phone, MapPin, Clock, Star, AlertTriangle,
    Shield, CheckCircle, ArrowLeft, ClipboardList, Stethoscope, Building2,
    FileText, Activity
} from "lucide-react";
import { hospitals } from "@/lib/hospitals";

// Use shared hospital list
const hospitalList = hospitals;

const defaultForm = {
    fullName: "", dob: "", gender: "", mobile: "",
    dept: "", symptoms: "", priority: "Routine",
    hospital: "", isEmergency: false, consent: false,
    date: "", time: "",
};

const CustomSelect = ({ label, value, options, onChange, required = false, placeholder = "Select" }: any) => {
    return (
        <div className="ap-field">
            <label>{label}</label>
            <select
                value={value}
                onChange={onChange}
                required={required}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontFamily: "'Inter', sans-serif", outline: 'none', background: '#fff' }}
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

export default function AppointmentPage() {
    const [form, setForm] = useState(defaultForm);
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();

    const showMsg = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 4000); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.isEmergency) {
            setSuccessMsg("Emergency case detected — redirecting...");
            setTimeout(() => router.push("/"), 2000);
            return;
        }
        if (!form.consent) { showMsg("Please confirm the consent checkbox before proceeding."); return; }

        // Find the selected hospital
        const selectedHospital = hospitalList.find(h => h.name === form.hospital);
        if (!selectedHospital) { showMsg("Please select a hospital."); return; }

        // Create appointment object
        const appointment = {
            id: `A${Date.now()}`,
            patient: form.fullName,
            dob: form.dob,
            gender: form.gender,
            mobile: form.mobile,
            dept: form.dept,
            symptoms: form.symptoms,
            priority: form.priority,
            hospitalId: selectedHospital.id,
            hospitalName: selectedHospital.name,
            date: form.date,
            time: form.time,
            status: "Pending",
            bookedAt: new Date().toISOString(),
        };

        // Save to localStorage keyed by hospitalId
        const storageKey = `appointments_${selectedHospital.id}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        existing.push(appointment);
        localStorage.setItem(storageKey, JSON.stringify(existing));

        showMsg(`Appointment booked at ${selectedHospital.name} for ${form.fullName}.`);
        setTimeout(() => setForm(defaultForm), 4000);
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="ap-root">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                .ap-root { font-family: 'Inter', sans-serif; min-height: 100vh; background: #f4f6f9; }

                /* ── Top Bar ── */
                .ap-header {
                    background: #fff; border-bottom: 1px solid #e2e8f0;
                    padding: 12px 40px; display: flex; justify-content: space-between; align-items: center;
                }
                .ap-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f172a; }
                .ap-brand-icon { height: 32px; width: auto; }
                .ap-brand-icon img { height: 100%; width: auto; object-fit: contain; }
                .ap-brand h3 { margin: 0; font-size: 16px; font-weight: 700; }
                .ap-brand span { font-size: 11px; color: #94a3b8; font-weight: 400; }
                .ap-back {
                    display: flex; align-items: center; gap: 6px;
                    padding: 7px 16px; border-radius: 6px; border: 1px solid #e2e8f0;
                    color: #475569; font-size: 13px; font-weight: 500; text-decoration: none;
                    transition: all 0.15s;
                }
                .ap-back:hover { background: #f1f5f9; border-color: #cbd5e1; }

                /* ── Page Title ── */
                .ap-title-row {
                    padding: 24px 40px 0; display: flex; align-items: center; gap: 12px;
                }
                .ap-title-row h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0; }
                .ap-title-row p { font-size: 13px; color: #64748b; margin: 2px 0 0; }

                /* ── Main Grid ── */
                .ap-body { padding: 20px 40px 50px; }
                .ap-main-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
                }

                /* ── Panels ── */
                .ap-panel {
                    background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
                    /* overflow: hidden; REMOVED to allow dropdowns to pop out */
                }
                .ap-panel-head {
                    padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
                    display: flex; align-items: center; gap: 10px;
                    background: #fafbfc;
                    border-radius: 10px 10px 0 0; /* Add radius back manually since overflow is gone */
                }
                .ap-panel-head .icon-wrap {
                    width: 28px; height: 28px; border-radius: 6px; display: flex;
                    align-items: center; justify-content: center; flex-shrink: 0;
                }
                .ap-panel-head .icon-wrap.blue { background: #dbeafe; color: #2563eb; }
                .ap-panel-head .icon-wrap.teal { background: #ccfbf1; color: #0d9488; }
                .ap-panel-head .icon-wrap.amber { background: #fef3c7; color: #d97706; }
                .ap-panel-head .icon-wrap.rose { background: #ffe4e6; color: #e11d48; }
                .ap-panel-head .icon-wrap.violet { background: #ede9fe; color: #7c3aed; }
                .ap-panel-head h3 { font-size: 14px; font-weight: 600; color: #1e293b; margin: 0; }
                .ap-panel-body { padding: 18px 20px; }

                /* ── Fields ── */
                .ap-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .ap-field { display: flex; flex-direction: column; position: relative; } /* Added position relative */
                .ap-field.full { grid-column: 1 / -1; }
                .ap-field label {
                    font-size: 11px; font-weight: 600; color: #475569;
                    text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 5px;
                }
                .ap-field input, .ap-field textarea {
                    padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 6px;
                    font-size: 13px; font-family: 'Inter', sans-serif; outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s; background: #fff;
                }
                .ap-field input:focus, .ap-field textarea:focus {
                    border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
                }
                .ap-field textarea { min-height: 72px; resize: vertical; }



                /* ── Priority Indicators ── */
                .ap-pri {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
                    margin-left: 6px; vertical-align: middle;
                }
                .ap-pri.routine { background: #dcfce7; color: #16a34a; }
                .ap-pri.urgent { background: #fef3c7; color: #d97706; }
                .ap-pri.emergency { background: #fee2e2; color: #dc2626; }

                /* ── Hospital List ── */
                .ap-hosp-list {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
                    max-height: 340px; overflow-y: auto;
                }
                .ap-hosp-card {
                    display: flex; align-items: flex-start; gap: 10px;
                    padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
                    cursor: pointer; transition: all 0.15s; background: #fff;
                }
                .ap-hosp-card:hover { border-color: #93c5fd; background: #f8faff; }
                .ap-hosp-card.sel {
                    border-color: #3b82f6; background: #eff6ff;
                    box-shadow: 0 0 0 2px rgba(59,130,246,0.08);
                }
                .ap-hosp-card input[type=radio] { accent-color: #3b82f6; margin-top: 3px; flex-shrink: 0; }
                .ap-hosp-info { flex: 1; min-width: 0; }
                .ap-hosp-name { font-size: 12px; font-weight: 600; color: #1e293b; line-height: 1.3; }
                .ap-hosp-loc { font-size: 10px; color: #64748b; margin-top: 2px; display: flex; align-items: center; gap: 3px; }
                .ap-hosp-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
                .ap-hosp-time { font-size: 9px; color: #0284c7; background: #e0f2fe; padding: 1px 6px; border-radius: 3px; }
                .ap-hosp-stars { font-size: 10px; font-weight: 600; color: #d97706; display: flex; align-items: center; gap: 2px; }

                /* ── Emergency Banner ── */
                .ap-emg-banner {
                    background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;
                    padding: 12px 16px; margin-bottom: 16px;
                    display: flex; align-items: center; gap: 10px;
                    color: #991b1b; font-size: 13px; font-weight: 500;
                }

                /* ── Consent ── */
                .ap-consent {
                    display: flex; align-items: flex-start; gap: 10px;
                    padding: 14px 16px; background: #f8fafc; border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                .ap-consent input[type=checkbox] {
                    accent-color: #3b82f6; width: 16px; height: 16px;
                    margin-top: 1px; flex-shrink: 0; cursor: pointer;
                }
                .ap-consent span { font-size: 12px; color: #475569; line-height: 1.5; }

                /* ── Submit ── */
                .ap-actions { margin-top: 20px; display: flex; gap: 12px; }
                .ap-btn {
                    padding: 10px 24px; border: none; border-radius: 8px;
                    font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: all 0.15s; font-family: 'Inter', sans-serif;
                    display: flex; align-items: center; gap: 8px;
                }
                .ap-btn-blue { background: #2563eb; color: #fff; }
                .ap-btn-blue:hover { background: #1d4ed8; }
                .ap-btn-red { background: #dc2626; color: #fff; }
                .ap-btn-red:hover { background: #b91c1c; }

                /* ── Toast ── */
                .ap-toast {
                    position: fixed; top: 20px; right: 20px; z-index: 999;
                    background: #fff; border-radius: 8px; padding: 14px 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-left: 3px solid #2563eb;
                    font-size: 13px; font-weight: 500; color: #1e293b; max-width: 380px;
                    display: flex; align-items: center; gap: 8px;
                    animation: apSlide 0.25s ease;
                }
                @keyframes apSlide { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

                /* ── Full-width bottom panel ── */
                .ap-full-row { grid-column: 1 / -1; }

                /* ── Responsive ── */
                @media (max-width: 900px) {
                    .ap-main-grid { grid-template-columns: 1fr; }
                    .ap-hosp-list { grid-template-columns: 1fr; }
                    .ap-header, .ap-title-row, .ap-body { padding-left: 20px; padding-right: 20px; }
                }
            `}</style>

            {/* Toast */}
            {successMsg && <div className="ap-toast"><CheckCircle size={16} color="#2563eb" />{successMsg}</div>}

            {/* Header */}
            <header className="ap-header">
                <Link href="/" className="ap-brand">
                    <div className="ap-brand-icon"><img src="/logo.png" alt="MediCure" /></div>
                    <div>
                        <h3>MediCure</h3>
                        <span>Smart Hospital System</span>
                    </div>
                </Link>
                <Link href="/" className="ap-back"><ArrowLeft size={14} /> Back to Home</Link>
            </header>

            {/* Title */}
            <div className="ap-title-row">
                <div>
                    <h1>Book Appointment</h1>
                    <p>Fill in your details below to schedule a visit at your preferred hospital.</p>
                </div>
            </div>

            {/* Emergency Banner */}
            {form.isEmergency && (
                <div style={{ padding: "0 40px", marginTop: 16 }}>
                    <div className="ap-emg-banner">
                        <AlertTriangle size={18} />
                        Emergency case detected. Upon submission, you will be redirected for immediate assistance.
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="ap-body">
                    <div className="ap-main-grid">

                        {/* ── Panel 1: Patient Information ── */}
                        <div className="ap-panel">
                            <div className="ap-panel-head">
                                <div className="icon-wrap blue"><User size={15} /></div>
                                <h3>Patient Information</h3>
                            </div>
                            <div className="ap-panel-body">
                                <div className="ap-fields">
                                    <div className="ap-field"><label>Full Name</label><input required placeholder="Enter full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
                                    <div className="ap-field"><label>Date of Birth</label><input type="date" required value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                                    <CustomSelect
                                        label="Gender"
                                        data-required
                                        value={form.gender}
                                        options={[
                                            { value: "Male", label: "Male" },
                                            { value: "Female", label: "Female" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                        onChange={(e: any) => setForm({ ...form, gender: e.target.value })}
                                        placeholder="Select Gender"
                                    />
                                    <div className="ap-field"><label>Mobile Number</label><input type="tel" required placeholder="+91 9876543210" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} /></div>
                                </div>
                            </div>
                        </div>

                        {/* ── Panel 2: Medical Details ── */}
                        <div className="ap-panel">
                            <div className="ap-panel-head">
                                <div className="icon-wrap teal"><Stethoscope size={15} /></div>
                                <h3>Medical Details</h3>
                            </div>
                            <div className="ap-panel-body">
                                <div className="ap-fields">
                                    <CustomSelect
                                        label="Department / Speciality"
                                        value={form.dept}
                                        options={[
                                            { value: "General Medicine", label: "General Medicine" },
                                            { value: "Orthopaedics", label: "Orthopaedics" },
                                            { value: "Cardiology", label: "Cardiology" },
                                            { value: "Paediatrics", label: "Paediatrics" },
                                            { value: "Gynaecology", label: "Gynaecology" },
                                            { value: "Neurology", label: "Neurology" },
                                            { value: "ENT", label: "ENT" },
                                            { value: "Dermatology", label: "Dermatology" },
                                            { value: "Emergency", label: "🚨 Emergency" }
                                        ]}
                                        onChange={(e: any) => {
                                            const v = e.target.value;
                                            if (v === "Emergency") setForm({ ...form, dept: v, isEmergency: true, priority: "Emergency" });
                                            else setForm({ ...form, dept: v, isEmergency: false });
                                        }}
                                        placeholder="Select Department"
                                    />
                                    <CustomSelect
                                        label={<span>Priority Level {form.priority && <span className={`ap-pri ${form.priority.toLowerCase()}`}>{form.priority}</span>}</span>}
                                        value={form.priority}
                                        options={[
                                            { value: "Routine", label: "🟢 Routine" },
                                            { value: "Urgent", label: "🟡 Urgent" },
                                            { value: "Emergency", label: "🔴 Emergency" }
                                        ]}
                                        onChange={(e: any) => setForm({ ...form, priority: e.target.value })}
                                        placeholder="Select Priority"
                                    />
                                    <div className="ap-field full"><label>Symptoms / Reason for Visit</label><textarea required placeholder="Describe symptoms, complaints, or reason for the visit..." value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} /></div>
                                </div>
                            </div>
                        </div>

                        {/* ── Panel 3: Appointment Preferences ── */}
                        <div className="ap-panel">
                            <div className="ap-panel-head">
                                <div className="icon-wrap amber"><Calendar size={15} /></div>
                                <h3>Appointment Preferences</h3>
                            </div>
                            <div className="ap-panel-body">
                                <div className="ap-fields">
                                    <div className="ap-field"><label>Preferred Date</label><input type="date" required min={today} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                                    <div className="ap-field"><label>Preferred Time Slot</label><input type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
                                </div>
                            </div>
                        </div>

                        {/* ── Panel 4: Safety & Validation ── */}
                        <div className="ap-panel">
                            <div className="ap-panel-head">
                                <div className="icon-wrap rose"><Shield size={15} /></div>
                                <h3>Safety & Validation</h3>
                            </div>
                            <div className="ap-panel-body">
                                <div className="ap-fields">
                                    <CustomSelect
                                        label="Is this an Emergency Case?"
                                        value={form.isEmergency ? "yes" : "no"}
                                        options={[
                                            { value: "no", label: "No" },
                                            { value: "yes", label: "🚨 Yes — Redirect to Emergency" }
                                        ]}
                                        onChange={(e: any) => {
                                            const isEm = e.target.value === "yes";
                                            setForm({ ...form, isEmergency: isEm, priority: isEm ? "Emergency" : form.priority });
                                        }}
                                        placeholder="Select"
                                    />
                                </div>
                                <div className="ap-consent" style={{ marginTop: 14 }}>
                                    <input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />
                                    <span>I confirm that all the information provided is <strong>accurate and complete</strong>. I understand that incorrect information may delay treatment or affect quality of care.</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Panel 5: Hospital Selection (Full Width) ── */}
                        <div className="ap-panel ap-full-row">
                            <div className="ap-panel-head">
                                <div className="icon-wrap violet"><Building2 size={15} /></div>
                                <h3>Hospital Selection</h3>
                            </div>
                            <div className="ap-panel-body">
                                <div className="ap-hosp-list">
                                    {hospitalList.map(h => (
                                        <label key={h.name} className={`ap-hosp-card ${form.hospital === h.name ? 'sel' : ''}`}>
                                            <input type="radio" name="hospital" value={h.name} checked={form.hospital === h.name} onChange={e => setForm({ ...form, hospital: e.target.value })} />
                                            <div className="ap-hosp-info">
                                                <div className="ap-hosp-name">{h.name}</div>
                                                <div className="ap-hosp-loc"><MapPin size={10} /> {h.location}</div>
                                                <div className="ap-hosp-meta">
                                                    <span className="ap-hosp-time"><Clock size={8} style={{ marginRight: 2, verticalAlign: 'middle' }} />{h.timings}</span>
                                                    <span className="ap-hosp-stars"><Star size={10} /> {h.rating}/5</span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="ap-actions">
                        {form.isEmergency
                            ? <button type="submit" className="ap-btn ap-btn-red"><AlertTriangle size={16} /> Redirect to Emergency</button>
                            : <button type="submit" className="ap-btn ap-btn-blue"><ClipboardList size={16} /> Book Appointment</button>
                        }
                    </div>
                </div>
            </form>
        </div>
    );
}
