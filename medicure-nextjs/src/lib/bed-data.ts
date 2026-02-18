export type BedStatus = "free" | "occupied" | "requested";

export interface Bed {
    id: string;
    label: string;
    status: BedStatus;
    ward: "General" | "ICU" | "Ventilator";
}

export interface HospitalBeds {
    hospitalId: string;
    beds: Bed[];
    lastUpdated: number;
}

// Helper to generate initial random beds if none exist
function generateInitialBeds(hospitalId: string): Bed[] {
    const beds: Bed[] = [];

    // General Ward (150 beds)
    // Randomize occupancy: ~60% occupied
    for (let i = 1; i <= 150; i++) {
        const isOccupied = Math.random() < 0.6;
        beds.push({
            id: `G-${i}`,
            label: `G-${i}`,
            status: isOccupied ? "occupied" : "free",
            ward: "General"
        });
    }

    // ICU Ward (50 beds)
    // ~75% occupied
    for (let i = 1; i <= 50; i++) {
        const isOccupied = Math.random() < 0.75;
        beds.push({
            id: `ICU-${i}`,
            label: `ICU-${i}`,
            status: isOccupied ? "occupied" : "free",
            ward: "ICU"
        });
    }

    // Ventilator Ward (20 beds)
    // ~80% occupied
    for (let i = 1; i <= 20; i++) {
        const isOccupied = Math.random() < 0.8;
        beds.push({
            id: `V-${i}`,
            label: `V-${i}`,
            status: isOccupied ? "occupied" : "free",
            ward: "Ventilator"
        });
    }

    return beds;
}

const STORAGE_KEY_PREFIX = "medicure_beds_";

export function getHospitalBeds(hospitalId: string): Bed[] {
    if (typeof window === "undefined") return [];

    const key = `${STORAGE_KEY_PREFIX}${hospitalId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
        try {
            const data: HospitalBeds = JSON.parse(stored);
            // Optionally check for expiry or just return
            return data.beds;
        } catch (e) {
            console.error("Failed to parse bed data", e);
        }
    }

    // Initialize if not found
    const initialBeds = generateInitialBeds(hospitalId);
    saveHospitalBeds(hospitalId, initialBeds);
    return initialBeds;
}

export function saveHospitalBeds(hospitalId: string, beds: Bed[]) {
    if (typeof window === "undefined") return;

    const key = `${STORAGE_KEY_PREFIX}${hospitalId}`;
    const data: HospitalBeds = {
        hospitalId,
        beds,
        lastUpdated: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Dispatch event for cross-component updates within same window
    window.dispatchEvent(new Event("medicure-bed-update"));
}

export function getBedStats(beds: Bed[]) {
    return {
        general: {
            total: beds.filter(b => b.ward === "General").length,
            occupied: beds.filter(b => b.ward === "General" && b.status === "occupied").length,
            free: beds.filter(b => b.ward === "General" && b.status === "free").length,
            requested: beds.filter(b => b.ward === "General" && b.status === "requested").length,
        },
        icu: {
            total: beds.filter(b => b.ward === "ICU").length,
            occupied: beds.filter(b => b.ward === "ICU" && b.status === "occupied").length,
            free: beds.filter(b => b.ward === "ICU" && b.status === "free").length,
            requested: beds.filter(b => b.ward === "ICU" && b.status === "requested").length,
        },
        ventilator: {
            total: beds.filter(b => b.ward === "Ventilator").length,
            occupied: beds.filter(b => b.ward === "Ventilator" && b.status === "occupied").length,
            free: beds.filter(b => b.ward === "Ventilator" && b.status === "free").length,
            requested: beds.filter(b => b.ward === "Ventilator" && b.status === "requested").length,
        }
    };
}
