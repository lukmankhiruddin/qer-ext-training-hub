/*
 * Schedule — Weekly Calendar View with Wave Switching & SME Filtering
 * Design: Modern Meta/Apple hybrid — glass cards, vibrant gradients,
 * Inter font, spring animations, colored shadows, pill badges
 * When SME filters their name, unrelated days dim to 30% opacity
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import {
  Search,
  Filter,
  Clock,
  User,
  BookOpen,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getSessionTypeBadge, type TrainingSession } from "@/lib/data";
import { toast } from "sonner";

const WAVE_DATE_MAP: Record<string, Record<string, string>> = {
  "prog-1": { Monday: "Jan 20", Tuesday: "Jan 21", Wednesday: "Jan 22", Thursday: "Jan 23", Friday: "Jan 24" },
  "prog-2": { Monday: "Feb 10", Tuesday: "Feb 11", Wednesday: "Feb 12", Thursday: "Feb 13" },
  "prog-3": { Tuesday: "Mar 10", Wednesday: "Mar 11", Thursday: "Mar 12", Friday: "Mar 13" },
};

export default function Schedule() {
  const { programs, activeWaveId, setActiveWaveId, getScheduleForWave, updateSession, addSession, deleteSession } = useData();
  const { isAdmin } = useAdmin();
  const [selectedSME, setSelectedSME] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const activeProgram = programs.find(p => p.id === activeWaveId);
  const currentSchedule = getScheduleForWave(activeWaveId);
  const DAYS = activeProgram?.daysOfWeek ?? ["Monday", "Tuesday", "Wednesday", "Thursday"];
  const DAY_DATES = WAVE_DATE_MAP[activeWaveId] ?? {};

  const uniqueSMEs = useMemo(() => {
    const smes = new Set(currentSchedule.map(s => s.sme).filter(s => s !== "N/A"));
    return Array.from(smes).sort();
  }, [currentSchedule]);

  const filteredSchedule = useMemo(() => {
    let filtered = currentSchedule;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.training.toLowerCase().includes(q) || s.sme.toLowerCase().includes(q) || s.day.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [currentSchedule, searchQuery]);

  const activeDays = useMemo(() => {
    if (selectedSME === "all") return new Set(DAYS);
    const days = new Set<string>();
    currentSchedule.forEach(s => {
      if (s.sme.toLowerCase().includes(selectedSME.toLowerCase())) days.add(s.day);
    });
    return days;
  }, [currentSchedule, selectedSME, DAYS]);

  const getSessionsForDay = (day: string) =>
    filteredSchedule.filter(s => s.day === day).sort((a, b) => parseTime(a.timeStart) - parseTime(b.timeStart));

  const isSessionHighlighted = (session: TrainingSession) => {
    if (selectedSME === "all") return true;
    return session.sme.toLowerCase().includes(selectedSME.toLowerCase());
  };

  const [newSession, setNewSession] = useState({
    day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" as TrainingSession["type"],
  });

  const handleAddSession = () => {
    const dayDates = WAVE_DATE_MAP[activeWaveId] ?? {};
    const session: TrainingSession = {
      id: `ts-new-${Date.now()}`, day: newSession.day, date: dayDates[newSession.day] ?? "TBD",
      timeStart: newSession.timeStart, timeEnd: newSession.timeEnd, training: newSession.training,
      sme: newSession.sme || "N/A", type: newSession.type, waveId: activeWaveId,
    };
    addSession(session);
    setAddDialogOpen(false);
    setNewSession({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" });
    toast("Session added", { description: `${session.training} on ${session.day}` });
  };

  const handleWaveSwitch = (waveId: string) => {
    setActiveWaveId(waveId);
    setSelectedSME("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-purple-500/[0.02]" />
        <div className="container relative py-6">
          <div className="flex items-center gap-2 mb-1.5 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.08em]">Weekly Schedule</span>
          </div>
          <h1 className="text-[26px] font-bold text-foreground tracking-[-0.02em] mb-1 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
            Training Calendar
          </h1>
          <p className="text-[14px] text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {activeProgram?.wave ?? "Training Schedule"} · {activeProgram?.location ?? "Dublin"} · {activeProgram ? `${formatDateShort(activeProgram.startDate)}–${formatDateShort(activeProgram.endDate)}` : ""}
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Wave Switcher */}
        <div className="glass-card p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-3">Training Waves</p>
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {programs.map((prog, idx) => {
              const isActive = prog.id === activeWaveId;
              const isLast = idx === programs.length - 1;
              return (
                <div key={prog.id} className="flex items-center shrink-0">
                  <button
                    onClick={() => handleWaveSwitch(prog.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-left",
                      isActive
                        ? "bg-gradient-to-br from-primary/8 to-purple-500/5 ring-1 ring-primary/15 shadow-[0_2px_8px_oklch(0.55_0.22_264_/_6%)]"
                        : "hover:bg-secondary/60"
                    )}
                  >
                    {prog.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                    ) : prog.status === "active" ? (
                      <div className="w-5 h-5 rounded-full gradient-hero flex items-center justify-center shrink-0 shadow-[0_0_8px_oklch(0.55_0.22_264_/_25%)]">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-border shrink-0" />
                    )}
                    <div>
                      <p className={cn("text-[13px] font-semibold leading-tight", isActive ? "gradient-text" : "text-foreground")}>
                        {prog.wave.split("—")[0].trim()}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDateShort(prog.startDate)} – {formatDateShort(prog.endDate)}
                      </p>
                    </div>
                    <span className={cn(
                      "ml-2 vibrant-badge",
                      prog.status === "completed" ? "vibrant-badge-gray" :
                      prog.status === "active" ? "vibrant-badge-blue" : "vibrant-badge-amber"
                    )}>
                      {prog.status === "completed" ? "Completed" : prog.status === "active" ? "Active" : "Upcoming"}
                    </span>
                  </button>
                  {!isLast && <ArrowRight className="w-4 h-4 text-border mx-1 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-secondary/60 border-none rounded-xl text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <Select value={selectedSME} onValueChange={setSelectedSME}>
                <SelectTrigger className="w-full sm:w-[220px] bg-secondary/60 border-none rounded-xl h-9 text-[13px] focus:ring-primary/20">
                  <SelectValue placeholder="Filter by SME" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_oklch(0.4_0.1_270_/_12%)]">
                  <SelectItem value="all">All SMEs</SelectItem>
                  {uniqueSMEs.map(sme => <SelectItem key={sme} value={sme}>{sme}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {selectedSME !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-gradient-to-r from-primary/10 to-purple-500/8 text-primary">
                <User className="w-3 h-3" />
                {selectedSME}
                <button onClick={() => setSelectedSME("all")} className="ml-0.5 hover:text-primary/70 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            )}

            {isAdmin && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 ml-auto gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] hover:opacity-90 transition-all duration-300 border-0">
                    <Plus className="w-3.5 h-3.5" />
                    Add Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)]">
                  <DialogHeader>
                    <DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Training Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Day</Label>
                        <Select value={newSession.day} onValueChange={v => setNewSession(p => ({ ...p, day: v }))}>
                          <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                          <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Type</Label>
                        <Select value={newSession.type} onValueChange={v => setNewSession(p => ({ ...p, type: v as TrainingSession["type"] }))}>
                          <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
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
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Start Time</Label>
                        <Input value={newSession.timeStart} onChange={e => setNewSession(p => ({ ...p, timeStart: e.target.value }))} placeholder="9:00 AM" className="rounded-xl border-border/50" />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">End Time</Label>
                        <Input value={newSession.timeEnd} onChange={e => setNewSession(p => ({ ...p, timeEnd: e.target.value }))} placeholder="10:00 AM" className="rounded-xl border-border/50" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Training Title</Label>
                      <Input value={newSession.training} onChange={e => setNewSession(p => ({ ...p, training: e.target.value }))} placeholder="e.g., Live Video Training" className="rounded-xl border-border/50" />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">QER SME</Label>
                      <Input value={newSession.sme} onChange={e => setNewSession(p => ({ ...p, sme: e.target.value }))} placeholder="e.g., Farrukh Ahmed (or N/A)" className="rounded-xl border-border/50" />
                    </div>
                    <Button onClick={handleAddSession} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newSession.training}>
                      Add Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Weekly Calendar Grid */}
        <div className={cn(
          "grid gap-3",
          DAYS.length === 5 ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          {DAYS.map((day, dayIdx) => {
            const sessions = getSessionsForDay(day);
            const isDayActive = activeDays.has(day);

            return (
              <div
                key={day}
                className={cn("transition-all duration-400 animate-fade-in-up", isDayActive ? "opacity-100" : "opacity-25")}
                style={{ animationDelay: `${0.18 + dayIdx * 0.05}s` }}
              >
                {/* Day Header */}
                <div className={cn(
                  "glass-card mb-2.5 p-3 transition-all duration-300",
                  isDayActive && selectedSME !== "all"
                    ? "ring-2 ring-primary/20 shadow-[0_2px_12px_oklch(0.55_0.22_264_/_10%)]"
                    : ""
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] font-bold text-foreground tracking-[-0.01em]">{day}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">{DAY_DATES[day] ?? ""}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-semibold bg-secondary/70 px-2 py-0.5 rounded-lg">
                      {sessions.length}
                    </span>
                  </div>
                  {isDayActive && selectedSME !== "all" && (
                    <div className="h-[3px] gradient-hero rounded-full mt-2 shadow-[0_0_6px_oklch(0.55_0.22_264_/_20%)]" />
                  )}
                </div>

                {/* Sessions */}
                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground border-2 border-dashed border-border/40 rounded-xl">
                      No sessions scheduled
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const badge = getSessionTypeBadge(session.type);
                      const highlighted = isSessionHighlighted(session);
                      const dotGradient = session.type === "live"
                        ? "from-emerald-400 to-green-500"
                        : session.type === "upskilling"
                        ? "from-blue-400 to-indigo-500"
                        : "from-amber-400 to-orange-500";
                      const badgeClass = session.type === "live"
                        ? "vibrant-badge vibrant-badge-green"
                        : session.type === "upskilling"
                        ? "vibrant-badge vibrant-badge-blue"
                        : "vibrant-badge vibrant-badge-amber";

                      return (
                        <div
                          key={session.id}
                          className={cn(
                            "glass-card relative group overflow-hidden transition-all duration-300",
                            highlighted ? "hover-lift" : "opacity-40"
                          )}
                        >
                          {/* Left gradient bar */}
                          <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-gradient-to-b", dotGradient)} />

                          <div className="p-3 pl-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[11px] text-muted-foreground font-medium">
                                {session.timeStart} — {session.timeEnd}
                              </span>
                            </div>

                            {isAdmin ? (
                              <EditableField
                                value={session.training}
                                fieldId={`session-${session.id}-training`}
                                onSave={v => updateSession(session.id, { training: v })}
                                className="text-[13px] font-semibold text-foreground leading-snug block mb-1.5"
                                as="p"
                              />
                            ) : (
                              <p className="text-[13px] font-semibold text-foreground leading-snug mb-1.5">{session.training}</p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={badgeClass}>{badge.label}</span>
                              {session.sme !== "N/A" && (
                                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {isAdmin ? (
                                    <EditableField value={session.sme} fieldId={`session-${session.id}-sme`} onSave={v => updateSession(session.id, { sme: v })} className="text-[12px]" />
                                  ) : session.sme}
                                </span>
                              )}
                            </div>

                            {session.resources && session.resources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/30">
                                {session.resources.map((r, ri) => (
                                  <div key={ri} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <BookOpen className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{r}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {isAdmin && (
                              <button
                                onClick={() => { deleteSession(session.id); toast("Session removed"); }}
                                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/50 hover:text-destructive transition-all duration-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="glass-card mt-5 p-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-3">Session Types</p>
          <div className="flex flex-wrap gap-5">
            {[
              { type: "live" as const, gradient: "from-emerald-400 to-green-500" },
              { type: "self-study" as const, gradient: "from-amber-400 to-orange-500" },
              { type: "upskilling" as const, gradient: "from-blue-400 to-indigo-500" },
            ].map(item => {
              const badge = getSessionTypeBadge(item.type);
              return (
                <div key={item.type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br", item.gradient)} />
                  <span className="text-[13px] text-muted-foreground font-medium">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function parseTime(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatDateShort(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = months[parseInt(parts[1]) - 1] ?? parts[1];
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}
