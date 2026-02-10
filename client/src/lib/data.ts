/*
 * Communication Hub — Core Data Layer
 * Design: Meta/Facebook — Clean, functional, blue accents
 * All data sourced from real CSV/XLSX files
 * Includes Wave 1 (completed), Wave 2 (active), Wave 3 (upcoming) programs
 */

// ============================================================
// TP Site Point of Contact — Support for all wave trainings
// ============================================================
export interface SiteContact {
  name: string;
  role: string;
  phone: string;
  description: string;
}

export const siteContact: SiteContact = {
  name: "Hannah Wynne",
  role: "TP Site POC",
  phone: "085 219 0640",
  description: "For any training support or queries across all waves",
};

export interface SME {
  id: string;
  name: string;
  market: string;
  vendors: string[];
  roles: string[];
  policySME: string;
  space: string;
  location: string;
}

export interface TrainingSession {
  id: string;
  day: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  training: string;
  sme: string;
  type: 'live' | 'self-study' | 'upskilling';
  resources?: string[];
  waveId: string; // links session to a program wave
}

export interface ProgramItinerary {
  id: string;
  program: string;
  wave: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  description: string;
  modules: string[];
  smesInvolved: string[];
  daysOfWeek: string[];
}

// ============================================================
// Real SME Data from QERName.xlsx
// ============================================================
export const smeData: SME[] = [
  { id: "sme-1", name: "Ahmed Sayed", market: "Arabic", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Adult Sexual Solicitation & Sexually Explicit Language", space: "Simple Object", location: "Dublin" },
  { id: "sme-2", name: "Akihito Mizukoshi", market: "Japanese", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-3", name: "Alana Sant'Anna", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-4", name: "Alina Karabko", market: "Russian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Violence and Incitement", space: "Simple Object", location: "Dublin" },
  { id: "sme-5", name: "Alyssa Quiles", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-6", name: "Andrea Draskovic", market: "German", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Drugs and Pharmaceuticals, Online Gambling and Gaming", space: "Simple Object", location: "Dublin" },
  { id: "sme-7", name: "Angela Zollo", market: "Italian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "", space: "Simple Object & Complex Object", location: "Dublin" },
  { id: "sme-8", name: "Arezoo Zahire", market: "Persian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-9", name: "Attila Urban", market: "Hungarian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Violent and Graphic Content", space: "Simple Object", location: "Dublin" },
  { id: "sme-10", name: "Carla Prati", market: "PAID", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Privacy, Financial and Insurance Products & Services, 3PI, Discriminatory practices, Unacceptable Business practices, Crypto Currency, Lead Ads, Dating Ads", space: "Simple Object", location: "Dublin" },
  { id: "sme-11", name: "Carollina Nicolini", market: "Portuguese", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Site Lead"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-12", name: "Christel Yoan Zefanya", market: "Indonesian", vendors: ["Accenture Bangkok"], roles: ["Market SME", "VG SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-13", name: "Corneliu Onica", market: "Romanian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Complex Object: Messengers", space: "Simple Object & Complex Object", location: "Dublin" },
  { id: "sme-14", name: "Danilo Cata", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-15", name: "Darla Nicole Florendo", market: "Filipino", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Tobacco and Alcohol, RGS Other, Health and Wellness", space: "Simple Object", location: "Dublin" },
  { id: "sme-16", name: "Edgar Sanchez Martinez", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-17", name: "Fady Akiki", market: "Arabic", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-18", name: "Farrukh Ahmed", market: "Hindi", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Child Sexual Exploitation, Abuse and Nudity, Complex Object: Messengers", space: "Simple Object", location: "Dublin" },
  { id: "sme-19", name: "Federica Persico", market: "French", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-20", name: "Fernanda Affonso", market: "Portuguese", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Drugs and Pharmaceuticals", space: "Simple Object", location: "Dublin" },
  { id: "sme-21", name: "Heather Yarrish", market: "North America", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME", "Site Lead"], policySME: "Hate Speech, Coordinating Harm & Promoting Crime", space: "Simple Object", location: "Dublin" },
  { id: "sme-22", name: "Ilona Iwanowa Pudelko", market: "Polish", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Weapons, Ammunition, and Explosives", space: "Simple Object", location: "Dublin" },
  { id: "sme-23", name: "Iman Moussaoui", market: "Maghreb", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Dangerous Individuals and Organizations, Suicide and Self-Injury, Adult Sexual Exploitation", space: "Simple Object", location: "Dublin" },
  { id: "sme-24", name: "Isabelle Sing", market: "Chinese Mandarin", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-25", name: "Ivan Kristić", market: "Austrasian", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-26", name: "Jesierla Silva", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-27", name: "Jessica Ivana", market: "Indonesian", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-28", name: "Karan Bajaj", market: "Hindi", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "Bullying and Harassment", space: "Simple Object", location: "Dublin" },
  { id: "sme-29", name: "Kseniia Yanush", market: "Ukrainian", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-30", name: "Lisa Raffaele", market: "PAID", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-31", name: "Lukman Khiruddin", market: "Malay", vendors: ["Accenture Bangkok"], roles: ["Market SME", "VG SME"], policySME: "Complex Object: Profile Review", space: "Simple Object & Complex Object", location: "Bangkok" },
  { id: "sme-32", name: "Maha Alkaabi", market: "Arabic", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-33", name: "Maria Bozina", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-34", name: "Maria Tamtomo", market: "Indonesian", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-35", name: "Martin Wallin", market: "Dutch", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Human Exploitation, Complex Object: Groups", space: "Simple Object & Complex Object", location: "Dublin" },
  { id: "sme-36", name: "Mona Tirasetpakdee", market: "Thai", vendors: ["Accenture Bangkok"], roles: ["Market SME", "VG SME", "Pillar Lead SME"], policySME: "Fraud, Scam, and Deceptive Practices, Spam, Cybersecurity, Profanity", space: "Simple Object", location: "Bangkok" },
  { id: "sme-37", name: "Muhammad Bilal Khan", market: "Pakistan", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-38", name: "Nitesh Singh", market: "Bangladesh", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-39", name: "Oksana Quinlan", market: "Hebrew", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME", "VG SME"], policySME: "Adult Nudity and Sexual Activity", space: "Simple Object", location: "Dublin" },
  { id: "sme-40", name: "Pratik Parkar", market: "Hindi", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-41", name: "Riza Rizki Amalia", market: "Indonesian", vendors: ["Accenture Bangkok"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Bangkok" },
  { id: "sme-42", name: "Shirley Franco Rodriguez", market: "ESLA", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-43", name: "Vasilis Axelos", market: "UKI", vendors: ["Accenture Dublin", "Teleperformance", "Covalen"], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "Dublin" },
  { id: "sme-44", name: "Whiteaker James", market: "North America", vendors: [], roles: ["Market SME"], policySME: "", space: "Simple Object", location: "" },
];

// ============================================================
// Program Itinerary — Wave 1 (completed), Wave 2 (active), Wave 3 (upcoming)
// ============================================================
export const programItinerary: ProgramItinerary[] = [
  {
    id: "prog-1",
    program: "TP Onboarding Schedule",
    wave: "Wave 1 — Simple Object Training",
    location: "Dublin",
    startDate: "2025-01-20",
    endDate: "2025-01-24",
    status: "completed",
    description: "Initial onboarding training for Teleperformance vendor covering Simple Object review processes, community standards fundamentals, and market-specific guidelines across all Dublin-based markets.",
    modules: ["Community Standards Overview", "Simple Object Review", "Market Guidelines", "Queue Management", "Quality Calibration"],
    smesInvolved: ["Heather Yarrish", "Carollina Nicolini", "Darla Nicole Florendo", "Ahmed Sayed", "Iman Moussaoui"],
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "prog-2a",
    program: "TP Onboarding Schedule",
    wave: "Wave 2 — VG SME Deep Dive Week",
    location: "Dublin",
    startDate: "2025-02-03",
    endDate: "2025-02-10",
    status: "active",
    description: "VG SME Deep Dive training for 2 separate groups (no large rooms available). Covers RGS1, RGS2, Live Video Review, HeX/DoI/SSI/ASE, CSE, BH/V&I/HC, FDSP + Spam, and ANSA/SSPx/GV modules across Dublin site.",
    modules: ["RGS1", "RGS2", "Live Video Review", "HeX, DoI, SSI, ASE", "CSE", "BH, V&I, HC", "FDSP + Spam", "ANSA, SSPx, GV"],
    smesInvolved: ["Andrea Draskovic", "Farrukh Ahmed", "Heather Yarrish", "Iman Moussaoui", "Ahmed Sayed", "Mona Tirasetpakdee", "Arezoo Zahire", "Darla Nicole Florendo"],
    daysOfWeek: ["Tue Feb 3", "Wed Feb 4", "Thu Feb 5", "Fri Feb 6", "Tue Feb 10"],
  },
  {
    id: "prog-2b",
    program: "TP Onboarding Schedule",
    wave: "Wave 2 — Complex Object Training",
    location: "Dublin",
    startDate: "2025-02-11",
    endDate: "2025-02-13",
    status: "active",
    description: "Upskilling training for Complex Object modules including Groups, Messenger IC, Max Recall, and Profile. Combines live training sessions with self-study materials and ops guidelines.",
    modules: ["Groups", "Messenger IC", "Max Recall", "Profile"],
    smesInvolved: ["Martin Wallin", "Corneliu Onica", "Lukman Khiruddin"],
    daysOfWeek: ["Tuesday", "Wednesday", "Thursday"],
  },
  {
    id: "prog-3",
    program: "TP Onboarding Schedule",
    wave: "Wave 3 — VG SME Deep Dive Week",
    location: "Dublin",
    startDate: "2025-03-10",
    endDate: "2025-03-13",
    status: "upcoming",
    description: "VG SME Deep Dive training for 2 separate groups covering RGS1, RGS2, Live Video Review, HeX/DoI/SSI/ASE, CSE, BH/V&I/HC, FDSP + Spam, and ANSA/SSPx/GV modules. Includes site-led wellness activities and Ops/PTQ team coordination.",
    modules: ["RGS1", "RGS2", "Live Video Review", "HeX, DoI, SSI, ASE", "CSE", "BH, V&I, HC", "FDSP + Spam", "ANSA, SSPx, GV"],
    smesInvolved: ["Fernanda Affonso", "Farrukh Ahmed", "Iman Moussaoui", "Heather Yarrish", "Darla Nicole Florendo", "Mona Tirasetpakdee", "Ahmed Sayed"],
    daysOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
  },
];

// ============================================================
// Training Schedules — per wave
// ============================================================

// Wave 1 — Simple Object Training (completed, Jan 20-24, 2025)
export const wave1Schedule: TrainingSession[] = [
  { id: "w1-1", day: "Monday", date: "2025-01-20", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Community Standards Overview", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-2", day: "Monday", date: "2025-01-20", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Community Standards Self Study", sme: "N/A", type: "self-study", resources: ["Community Standards Handbook"], waveId: "prog-1" },
  { id: "w1-3", day: "Monday", date: "2025-01-20", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Simple Object Review — Introduction", sme: "Carollina Nicolini", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-4", day: "Monday", date: "2025-01-20", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Simple Object Self Study", sme: "N/A", type: "self-study", resources: ["SO Review Guide"], waveId: "prog-1" },
  { id: "w1-5", day: "Tuesday", date: "2025-01-21", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Market-Specific Guidelines — ESLA & Arabic", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-6", day: "Tuesday", date: "2025-01-21", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Market Guidelines Self Study", sme: "N/A", type: "self-study", resources: ["Market Guidelines Doc"], waveId: "prog-1" },
  { id: "w1-7", day: "Tuesday", date: "2025-01-21", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Market-Specific Guidelines — European Markets", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-8", day: "Tuesday", date: "2025-01-21", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Market Guidelines Self Study", sme: "N/A", type: "self-study", resources: ["European Market Guide"], waveId: "prog-1" },
  { id: "w1-9", day: "Wednesday", date: "2025-01-22", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Queue Management Training", sme: "Darla Nicole Florendo", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-10", day: "Wednesday", date: "2025-01-22", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Queue Management Self Study", sme: "N/A", type: "self-study", resources: ["Queue Management SOP"], waveId: "prog-1" },
  { id: "w1-11", day: "Wednesday", date: "2025-01-22", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Practical Queue Exercise", sme: "Darla Nicole Florendo", type: "upskilling", resources: [], waveId: "prog-1" },
  { id: "w1-12", day: "Thursday", date: "2025-01-23", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Quality Calibration — Standards & Metrics", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-13", day: "Thursday", date: "2025-01-23", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Quality Calibration Self Study", sme: "N/A", type: "self-study", resources: ["Calibration Rubric"], waveId: "prog-1" },
  { id: "w1-14", day: "Thursday", date: "2025-01-23", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Calibration Workshop", sme: "Carollina Nicolini", type: "upskilling", resources: [], waveId: "prog-1" },
  { id: "w1-15", day: "Friday", date: "2025-01-24", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Week 1 Review & Assessment", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-1" },
  { id: "w1-16", day: "Friday", date: "2025-01-24", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Assessment Self Study", sme: "N/A", type: "self-study", resources: ["Assessment Prep Guide"], waveId: "prog-1" },
  { id: "w1-17", day: "Friday", date: "2025-01-24", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Wave 1 Wrap-Up & Feedback", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-1" },
];

// Wave 2a — VG SME Deep Dive Week (active, Feb 3-10, 2025) — from real PDF
// Training for 2 separate Groups (no large rooms available)
// Uses date-based day labels ("Tue Feb 3") to handle multi-week span
export const wave2aSchedule: TrainingSession[] = [
  // TUESDAY FEB 3rd
  { id: "w2a-1", day: "Tue Feb 3", date: "2025-02-03", timeStart: "10:30 AM", timeEnd: "12:00 PM", training: "RGS1 (Group 1)", sme: "Andrea Draskovic", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-2", day: "Tue Feb 3", date: "2025-02-03", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Live Video Review (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-3", day: "Tue Feb 3", date: "2025-02-03", timeStart: "2:30 PM", timeEnd: "4:00 PM", training: "RGS1 (Group 2)", sme: "Andrea Draskovic", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-4", day: "Tue Feb 3", date: "2025-02-03", timeStart: "3:00 PM", timeEnd: "4:00 PM", training: "BH, V&I, HC (Group 1)", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-2a" },
  // WEDNESDAY FEB 4th
  { id: "w2a-5", day: "Wed Feb 4", date: "2025-02-04", timeStart: "10:00 AM", timeEnd: "10:30 AM", training: "CSE (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-6", day: "Wed Feb 4", date: "2025-02-04", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Live Video Review (Group 1)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-7", day: "Wed Feb 4", date: "2025-02-04", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Site-Led Wellness Activity (Group 2)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-2a" },
  { id: "w2a-8", day: "Wed Feb 4", date: "2025-02-04", timeStart: "2:30 PM", timeEnd: "3:00 PM", training: "CSE (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-9", day: "Wed Feb 4", date: "2025-02-04", timeStart: "3:00 PM", timeEnd: "4:00 PM", training: "BH, V&I, HC (Group 1)", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-10", day: "Wed Feb 4", date: "2025-02-04", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Site-Led Wellness Activity (Group 2)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-2a" },
  { id: "w2a-23", day: "Wed Feb 4", date: "2025-02-04", timeStart: "TBD", timeEnd: "TBD", training: "Ops/PTQ Team Session (TBD)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-2a" },
  // THURSDAY FEB 5th
  { id: "w2a-11", day: "Thu Feb 5", date: "2025-02-05", timeStart: "10:30 AM", timeEnd: "12:00 PM", training: "HeX, DoI, SSI, ASE (Group 1)", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-12", day: "Thu Feb 5", date: "2025-02-05", timeStart: "10:30 AM", timeEnd: "12:00 PM", training: "ANSA, SSPx, GV (Group 2)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-13", day: "Thu Feb 5", date: "2025-02-05", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "ANSA, SSPx, GV (Group 1)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-14", day: "Thu Feb 5", date: "2025-02-05", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "HeX, DoI, SSI, ASE (Group 2)", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-2a" },
  // FRIDAY FEB 6th
  { id: "w2a-15", day: "Fri Feb 6", date: "2025-02-06", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "FDSP + Spam (Group 1)", sme: "Mona Tirasetpakdee", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-16", day: "Fri Feb 6", date: "2025-02-06", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "Self Study / Nesting (Group 2)", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2a" },
  { id: "w2a-17", day: "Fri Feb 6", date: "2025-02-06", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "FDSP + Spam (Group 1)", sme: "Mona Tirasetpakdee", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-18", day: "Fri Feb 6", date: "2025-02-06", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "Self Study / Nesting (Group 2)", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2a" },
  { id: "w2a-24", day: "Fri Feb 6", date: "2025-02-06", timeStart: "TBD", timeEnd: "TBD", training: "Ops Lead Sync with Site Leads (TBD)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-2a" },
  // TUESDAY FEB 10th (Week 2)
  { id: "w2a-19", day: "Tue Feb 10", date: "2025-02-10", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "ANSA, SSPx, GV (Group 1)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-20", day: "Tue Feb 10", date: "2025-02-10", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "RGS2 (Group 2)", sme: "Darla Nicole Florendo", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-21", day: "Tue Feb 10", date: "2025-02-10", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "ANSA, SSPx, GV (Group 1)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-2a" },
  { id: "w2a-22", day: "Tue Feb 10", date: "2025-02-10", timeStart: "4:30 PM", timeEnd: "5:00 PM", training: "RGS2 (Group 2)", sme: "Darla Nicole Florendo", type: "live", resources: [], waveId: "prog-2a" },
];

// Wave 2b — Complex Object Training (active, Feb 11-13, 2025) — from real PDF
export const wave2bSchedule: TrainingSession[] = [
  // TUESDAY FEB 11th (Wednesday in PDF = Feb 11)
  { id: "w2b-1", day: "Tuesday", date: "2025-02-11", timeStart: "10:00 AM", timeEnd: "11:30 AM", training: "Groups Training / Group Review Training Dec 2025", sme: "Martin Wallin", type: "live", resources: [], waveId: "prog-2b" },
  { id: "w2b-2", day: "Tuesday", date: "2025-02-11", timeStart: "2:30 PM", timeEnd: "3:30 PM", training: "Groups Self Study", sme: "N/A", type: "self-study", resources: ["Ops guidelines", "Confluence", "Ops tools review"], waveId: "prog-2b" },
  // WEDNESDAY FEB 12th
  { id: "w2b-3", day: "Wednesday", date: "2025-02-12", timeStart: "9:30 AM", timeEnd: "10:00 AM", training: "Messenger Self Study", sme: "N/A", type: "self-study", resources: ["Ops guidelines", "Messenger Connections"], waveId: "prog-2b" },
  { id: "w2b-4", day: "Wednesday", date: "2025-02-12", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Messenger IC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IC for Messenger training material"], waveId: "prog-2b" },
  { id: "w2b-5", day: "Wednesday", date: "2025-02-12", timeStart: "2:00 PM", timeEnd: "3:00 PM", training: "Messenger IC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IC for Messenger training material"], waveId: "prog-2b" },
  { id: "w2b-6", day: "Wednesday", date: "2025-02-12", timeStart: "4:00 PM", timeEnd: "4:30 PM", training: "Messenger Self Study", sme: "N/A", type: "self-study", resources: ["Ops guidelines", "Messenger Connections"], waveId: "prog-2b" },
  // THURSDAY FEB 13th
  { id: "w2b-7", day: "Thursday", date: "2025-02-13", timeStart: "10:00 AM", timeEnd: "11:00 AM", training: "Max Recall Training", sme: "Lukman Khiruddin", type: "live", resources: [], waveId: "prog-2b" },
  { id: "w2b-8", day: "Thursday", date: "2025-02-13", timeStart: "12:00 PM", timeEnd: "1:00 PM", training: "Max Recall Self Study", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2b" },
  { id: "w2b-9", day: "Thursday", date: "2025-02-13", timeStart: "2:30 PM", timeEnd: "3:30 PM", training: "Profile Training", sme: "Lukman Khiruddin", type: "live", resources: [], waveId: "prog-2b" },
  { id: "w2b-10", day: "Thursday", date: "2025-02-13", timeStart: "4:30 PM", timeEnd: "5:00 PM", training: "Profile Self Study", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2b" },
];

// Wave 3 — VG SME Deep Dive Week (upcoming, Mar 10-13, 2025) — from real PDF
// Training for 2 separate Groups (no large rooms available)
// Each session runs for both Group 1 and Group 2 with different modules
export const wave3Schedule: TrainingSession[] = [
  // TUESDAY MAR 10th
  { id: "w3-1", day: "Tuesday", date: "2025-03-10", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "RGS1 (Group 1)", sme: "Fernanda Affonso", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-2", day: "Tuesday", date: "2025-03-10", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Live Video Review (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-3", day: "Tuesday", date: "2025-03-10", timeStart: "2:00 PM", timeEnd: "3:00 PM", training: "Live Video Review (Group 1)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-4", day: "Tuesday", date: "2025-03-10", timeStart: "2:30 PM", timeEnd: "4:00 PM", training: "RGS1 (Group 2)", sme: "Fernanda Affonso", type: "live", resources: [], waveId: "prog-3" },
  // WEDNESDAY MAR 11th
  { id: "w3-5", day: "Wednesday", date: "2025-03-11", timeStart: "9:30 AM", timeEnd: "12:00 PM", training: "HeX, DoI, SSI, ASE (Group 1)", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-6", day: "Wednesday", date: "2025-03-11", timeStart: "9:00 AM", timeEnd: "10:30 AM", training: "CSE (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-7", day: "Wednesday", date: "2025-03-11", timeStart: "11:00 AM", timeEnd: "12:00 PM", training: "Site-Led Wellness Activity (Group 2)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-3" },
  { id: "w3-8", day: "Wednesday", date: "2025-03-11", timeStart: "2:00 PM", timeEnd: "3:00 PM", training: "CSE (Group 2)", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-9", day: "Wednesday", date: "2025-03-11", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "HeX, DoI, SSI, ASE (Group 1)", sme: "Iman Moussaoui", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-10", day: "Wednesday", date: "2025-03-11", timeStart: "3:30 PM", timeEnd: "4:30 PM", training: "Site-Led Wellness Activity (Group 2)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-3" },
  // THURSDAY MAR 12th
  { id: "w3-11", day: "Thursday", date: "2025-03-12", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "BH, V&I, HC (Group 1)", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-12", day: "Thursday", date: "2025-03-12", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "RGS2 (Group 2)", sme: "Darla Nicole Florendo", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-13", day: "Thursday", date: "2025-03-12", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "RGS2 (Group 1)", sme: "Darla Nicole Florendo", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-14", day: "Thursday", date: "2025-03-12", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "BH, V&I, HC (Group 2)", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-3" },
  // FRIDAY MAR 13th
  { id: "w3-15", day: "Friday", date: "2025-03-13", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "FDSP + Spam (Group 1)", sme: "Mona Tirasetpakdee", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-16", day: "Friday", date: "2025-03-13", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "ANSA, SSPx, GV (Group 2)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-17", day: "Friday", date: "2025-03-13", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "ANSA, SSPx, GV (Group 1)", sme: "Ahmed Sayed", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-18", day: "Friday", date: "2025-03-13", timeStart: "3:00 PM", timeEnd: "4:30 PM", training: "FDSP + Spam (Group 2)", sme: "Mona Tirasetpakdee", type: "live", resources: [], waveId: "prog-3" },
  // Ops/PTQ Team sessions
  { id: "w3-19", day: "Wednesday", date: "2025-03-11", timeStart: "TBD", timeEnd: "TBD", training: "Ops/PTQ Team Session (TBD)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-3" },
  { id: "w3-20", day: "Friday", date: "2025-03-13", timeStart: "10:00 AM", timeEnd: "12:00 PM", training: "Ops Lead Sync with Site Leads (TBD)", sme: "N/A", type: "upskilling", resources: [], waveId: "prog-3" },
];

// Combined schedule (backward compatible — uses active Wave 2a)
export const trainingSchedule: TrainingSession[] = [...wave2aSchedule];

// All schedules by wave ID
export function getScheduleByWaveId(waveId: string): TrainingSession[] {
  switch (waveId) {
    case "prog-1": return wave1Schedule;
    case "prog-2a": return wave2aSchedule;
    case "prog-2b": return wave2bSchedule;
    case "prog-3": return wave3Schedule;
    default: return [];
  }
}

// ============================================================
// Vendor contacts
// ============================================================
export interface VendorContact {
  id: string;
  name: string;
  vendor: string;
  location: string;
  primaryContact: string;
  email: string;
  phone: string;
  role: string;
}

export const vendorContacts: VendorContact[] = [
  { id: "vc-1", name: "Sarah Mitchell", vendor: "Accenture", location: "Dublin", primaryContact: "Operations Manager", email: "ops.dublin@accenture.com", phone: "+353 1 234 5678", role: "Vendor Operations" },
  { id: "vc-2", name: "James O'Brien", vendor: "Teleperformance", location: "Dublin", primaryContact: "Training Coordinator", email: "training@teleperformance.com", phone: "+353 1 345 6789", role: "Training Delivery" },
  { id: "vc-3", name: "Emma Walsh", vendor: "Covalen", location: "Dublin", primaryContact: "Site Manager", email: "site.mgr@covalen.com", phone: "+353 1 456 7890", role: "Site Operations" },
  { id: "vc-4", name: "Priya Sharma", vendor: "Accenture", location: "Bangkok", primaryContact: "Regional Lead", email: "regional.bkk@accenture.com", phone: "+66 2 123 4567", role: "Regional Operations" },
];

// ============================================================
// Helper functions
// ============================================================
export function getSMEsByDay(day: string): TrainingSession[] {
  return trainingSchedule.filter(s => s.day === day);
}

export function getSMEByName(name: string): SME | undefined {
  return smeData.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

export function getSessionsBySME(smeName: string): TrainingSession[] {
  return trainingSchedule.filter(s =>
    s.sme.toLowerCase().includes(smeName.toLowerCase())
  );
}

export function getUniqueSMEsInSchedule(): string[] {
  const smes = new Set(trainingSchedule.map(s => s.sme).filter(s => s !== "N/A"));
  return Array.from(smes);
}

export function getUniqueSMEsForWave(waveId: string): string[] {
  const schedule = getScheduleByWaveId(waveId);
  const smes = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
  return Array.from(smes);
}

export function getDaysOfWeek(): string[] {
  return ["Monday", "Tuesday", "Wednesday", "Thursday"];
}

export function getDaysForWave(waveId: string): string[] {
  const program = programItinerary.find(p => p.id === waveId);
  return program?.daysOfWeek ?? ["Monday", "Tuesday", "Wednesday", "Thursday"];
}

export function getSessionTypeColor(type: TrainingSession['type']): string {
  switch (type) {
    case 'live': return 'bg-[#E8F5E9] border-[#4CAF50] text-[#2E7D32]';
    case 'self-study': return 'bg-[#F0F2F5] border-[#CED0D4] text-[#65676B]';
    case 'upskilling': return 'bg-[#E7F3FF] border-[#1877F2]/30 text-[#1877F2]';
    default: return 'bg-[#F0F2F5] border-[#CED0D4] text-[#65676B]';
  }
}

export function getSessionTypeBadge(type: TrainingSession['type']): { label: string; color: string } {
  switch (type) {
    case 'live': return { label: 'Live Training', color: 'bg-[#E8F5E9] text-[#2E7D32]' };
    case 'self-study': return { label: 'Self Study', color: 'bg-[#F0F2F5] text-[#65676B]' };
    case 'upskilling': return { label: 'Upskilling', color: 'bg-[#E7F3FF] text-[#1877F2]' };
    default: return { label: 'Session', color: 'bg-[#F0F2F5] text-[#65676B]' };
  }
}

export function getStatusBadge(status: ProgramItinerary['status']): { label: string; dotColor: string; bgColor: string; textColor: string } {
  switch (status) {
    case 'completed': return { label: 'Completed', dotColor: 'bg-[#65676B]', bgColor: 'bg-[#F0F2F5]', textColor: 'text-[#65676B]' };
    case 'active': return { label: 'Active', dotColor: 'bg-[#42B72A]', bgColor: 'bg-[#E8F5E9]', textColor: 'text-[#2E7D32]' };
    case 'upcoming': return { label: 'Upcoming', dotColor: 'bg-[#1877F2]', bgColor: 'bg-[#E7F3FF]', textColor: 'text-[#1877F2]' };
    default: return { label: 'Unknown', dotColor: 'bg-[#CED0D4]', bgColor: 'bg-[#F0F2F5]', textColor: 'text-[#65676B]' };
  }
}
