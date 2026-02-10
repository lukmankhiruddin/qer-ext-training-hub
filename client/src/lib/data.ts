/*
 * Communication Hub — Core Data Layer
 * Design: Meta/Facebook — Clean, functional, blue accents
 * All data sourced from real CSV/XLSX files
 * Includes Wave 1 (completed), Wave 2 (active), Wave 3 (upcoming) programs
 */

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
    id: "prog-2",
    program: "TP Onboarding Schedule",
    wave: "Wave 2 — Complex Object Training",
    location: "Dublin",
    startDate: "2025-02-10",
    endDate: "2025-02-13",
    status: "active",
    description: "Upskilling training for Teleperformance vendor onboarding. Covers Live Video, Threads, Groups, Messenger, Max Recall, and Profile modules.",
    modules: ["Live Video", "Threads / Simple Objects", "Groups", "Messenger IIC", "Max Recall", "Profile"],
    smesInvolved: ["Farrukh Ahmed", "Martin Wallin", "Corneliu Onica", "Lukman Khiruddin"],
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  },
  {
    id: "prog-3",
    program: "TP Onboarding Schedule",
    wave: "Wave 3 — Advanced Review & Certification",
    location: "Dublin",
    startDate: "2025-03-10",
    endDate: "2025-03-14",
    status: "upcoming",
    description: "Advanced training wave covering complex policy enforcement, cross-market calibration, and SME certification assessments. Prepares vendor reviewers for independent queue handling.",
    modules: ["Advanced Policy Enforcement", "Cross-Market Calibration", "Edge Case Workshop", "Certification Assessment", "Independent Queue Prep"],
    smesInvolved: ["Heather Yarrish", "Angela Zollo", "Carla Prati", "Fernanda Affonso", "Corneliu Onica"],
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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

// Wave 2 — Complex Object Training (active, Feb 10-13, 2025) — from real CSV
export const wave2Schedule: TrainingSession[] = [
  { id: "ts-1", day: "Monday", date: "2025-02-10", timeStart: "9:30 AM", timeEnd: "10:30 AM", training: "Live Video Training", sme: "Farrukh Ahmed", type: "live", resources: [], waveId: "prog-2" },
  { id: "ts-2", day: "Monday", date: "2025-02-10", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Threads / Simple Objects Module", sme: "Farrukh Ahmed", type: "upskilling", resources: [], waveId: "prog-2" },
  { id: "ts-3", day: "Monday", date: "2025-02-10", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Live Video Self Study", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2" },
  { id: "ts-4", day: "Tuesday", date: "2025-02-11", timeStart: "9:30 AM", timeEnd: "10:30 AM", training: "Groups Training — Group Review Training Dec 2025", sme: "Martin Wallin", type: "live", resources: [], waveId: "prog-2" },
  { id: "ts-5", day: "Tuesday", date: "2025-02-11", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Groups Self Study — Ops Guideline & Complex Objects Module", sme: "N/A", type: "self-study", resources: ["Link Ops Guideline", "Complex Objects module"], waveId: "prog-2" },
  { id: "ts-6", day: "Wednesday", date: "2025-02-12", timeStart: "9:30 AM", timeEnd: "10:00 AM", training: "Messenger Self Study — Ops Guidelines & Cornerstone", sme: "N/A", type: "self-study", resources: ["Link Ops guidelines", "Link Cornerstone Messenger Cornerstone"], waveId: "prog-2" },
  { id: "ts-7", day: "Wednesday", date: "2025-02-12", timeStart: "10:30 AM", timeEnd: "12:00 PM", training: "Messenger IIC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IIC for Messenger training material"], waveId: "prog-2" },
  { id: "ts-8", day: "Wednesday", date: "2025-02-12", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Messenger IIC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IIC for Messenger training material"], waveId: "prog-2" },
  { id: "ts-9", day: "Wednesday", date: "2025-02-12", timeStart: "3:30 PM", timeEnd: "4:30 PM", training: "Messenger Self Study — Ops Guidelines & Cornerstone", sme: "N/A", type: "self-study", resources: ["Link Ops guidelines", "Link Cornerstone Messenger Cornerstone"], waveId: "prog-2" },
  { id: "ts-10", day: "Thursday", date: "2025-02-13", timeStart: "9:30 AM", timeEnd: "12:00 PM", training: "Max Recall Training", sme: "Lukman Khiruddin", type: "live", resources: [], waveId: "prog-2" },
  { id: "ts-11", day: "Thursday", date: "2025-02-13", timeStart: "12:00 PM", timeEnd: "1:00 PM", training: "Max Recall Self Study", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2" },
  { id: "ts-12", day: "Thursday", date: "2025-02-13", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Profile Training", sme: "Lukman Khiruddin", type: "live", resources: [], waveId: "prog-2" },
  { id: "ts-13", day: "Thursday", date: "2025-02-13", timeStart: "4:30 PM", timeEnd: "5:30 PM", training: "Profile Self Study", sme: "N/A", type: "self-study", resources: [], waveId: "prog-2" },
];

// Wave 3 — Advanced Review & Certification (upcoming, Mar 10-14, 2025)
export const wave3Schedule: TrainingSession[] = [
  { id: "w3-1", day: "Monday", date: "2025-03-10", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Advanced Policy Enforcement — Overview", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-2", day: "Monday", date: "2025-03-10", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Advanced Policy Self Study", sme: "N/A", type: "self-study", resources: ["Advanced Policy Handbook"], waveId: "prog-3" },
  { id: "w3-3", day: "Monday", date: "2025-03-10", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Advanced Policy Enforcement — Deep Dive", sme: "Angela Zollo", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-4", day: "Monday", date: "2025-03-10", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Policy Case Studies Self Study", sme: "N/A", type: "self-study", resources: ["Case Studies Collection"], waveId: "prog-3" },
  { id: "w3-5", day: "Tuesday", date: "2025-03-11", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Cross-Market Calibration — Methodology", sme: "Carla Prati", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-6", day: "Tuesday", date: "2025-03-11", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Calibration Self Study", sme: "N/A", type: "self-study", resources: ["Cross-Market Calibration Guide"], waveId: "prog-3" },
  { id: "w3-7", day: "Tuesday", date: "2025-03-11", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Cross-Market Calibration Workshop", sme: "Carla Prati", type: "upskilling", resources: [], waveId: "prog-3" },
  { id: "w3-8", day: "Wednesday", date: "2025-03-12", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Edge Case Workshop — Complex Scenarios", sme: "Corneliu Onica", type: "upskilling", resources: ["Edge Case Scenario Pack"], waveId: "prog-3" },
  { id: "w3-9", day: "Wednesday", date: "2025-03-12", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Edge Case Self Study", sme: "N/A", type: "self-study", resources: ["Edge Case Reference Guide"], waveId: "prog-3" },
  { id: "w3-10", day: "Wednesday", date: "2025-03-12", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Edge Case Workshop — Group Exercise", sme: "Fernanda Affonso", type: "upskilling", resources: [], waveId: "prog-3" },
  { id: "w3-11", day: "Thursday", date: "2025-03-13", timeStart: "9:30 AM", timeEnd: "12:00 PM", training: "Certification Assessment — Written", sme: "Heather Yarrish", type: "live", resources: ["Certification Prep Guide"], waveId: "prog-3" },
  { id: "w3-12", day: "Thursday", date: "2025-03-13", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Certification Assessment — Practical", sme: "Angela Zollo", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-13", day: "Thursday", date: "2025-03-13", timeStart: "4:30 PM", timeEnd: "5:30 PM", training: "Assessment Review Self Study", sme: "N/A", type: "self-study", resources: ["Assessment Review Checklist"], waveId: "prog-3" },
  { id: "w3-14", day: "Friday", date: "2025-03-14", timeStart: "9:30 AM", timeEnd: "11:00 AM", training: "Independent Queue Preparation", sme: "Fernanda Affonso", type: "live", resources: [], waveId: "prog-3" },
  { id: "w3-15", day: "Friday", date: "2025-03-14", timeStart: "11:30 AM", timeEnd: "12:30 PM", training: "Queue Prep Self Study", sme: "N/A", type: "self-study", resources: ["Queue Readiness Checklist"], waveId: "prog-3" },
  { id: "w3-16", day: "Friday", date: "2025-03-14", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Wave 3 Wrap-Up & Next Steps", sme: "Heather Yarrish", type: "live", resources: [], waveId: "prog-3" },
];

// Combined schedule (backward compatible)
export const trainingSchedule: TrainingSession[] = [...wave2Schedule];

// All schedules by wave ID
export function getScheduleByWaveId(waveId: string): TrainingSession[] {
  switch (waveId) {
    case "prog-1": return wave1Schedule;
    case "prog-2": return wave2Schedule;
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
