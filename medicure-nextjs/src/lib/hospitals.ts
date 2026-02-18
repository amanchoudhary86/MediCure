export interface Hospital {
    id: string;
    name: string;
    location: string;
    timings: string;
    rating: number;
    email: string;
    password: string;
}

export const hospitals: Hospital[] = [
    {
        id: "hosp_sms",
        name: "Sawai Man Singh (SMS) Hospital",
        location: "Jawahar Lal Nehru Marg, Ashok Nagar",
        timings: "OPD: 9:00 AM – 3:00 PM | Emergency: 24 Hours",
        rating: 4.1,
        email: "sms@medicure.com",
        password: "Sms@2026",
    },
    {
        id: "hosp_jaipuria",
        name: "Rukmani Devi Beni Prasad Jaipuria Hospital",
        location: "Hospital Road, Milap Nagar (near Tonk Rd)",
        timings: "OPD: 9:00 AM – 3:00 PM | Emergency: 24 Hours",
        rating: 3.7,
        email: "jaipuria@medicure.com",
        password: "Jaipuria@2026",
    },
    {
        id: "hosp_jklone",
        name: "J.K. Lone Hospital",
        location: "Jawahar Lal Nehru Marg, Adarsh Nagar",
        timings: "Open 24 Hours",
        rating: 3.5,
        email: "jklone@medicure.com",
        password: "Jklone@2026",
    },
    {
        id: "hosp_gangori",
        name: "Gangori Hospital (Pandit Deendayal Upadhyay)",
        location: "Gangori Bazar Road, Kanwar Nagar",
        timings: "OPD: 9:00 AM – 3:00 PM | Emergency: 24 Hours",
        rating: 3.8,
        email: "gangori@medicure.com",
        password: "Gangori@2026",
    },
    {
        id: "hosp_satellite",
        name: "Govt. Satellite Hospital (Bani Park)",
        location: "Shiv Marg, Bani Park",
        timings: "Open 24 Hours",
        rating: 3.7,
        email: "satellite@medicure.com",
        password: "Satellite@2026",
    },
    {
        id: "hosp_zanana",
        name: "Zanana Hospital",
        location: "Station Road, Sindhi Camp",
        timings: "Open 24 Hours",
        rating: 3.4,
        email: "zanana@medicure.com",
        password: "Zanana@2026",
    },
    {
        id: "hosp_mahila",
        name: "Mahila Chikitsalaya",
        location: "Moti Doongri Road, Adarsh Nagar",
        timings: "Open 24 Hours",
        rating: 3.3,
        email: "mahila@medicure.com",
        password: "Mahila@2026",
    },
    {
        id: "hosp_haribux",
        name: "Haribux Kanwatia Govt. Hospital",
        location: "Shastri Nagar, Near Science Park",
        timings: "OPD: 9:00 AM – 3:00 PM | Emergency: 24 Hours",
        rating: 3.1,
        email: "haribux@medicure.com",
        password: "Haribux@2026",
    },
    {
        id: "hosp_jantacolony",
        name: "Government Hospital (Janta Colony)",
        location: "Janta Colony, Sindhi Colony, Bani Park",
        timings: "9:00 AM – 6:00 PM",
        rating: 4.5,
        email: "jantacolony@medicure.com",
        password: "Janta@2026",
    },
    {
        id: "hosp_railway",
        name: "Central Railway Hospital (NWR)",
        location: "Ganpati Nagar, Civil Lines (Near Railway Station)",
        timings: "OPD: 9:00 AM – 1:00 PM | Emergency: 24 Hours",
        rating: 3.9,
        email: "railway@medicure.com",
        password: "Railway@2026",
    },
    {
        id: "hosp_esic",
        name: "ESIC Model Hospital",
        location: "Laxmi Nagar, Ajmer Road, Sodala",
        timings: "OPD: 8:00 AM – 4:00 PM",
        rating: 4.1,
        email: "esic@medicure.com",
        password: "Esic@2026",
    },
    {
        id: "hosp_city_care",
        name: "City Care Hospital",
        location: "Sector 11, Malviya Nagar",
        timings: "Open 24 Hours",
        rating: 4.5,
        email: "citycare@medicure.com",
        password: "CityCare@2026",
    },
    {
        id: "hosp_apex",
        name: "Apex Trauma Center",
        location: "Sector 51, Gurugram",
        timings: "Open 24 Hours",
        rating: 4.8,
        email: "apex@medicure.com",
        password: "Apex@2026",
    },
];

// Find hospital by email
export function findHospitalByEmail(email: string): Hospital | undefined {
    return hospitals.find(h => h.email.toLowerCase() === email.toLowerCase());
}

// Find hospital by ID
export function findHospitalById(id: string): Hospital | undefined {
    return hospitals.find(h => h.id === id);
}
