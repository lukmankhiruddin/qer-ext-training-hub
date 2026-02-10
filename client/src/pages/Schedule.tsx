/*
 * Schedule — Weekly Calendar View with Wave Switching & SME Filtering
 * Design: Meta/Facebook — White cards on gray bg, blue filter pills
 * Supports Wave 1 (completed), Wave 2 (active), Wave 3 (upcoming)
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
import { getSessionTypeBadge, getStatusBadge, type TrainingSession } from "@/lib/data";
import { toast } from "sonner";

// Date info per wave
const WAVE_DATE_MAP: Record<string, Record<string, string>> = {
  "prog-1": { Monday: "Jan 20", Tuesday: "Jan 21", Wednesday: "Jan 22", Thursday: "Jan 23", Friday: "Jan 24" },
  "prog-2": { Monday: "Feb 10", Tuesday: "Feb 11", Wednesday: "Feb 12", Thursday: "Feb 13" },
  "prog-3": { Monday: "Mar 10", Tuesday: "Mar 11", Wednesday: "Mar 12", Thursday: "Mar 13", Friday: "Mar 14" },
};

export default function Schedule() {
  const { schedule, programs, activeWaveId, setActiveWaveId, getScheduleForWave, updateSession, addSession, deleteSession } = useData();
  const { isAdmin } = useAdmin();
  const [selectedSME, setSelectedSME] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Current wave program
  const activeProgram = programs.find(p => p.id === activeWaveId);
  const currentSchedule = getScheduleForWave(activeWaveId);
  const DAYS = activeProgram?.daysOfWeek ?? ["Monday", "Tuesday", "Wednesday", "Thursday"];
  const DAY_DATES = WAVE_DATE_MAP[activeWaveId] ?? {};

  // Get unique SMEs for filter
  const uniqueSMEs = useMemo(() => {
    const smes = new Set(currentSchedule.map(s => s.sme).filter(s => s !== "N/A"));
    return Array.from(smes).sort();
  }, [currentSchedule]);

  // Filter logic
  const filteredSchedule = useMemo(() => {
    let filtered = currentSchedule;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.training.toLowerCase().includes(q) ||
          s.sme.toLowerCase().includes(q) ||
          s.day.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [currentSchedule, searchQuery]);

  // Determine which days have sessions for the selected SME
  const activeDays = useMemo(() => {
    if (selectedSME === "all") return new Set(DAYS);
    const days = new Set<string>();
    currentSchedule.forEach(s => {
      if (s.sme.toLowerCase().includes(selectedSME.toLowerCase())) {
        days.add(s.day);
      }
    });
    return days;
  }, [currentSchedule, selectedSME, DAYS]);

  // Get sessions for a specific day
  const getSessionsForDay = (day: string) => {
    return filteredSchedule
      .filter(s => s.day === day)
      .sort((a, b) => parseTime(a.timeStart) - parseTime(b.timeStart));
  };

  // Check if a session matches the SME filter
  const isSessionHighlighted = (session: TrainingSession) => {
    if (selectedSME === "all") return true;
    return session.sme.toLowerCase().includes(selectedSME.toLowerCase());
  };

  // New session form state
  const [newSession, setNewSession] = useState({
    day: "Monday",
    timeStart: "9:00 AM",
    timeEnd: "10:00 AM",
    training: "",
    sme: "",
    type: "live" as TrainingSession["type"],
  });

  const handleAddSession = () => {
    const dayDates = WAVE_DATE_MAP[activeWaveId] ?? {};
    const dateStr = dayDates[newSession.day] ?? "TBD";
    const session: TrainingSession = {
      id: `ts-new-${Date.now()}`,
      day: newSession.day,
      date: dateStr,
      timeStart: newSession.timeStart,
      timeEnd: newSession.timeEnd,
      training: newSession.training,
      sme: newSession.sme || "N/A",
      type: newSession.type,
      waveId: activeWaveId,
    };
    addSession(session);
    setAddDialogOpen(false);
    setNewSession({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" });
    toast("Session added", { description: `${session.training} on ${session.day}` });
  };

  // Reset SME filter when switching waves
  const handleWaveSwitch = (waveId: string) => {
    setActiveWaveId(waveId);
    setSelectedSME("all");
    setSearchQuery("");
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">
              Weekly Schedule
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-[#050505] mb-1">
            Training Calendar
          </h1>
          <p className="text-[15px] text-[#65676B]">
            {activeProgram?.wave ?? "Training Schedule"} · {activeProgram?.location ?? "Dublin"} · {activeProgram ? `${formatDateShort(activeProgram.startDate)}–${formatDateShort(activeProgram.endDate)}` : ""}
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Wave Switcher — horizontal timeline */}
        <div className="meta-card p-4 mb-4">
          <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-3">Training Waves</p>
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {programs.map((prog, idx) => {
              const status = getStatusBadge(prog.status);
              const isActive = prog.id === activeWaveId;
              const isLast = idx === programs.length - 1;

              return (
                <div key={prog.id} className="flex items-center shrink-0">
                  <button
                    onClick={() => handleWaveSwitch(prog.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-150 text-left",
                      isActive
                        ? "bg-[#E7F3FF] ring-1 ring-primary/20"
                        : "hover:bg-[#F0F2F5]"
                    )}
                  >
                    {/* Status icon */}
                    {prog.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#65676B] shrink-0" />
                    ) : prog.status === "active" ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-[#CED0D4] shrink-0" />
                    )}
                    <div>
                      <p className={cn(
                        "text-[14px] font-semibold leading-tight",
                        isActive ? "text-primary" : "text-[#050505]"
                      )}>
                        {prog.wave.split("—")[0].trim()}
                      </p>
                      <p className="text-[11px] text-[#8A8D91] mt-0.5">
                        {formatDateShort(prog.startDate)} – {formatDateShort(prog.endDate)}
                      </p>
                    </div>
                    <span className={cn(
                      "ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      status.bgColor, status.textColor
                    )}>
                      {status.label}
                    </span>
                  </button>
                  {!isLast && (
                    <ArrowRight className="w-4 h-4 text-[#CED0D4] mx-1 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="meta-card p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8D91]" />
              <input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] border-none rounded-full text-[15px] text-[#050505] placeholder-[#8A8D91] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors duration-150"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D91] hover:text-[#050505]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* SME Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#65676B] shrink-0" />
              <Select value={selectedSME} onValueChange={setSelectedSME}>
                <SelectTrigger className="w-full sm:w-[220px] bg-[#F0F2F5] border-none rounded-lg h-9 text-[14px]">
                  <SelectValue placeholder="Filter by SME" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SMEs</SelectItem>
                  {uniqueSMEs.map(sme => (
                    <SelectItem key={sme} value={sme}>
                      {sme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active filter indicator */}
            {selectedSME !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#E7F3FF] text-primary">
                <User className="w-3 h-3" />
                {selectedSME}
                <button
                  onClick={() => setSelectedSME("all")}
                  className="ml-0.5 hover:text-[#1565D8] transition-colors duration-150"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Admin: Add Session */}
            {isAdmin && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 ml-auto bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none">
                    <Plus className="w-3.5 h-3.5" />
                    Add Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-[20px] font-bold text-[#050505]">Add Training Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
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
                        <Input value={newSession.timeStart} onChange={e => setNewSession(p => ({ ...p, timeStart: e.target.value }))} placeholder="9:00 AM" className="rounded-lg" />
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">End Time</Label>
                        <Input value={newSession.timeEnd} onChange={e => setNewSession(p => ({ ...p, timeEnd: e.target.value }))} placeholder="10:00 AM" className="rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Training Title</Label>
                      <Input value={newSession.training} onChange={e => setNewSession(p => ({ ...p, training: e.target.value }))} placeholder="e.g., Live Video Training" className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">QER SME</Label>
                      <Input value={newSession.sme} onChange={e => setNewSession(p => ({ ...p, sme: e.target.value }))} placeholder="e.g., Farrukh Ahmed (or N/A)" className="rounded-lg" />
                    </div>
                    <Button onClick={handleAddSession} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newSession.training}>
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
          "grid gap-4",
          DAYS.length === 5
            ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          {DAYS.map(day => {
            const sessions = getSessionsForDay(day);
            const isDayActive = activeDays.has(day);

            return (
              <div
                key={day}
                className={cn(
                  "transition-opacity duration-200",
                  isDayActive ? "opacity-100" : "opacity-30"
                )}
              >
                {/* Day Header */}
                <div className={cn(
                  "meta-card mb-3 p-3 transition-all duration-200",
                  isDayActive && selectedSME !== "all"
                    ? "ring-2 ring-primary/30"
                    : ""
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[17px] font-bold text-[#050505]">{day}</h3>
                      <p className="text-[12px] text-[#8A8D91] font-medium">
                        {DAY_DATES[day] ?? ""}
                      </p>
                    </div>
                    <span className="text-[12px] text-[#8A8D91] font-medium bg-[#F0F2F5] px-2 py-0.5 rounded-full">
                      {sessions.length}
                    </span>
                  </div>
                  {isDayActive && selectedSME !== "all" && (
                    <div className="h-[3px] bg-primary rounded-full mt-2" />
                  )}
                </div>

                {/* Sessions */}
                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <div className="p-6 text-center text-[14px] text-[#8A8D91] border-2 border-dashed border-[#CED0D4]/60 rounded-lg">
                      No sessions scheduled
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const badge = getSessionTypeBadge(session.type);
                      const highlighted = isSessionHighlighted(session);
                      const dotColor = session.type === "live"
                        ? "bg-[#42B72A]"
                        : session.type === "upskilling"
                        ? "bg-primary"
                        : "bg-[#8A8D91]";
                      const badgeClass = session.type === "live"
                        ? "meta-badge meta-badge-green"
                        : session.type === "upskilling"
                        ? "meta-badge meta-badge-blue"
                        : "meta-badge meta-badge-yellow";

                      return (
                        <div
                          key={session.id}
                          className={cn(
                            "meta-card relative group overflow-hidden transition-all duration-200",
                            highlighted
                              ? "shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                              : "opacity-40"
                          )}
                        >
                          {/* Left color bar */}
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg",
                            dotColor
                          )} />

                          <div className="p-3 pl-4">
                            {/* Time */}
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3 h-3 text-[#8A8D91]" />
                              <span className="text-[12px] text-[#65676B] font-medium">
                                {session.timeStart} — {session.timeEnd}
                              </span>
                            </div>

                            {/* Training title */}
                            {isAdmin ? (
                              <EditableField
                                value={session.training}
                                fieldId={`session-${session.id}-training`}
                                onSave={v => updateSession(session.id, { training: v })}
                                className="text-[14px] font-semibold text-[#050505] leading-snug block mb-1.5"
                                as="p"
                              />
                            ) : (
                              <p className="text-[14px] font-semibold text-[#050505] leading-snug mb-1.5">
                                {session.training}
                              </p>
                            )}

                            {/* Badge + SME */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={badgeClass}>
                                {badge.label}
                              </span>
                              {session.sme !== "N/A" && (
                                <span className="flex items-center gap-1 text-[13px] text-[#65676B]">
                                  <User className="w-3 h-3" />
                                  {isAdmin ? (
                                    <EditableField
                                      value={session.sme}
                                      fieldId={`session-${session.id}-sme`}
                                      onSave={v => updateSession(session.id, { sme: v })}
                                      className="text-[13px]"
                                    />
                                  ) : (
                                    session.sme
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Resources */}
                            {session.resources && session.resources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-[#CED0D4]/40">
                                {session.resources.map((r, ri) => (
                                  <div key={ri} className="flex items-center gap-1.5 text-[12px] text-[#8A8D91]">
                                    <BookOpen className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{r}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Admin delete */}
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  deleteSession(session.id);
                                  toast("Session removed");
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#FA3E3E]/60 hover:text-[#FA3E3E] transition-all duration-150"
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
        <div className="meta-card mt-6 p-4">
          <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-3">Session Types</p>
          <div className="flex flex-wrap gap-5">
            {[
              { type: "live" as const, color: "bg-[#42B72A]" },
              { type: "self-study" as const, color: "bg-[#8A8D91]" },
              { type: "upskilling" as const, color: "bg-primary" },
            ].map(item => {
              const badge = getSessionTypeBadge(item.type);
              return (
                <div key={item.type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-[14px] text-[#65676B]">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: parse time string to minutes for sorting
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

// Helper: format date like "Feb 10"
function formatDateShort(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = months[parseInt(parts[1]) - 1] ?? parts[1];
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}
