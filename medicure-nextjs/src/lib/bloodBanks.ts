// ── Blood Group Types ──
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type StockStatus = "Available" | "Low" | "Critical";

export interface BloodStock {
    group: BloodGroup;
    units: number;
    status: StockStatus;
    lastUpdated: string;
}

export interface HospitalBloodBank {
    hospitalId: string;
    hospitalName: string;
    location: string;
    bloodBankName: string;
    contact: string;
    stocks: BloodStock[];
}

export interface DonationCamp {
    id: string;
    name: string;
    location: string;
    type: string;
    description: string;
    contact?: string;
}

// ── Helper to assign status ──
function stockStatus(units: number): StockStatus {
    if (units >= 15) return "Available";
    if (units >= 5) return "Low";
    return "Critical";
}

function makeStocks(units: number[]): BloodStock[] {
    const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const now = "18 Feb 2026, 08:30 AM";
    return groups.map((g, i) => ({
        group: g,
        units: units[i],
        status: stockStatus(units[i]),
        lastUpdated: now,
    }));
}

// ══════════════════════════════════════════════
// HOSPITAL BLOOD BANK INVENTORY (simulated data)
// ══════════════════════════════════════════════
export const hospitalBloodBanks: HospitalBloodBank[] = [
    {
        hospitalId: "hosp_sms",
        hospitalName: "Sawai Man Singh (SMS) Hospital",
        location: "J.L.N. Marg, Ashok Nagar",
        bloodBankName: "SMS Hospital Blood Bank",
        contact: "+91-141-256-0291",
        stocks: makeStocks([32, 8, 25, 3, 12, 2, 40, 6]),
    },
    {
        hospitalId: "hosp_jaipuria",
        hospitalName: "Rukmani Devi Jaipuria Hospital",
        location: "Hospital Road, Milap Nagar",
        bloodBankName: "Jaipuria Blood Bank",
        contact: "+91-141-262-0011",
        stocks: makeStocks([18, 5, 14, 7, 6, 4, 22, 3]),
    },
    {
        hospitalId: "hosp_jklone",
        hospitalName: "J.K. Lone Hospital",
        location: "J.L.N. Marg, Adarsh Nagar",
        bloodBankName: "JK Lone Blood Centre",
        contact: "+91-141-256-1234",
        stocks: makeStocks([10, 2, 20, 4, 8, 1, 15, 9]),
    },
    {
        hospitalId: "hosp_gangori",
        hospitalName: "Gangori Hospital (PDU)",
        location: "Gangori Bazar Road, Kanwar Nagar",
        bloodBankName: "Gangori Blood Bank",
        contact: "+91-141-231-5678",
        stocks: makeStocks([15, 6, 11, 3, 4, 2, 18, 5]),
    },
    {
        hospitalId: "hosp_satellite",
        hospitalName: "Govt. Satellite Hospital",
        location: "Shiv Marg, Bani Park",
        bloodBankName: "Satellite Blood Centre",
        contact: "+91-141-220-0055",
        stocks: makeStocks([8, 3, 16, 2, 10, 5, 12, 4]),
    },
    {
        hospitalId: "hosp_zanana",
        hospitalName: "Zanana Hospital",
        location: "Station Road, Sindhi Camp",
        bloodBankName: "Zanana Blood Bank",
        contact: "+91-141-237-0099",
        stocks: makeStocks([20, 4, 9, 6, 3, 1, 28, 7]),
    },
    {
        hospitalId: "hosp_esic",
        hospitalName: "ESIC Model Hospital",
        location: "Laxmi Nagar, Ajmer Road",
        bloodBankName: "ESIC Blood Centre",
        contact: "+91-141-229-0077",
        stocks: makeStocks([14, 7, 18, 5, 9, 3, 16, 2]),
    },
];

// ══════════════════════════════════════════════
// BLOOD DONATION CAMPS & COMMUNITIES IN JAIPUR
// ══════════════════════════════════════════════
export const donationCamps: DonationCamp[] = [
    {
        id: "camp_redcross",
        name: "Indian Red Cross Society (Rajasthan Branch)",
        location: "Near Sanganeri Gate",
        type: "Govt + NGO",
        description: "Highly trusted; conducts voluntary donation drives regularly across Jaipur.",
        contact: "+91-141-256-3322",
    },
    {
        id: "camp_sms",
        name: "SMS Hospital Blood Bank",
        location: "J.L.N. Marg",
        type: "Govt Hospital",
        description: "Organises city-wide donation camps to maintain stock levels.",
        contact: "+91-141-256-0291",
    },
    {
        id: "camp_sindhi",
        name: "Sindhi Mahasabha",
        location: "Jhulelal Mandir, Banipark",
        type: "Community Organisation",
        description: "Conducted awareness-based blood donation camp in 2024.",
    },
    {
        id: "camp_redribbon",
        name: "Red Ribbon Club (St. Xavier's College)",
        location: "C-Scheme",
        type: "Student / Institutional",
        description: "Regularly conducts donation camps with NGOs & NSS support.",
    },
    {
        id: "camp_nss",
        name: "National Service Scheme (NSS)",
        location: "Various Colleges",
        type: "Govt Youth Programme",
        description: "Strong student participation in camps across Jaipur colleges.",
    },
    {
        id: "camp_asiancancer",
        name: "Asian Cancer Hospital",
        location: "Jagatpura",
        type: "Private Medical",
        description: "Conducts regular camps for cancer patient support.",
        contact: "+91-141-275-0071",
    },
    {
        id: "camp_jankalyan",
        name: "Jan Kalyan Blood Centre",
        location: "Tilak Nagar (Rajapark)",
        type: "NGO Blood Centre",
        description: "Participates in camp-based blood collection drives.",
        contact: "+91-141-262-4455",
    },
    {
        id: "camp_apexkalyan",
        name: "Apex Kalyan Blood Bank",
        location: "Malviya Nagar",
        type: "NGO-run",
        description: "Community supported donation drives across south Jaipur.",
    },
    {
        id: "camp_bdmemorial",
        name: "B.D. Memorial Blood Centre",
        location: "Ajmer Road, Vidhyut Nagar",
        type: "NGO-run",
        description: "Highly rated (5★ public rating) blood centre in west Jaipur.",
        contact: "+91-141-236-7788",
    },
    {
        id: "camp_reddrop",
        name: "Red Drop Blood Centre",
        location: "Vaishali Nagar",
        type: "Private / NGO",
        description: "Active in voluntary donation drives in west Jaipur.",
    },
    {
        id: "camp_agrasen",
        name: "Agrasen Blood Bank",
        location: "Vidyadhar Nagar",
        type: "Hospital-based",
        description: "Regular blood donation support for north Jaipur hospitals.",
    },
    {
        id: "camp_sksoni",
        name: "S.K. Soni Blood Bank",
        location: "Vidhyadhar Nagar",
        type: "Private Hospital",
        description: "Largest blood bank in North Jaipur with indoor donation facilities.",
        contact: "+91-141-239-9900",
    },
    {
        id: "camp_jnu",
        name: "JNU Hospital Blood Centre",
        location: "Jagatpura",
        type: "Private Hospital",
        description: "Conducts indoor & outdoor donation camps regularly.",
        contact: "+91-141-279-1234",
    },
    {
        id: "camp_eternal",
        name: "Eternal Hospital Blood Bank",
        location: "Jawahar Circle Area",
        type: "Private Hospital",
        description: "Supports voluntary donation initiatives across the city.",
    },
    {
        id: "camp_friends2support",
        name: "Friends2Support (Jaipur Chapter)",
        location: "Digital Network",
        type: "Volunteer Network",
        description: "Large voluntary donor coordination platform connecting donors with patients.",
    },
    {
        id: "camp_manavkalyan",
        name: "Manav Kalyan Vidhya Peeth Sansthan",
        location: "Jaipur",
        type: "Healthcare NGO",
        description: "Positive public review for blood donation teamwork across Jaipur.",
    },
];

// ── City-wide summary helpers ──
export function getCityWideSummary(banks: HospitalBloodBank[]) {
    const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    return groups.map((g) => {
        const totalUnits = banks.reduce((sum, bank) => {
            const stock = bank.stocks.find((s) => s.group === g);
            return sum + (stock?.units ?? 0);
        }, 0);
        return {
            group: g,
            totalUnits,
            status: stockStatus(totalUnits),
        };
    });
}

export function getTotalUnits(banks: HospitalBloodBank[]): number {
    return banks.reduce(
        (sum, bank) => sum + bank.stocks.reduce((s, st) => s + st.units, 0),
        0
    );
}

export function getCriticalCount(banks: HospitalBloodBank[]): number {
    return banks.reduce(
        (count, bank) => count + bank.stocks.filter((s) => s.status === "Critical").length,
        0
    );
}
