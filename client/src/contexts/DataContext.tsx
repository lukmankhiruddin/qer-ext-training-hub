/*
 * Data Context — Centralized state management for all hub data
 * Supports multi-wave schedules with wave selection
 * Allows admin edits to propagate across all views
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
  // All wave schedules
  allSchedules: Record<string, TrainingSession[]>;
  // Active wave schedule (currently selected)
  schedule: TrainingSession[];
  activeWaveId: string;
  setActiveWaveId: (id: string) => void;
  getScheduleForWave: (waveId: string) => TrainingSession[];
  programs: ProgramItinerary[];
  smes: SME[];
  contacts: VendorContact[];
  updateSession: (id: string, updates: Partial<TrainingSession>) => void;
  updateProgram: (id: string, updates: Partial<ProgramItinerary>) => void;
  addSession: (session: TrainingSession) => void;
  deleteSession: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [allSchedules, setAllSchedules] = useState<Record<string, TrainingSession[]>>({
    "prog-1": [...wave1Schedule],
    "prog-2": [...wave2Schedule],
    "prog-3": [...wave3Schedule],
  });
  const [activeWaveId, setActiveWaveId] = useState("prog-2"); // Wave 2 is active
  const [programs, setPrograms] = useState<ProgramItinerary[]>(initialPrograms);
  const [smes] = useState<SME[]>(initialSMEs);
  const [contacts] = useState<VendorContact[]>(initialContacts);

  const schedule = allSchedules[activeWaveId] ?? [];

  const getScheduleForWave = useCallback((waveId: string) => {
    return allSchedules[waveId] ?? [];
  }, [allSchedules]);

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

  const updateProgram = useCallback((id: string, updates: Partial<ProgramItinerary>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
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

  return (
    <DataContext.Provider value={{
      allSchedules,
      schedule,
      activeWaveId,
      setActiveWaveId,
      getScheduleForWave,
      programs,
      smes,
      contacts,
      updateSession,
      updateProgram,
      addSession,
      deleteSession,
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
