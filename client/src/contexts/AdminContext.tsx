/*
 * Admin Context — Controls admin editing mode
 * Design: "Anthropic Warmth" — Empathetic Admin UX
 * When active, editable fields show subtle dashed borders with pencil icons on hover
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  saveEdit: (field: string, value: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => {
      const next = !prev;
      toast(next ? "Admin mode enabled" : "Admin mode disabled", {
        description: next
          ? "You can now edit schedules and program details inline."
          : "View-only mode restored.",
        duration: 2000,
      });
      return next;
    });
  }, []);

  const saveEdit = useCallback((field: string, value: string) => {
    // In a real app, this would persist to a backend
    console.log(`Saved: ${field} = ${value}`);
    setEditingField(null);
    toast("Changes saved", {
      description: "Your edit has been applied successfully.",
      duration: 1500,
    });
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin, editingField, setEditingField, saveEdit }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
