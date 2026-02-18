"use client";

import { useState, useEffect } from "react";

const features = [
    {
        icon: "🛏️",
        title: "Smart Bed Allocation",
        desc: "Track and allocate hospital beds in real-time across departments, reducing wait times and maximizing occupancy.",
    },
    {
        icon: "🩸",
        title: "Blood Bank Integration",
        desc: "Monitor blood unit availability across hospitals with instant alerts for critical shortages and donation drives.",
    },
    {
        icon: "🚑",
        title: "Emergency Response",
        desc: "Instant emergency notifications to the nearest available hospitals with live ambulance tracking and routing.",
    },
    {
        icon: "👨‍⚕️",
        title: "Doctor Coordination",
        desc: "Seamless scheduling and communication between specialists, ensuring patients get timely consultations.",
    },
];

const WhyChoose = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section
            style={{
                padding: "100px 0",
                background: "linear-gradient(135deg, #f8fafc 0%, #e8f4f8 50%, #f0fdf4 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative background elements */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(13,115,119,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "-80px",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(13,115,119,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div className="container" style={{ position: "relative", zIndex: 1 }}>
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            color: "#0d7377",
                            marginBottom: "14px",
                            background: "rgba(13,115,119,0.08)",
                            padding: "6px 20px",
                            borderRadius: "30px",
                        }}
                    >
                        Why MediCure?
                    </span>
                    <h2
                        style={{
                            fontSize: "36px",
                            fontWeight: 700,
                            color: "#1a2332",
                            lineHeight: "1.3",
                            margin: "0 auto",
                            maxWidth: "650px",
                        }}
                    >
                        Transforming Hospital Operations Through{" "}
                        <span style={{ color: "#0d7377" }}>Intelligent Technology</span>
                    </h2>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#5a6577",
                            marginTop: "16px",
                            maxWidth: "560px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            lineHeight: "1.7",
                        }}
                    >
                        Indian hospitals lose countless hours daily to manual coordination. MediCure bridges
                        the gap between outdated systems and modern, data-driven healthcare management.
                    </p>
                </div>

                {/* Main Content Row */}
                <div className="row" style={{ alignItems: "center" }}>
                    {/* Left — Mission Statement */}
                    <div className="col-lg-5 col-12" style={{ marginBottom: "40px" }}>
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "20px",
                                padding: "40px 35px",
                                boxShadow: "0 8px 40px rgba(13,115,119,0.08)",
                                border: "1px solid rgba(13,115,119,0.06)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Accent stripe */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "5px",
                                    height: "100%",
                                    background: "linear-gradient(to bottom, #0d7377, #14919b)",
                                    borderRadius: "20px 0 0 20px",
                                }}
                            />
                            <h3
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 700,
                                    color: "#1a2332",
                                    marginBottom: "18px",
                                    lineHeight: "1.3",
                                }}
                            >
                                Our Mission
                            </h3>
                            <p
                                style={{
                                    fontSize: "15px",
                                    color: "#5a6577",
                                    lineHeight: "1.8",
                                    marginBottom: "20px",
                                }}
                            >
                                Every minute counts in healthcare. Yet hospitals across India still
                                struggle with fragmented bed management, delayed emergency responses,
                                and manual blood bank tracking — leading to preventable patient distress.
                            </p>
                            <p
                                style={{
                                    fontSize: "15px",
                                    color: "#5a6577",
                                    lineHeight: "1.8",
                                    marginBottom: "28px",
                                }}
                            >
                                <strong style={{ color: "#1a2332" }}>MediCure</strong> is built to solve
                                exactly this — a centralized, intelligent platform that connects hospitals,
                                doctors, and patients in real-time, ensuring no bed goes unnoticed, no
                                emergency goes unanswered, and no resource is wasted.
                            </p>

                            {/* Stats row */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {[
                                    { num: "40%", label: "Faster Bed Allocation" },
                                    { num: "3x", label: "Emergency Response" },
                                    { num: "24/7", label: "Live Monitoring" },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: "1 1 80px",
                                            textAlign: "center",
                                            padding: "14px 8px",
                                            background: "rgba(13,115,119,0.04)",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "22px",
                                                fontWeight: 800,
                                                color: "#0d7377",
                                            }}
                                        >
                                            {stat.num}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "11px",
                                                color: "#5a6577",
                                                marginTop: "4px",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video Section */}
                        {isMounted && (
                            <div
                                style={{
                                    marginTop: "24px",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    position: "relative",
                                    background: "linear-gradient(135deg, #0d7377, #14919b)",
                                    height: "220px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 8px 40px rgba(13,115,119,0.15)",
                                }}
                            >
                                {/* Background pattern */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        opacity: 0.08,
                                        backgroundImage:
                                            "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
                                        backgroundSize: "40px 40px",
                                    }}
                                />
                                {/* Label */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "18px",
                                        left: "24px",
                                        color: "rgba(255,255,255,0.85)",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                >
                                    ▶ Watch How MediCure Works
                                </div>
                                {/* Play Button */}
                                <a
                                    href="https://youtu.be/ga_-T9IUmsk"
                                    className="video-popup mfp-iframe"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.95)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 25px rgba(0,0,0,0.2)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        position: "relative",
                                        zIndex: 2,
                                        textDecoration: "none",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
                                        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 35px rgba(0,0,0,0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 25px rgba(0,0,0,0.2)";
                                    }}
                                >
                                    <i
                                        className="fa fa-play"
                                        style={{
                                            fontSize: "22px",
                                            color: "#0d7377",
                                            marginLeft: "4px",
                                        }}
                                    ></i>
                                </a>
                                {/* Animated rings */}
                                <div
                                    className="waves-block"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <div className="waves wave-1"></div>
                                    <div className="waves wave-2"></div>
                                    <div className="waves wave-3"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Feature Cards */}
                    <div className="col-lg-7 col-12">
                        <div className="row">
                            {features.map((feature, index) => (
                                <div key={index} className="col-md-6" style={{ marginBottom: "24px" }}>
                                    <div
                                        style={{
                                            background: "#fff",
                                            borderRadius: "16px",
                                            padding: "30px 24px",
                                            height: "100%",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                                            border: "1px solid rgba(13,115,119,0.06)",
                                            transition: "all 0.3s ease",
                                            cursor: "default",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 35px rgba(13,115,119,0.12)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "52px",
                                                height: "52px",
                                                borderRadius: "14px",
                                                background: "linear-gradient(135deg, #0d7377, #14919b)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "18px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "26px",
                                                }}
                                            >{feature.icon}</span>
                                        </div>
                                        <h4
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: 700,
                                                color: "#1a2332",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {feature.title}
                                        </h4>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: "#6b7a8d",
                                                lineHeight: "1.65",
                                                margin: 0,
                                            }}
                                        >
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
