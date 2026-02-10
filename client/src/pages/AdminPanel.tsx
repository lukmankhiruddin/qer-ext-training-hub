/*
 * Admin Control Panel — Full CRUD management for the Communication Hub
 * Design: Modern Meta/Apple hybrid — glass cards, gradient accents, vibrant badges
 * Tabs: Overview, Users, Sessions, Programs, SMEs, Contacts, Activity Log
 */
import { useState, useMemo } from "react";
import { useAdmin, type AdminUser } from "@/contexts/AdminContext";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import {
  Users, CalendarDays, FolderKanban, UserPlus, Trash2, Plus, Edit3, Shield, Eye,
  Activity, Settings, BookOpen, Phone, Search, X, ChevronRight, Clock, MapPin, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { type TrainingSession, type ProgramItinerary, type SME, type VendorContact, getSessionTypeBadge, getStatusBadge } from "@/lib/data";

type Tab = "overview" | "users" | "sessions" | "programs" | "smes" | "contacts" | "activity";

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "sessions", label: "Sessions", icon: CalendarDays },
  { id: "programs", label: "Programs", icon: FolderKanban },
  { id: "smes", label: "SMEs", icon: BookOpen },
  { id: "contacts", label: "Contacts", icon: Phone },
  { id: "activity", label: "Activity Log", icon: Activity },
];

export default function AdminPanel() {
  const { isAdmin, currentUser, activityLog, logActivity } = useAdmin();
  const { programs, smes, contacts, allSchedules, addSession, deleteSession, updateSession, addProgram, deleteProgram, updateProgram, addSME, deleteSME, updateSME, addContact, deleteContact, updateContact, activeWaveId } = useData();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <h2 className="text-[20px] font-bold text-foreground tracking-[-0.01em] mb-2">Access Denied</h2>
          <p className="text-[14px] text-muted-foreground mb-5">
            You need admin privileges to access the Control Panel. Please log in as admin from the navigation bar.
          </p>
          <Button onClick={() => navigate("/")} className="gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] border-0 hover:opacity-90 transition-all duration-300">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const totalSessions = Object.values(allSchedules).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03]" />
        <div className="container relative py-6">
          <div className="flex items-center gap-2 mb-1.5 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.08em]">Control Panel</span>
          </div>
          <h1 className="text-[26px] font-bold text-foreground tracking-[-0.02em] mb-1 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
            Admin Dashboard
          </h1>
          <p className="text-[14px] text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Manage users, sessions, programs, SMEs, and contacts. All changes are reflected in real-time.
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="lg:w-56 shrink-0 animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
            <div className="glass-card p-2 lg:sticky lg:top-20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-left",
                    activeTab === tab.id
                      ? "bg-primary/8 text-primary shadow-[0_1px_3px_oklch(0.55_0.22_264_/_8%)]"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-[18px] h-[18px]" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            {activeTab === "overview" && (
              <OverviewTab totalSessions={totalSessions} totalPrograms={programs.length} totalSMEs={smes.length} totalContacts={contacts.length} totalUsers={1} recentActivity={activityLog.slice(0, 5)} onTabChange={setActiveTab} />
            )}
            {activeTab === "users" && (
              <UsersTab currentUser={currentUser} />
            )}
            {activeTab === "sessions" && (
              <SessionsTab allSchedules={allSchedules} programs={programs} activeWaveId={activeWaveId} onAdd={addSession} onDelete={(id) => { deleteSession(id); logActivity("Session Deleted", `Session ${id} removed`); }} onUpdate={(id, updates) => { updateSession(id, updates); logActivity("Session Updated", `Session ${id} updated`); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
            {activeTab === "programs" && (
              <ProgramsTab programs={programs} onAdd={(p) => { addProgram(p); logActivity("Program Added", `${p.wave} created`); }} onDelete={(id) => { deleteProgram(id); logActivity("Program Deleted", `Program ${id} removed`); }} onUpdate={(id, updates) => { updateProgram(id, updates); logActivity("Program Updated", `Program ${id} updated`); }} />
            )}
            {activeTab === "smes" && (
              <SMEsTab smes={smes} onAdd={(s) => { addSME(s); logActivity("SME Added", `${s.name} added`); }} onDelete={(id) => { deleteSME(id); logActivity("SME Deleted", `SME ${id} removed`); }} onUpdate={(id, updates) => { updateSME(id, updates); logActivity("SME Updated", `SME ${id} updated`); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
            {activeTab === "contacts" && (
              <ContactsTab contacts={contacts} onAdd={(c) => { addContact(c); logActivity("Contact Added", `${c.name} added`); }} onDelete={(id) => { deleteContact(id); logActivity("Contact Deleted", `Contact ${id} removed`); }} onUpdate={(id, updates) => { updateContact(id, updates); logActivity("Contact Updated", `Contact ${id} updated`); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
            {activeTab === "activity" && <ActivityTab log={activityLog} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
function OverviewTab({ totalSessions, totalPrograms, totalSMEs, totalContacts, totalUsers, recentActivity, onTabChange }: {
  totalSessions: number; totalPrograms: number; totalSMEs: number; totalContacts: number; totalUsers: number;
  recentActivity: { id: string; timestamp: string; user: string; action: string; detail: string }[];
  onTabChange: (tab: Tab) => void;
}) {
  const stats = [
    { label: "Sessions", value: totalSessions, icon: CalendarDays, tab: "sessions" as Tab, gradient: "from-blue-400 to-indigo-500" },
    { label: "Programs", value: totalPrograms, icon: FolderKanban, tab: "programs" as Tab, gradient: "from-purple-400 to-pink-500" },
    { label: "SMEs", value: totalSMEs, icon: BookOpen, tab: "smes" as Tab, gradient: "from-emerald-400 to-teal-500" },
    { label: "Contacts", value: totalContacts, icon: Phone, tab: "contacts" as Tab, gradient: "from-amber-400 to-orange-500" },
    { label: "Admins", value: totalUsers, icon: Users, tab: "users" as Tab, gradient: "from-cyan-400 to-blue-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <button key={stat.label} onClick={() => onTabChange(stat.tab)} className="glass-card p-4 text-left hover-lift group">
            <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-sm", stat.gradient)}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-[26px] font-bold text-foreground tracking-[-0.02em] leading-none">{stat.value}</p>
            <p className="text-[12px] text-muted-foreground mt-1 group-hover:text-primary transition-colors duration-200">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-[15px] font-bold text-foreground tracking-[-0.01em] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: "Add Session", icon: Plus, tab: "sessions" as Tab },
            { label: "Add SME", icon: UserPlus, tab: "smes" as Tab },
            { label: "Manage Users", icon: Users, tab: "users" as Tab },
            { label: "View Activity", icon: Activity, tab: "activity" as Tab },
          ].map(action => (
            <button key={action.label} onClick={() => onTabChange(action.tab)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-primary/6 text-[13px] font-medium text-foreground transition-all duration-200 group">
              <action.icon className="w-4 h-4 text-primary" />
              {action.label}
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-foreground tracking-[-0.01em]">Recent Activity</h3>
          <button onClick={() => onTabChange("activity")} className="text-[12px] text-primary font-semibold hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {recentActivity.map(entry => (
            <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
              <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-foreground font-medium">{entry.action}</p>
                <p className="text-[12px] text-muted-foreground truncate">{entry.detail}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">{entry.user} · {formatTimeAgo(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
function UsersTab({ currentUser }: { currentUser: AdminUser | null }) {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="mb-4">
          <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em]">Users & Roles</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">User access is managed through Manus OAuth authentication</p>
        </div>

        {/* Current User */}
        {currentUser && (
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Current User</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-purple-500/10 flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-primary">{currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-foreground">{currentUser.name}</p>
                  {currentUser.role === "admin" && <span className="vibrant-badge vibrant-badge-amber">Owner</span>}
                </div>
                <p className="text-[12px] text-muted-foreground">{currentUser.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("vibrant-badge", currentUser.role === "admin" ? "vibrant-badge-blue" : "vibrant-badge-gray")}>
                  {currentUser.role === "admin" ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {currentUser.role === "admin" ? "Admin" : "Viewer"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-4 bg-gradient-to-r from-primary/[0.03] to-purple-500/[0.03]">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">About Roles</p>
            <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
              <strong>Admin</strong> users can edit all content directly on the website — sessions, programs, SME details, and contacts.
              <strong> Viewer</strong> users can only view the dashboard and schedules without making changes.
              User roles are managed through the database. The project owner is automatically assigned the admin role.
              To promote other users to admin, update their role in the Database panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
function SessionsTab({ allSchedules, programs, activeWaveId, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery }: {
  allSchedules: Record<string, TrainingSession[]>; programs: ProgramItinerary[]; activeWaveId: string;
  onAdd: (session: TrainingSession) => void; onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TrainingSession>) => void; searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const [selectedWave, setSelectedWave] = useState(activeWaveId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sessions = allSchedules[selectedWave] ?? [];
  const program = programs.find(p => p.id === selectedWave);
  const DAYS = program?.daysOfWeek ?? ["Monday", "Tuesday", "Wednesday", "Thursday"];

  const filteredSessions = sessions.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.training.toLowerCase().includes(q) || s.sme.toLowerCase().includes(q) || s.day.toLowerCase().includes(q);
  }).sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  const [newSession, setNewSession] = useState({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" as TrainingSession["type"] });

  const handleAdd = () => {
    const session: TrainingSession = { id: `ts-${Date.now()}`, day: newSession.day, date: "", timeStart: newSession.timeStart, timeEnd: newSession.timeEnd, training: newSession.training, sme: newSession.sme || "N/A", type: newSession.type, waveId: selectedWave };
    onAdd(session); setAddDialogOpen(false);
    setNewSession({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" });
    toast.success("Session added");
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em]">Training Sessions</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">{sessions.length} sessions in {program?.wave ?? "—"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedWave} onValueChange={setSelectedWave}>
              <SelectTrigger className="w-[200px] rounded-xl border-border/40 bg-secondary/40 h-9 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_oklch(0.4_0.1_270_/_12%)]">
                {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.wave}</SelectItem>)}
              </SelectContent>
            </Select>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] border-0 hover:opacity-90 transition-all duration-300">
                  <Plus className="w-3.5 h-3.5" />Add
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[420px]">
                <DialogHeader><DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Training Session</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Day</Label>
                      <Select value={newSession.day} onValueChange={v => setNewSession(p => ({ ...p, day: v }))}>
                        <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Type</Label>
                      <Select value={newSession.type} onValueChange={v => setNewSession(p => ({ ...p, type: v as TrainingSession["type"] }))}>
                        <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="live">Live</SelectItem><SelectItem value="self-study">Self Study</SelectItem><SelectItem value="upskilling">Upskilling</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Start</Label><Input value={newSession.timeStart} onChange={e => setNewSession(p => ({ ...p, timeStart: e.target.value }))} className="rounded-xl border-border/50" /></div>
                    <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">End</Label><Input value={newSession.timeEnd} onChange={e => setNewSession(p => ({ ...p, timeEnd: e.target.value }))} className="rounded-xl border-border/50" /></div>
                  </div>
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Training Title</Label><Input value={newSession.training} onChange={e => setNewSession(p => ({ ...p, training: e.target.value }))} className="rounded-xl border-border/50" /></div>
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">SME</Label><Input value={newSession.sme} onChange={e => setNewSession(p => ({ ...p, sme: e.target.value }))} className="rounded-xl border-border/50" /></div>
                  <Button onClick={handleAdd} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newSession.training}>Add Session</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search sessions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-secondary/60 border-none rounded-xl text-[13px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30">
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Day</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Time</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Training</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">SME</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Type</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => {
                const badge = getSessionTypeBadge(session.type);
                return (
                  <tr key={session.id} className="border-b border-border/15 hover:bg-primary/[0.02] transition-all duration-200 group">
                    <td className="py-2.5 px-3 text-[13px] font-medium text-foreground">{session.day}</td>
                    <td className="py-2.5 px-3 text-[12px] text-muted-foreground font-mono">{session.timeStart} – {session.timeEnd}</td>
                    <td className="py-2.5 px-3 text-[13px] text-foreground max-w-[200px] truncate">{session.training}</td>
                    <td className="py-2.5 px-3 text-[13px] text-muted-foreground">{session.sme}</td>
                    <td className="py-2.5 px-3"><span className={cn("vibrant-badge", badge.color)}>{badge.label}</span></td>
                    <td className="py-2.5 px-3">
                      <button onClick={() => { onDelete(session.id); toast("Session removed"); }}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground mt-3">{filteredSessions.length} of {sessions.length} sessions</p>
      </div>
    </div>
  );
}

/* ============================================================ */
function ProgramsTab({ programs, onAdd, onDelete, onUpdate }: {
  programs: ProgramItinerary[]; onAdd: (p: ProgramItinerary) => void;
  onDelete: (id: string) => void; onUpdate: (id: string, updates: Partial<ProgramItinerary>) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProg, setNewProg] = useState({ program: "TP Onboarding Schedule", wave: "", location: "Dublin", startDate: "", endDate: "", status: "upcoming" as ProgramItinerary["status"], description: "", modules: "", smes: "" });

  const handleAdd = () => {
    const prog: ProgramItinerary = { id: `prog-${Date.now()}`, program: newProg.program, wave: newProg.wave, location: newProg.location, startDate: newProg.startDate, endDate: newProg.endDate, status: newProg.status, description: newProg.description, modules: newProg.modules.split(",").map(m => m.trim()).filter(Boolean), smesInvolved: newProg.smes.split(",").map(s => s.trim()).filter(Boolean), daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] };
    onAdd(prog); setAddDialogOpen(false); toast.success("Program added");
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em]">Training Programs</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">Manage training waves and programs</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] border-0 hover:opacity-90 transition-all duration-300"><Plus className="w-3.5 h-3.5" />Add Program</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Training Program</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-3 max-h-[60vh] overflow-y-auto pr-1">
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Program Name</Label><Input value={newProg.program} onChange={e => setNewProg(p => ({ ...p, program: e.target.value }))} className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Wave Title</Label><Input value={newProg.wave} onChange={e => setNewProg(p => ({ ...p, wave: e.target.value }))} placeholder="e.g., Wave 4 — Quality Assurance" className="rounded-xl border-border/50" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Start Date</Label><Input type="date" value={newProg.startDate} onChange={e => setNewProg(p => ({ ...p, startDate: e.target.value }))} className="rounded-xl border-border/50" /></div>
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">End Date</Label><Input type="date" value={newProg.endDate} onChange={e => setNewProg(p => ({ ...p, endDate: e.target.value }))} className="rounded-xl border-border/50" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Location</Label><Input value={newProg.location} onChange={e => setNewProg(p => ({ ...p, location: e.target.value }))} className="rounded-xl border-border/50" /></div>
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Status</Label>
                    <Select value={newProg.status} onValueChange={v => setNewProg(p => ({ ...p, status: v as ProgramItinerary["status"] }))}>
                      <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Description</Label>
                  <textarea value={newProg.description} onChange={e => setNewProg(p => ({ ...p, description: e.target.value }))} className="w-full bg-white border border-border/50 rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={3} />
                </div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Modules (comma-separated)</Label><Input value={newProg.modules} onChange={e => setNewProg(p => ({ ...p, modules: e.target.value }))} className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">SMEs (comma-separated)</Label><Input value={newProg.smes} onChange={e => setNewProg(p => ({ ...p, smes: e.target.value }))} className="rounded-xl border-border/50" /></div>
                <Button onClick={handleAdd} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newProg.wave}>Add Program</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {programs.map(prog => {
            const status = getStatusBadge(prog.status);
            return (
              <div key={prog.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] font-bold text-foreground">{prog.wave}</h4>
                      <span className={cn("vibrant-badge", prog.status === "completed" ? "vibrant-badge-gray" : prog.status === "active" ? "vibrant-badge-green" : "vibrant-badge-blue")}>{status.label}</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground mb-2">{prog.description}</p>
                    <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prog.location}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{prog.startDate} – {prog.endDate}</span>
                      <span>{prog.modules.length} modules</span>
                      <span>{prog.smesInvolved.length} SMEs</span>
                    </div>
                  </div>
                  <button onClick={() => { onDelete(prog.id); toast("Program removed"); }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
function SMEsTab({ smes, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery }: {
  smes: SME[]; onAdd: (sme: SME) => void; onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SME>) => void; searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSME, setNewSME] = useState({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" });

  const filtered = smes.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.market.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    const sme: SME = { id: `sme-${Date.now()}`, name: newSME.name, market: newSME.market, vendors: [], roles: newSME.roles.split(",").map(r => r.trim()).filter(Boolean), policySME: "", space: newSME.space, location: newSME.location };
    onAdd(sme); setAddDialogOpen(false); setNewSME({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" }); toast.success("SME added");
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em]">Subject Matter Experts</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">Manage the SME directory</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] border-0 hover:opacity-90 transition-all duration-300"><UserPlus className="w-3.5 h-3.5" />Add SME</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[420px]">
              <DialogHeader><DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add SME</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-3">
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Full Name</Label><Input value={newSME.name} onChange={e => setNewSME(p => ({ ...p, name: e.target.value }))} placeholder="e.g., John Smith" className="rounded-xl border-border/50" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Market</Label><Input value={newSME.market} onChange={e => setNewSME(p => ({ ...p, market: e.target.value }))} placeholder="e.g., Arabic" className="rounded-xl border-border/50" /></div>
                  <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Location</Label>
                    <Select value={newSME.location} onValueChange={v => setNewSME(p => ({ ...p, location: v }))}>
                      <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Dublin">Dublin</SelectItem><SelectItem value="Bangkok">Bangkok</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Space</Label>
                  <Select value={newSME.space} onValueChange={v => setNewSME(p => ({ ...p, space: v }))}>
                    <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Simple Object">Simple Object</SelectItem><SelectItem value="Complex Object">Complex Object</SelectItem><SelectItem value="Simple Object & Complex Object">Simple & Complex</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Roles (comma-separated)</Label><Input value={newSME.roles} onChange={e => setNewSME(p => ({ ...p, roles: e.target.value }))} placeholder="Market SME, VG SME" className="rounded-xl border-border/50" /></div>
                <Button onClick={handleAdd} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newSME.name}>Add SME</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search SMEs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-secondary/60 border-none rounded-xl text-[13px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30">
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Name</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Market</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Location</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Space</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Roles</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sme => (
                <tr key={sme.id} className="border-b border-border/15 hover:bg-primary/[0.02] transition-all duration-200 group">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-purple-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{sme.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                      </div>
                      <span className="text-[13px] font-medium text-foreground">{sme.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[13px] text-muted-foreground">{sme.market}</td>
                  <td className="py-2.5 px-3 text-[13px] text-muted-foreground">{sme.location}</td>
                  <td className="py-2.5 px-3 text-[12px] text-muted-foreground">{sme.space}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {sme.roles.slice(0, 2).map(r => <span key={r} className="vibrant-badge vibrant-badge-gray">{r}</span>)}
                      {sme.roles.length > 2 && <span className="vibrant-badge vibrant-badge-gray">+{sme.roles.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => { onDelete(sme.id); toast("SME removed"); }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground mt-3">{filtered.length} of {smes.length} SMEs</p>
      </div>
    </div>
  );
}

/* ============================================================ */
function ContactsTab({ contacts, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery }: {
  contacts: VendorContact[]; onAdd: (contact: VendorContact) => void; onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<VendorContact>) => void; searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", vendor: "", email: "", phone: "" });

  const filtered = contacts.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    const contact: VendorContact = { id: `vc-${Date.now()}`, name: newContact.name, role: newContact.role, vendor: newContact.vendor, location: "Dublin", primaryContact: newContact.role, email: newContact.email, phone: newContact.phone };
    onAdd(contact); setAddDialogOpen(false); setNewContact({ name: "", role: "", vendor: "", email: "", phone: "" }); toast.success("Contact added");
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em]">Vendor Contacts</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">Key contacts for vendor coordination</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] border-0 hover:opacity-90 transition-all duration-300"><Plus className="w-3.5 h-3.5" />Add Contact</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[420px]">
              <DialogHeader><DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Contact</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-3">
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Full Name</Label><Input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Role / Title</Label><Input value={newContact.role} onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))} placeholder="e.g., Training Manager" className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Vendor</Label><Input value={newContact.vendor} onChange={e => setNewContact(p => ({ ...p, vendor: e.target.value }))} placeholder="e.g., Teleperformance" className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Email</Label><Input value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} type="email" className="rounded-xl border-border/50" /></div>
                <div><Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Phone</Label><Input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="rounded-xl border-border/50" /></div>
                <Button onClick={handleAdd} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newContact.name}>Add Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search contacts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-secondary/60 border-none rounded-xl text-[13px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(contact => (
            <div key={contact.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 group relative">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-purple-500/10 flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-bold text-primary">{contact.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-foreground">{contact.name}</p>
                  <p className="text-[12px] text-muted-foreground">{contact.role}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">{contact.vendor}</p>
                  {contact.email && <p className="text-[12px] text-primary mt-1">{contact.email}</p>}
                  {contact.phone && <p className="text-[12px] text-muted-foreground">{contact.phone}</p>}
                </div>
              </div>
              <button onClick={() => { onDelete(contact.id); toast("Contact removed"); }}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No contacts found{searchQuery ? ` for "${searchQuery}"` : ""}</div>}
      </div>
    </div>
  );
}

/* ============================================================ */
function ActivityTab({ log }: { log: { id: string; timestamp: string; user: string; action: string; detail: string }[] }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-[17px] font-bold text-foreground tracking-[-0.01em] mb-1">Activity Log</h3>
      <p className="text-[13px] text-muted-foreground mb-4">Track all changes made to the Communication Hub</p>

      <div className="space-y-0">
        {log.map((entry, idx) => (
          <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              {idx < log.length - 1 && <div className="w-px h-full bg-border/30 mt-1" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-foreground">{entry.action}</p>
                <span className="text-[11px] text-muted-foreground/60">{formatTimeAgo(entry.timestamp)}</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">{entry.detail}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">by {entry.user}</p>
            </div>
          </div>
        ))}
        {log.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No activity recorded yet</div>}
      </div>
    </div>
  );
}

/* ============================================================ */
function EditInlineInput({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [editValue, setEditValue] = useState(value);
  return (
    <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
      onBlur={() => onSave(editValue)}
      onKeyDown={e => { if (e.key === "Enter") onSave(editValue); if (e.key === "Escape") onCancel(); }}
      className="bg-white border-2 border-primary rounded-xl px-2 py-1 text-[13px] text-foreground focus:outline-none shadow-[0_0_0_3px_oklch(0.55_0.22_264_/_12%)] min-w-[200px]" />
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
