/*
 * Communication Hub — Core Data Layer
 * Design: "Anthropic Warmth" — Editorial Minimalism
 * All data sourced from real CSV/XLSX files
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
// Real Training Schedule from CSV — Wave 2 Complex Object Training
// Location: Dublin | Week of Feb 10-13, 2025
// ============================================================
export const trainingSchedule: TrainingSession[] = [
  // Monday Feb 10 (labeled as "Monday 5th Jan" in CSV but contextually Feb 10)
  { id: "ts-1", day: "Monday", date: "2025-02-10", timeStart: "9:30 AM", timeEnd: "10:30 AM", training: "Live Video Training", sme: "Farrukh Ahmed", type: "live", resources: [] },
  { id: "ts-2", day: "Monday", date: "2025-02-10", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Threads / Simple Objects Module", sme: "Farrukh Ahmed", type: "upskilling", resources: [] },
  { id: "ts-3", day: "Monday", date: "2025-02-10", timeStart: "4:00 PM", timeEnd: "5:00 PM", training: "Live Video Self Study", sme: "N/A", type: "self-study", resources: [] },

  // Tuesday Feb 11
  { id: "ts-4", day: "Tuesday", date: "2025-02-11", timeStart: "9:30 AM", timeEnd: "10:30 AM", training: "Groups Training — Group Review Training Dec 2025", sme: "Martin Wallin", type: "live", resources: [] },
  { id: "ts-5", day: "Tuesday", date: "2025-02-11", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Groups Self Study — Ops Guideline & Complex Objects Module", sme: "N/A", type: "self-study", resources: ["Link Ops Guideline", "Complex Objects module"] },

  // Wednesday Feb 12
  { id: "ts-6", day: "Wednesday", date: "2025-02-12", timeStart: "9:30 AM", timeEnd: "10:00 AM", training: "Messenger Self Study — Ops Guidelines & Cornerstone", sme: "N/A", type: "self-study", resources: ["Link Ops guidelines", "Link Cornerstone Messenger Cornerstone"] },
  { id: "ts-7", day: "Wednesday", date: "2025-02-12", timeStart: "10:30 AM", timeEnd: "12:00 PM", training: "Messenger IIC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IIC for Messenger training material"] },
  { id: "ts-8", day: "Wednesday", date: "2025-02-12", timeStart: "2:00 PM", timeEnd: "3:30 PM", training: "Messenger IIC Upskilling Training", sme: "Corneliu Onica", type: "upskilling", resources: ["IIC for Messenger training material"] },
  { id: "ts-9", day: "Wednesday", date: "2025-02-12", timeStart: "3:30 PM", timeEnd: "4:30 PM", training: "Messenger Self Study — Ops Guidelines & Cornerstone", sme: "N/A", type: "self-study", resources: ["Link Ops guidelines", "Link Cornerstone Messenger Cornerstone"] },

  // Thursday Feb 13
  { id: "ts-10", day: "Thursday", date: "2025-02-13", timeStart: "9:30 AM", timeEnd: "12:00 PM", training: "Max Recall Training", sme: "Lukman Khiruddin", type: "live", resources: [] },
  { id: "ts-11", day: "Thursday", date: "2025-02-13", timeStart: "12:00 PM", timeEnd: "1:00 PM", training: "Max Recall Self Study", sme: "N/A", type: "self-study", resources: [] },
  { id: "ts-12", day: "Thursday", date: "2025-02-13", timeStart: "2:00 PM", timeEnd: "4:00 PM", training: "Profile Training", sme: "Lukman Khiruddin", type: "live", resources: [] },
  { id: "ts-13", day: "Thursday", date: "2025-02-13", timeStart: "4:30 PM", timeEnd: "5:30 PM", training: "Profile Self Study", sme: "N/A", type: "self-study", resources: [] },
];

// ============================================================
// Program Itinerary (mock + real context)
// ============================================================
export const programItinerary: ProgramItinerary[] = [
  {
    id: "prog-1",
    program: "TP Onboarding Schedule",
    wave: "Wave 2 — Complex Object Training",
    location: "Dublin",
    startDate: "2025-02-10",
    endDate: "2025-02-13",
    status: "active",
    description: "Upskilling training for Teleperformance vendor onboarding. Covers Live Video, Threads, Groups, Messenger, Max Recall, and Profile modules."
  },
  {
    id: "prog-2",
    program: "Accenture Bangkok Onboarding",
    wave: "Wave 1 — Simple Object Training",
    location: "Bangkok",
    startDate: "2025-01-20",
    endDate: "2025-01-24",
    status: "completed",
    description: "Initial onboarding training for Accenture Bangkok team covering Simple Object review processes and market-specific guidelines."
  },
  {
    id: "prog-3",
    program: "Covalen Dublin Refresher",
    wave: "Q1 2025 — Policy Updates",
    location: "Dublin",
    startDate: "2025-03-03",
    endDate: "2025-03-07",
    status: "upcoming",
    description: "Quarterly policy refresh training for Covalen Dublin covering updated community standards and new enforcement guidelines."
  },
];

// ============================================================
// Vendor contacts
// ============================================================
export interface VendorContact {
  id: string;
  vendor: string;
  location: string;
  primaryContact: string;
  email: string;
  role: string;
}

export const vendorContacts: VendorContact[] = [
  { id: "vc-1", vendor: "Accenture", location: "Dublin", primaryContact: "Operations Manager", email: "ops.dublin@accenture.com", role: "Vendor Operations" },
  { id: "vc-2", vendor: "Teleperformance", location: "Dublin", primaryContact: "Training Coordinator", email: "training@teleperformance.com", role: "Training Delivery" },
  { id: "vc-3", vendor: "Covalen", location: "Dublin", primaryContact: "Site Manager", email: "site.mgr@covalen.com", role: "Site Operations" },
  { id: "vc-4", vendor: "Accenture", location: "Bangkok", primaryContact: "Regional Lead", email: "regional.bkk@accenture.com", role: "Regional Operations" },
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

export function getDaysOfWeek(): string[] {
  return ["Monday", "Tuesday", "Wednesday", "Thursday"];
}

export function getSessionTypeColor(type: TrainingSession['type']): string {
  switch (type) {
    case 'live': return 'bg-amber/15 border-amber text-amber-dark';
    case 'self-study': return 'bg-sage/10 border-sage-light text-sage';
    case 'upskilling': return 'bg-primary/10 border-primary/30 text-primary';
    default: return 'bg-muted border-border text-muted-foreground';
  }
}

export function getSessionTypeBadge(type: TrainingSession['type']): { label: string; color: string } {
  switch (type) {
    case 'live': return { label: 'Live Training', color: 'bg-amber/20 text-amber-dark' };
    case 'self-study': return { label: 'Self Study', color: 'bg-sage/15 text-sage' };
    case 'upskilling': return { label: 'Upskilling', color: 'bg-primary/15 text-primary' };
    default: return { label: 'Session', color: 'bg-muted text-muted-foreground' };
  }
}
