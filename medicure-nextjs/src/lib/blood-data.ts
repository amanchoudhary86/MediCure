import { hospitalBloodBanks, type BloodGroup, type StockStatus, type BloodStock } from "./bloodBanks";

// Re-export types for convenience
export type { BloodGroup, StockStatus, BloodStock };

export interface HospitalBloodInfo {
    hospitalId: string;
    lastUpdated: number;
    stocks: BloodStock[];
}

const STORAGE_KEY_PREFIX = "medicure_blood_";

// Helper to get stock status based on units
export function getStockStatus(units: number): StockStatus {
    if (units >= 15) return "Available";
    if (units >= 5) return "Low";
    return "Critical";
}

export function getHospitalBloodStocks(hospitalId: string): BloodStock[] {
    if (typeof window === "undefined") return [];

    const key = `${STORAGE_KEY_PREFIX}${hospitalId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
        try {
            const data: HospitalBloodInfo = JSON.parse(stored);
            return data.stocks;
        } catch (e) {
            console.error("Failed to parse blood data", e);
        }
    }

    // Initialize with static data if available
    const staticData = hospitalBloodBanks.find(h => h.hospitalId === hospitalId);
    if (staticData) {
        saveHospitalBloodStocks(hospitalId, staticData.stocks);
        return staticData.stocks;
    }

    // Fallback if no static data found (e.g. new hospital)
    // Initialize with random values
    const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const now = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    const initialStocks = groups.map(g => {
        const units = Math.floor(Math.random() * 20) + 1; // 1-20 units
        return {
            group: g,
            units,
            status: getStockStatus(units),
            lastUpdated: now
        };
    });

    saveHospitalBloodStocks(hospitalId, initialStocks);
    return initialStocks;
}

export function saveHospitalBloodStocks(hospitalId: string, stocks: BloodStock[]) {
    if (typeof window === "undefined") return;

    const key = `${STORAGE_KEY_PREFIX}${hospitalId}`;
    const data: HospitalBloodInfo = {
        hospitalId,
        lastUpdated: Date.now(),
        stocks
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Dispatch event
    window.dispatchEvent(new Event("medicure-blood-update"));
}

export function getTotalBloodUnits(stocks: BloodStock[]): number {
    return stocks.reduce((sum, s) => sum + s.units, 0);
}

export function getCriticalBloodCount(stocks: BloodStock[]): number {
    return stocks.filter(s => s.status === "Critical").length;
}
