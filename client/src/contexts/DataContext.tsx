/*
 * Data Context — Centralized state management with full CRUD
 * Supports multi-wave schedules, SME management, contact management
 * All changes propagate across all views in real-time
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  wave1Schedule,
  wave2Schedule,
  wave3Schedule,
  programItinerary as initialPrograms,
  smeData as initialSMEs,
  vendorContacts as initialContacts,
  type TrainingSession,
  type ProgramItinerary,
  type SME,
  type VendorContact,
} from "@/lib/data";

interface DataContextType {
  // Schedules
  allSchedules: Record<string, TrainingSession[]>;
  schedule: TrainingSession[];
  activeWaveId: string;
  setActiveWaveId: (id: string) => void;
  getScheduleForWave: (waveId: string) => TrainingSession[];
  updateSession: (id: string, updates: Partial<TrainingSession>) => void;
  addSession: (session: TrainingSession) => void;
  deleteSession: (id: string) => void;

  // Programs
  programs: ProgramItinerary[];
  updateProgram: (id: string, updates: Partial<ProgramItinerary>) => void;
  addProgram: (program: ProgramItinerary) => void;
  deleteProgram: (id: string) => void;

  // SMEs
  smes: SME[];
  addSME: (sme: SME) => void;
  updateSME: (id: string, updates: Partial<SME>) => void;
  deleteSME: (id: string) => void;

  // Contacts
  contacts: VendorContact[];
  addContact: (contact: VendorContact) => void;
  updateContact: (id: string, updates: Partial<VendorContact>) => void;
  deleteContact: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [allSchedules, setAllSchedules] = useState<Record<string, TrainingSession[]>>({
    "prog-1": [...wave1Schedule],
    "prog-2": [...wave2Schedule],
    "prog-3": [...wave3Schedule],
  });
  const [activeWaveId, setActiveWaveId] = useState("prog-2");
  const [programs, setPrograms] = useState<ProgramItinerary[]>(initialPrograms);
  const [smes, setSMEs] = useState<SME[]>(initialSMEs);
  const [contacts, setContacts] = useState<VendorContact[]>(initialContacts);

  const schedule = allSchedules[activeWaveId] ?? [];

  const getScheduleForWave = useCallback((waveId: string) => {
    return allSchedules[waveId] ?? [];
  }, [allSchedules]);

  // Session CRUD
  const updateSession = useCallback((id: string, updates: Partial<TrainingSession>) => {
    setAllSchedules(prev => {
      const newSchedules = { ...prev };
      for (const waveId of Object.keys(newSchedules)) {
        newSchedules[waveId] = newSchedules[waveId].map(s =>
          s.id === id ? { ...s, ...updates } : s
        );
      }
      return newSchedules;
    });
  }, []);

  const addSession = useCallback((session: TrainingSession) => {
    const waveId = session.waveId || activeWaveId;
    setAllSchedules(prev => ({
      ...prev,
      [waveId]: [...(prev[waveId] ?? []), session],
    }));
  }, [activeWaveId]);

  const deleteSession = useCallback((id: string) => {
    setAllSchedules(prev => {
      const newSchedules = { ...prev };
      for (const waveId of Object.keys(newSchedules)) {
        newSchedules[waveId] = newSchedules[waveId].filter(s => s.id !== id);
      }
      return newSchedules;
    });
  }, []);

  // Program CRUD
  const updateProgram = useCallback((id: string, updates: Partial<ProgramItinerary>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addProgram = useCallback((program: ProgramItinerary) => {
    setPrograms(prev => [...prev, program]);
    setAllSchedules(prev => ({ ...prev, [program.id]: [] }));
  }, []);

  const deleteProgram = useCallback((id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    setAllSchedules(prev => {
      const newSchedules = { ...prev };
      delete newSchedules[id];
      return newSchedules;
    });
  }, []);

  // SME CRUD
  const addSME = useCallback((sme: SME) => {
    setSMEs(prev => [...prev, sme]);
  }, []);

  const updateSME = useCallback((id: string, updates: Partial<SME>) => {
    setSMEs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSME = useCallback((id: string) => {
    setSMEs(prev => prev.filter(s => s.id !== id));
  }, []);

  // Contact CRUD
  const addContact = useCallback((contact: VendorContact) => {
    setContacts(prev => [...prev, contact]);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<VendorContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      allSchedules,
      schedule,
      activeWaveId,
      setActiveWaveId,
      getScheduleForWave,
      updateSession,
      addSession,
      deleteSession,
      programs,
      updateProgram,
      addProgram,
      deleteProgram,
      smes,
      addSME,
      updateSME,
      deleteSME,
      contacts,
      addContact,
      updateContact,
      deleteContact,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
