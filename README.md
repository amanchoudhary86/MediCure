# MediCure - Smart Hospital Management System

MediCure is a comprehensive, real-time hospital management and resource tracking system designed to bridge the gap in critical care availability. It provides a unified platform for patients, hospital administrators, and central control authorities to track bed availability, blood bank inventory, and facilitate emergency admissions.

## 🚀 Key Features

### 🏥 Public Portal
- **Real-Time Bed Availability**: View live status of General, ICU, and Ventilator beds across multiple government hospitals in Jaipur.
- **Blood Bank Dashboard**: Instant visibility into blood stock levels (A+, B+, O+, etc.) at various blood banks.
- **Unified Login**: Single entry point for Hospital Admins and Central Control (Super Admin).
- ** responsive Design**: Modern, premium UI optimized for all devices.

### 👨‍💼 Hospital Admin Dashboard
- **Bed Management**: Update bed status (Free/Occupied) instantly.
- **Patient Admission**: Admit patients directly to specific wards; data persists across sessions.
- **Blood Inventory**: Manage blood unit counts in real-time.
- **Live Sync**: Changes made here immediately reflect on the public portal.

### 🌐 Central Control (Super Admin)
- **City-Wide Overview**: Aggregated view of all registered hospitals.
- **Live Stat Counters**: Real-time total active hospitals, total beds, and average occupancy rates.
- **Hospital List**: Detailed list of hospitals with location and occupancy metrics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Custom CSS modules, Glassmorphism effects
- **State Management**: React `useState`, `useEffect`, Custom Events for real-time sync
- **Persistence**: LocalStorage (for demo purposes)

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/medicure-nextjs.git
    cd medicure-nextjs
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🔑 Demo Credentials

To explore the admin features, use the following demo credentials. You can also download the [Admin Credentials Excel](./public/admin_credentials.xlsx) from the login page.

### Hospital Admin (City Care Hospital)
- **Username**: `admin_citycare`
- **Password**: `Citycare@2026`

### Super Admin (Central Control)
- **Username**: `admin`
- **Password**: `admin123`

## 📂 Project Structure

- `src/app`: Next.js App Router pages (Home, Login, Dashboards)
- `src/components`: Reusable UI components (Navbar, Footer, Stats)
- `src/lib`: Utility functions and mock data (`bed-data.ts`, `hospitals.ts`)
- `public`: Static assets (images, logos)

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

---

**MediCure** — Saving lives when every second counts.
