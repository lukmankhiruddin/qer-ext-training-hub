/*
 * Admin Control Panel — Full CRUD management for the Communication Hub
 * Design: Meta/Facebook — Clean white cards, blue accents, tabbed interface
 * Tabs: Overview, Users, Sessions, Programs, SMEs, Contacts, Activity Log
 */
import { useState, useMemo } from "react";
import { useAdmin, type AdminUser } from "@/contexts/AdminContext";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import {
  Users,
  CalendarDays,
  FolderKanban,
  UserPlus,
  Trash2,
  Plus,
  Edit3,
  Shield,
  Eye,
  Activity,
  Settings,
  BookOpen,
  Phone,
  Search,
  X,
  ChevronRight,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const { isAdmin, adminUsers, addAdminUser, removeAdminUser, updateAdminUser, activityLog, logActivity } = useAdmin();
  const { programs, smes, contacts, allSchedules, addSession, deleteSession, updateSession, addProgram, deleteProgram, updateProgram, addSME, deleteSME, updateSME, addContact, deleteContact, updateContact, activeWaveId } = useData();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // If not admin, redirect
  if (!isAdmin) {
    return (
      <div className="bg-[#F0F2F5] min-h-screen flex items-center justify-center">
        <div className="meta-card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-[#FA3E3E] mx-auto mb-4" />
          <h2 className="text-[20px] font-bold text-[#050505] mb-2">Access Denied</h2>
          <p className="text-[15px] text-[#65676B] mb-4">
            You need admin privileges to access the Control Panel. Please log in as admin from the navigation bar.
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Count total sessions across all waves
  const totalSessions = Object.values(allSchedules).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-5">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">
              Control Panel
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-[#050505] mb-1">
            Admin Dashboard
          </h1>
          <p className="text-[15px] text-[#65676B]">
            Manage users, sessions, programs, SMEs, and contacts. All changes are reflected across the website in real-time.
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Tabs */}
          <div className="lg:w-56 shrink-0">
            <div className="meta-card p-2 lg:sticky lg:top-20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150 text-left",
                    activeTab === tab.id
                      ? "bg-[#E7F3FF] text-primary"
                      : "text-[#65676B] hover:bg-[#F0F2F5]"
                  )}
                >
                  <tab.icon className="w-[18px] h-[18px]" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <OverviewTab
                totalSessions={totalSessions}
                totalPrograms={programs.length}
                totalSMEs={smes.length}
                totalContacts={contacts.length}
                totalUsers={adminUsers.length}
                recentActivity={activityLog.slice(0, 5)}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === "users" && (
              <UsersTab
                users={adminUsers}
                onAdd={addAdminUser}
                onRemove={removeAdminUser}
                onUpdate={updateAdminUser}
              />
            )}
            {activeTab === "sessions" && (
              <SessionsTab
                allSchedules={allSchedules}
                programs={programs}
                activeWaveId={activeWaveId}
                onAdd={addSession}
                onDelete={(id) => { deleteSession(id); logActivity("Session Deleted", `Session ${id} removed`); }}
                onUpdate={(id, updates) => { updateSession(id, updates); logActivity("Session Updated", `Session ${id} updated`); }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === "programs" && (
              <ProgramsTab
                programs={programs}
                onAdd={(p) => { addProgram(p); logActivity("Program Added", `${p.wave} created`); }}
                onDelete={(id) => { deleteProgram(id); logActivity("Program Deleted", `Program ${id} removed`); }}
                onUpdate={(id, updates) => { updateProgram(id, updates); logActivity("Program Updated", `Program ${id} updated`); }}
              />
            )}
            {activeTab === "smes" && (
              <SMEsTab
                smes={smes}
                onAdd={(s) => { addSME(s); logActivity("SME Added", `${s.name} added`); }}
                onDelete={(id) => { deleteSME(id); logActivity("SME Deleted", `SME ${id} removed`); }}
                onUpdate={(id, updates) => { updateSME(id, updates); logActivity("SME Updated", `SME ${id} updated`); }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === "contacts" && (
              <ContactsTab
                contacts={contacts}
                onAdd={(c) => { addContact(c); logActivity("Contact Added", `${c.name} added`); }}
                onDelete={(id) => { deleteContact(id); logActivity("Contact Deleted", `Contact ${id} removed`); }}
                onUpdate={(id, updates) => { updateContact(id, updates); logActivity("Contact Updated", `Contact ${id} updated`); }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === "activity" && (
              <ActivityTab log={activityLog} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Overview Tab
 * ============================================================ */
function OverviewTab({
  totalSessions, totalPrograms, totalSMEs, totalContacts, totalUsers, recentActivity, onTabChange,
}: {
  totalSessions: number;
  totalPrograms: number;
  totalSMEs: number;
  totalContacts: number;
  totalUsers: number;
  recentActivity: { id: string; timestamp: string; user: string; action: string; detail: string }[];
  onTabChange: (tab: Tab) => void;
}) {
  const stats = [
    { label: "Training Sessions", value: totalSessions, icon: CalendarDays, tab: "sessions" as Tab },
    { label: "Programs / Waves", value: totalPrograms, icon: FolderKanban, tab: "programs" as Tab },
    { label: "SME Experts", value: totalSMEs, icon: BookOpen, tab: "smes" as Tab },
    { label: "Contacts", value: totalContacts, icon: Phone, tab: "contacts" as Tab },
    { label: "Admin Users", value: totalUsers, icon: Users, tab: "users" as Tab },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <button
            key={stat.label}
            onClick={() => onTabChange(stat.tab)}
            className="meta-card p-4 text-left hover:shadow-md transition-shadow duration-150 group"
          >
            <stat.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-[28px] font-bold text-[#050505] leading-none">{stat.value}</p>
            <p className="text-[13px] text-[#65676B] mt-1 group-hover:text-primary transition-colors duration-150">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="meta-card p-4">
        <h3 className="text-[16px] font-bold text-[#050505] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: "Add Session", icon: Plus, tab: "sessions" as Tab },
            { label: "Add SME", icon: UserPlus, tab: "smes" as Tab },
            { label: "Manage Users", icon: Users, tab: "users" as Tab },
            { label: "View Activity", icon: Activity, tab: "activity" as Tab },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => onTabChange(action.tab)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#F0F2F5] hover:bg-[#E7F3FF] text-[14px] font-medium text-[#050505] transition-colors duration-150"
            >
              <action.icon className="w-4 h-4 text-primary" />
              {action.label}
              <ChevronRight className="w-4 h-4 text-[#8A8D91] ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="meta-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-bold text-[#050505]">Recent Activity</h3>
          <button onClick={() => onTabChange("activity")} className="text-[13px] text-primary font-semibold hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-2">
          {recentActivity.map(entry => (
            <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-[#F0F2F5] last:border-0">
              <div className="w-8 h-8 rounded-full bg-[#E7F3FF] flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] text-[#050505] font-medium">{entry.action}</p>
                <p className="text-[13px] text-[#65676B] truncate">{entry.detail}</p>
                <p className="text-[12px] text-[#8A8D91] mt-0.5">
                  {entry.user} · {formatTimeAgo(entry.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Users Tab
 * ============================================================ */
function UsersTab({
  users, onAdd, onRemove, onUpdate,
}: {
  users: AdminUser[];
  onAdd: (user: Omit<AdminUser, "id" | "addedAt">) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AdminUser>) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "admin" as "admin" | "viewer" });

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) return;
    onAdd(newUser);
    setNewUser({ name: "", email: "", role: "admin" });
    setAddDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="meta-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#050505]">Users & Roles</h3>
            <p className="text-[14px] text-[#65676B] mt-0.5">Manage who can edit the Communication Hub</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                <UserPlus className="w-3.5 h-3.5" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle className="text-[20px] font-bold text-[#050505]">Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Full Name</Label>
                  <Input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="e.g., John Smith" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Email</Label>
                  <Input value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="e.g., john@company.com" className="rounded-lg" type="email" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Role</Label>
                  <Select value={newUser.role} onValueChange={v => setNewUser(p => ({ ...p, role: v as "admin" | "viewer" }))}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin — Can edit everything</SelectItem>
                      <SelectItem value="viewer">Viewer — Read-only access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newUser.name || !newUser.email}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User List */}
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F8FA] hover:bg-[#F0F2F5] transition-colors duration-150 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[13px] font-bold text-primary">
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-[#050505]">{user.name}</p>
                  {user.id === "admin-1" && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#E65100]">Owner</span>
                  )}
                </div>
                <p className="text-[13px] text-[#65676B]">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[12px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                  user.role === "admin"
                    ? "bg-[#E7F3FF] text-primary"
                    : "bg-[#F0F2F5] text-[#65676B]"
                )}>
                  {user.role === "admin" ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {user.role === "admin" ? "Admin" : "Viewer"}
                </span>
                {user.id !== "admin-1" && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => onUpdate(user.id, { role: user.role === "admin" ? "viewer" : "admin" })}
                      className="p-1.5 rounded-md hover:bg-[#E7F3FF] text-[#65676B] hover:text-primary transition-colors duration-150"
                      title="Toggle role"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(user.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-colors duration-150"
                      title="Remove user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="meta-card p-4 bg-[#E7F3FF]/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-semibold text-[#050505]">About Roles</p>
            <p className="text-[13px] text-[#65676B] mt-1 leading-relaxed">
              <strong>Admin</strong> users can edit all content directly on the website — sessions, programs, SME details, and contacts. They can also manage other users.
              <strong> Viewer</strong> users can only view the dashboard and schedules without making changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Sessions Tab
 * ============================================================ */
function SessionsTab({
  allSchedules, programs, activeWaveId, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery,
}: {
  allSchedules: Record<string, TrainingSession[]>;
  programs: ProgramItinerary[];
  activeWaveId: string;
  onAdd: (session: TrainingSession) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TrainingSession>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
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

  const [newSession, setNewSession] = useState({
    day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" as TrainingSession["type"],
  });

  const handleAdd = () => {
    const session: TrainingSession = {
      id: `ts-${Date.now()}`,
      day: newSession.day,
      date: "",
      timeStart: newSession.timeStart,
      timeEnd: newSession.timeEnd,
      training: newSession.training,
      sme: newSession.sme || "N/A",
      type: newSession.type,
      waveId: selectedWave,
    };
    onAdd(session);
    setAddDialogOpen(false);
    setNewSession({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" });
    toast.success("Session added");
  };

  return (
    <div className="space-y-4">
      <div className="meta-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#050505]">Training Sessions</h3>
            <p className="text-[14px] text-[#65676B] mt-0.5">Add, edit, or remove training sessions across all waves</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                <Plus className="w-3.5 h-3.5" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-[20px] font-bold text-[#050505]">Add Training Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Wave</Label>
                  <Select value={selectedWave} onValueChange={setSelectedWave}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.wave}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Day</Label>
                    <Select value={newSession.day} onValueChange={v => setNewSession(p => ({ ...p, day: v }))}>
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Type</Label>
                    <Select value={newSession.type} onValueChange={v => setNewSession(p => ({ ...p, type: v as TrainingSession["type"] }))}>
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live Training</SelectItem>
                        <SelectItem value="self-study">Self Study</SelectItem>
                        <SelectItem value="upskilling">Upskilling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Start Time</Label>
                    <Input value={newSession.timeStart} onChange={e => setNewSession(p => ({ ...p, timeStart: e.target.value }))} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">End Time</Label>
                    <Input value={newSession.timeEnd} onChange={e => setNewSession(p => ({ ...p, timeEnd: e.target.value }))} className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Training Title</Label>
                  <Input value={newSession.training} onChange={e => setNewSession(p => ({ ...p, training: e.target.value }))} placeholder="e.g., Live Video Training" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">SME</Label>
                  <Input value={newSession.sme} onChange={e => setNewSession(p => ({ ...p, sme: e.target.value }))} placeholder="e.g., Farrukh Ahmed" className="rounded-lg" />
                </div>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newSession.training}>
                  Add Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Wave selector + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select value={selectedWave} onValueChange={setSelectedWave}>
            <SelectTrigger className="w-full sm:w-[260px] bg-[#F0F2F5] border-none rounded-lg h-9 text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programs.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.wave}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8D91]" />
            <input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] border-none rounded-full text-[14px] text-[#050505] placeholder-[#8A8D91] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors duration-150"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D91] hover:text-[#050505]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sessions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4E6EB]">
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Day</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Time</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Training</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">SME</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Type</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => {
                const badge = getSessionTypeBadge(session.type);
                const isEditing = editingId === session.id;
                const badgeClass = session.type === "live"
                  ? "meta-badge meta-badge-green"
                  : session.type === "upskilling"
                  ? "meta-badge meta-badge-blue"
                  : "meta-badge meta-badge-yellow";

                return (
                  <tr key={session.id} className="border-b border-[#F0F2F5] hover:bg-[#F7F8FA] transition-colors duration-100 group">
                    <td className="py-2.5 px-3 text-[14px] text-[#050505] font-medium">{session.day}</td>
                    <td className="py-2.5 px-3 text-[13px] text-[#65676B]">{session.timeStart} – {session.timeEnd}</td>
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <EditInlineInput
                          value={session.training}
                          onSave={v => { onUpdate(session.id, { training: v }); setEditingId(null); }}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <span className="text-[14px] text-[#050505]">{session.training}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[14px] text-[#65676B]">{session.sme}</td>
                    <td className="py-2.5 px-3"><span className={badgeClass}>{badge.label}</span></td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => setEditingId(isEditing ? null : session.id)}
                          className="p-1.5 rounded-md hover:bg-[#E7F3FF] text-[#65676B] hover:text-primary transition-colors duration-150"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { onDelete(session.id); toast("Session removed"); }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-colors duration-150"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSessions.length === 0 && (
            <div className="py-12 text-center text-[14px] text-[#8A8D91]">
              No sessions found{searchQuery ? ` for "${searchQuery}"` : ""}
            </div>
          )}
        </div>
        <p className="text-[13px] text-[#8A8D91] mt-3">{filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""} in {program?.wave ?? "this wave"}</p>
      </div>
    </div>
  );
}

/* ============================================================
 * Programs Tab
 * ============================================================ */
function ProgramsTab({
  programs, onAdd, onDelete, onUpdate,
}: {
  programs: ProgramItinerary[];
  onAdd: (program: ProgramItinerary) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ProgramItinerary>) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProg, setNewProg] = useState({
    program: "TP Onboarding Schedule",
    wave: "",
    location: "Dublin",
    startDate: "",
    endDate: "",
    status: "upcoming" as ProgramItinerary["status"],
    description: "",
    modules: "",
    smes: "",
  });

  const handleAdd = () => {
    const prog: ProgramItinerary = {
      id: `prog-${Date.now()}`,
      program: newProg.program,
      wave: newProg.wave,
      location: newProg.location,
      startDate: newProg.startDate,
      endDate: newProg.endDate,
      status: newProg.status,
      description: newProg.description,
      modules: newProg.modules.split(",").map(m => m.trim()).filter(Boolean),
      smesInvolved: newProg.smes.split(",").map(s => s.trim()).filter(Boolean),
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
    onAdd(prog);
    setAddDialogOpen(false);
    toast.success("Program added");
  };

  return (
    <div className="space-y-4">
      <div className="meta-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#050505]">Training Programs</h3>
            <p className="text-[14px] text-[#65676B] mt-0.5">Manage training waves and programs</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                <Plus className="w-3.5 h-3.5" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-[20px] font-bold text-[#050505]">Add Training Program</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Program Name</Label>
                  <Input value={newProg.program} onChange={e => setNewProg(p => ({ ...p, program: e.target.value }))} className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Wave Title</Label>
                  <Input value={newProg.wave} onChange={e => setNewProg(p => ({ ...p, wave: e.target.value }))} placeholder="e.g., Wave 4 — Quality Assurance" className="rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Start Date</Label>
                    <Input type="date" value={newProg.startDate} onChange={e => setNewProg(p => ({ ...p, startDate: e.target.value }))} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">End Date</Label>
                    <Input type="date" value={newProg.endDate} onChange={e => setNewProg(p => ({ ...p, endDate: e.target.value }))} className="rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Location</Label>
                    <Input value={newProg.location} onChange={e => setNewProg(p => ({ ...p, location: e.target.value }))} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Status</Label>
                    <Select value={newProg.status} onValueChange={v => setNewProg(p => ({ ...p, status: v as ProgramItinerary["status"] }))}>
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Description</Label>
                  <textarea
                    value={newProg.description}
                    onChange={e => setNewProg(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white border border-input rounded-lg px-3 py-2 text-[14px] text-[#050505] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    rows={3}
                    placeholder="Brief description of this training wave..."
                  />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Modules (comma-separated)</Label>
                  <Input value={newProg.modules} onChange={e => setNewProg(p => ({ ...p, modules: e.target.value }))} placeholder="Module 1, Module 2, Module 3" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">SMEs Involved (comma-separated)</Label>
                  <Input value={newProg.smes} onChange={e => setNewProg(p => ({ ...p, smes: e.target.value }))} placeholder="Name 1, Name 2" className="rounded-lg" />
                </div>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newProg.wave}>
                  Add Program
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Programs List */}
        <div className="space-y-3">
          {programs.map(prog => {
            const status = getStatusBadge(prog.status);
            return (
              <div key={prog.id} className="p-4 rounded-lg bg-[#F7F8FA] hover:bg-[#F0F2F5] transition-colors duration-150 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[16px] font-bold text-[#050505]">{prog.wave}</h4>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", status.bgColor, status.textColor)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#65676B] mb-2">{prog.description}</p>
                    <div className="flex items-center gap-4 text-[13px] text-[#8A8D91]">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prog.location}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{prog.startDate} – {prog.endDate}</span>
                      <span>{prog.modules.length} modules</span>
                      <span>{prog.smesInvolved.length} SMEs</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { onDelete(prog.id); toast("Program removed"); }}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-all duration-150"
                  >
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

/* ============================================================
 * SMEs Tab
 * ============================================================ */
function SMEsTab({
  smes, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery,
}: {
  smes: SME[];
  onAdd: (sme: SME) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SME>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSME, setNewSME] = useState({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" });

  const filtered = smes.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.market.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    const sme: SME = {
      id: `sme-${Date.now()}`,
      name: newSME.name,
      market: newSME.market,
      vendors: [],
      roles: newSME.roles.split(",").map(r => r.trim()).filter(Boolean),
      policySME: "",
      space: newSME.space,
      location: newSME.location,
    };
    onAdd(sme);
    setAddDialogOpen(false);
    setNewSME({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" });
    toast.success("SME added");
  };

  return (
    <div className="space-y-4">
      <div className="meta-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#050505]">Subject Matter Experts</h3>
            <p className="text-[14px] text-[#65676B] mt-0.5">Manage the SME directory</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                <UserPlus className="w-3.5 h-3.5" />
                Add SME
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle className="text-[20px] font-bold text-[#050505]">Add SME</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Full Name</Label>
                  <Input value={newSME.name} onChange={e => setNewSME(p => ({ ...p, name: e.target.value }))} placeholder="e.g., John Smith" className="rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Market</Label>
                    <Input value={newSME.market} onChange={e => setNewSME(p => ({ ...p, market: e.target.value }))} placeholder="e.g., Arabic" className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Location</Label>
                    <Select value={newSME.location} onValueChange={v => setNewSME(p => ({ ...p, location: v }))}>
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dublin">Dublin</SelectItem>
                        <SelectItem value="Bangkok">Bangkok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Space</Label>
                  <Select value={newSME.space} onValueChange={v => setNewSME(p => ({ ...p, space: v }))}>
                    <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simple Object">Simple Object</SelectItem>
                      <SelectItem value="Complex Object">Complex Object</SelectItem>
                      <SelectItem value="Simple Object & Complex Object">Simple Object & Complex Object</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Roles (comma-separated)</Label>
                  <Input value={newSME.roles} onChange={e => setNewSME(p => ({ ...p, roles: e.target.value }))} placeholder="Market SME, VG SME" className="rounded-lg" />
                </div>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newSME.name}>
                  Add SME
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8D91]" />
          <input
            placeholder="Search SMEs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] border-none rounded-full text-[14px] text-[#050505] placeholder-[#8A8D91] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors duration-150"
          />
        </div>

        {/* SME Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4E6EB]">
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Name</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Market</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Location</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Space</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Roles</th>
                <th className="py-2.5 px-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sme => (
                <tr key={sme.id} className="border-b border-[#F0F2F5] hover:bg-[#F7F8FA] transition-colors duration-100 group">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-primary">
                          {sme.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-[14px] font-medium text-[#050505]">{sme.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[14px] text-[#65676B]">{sme.market}</td>
                  <td className="py-2.5 px-3 text-[14px] text-[#65676B]">{sme.location}</td>
                  <td className="py-2.5 px-3 text-[13px] text-[#65676B]">{sme.space}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {sme.roles.slice(0, 2).map(r => (
                        <span key={r} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F2F5] text-[#65676B]">{r}</span>
                      ))}
                      {sme.roles.length > 2 && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F2F5] text-[#8A8D91]">+{sme.roles.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => { onDelete(sme.id); toast("SME removed"); }}
                      className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-[#8A8D91] mt-3">{filtered.length} of {smes.length} SMEs</p>
      </div>
    </div>
  );
}

/* ============================================================
 * Contacts Tab
 * ============================================================ */
function ContactsTab({
  contacts, onAdd, onDelete, onUpdate, searchQuery, setSearchQuery,
}: {
  contacts: VendorContact[];
  onAdd: (contact: VendorContact) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<VendorContact>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", vendor: "", email: "", phone: "" });

  const filtered = contacts.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    const contact: VendorContact = {
      id: `vc-${Date.now()}`,
      name: newContact.name,
      role: newContact.role,
      vendor: newContact.vendor,
      location: "Dublin",
      primaryContact: newContact.role,
      email: newContact.email,
      phone: newContact.phone,
    };
    onAdd(contact);
    setAddDialogOpen(false);
    setNewContact({ name: "", role: "", vendor: "", email: "", phone: "" });
    toast.success("Contact added");
  };

  return (
    <div className="space-y-4">
      <div className="meta-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#050505]">Vendor Contacts</h3>
            <p className="text-[14px] text-[#65676B] mt-0.5">Key contacts for vendor coordination</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                <Plus className="w-3.5 h-3.5" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle className="text-[20px] font-bold text-[#050505]">Add Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Full Name</Label>
                  <Input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Role / Title</Label>
                  <Input value={newContact.role} onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))} placeholder="e.g., Training Manager" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Vendor / Organization</Label>
                  <Input value={newContact.vendor} onChange={e => setNewContact(p => ({ ...p, vendor: e.target.value }))} placeholder="e.g., Teleperformance" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Email</Label>
                  <Input value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} type="email" className="rounded-lg" />
                </div>
                <div>
                  <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Phone</Label>
                  <Input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="rounded-lg" />
                </div>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newContact.name}>
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8D91]" />
          <input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] border-none rounded-full text-[14px] text-[#050505] placeholder-[#8A8D91] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors duration-150"
          />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(contact => (
            <div key={contact.id} className="p-4 rounded-lg bg-[#F7F8FA] hover:bg-[#F0F2F5] transition-colors duration-150 group relative">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-bold text-primary">
                    {contact.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#050505]">{contact.name}</p>
                  <p className="text-[13px] text-[#65676B]">{contact.role}</p>
                  <p className="text-[12px] text-[#8A8D91] mt-0.5">{contact.vendor}</p>
                  {contact.email && <p className="text-[13px] text-primary mt-1">{contact.email}</p>}
                  {contact.phone && <p className="text-[13px] text-[#65676B]">{contact.phone}</p>}
                </div>
              </div>
              <button
                onClick={() => { onDelete(contact.id); toast("Contact removed"); }}
                className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-all duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[14px] text-[#8A8D91]">
            No contacts found{searchQuery ? ` for "${searchQuery}"` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Activity Log Tab
 * ============================================================ */
function ActivityTab({ log }: { log: { id: string; timestamp: string; user: string; action: string; detail: string }[] }) {
  return (
    <div className="meta-card p-4">
      <h3 className="text-[18px] font-bold text-[#050505] mb-1">Activity Log</h3>
      <p className="text-[14px] text-[#65676B] mb-4">Track all changes made to the Communication Hub</p>

      <div className="space-y-0">
        {log.map((entry, idx) => (
          <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-[#F0F2F5] last:border-0">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#E7F3FF] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              {idx < log.length - 1 && <div className="w-px h-full bg-[#E4E6EB] mt-1" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-[#050505]">{entry.action}</p>
                <span className="text-[12px] text-[#8A8D91]">{formatTimeAgo(entry.timestamp)}</span>
              </div>
              <p className="text-[13px] text-[#65676B] mt-0.5">{entry.detail}</p>
              <p className="text-[12px] text-[#8A8D91] mt-0.5">by {entry.user}</p>
            </div>
          </div>
        ))}
        {log.length === 0 && (
          <div className="py-12 text-center text-[14px] text-[#8A8D91]">
            No activity recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Inline Edit Input
 * ============================================================ */
function EditInlineInput({
  value, onSave, onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [editValue, setEditValue] = useState(value);
  return (
    <input
      autoFocus
      value={editValue}
      onChange={e => setEditValue(e.target.value)}
      onBlur={() => { onSave(editValue); }}
      onKeyDown={e => {
        if (e.key === "Enter") onSave(editValue);
        if (e.key === "Escape") onCancel();
      }}
      className="bg-white border-2 border-primary rounded-lg px-2 py-1 text-[14px] text-[#050505] focus:outline-none shadow-[0_0_0_2px_rgba(24,119,242,0.2)] min-w-[200px]"
    />
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */
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
