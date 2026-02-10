/*
 * Data Context — Centralized state management for all hub data
 * Allows admin edits to propagate across all views
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  trainingSchedule as initialSchedule,
  programItinerary as initialPrograms,
  smeData as initialSMEs,
  vendorContacts as initialContacts,
  type TrainingSession,
  type ProgramItinerary,
  type SME,
  type VendorContact,
} from "@/lib/data";

interface DataContextType {
  schedule: TrainingSession[];
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
  const [schedule, setSchedule] = useState<TrainingSession[]>(initialSchedule);
  const [programs, setPrograms] = useState<ProgramItinerary[]>(initialPrograms);
  const [smes] = useState<SME[]>(initialSMEs);
  const [contacts] = useState<VendorContact[]>(initialContacts);

  const updateSession = useCallback((id: string, updates: Partial<TrainingSession>) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const updateProgram = useCallback((id: string, updates: Partial<ProgramItinerary>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addSession = useCallback((session: TrainingSession) => {
    setSchedule(prev => [...prev, session]);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{ schedule, programs, smes, contacts, updateSession, updateProgram, addSession, deleteSession }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
