/*
 * Schedule — Weekly Calendar View with SME Filtering
 * Design: "Anthropic Warmth" — Smart Filter Pills
 * When SME filters their name, unrelated days dim to 30% opacity
 * maintaining spatial context while highlighting relevant sessions
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  User,
  BookOpen,
  X,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { getSessionTypeBadge, getDaysOfWeek, type TrainingSession } from "@/lib/data";
import { toast } from "sonner";

const DAYS = getDaysOfWeek();
const DAY_DATES: Record<string, string> = {
  Monday: "Feb 10",
  Tuesday: "Feb 11",
  Wednesday: "Feb 12",
  Thursday: "Feb 13",
};

export default function Schedule() {
  const { schedule, updateSession, addSession, deleteSession } = useData();
  const { isAdmin } = useAdmin();
  const [selectedSME, setSelectedSME] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Get unique SMEs for filter
  const uniqueSMEs = useMemo(() => {
    const smes = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
    return Array.from(smes).sort();
  }, [schedule]);

  // Filter logic
  const filteredSchedule = useMemo(() => {
    let filtered = schedule;
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
  }, [schedule, searchQuery]);

  // Determine which days have sessions for the selected SME
  const activeDays = useMemo(() => {
    if (selectedSME === "all") return new Set(DAYS);
    const days = new Set<string>();
    schedule.forEach(s => {
      if (s.sme.toLowerCase().includes(selectedSME.toLowerCase())) {
        days.add(s.day);
      }
    });
    return days;
  }, [schedule, selectedSME]);

  // Get sessions for a specific day
  const getSessionsForDay = (day: string) => {
    return filteredSchedule
      .filter(s => s.day === day)
      .sort((a, b) => {
        const timeA = parseTime(a.timeStart);
        const timeB = parseTime(b.timeStart);
        return timeA - timeB;
      });
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
    const session: TrainingSession = {
      id: `ts-new-${Date.now()}`,
      day: newSession.day,
      date: `2025-02-${newSession.day === "Monday" ? "10" : newSession.day === "Tuesday" ? "11" : newSession.day === "Wednesday" ? "12" : "13"}`,
      timeStart: newSession.timeStart,
      timeEnd: newSession.timeEnd,
      training: newSession.training,
      sme: newSession.sme || "N/A",
      type: newSession.type,
    };
    addSession(session);
    setAddDialogOpen(false);
    setNewSession({ day: "Monday", timeStart: "9:00 AM", timeEnd: "10:00 AM", training: "", sme: "", type: "live" });
    toast("Session added", { description: `${session.training} on ${session.day}` });
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-amber" />
          <span className="font-mono-label text-amber uppercase tracking-wider">
            Weekly Schedule
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Training Calendar
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Wave 2 Complex Object Training · Dublin · Feb 10–13, 2025
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 p-4 bg-card rounded-xl border border-border/50">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* SME Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <Select value={selectedSME} onValueChange={setSelectedSME}>
            <SelectTrigger className="w-full sm:w-[220px] bg-background">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber/15 text-amber-dark border border-amber/20">
              <User className="w-3 h-3" />
              {selectedSME}
              <button
                onClick={() => setSelectedSME("all")}
                className="ml-1 hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </motion.div>
        )}

        {/* Admin: Add Session */}
        {isAdmin && (
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 ml-auto">
                <Plus className="w-3.5 h-3.5" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Add Training Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Day</Label>
                    <Select value={newSession.day} onValueChange={v => setNewSession(p => ({ ...p, day: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Type</Label>
                    <Select value={newSession.type} onValueChange={v => setNewSession(p => ({ ...p, type: v as TrainingSession["type"] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Start Time</Label>
                    <Input value={newSession.timeStart} onChange={e => setNewSession(p => ({ ...p, timeStart: e.target.value }))} placeholder="9:00 AM" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">End Time</Label>
                    <Input value={newSession.timeEnd} onChange={e => setNewSession(p => ({ ...p, timeEnd: e.target.value }))} placeholder="10:00 AM" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Training Title</Label>
                  <Input value={newSession.training} onChange={e => setNewSession(p => ({ ...p, training: e.target.value }))} placeholder="e.g., Live Video Training" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">QER SME</Label>
                  <Input value={newSession.sme} onChange={e => setNewSession(p => ({ ...p, sme: e.target.value }))} placeholder="e.g., Farrukh Ahmed (or N/A)" />
                </div>
                <Button onClick={handleAddSession} className="w-full" disabled={!newSession.training}>
                  Add Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {DAYS.map(day => {
          const sessions = getSessionsForDay(day);
          const isDayActive = activeDays.has(day);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: isDayActive ? 1 : 0.3,
                y: 0,
                scale: isDayActive && selectedSME !== "all" ? 1.01 : 1,
              }}
              transition={{ duration: 0.35, ease: "easeOut" as const }}
              className="relative"
            >
              {/* Day Header */}
              <div className={cn(
                "sticky top-20 z-10 mb-3 p-3 rounded-xl border transition-all duration-300",
                isDayActive && selectedSME !== "all"
                  ? "bg-amber/5 border-amber/20"
                  : "bg-card border-border/50"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl text-foreground">{day}</h3>
                    <p className="font-mono-label text-muted-foreground text-[11px]">
                      {DAY_DATES[day]}
                    </p>
                  </div>
                  <span className="font-mono-label text-xs text-muted-foreground/60">
                    {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {isDayActive && selectedSME !== "all" && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="h-0.5 bg-amber rounded-full mt-2"
                  />
                )}
              </div>

              {/* Sessions */}
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground/50 border border-dashed border-border/30 rounded-xl">
                    No sessions scheduled
                  </div>
                ) : (
                  sessions.map((session, i) => {
                    const badge = getSessionTypeBadge(session.type);
                    const highlighted = isSessionHighlighted(session);

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: highlighted ? 1 : 0.25,
                          y: 0,
                        }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <Card className={cn(
                          "border transition-all duration-300 group relative overflow-hidden",
                          highlighted
                            ? "border-border/60 shadow-sm hover:shadow-md"
                            : "border-border/20 shadow-none"
                        )}>
                          {/* Type indicator bar */}
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                            session.type === "live" ? "bg-amber" : session.type === "upskilling" ? "bg-primary" : "bg-sage-light"
                          )} />

                          <CardContent className="p-3.5 pl-4.5 ml-1">
                            {/* Time */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <Clock className="w-3 h-3 text-muted-foreground/60" />
                              <span className="font-mono-label text-[11px] text-muted-foreground">
                                {session.timeStart} — {session.timeEnd}
                              </span>
                            </div>

                            {/* Training title */}
                            {isAdmin ? (
                              <EditableField
                                value={session.training}
                                fieldId={`session-${session.id}-training`}
                                onSave={v => updateSession(session.id, { training: v })}
                                className="text-sm font-medium text-foreground leading-snug block mb-2"
                                as="p"
                              />
                            ) : (
                              <p className="text-sm font-medium text-foreground leading-snug mb-2">
                                {session.training}
                              </p>
                            )}

                            {/* Badge + SME */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                                badge.color
                              )}>
                                {badge.label}
                              </span>
                              {session.sme !== "N/A" && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {isAdmin ? (
                                    <EditableField
                                      value={session.sme}
                                      fieldId={`session-${session.id}-sme`}
                                      onSave={v => updateSession(session.id, { sme: v })}
                                      className="text-xs"
                                    />
                                  ) : (
                                    session.sme
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Resources */}
                            {session.resources && session.resources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/30">
                                {session.resources.map((r, ri) => (
                                  <div key={ri} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
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
                                className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 p-4 bg-card rounded-xl border border-border/40">
        <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-3">Session Types</p>
        <div className="flex flex-wrap gap-4">
          {[
            { type: "live" as const, color: "bg-amber" },
            { type: "self-study" as const, color: "bg-sage-light" },
            { type: "upskilling" as const, color: "bg-primary" },
          ].map(item => {
            const badge = getSessionTypeBadge(item.type);
            return (
              <div key={item.type} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", item.color)} />
                <span className="text-sm text-muted-foreground">{badge.label}</span>
              </div>
            );
          })}
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
