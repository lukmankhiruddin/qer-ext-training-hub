import { describe, expect, it, beforeAll } from "vitest";

/**
 * Tests for Wave 2 schedule data accuracy.
 * Validates that the Wave 2a (VG SME Deep Dive) and Wave 2b (Complex Object)
 * training data matches the real PDF schedules.
 */

// We import the data directly since it's a shared data module
// Using dynamic import to handle the client-side module
describe("Wave 2a — VG SME Deep Dive Week data accuracy", () => {
  // Import the data module
  let wave2aSchedule: any[];
  let programItinerary: any[];

  beforeAll(async () => {
    const dataModule = await import("../client/src/lib/data");
    wave2aSchedule = dataModule.wave2aSchedule;
    programItinerary = dataModule.programItinerary;
  });

  it("should have the correct number of sessions (24 total)", () => {
    expect(wave2aSchedule.length).toBe(24);
  });

  it("should span 5 days with date-based day labels", () => {
    const uniqueDays = [...new Set(wave2aSchedule.map((s: any) => s.day))];
    expect(uniqueDays).toContain("Tue Feb 3");
    expect(uniqueDays).toContain("Wed Feb 4");
    expect(uniqueDays).toContain("Thu Feb 5");
    expect(uniqueDays).toContain("Fri Feb 6");
    expect(uniqueDays).toContain("Tue Feb 10");
    expect(uniqueDays.length).toBe(5);
  });

  it("should use Andrea Draskovic (not Fernanda Affonso) for RGS1", () => {
    const rgs1Sessions = wave2aSchedule.filter((s: any) => s.training.includes("RGS1"));
    expect(rgs1Sessions.length).toBe(2);
    rgs1Sessions.forEach((s: any) => {
      expect(s.sme).toBe("Andrea Draskovic");
    });
  });

  it("should have correct Tuesday Feb 3 sessions", () => {
    const tueSessions = wave2aSchedule.filter((s: any) => s.day === "Tue Feb 3");
    expect(tueSessions.length).toBe(4);

    const trainings = tueSessions.map((s: any) => s.training).sort();
    expect(trainings).toContain("RGS1 (Group 1)");
    expect(trainings).toContain("Live Video Review (Group 2)");
    expect(trainings).toContain("RGS1 (Group 2)");
    expect(trainings).toContain("BH, V&I, HC (Group 1)");
  });

  it("should have correct Thursday Feb 5 sessions (HeX/DoI/SSI/ASE + ANSA/SSPx/GV)", () => {
    const thuSessions = wave2aSchedule.filter((s: any) => s.day === "Thu Feb 5");
    expect(thuSessions.length).toBe(4);

    const trainings = thuSessions.map((s: any) => s.training);
    expect(trainings).toContain("HeX, DoI, SSI, ASE (Group 1)");
    expect(trainings).toContain("ANSA, SSPx, GV (Group 2)");
    expect(trainings).toContain("ANSA, SSPx, GV (Group 1)");
    expect(trainings).toContain("HeX, DoI, SSI, ASE (Group 2)");
  });

  it("should have Self Study / Nesting for Group 2 on Friday Feb 6", () => {
    const friSessions = wave2aSchedule.filter((s: any) => s.day === "Fri Feb 6");
    const selfStudy = friSessions.filter((s: any) => s.training.includes("Self Study"));
    expect(selfStudy.length).toBe(2);
    selfStudy.forEach((s: any) => {
      expect(s.type).toBe("self-study");
      expect(s.sme).toBe("N/A");
    });
  });

  it("should have ANSA/SSPx/GV and RGS2 on Tuesday Feb 10", () => {
    const tue10Sessions = wave2aSchedule.filter((s: any) => s.day === "Tue Feb 10");
    expect(tue10Sessions.length).toBe(4);

    const trainings = tue10Sessions.map((s: any) => s.training);
    expect(trainings).toContain("ANSA, SSPx, GV (Group 1)");
    expect(trainings).toContain("RGS2 (Group 2)");
  });

  it("should have correct SME assignments on Tuesday Feb 10", () => {
    const tue10Sessions = wave2aSchedule.filter((s: any) => s.day === "Tue Feb 10");
    const ansaSessions = tue10Sessions.filter((s: any) => s.training.includes("ANSA"));
    const rgs2Sessions = tue10Sessions.filter((s: any) => s.training.includes("RGS2"));

    ansaSessions.forEach((s: any) => expect(s.sme).toBe("Ahmed Sayed"));
    rgs2Sessions.forEach((s: any) => expect(s.sme).toBe("Darla Nicole Florendo"));
  });

  it("should have Andrea Draskovic in program smesInvolved", () => {
    const prog2a = programItinerary.find((p: any) => p.id === "prog-2a");
    expect(prog2a).toBeDefined();
    expect(prog2a.smesInvolved).toContain("Andrea Draskovic");
    expect(prog2a.smesInvolved).not.toContain("Fernanda Affonso");
  });

  it("should have date-based daysOfWeek in program definition", () => {
    const prog2a = programItinerary.find((p: any) => p.id === "prog-2a");
    expect(prog2a).toBeDefined();
    expect(prog2a.daysOfWeek).toEqual(["Tue Feb 3", "Wed Feb 4", "Thu Feb 5", "Fri Feb 6", "Tue Feb 10"]);
  });
});

describe("Site Contact — TP Site POC data", () => {
  let siteContact: any;

  beforeAll(async () => {
    const dataModule = await import("../client/src/lib/data");
    siteContact = dataModule.siteContact;
  });

  it("should have Hannah Wynne as the TP Site POC", () => {
    expect(siteContact).toBeDefined();
    expect(siteContact.name).toBe("Hannah Wynne");
    expect(siteContact.role).toBe("TP Site POC");
  });

  it("should have the correct phone number", () => {
    expect(siteContact.phone).toBe("085 219 0640");
  });

  it("should have a support description", () => {
    expect(siteContact.description).toBeTruthy();
    expect(siteContact.description.length).toBeGreaterThan(10);
  });
});

describe("Wave 2b — Complex Object Training data accuracy", () => {
  let wave2bSchedule: any[];
  let programItinerary: any[];

  beforeAll(async () => {
    const dataModule = await import("../client/src/lib/data");
    wave2bSchedule = dataModule.wave2bSchedule;
    programItinerary = dataModule.programItinerary;
  });

  it("should have the correct number of sessions (10 total)", () => {
    expect(wave2bSchedule.length).toBe(10);
  });

  it("should span 3 days (Tuesday, Wednesday, Thursday)", () => {
    const uniqueDays = [...new Set(wave2bSchedule.map((s: any) => s.day))];
    expect(uniqueDays).toContain("Tuesday");
    expect(uniqueDays).toContain("Wednesday");
    expect(uniqueDays).toContain("Thursday");
    expect(uniqueDays.length).toBe(3);
  });

  it("should have Martin Wallin for Groups Training", () => {
    const groupsSessions = wave2bSchedule.filter((s: any) => s.training.includes("Groups Training"));
    expect(groupsSessions.length).toBe(1);
    expect(groupsSessions[0].sme).toBe("Martin Wallin");
  });

  it("should have Corneliu Onica for Messenger IC Upskilling", () => {
    const messengerSessions = wave2bSchedule.filter((s: any) => s.training.includes("Messenger IC Upskilling"));
    expect(messengerSessions.length).toBe(2);
    messengerSessions.forEach((s: any) => expect(s.sme).toBe("Corneliu Onica"));
  });

  it("should have Lukman Khiruddin for Max Recall and Profile Training", () => {
    const lukmanSessions = wave2bSchedule.filter((s: any) => s.sme === "Lukman Khiruddin");
    expect(lukmanSessions.length).toBe(2);
    const trainings = lukmanSessions.map((s: any) => s.training);
    expect(trainings).toContain("Max Recall Training");
    expect(trainings).toContain("Profile Training");
  });

  it("should have correct program definition", () => {
    const prog2b = programItinerary.find((p: any) => p.id === "prog-2b");
    expect(prog2b).toBeDefined();
    expect(prog2b.wave).toBe("Wave 2 — Complex Object Training");
    expect(prog2b.startDate).toBe("2025-02-11");
    expect(prog2b.endDate).toBe("2025-02-13");
    expect(prog2b.smesInvolved).toContain("Martin Wallin");
    expect(prog2b.smesInvolved).toContain("Corneliu Onica");
    expect(prog2b.smesInvolved).toContain("Lukman Khiruddin");
  });
});
