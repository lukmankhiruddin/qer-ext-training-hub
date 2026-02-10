/*
 * Programs — Program Itinerary Management with Wave 1/2/3
 * Design: Modern Meta/Apple hybrid — glass cards, gradient accents, vibrant badges
 */
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import {
  FolderKanban, MapPin, CalendarDays, CheckCircle2, Circle, Timer, Users,
  Building2, ArrowRight, BookOpen, Clock, Plus, Trash2, X, Sparkles,
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
import { Link } from "wouter";
import { type ProgramItinerary } from "@/lib/data";
import { toast } from "sonner";

function formatDateShort(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = months[parseInt(parts[1]) - 1] ?? parts[1];
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}

export default function Programs() {
  const { programs, smes, updateProgram, deleteProgram, addProgram, getScheduleForWave, setActiveWaveId } = useData();
  const { isAdmin, logActivity } = useAdmin();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProg, setNewProg] = useState({
    program: "TP Onboarding Schedule", wave: "", location: "Dublin", startDate: "", endDate: "",
    status: "upcoming" as ProgramItinerary["status"], description: "", modules: "", smes: "",
  });

  const handleAddProgram = () => {
    const prog: ProgramItinerary = {
      id: `prog-${Date.now()}`, program: newProg.program, wave: newProg.wave, location: newProg.location,
      startDate: newProg.startDate, endDate: newProg.endDate, status: newProg.status, description: newProg.description,
      modules: newProg.modules.split(",").map(m => m.trim()).filter(Boolean),
      smesInvolved: newProg.smes.split(",").map(s => s.trim()).filter(Boolean),
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
    addProgram(prog);
    logActivity("Program Added", `${prog.wave} created`);
    setAddDialogOpen(false);
    setNewProg({ program: "TP Onboarding Schedule", wave: "", location: "Dublin", startDate: "", endDate: "", status: "upcoming", description: "", modules: "", smes: "" });
    toast.success("Program added");
  };

  const handleDeleteProgram = (prog: ProgramItinerary) => {
    deleteProgram(prog.id);
    logActivity("Program Deleted", `${prog.wave} removed`);
    toast("Program removed");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03]" />
        <div className="container relative py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                <FolderKanban className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.08em]">Program Itinerary</span>
              </div>
              <h1 className="text-[26px] font-bold text-foreground tracking-[-0.02em] mb-1 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
                Training Programs
              </h1>
              <p className="text-[14px] text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Track all training waves — past, current, and upcoming. View schedules, SME assignments, and program status at a glance.
              </p>
            </div>

            {isAdmin && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] hover:opacity-90 transition-all duration-300 border-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <Plus className="w-3.5 h-3.5" />
                    Add Program
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Training Program</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-3 max-h-[60vh] overflow-y-auto pr-1">
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Program Name</Label>
                      <Input value={newProg.program} onChange={e => setNewProg(p => ({ ...p, program: e.target.value }))} className="rounded-xl border-border/50" />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Wave Title</Label>
                      <Input value={newProg.wave} onChange={e => setNewProg(p => ({ ...p, wave: e.target.value }))} placeholder="e.g., Wave 4 — Quality Assurance" className="rounded-xl border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Start Date</Label>
                        <Input type="date" value={newProg.startDate} onChange={e => setNewProg(p => ({ ...p, startDate: e.target.value }))} className="rounded-xl border-border/50" />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">End Date</Label>
                        <Input type="date" value={newProg.endDate} onChange={e => setNewProg(p => ({ ...p, endDate: e.target.value }))} className="rounded-xl border-border/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Location</Label>
                        <Input value={newProg.location} onChange={e => setNewProg(p => ({ ...p, location: e.target.value }))} className="rounded-xl border-border/50" />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Status</Label>
                        <Select value={newProg.status} onValueChange={v => setNewProg(p => ({ ...p, status: v as ProgramItinerary["status"] }))}>
                          <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Description</Label>
                      <textarea
                        value={newProg.description}
                        onChange={e => setNewProg(p => ({ ...p, description: e.target.value }))}
                        className="w-full bg-white border border-border/50 rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={3}
                        placeholder="Brief description of the program..."
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Modules (comma-separated)</Label>
                      <Input value={newProg.modules} onChange={e => setNewProg(p => ({ ...p, modules: e.target.value }))} placeholder="e.g., Video Review, Photo Moderation" className="rounded-xl border-border/50" />
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">SMEs Involved (comma-separated)</Label>
                      <Input value={newProg.smes} onChange={e => setNewProg(p => ({ ...p, smes: e.target.value }))} placeholder="e.g., Farrukh Ahmed, Corneliu Onica" className="rounded-xl border-border/50" />
                    </div>
                    <Button onClick={handleAddProgram} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newProg.wave || !newProg.startDate}>
                      Add Program
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="space-y-4">
          {programs.map((program, progIdx) => {
            const waveSchedule = getScheduleForWave(program.id);
            const waveSMEs = new Set(waveSchedule.map(s => s.sme).filter(s => s !== "N/A"));
            const liveSessions = waveSchedule.filter(s => s.type === "live").length;
            const selfStudySessions = waveSchedule.filter(s => s.type === "self-study").length;
            const upskillingCount = waveSchedule.filter(s => s.type === "upskilling").length;

            const statusGradient = program.status === "active"
              ? "from-emerald-400 to-green-500"
              : program.status === "upcoming"
              ? "from-blue-400 to-indigo-500"
              : "from-gray-300 to-gray-400";

            return (
              <div
                key={program.id}
                className={cn(
                  "glass-card overflow-hidden relative group animate-fade-in-up",
                  program.status === "active" && "shadow-[0_4px_20px_oklch(0.55_0.22_264_/_8%)]"
                )}
                style={{ animationDelay: `${0.12 + progIdx * 0.06}s` }}
              >
                {/* Status gradient bar */}
                <div className={cn("h-[3px] bg-gradient-to-r", statusGradient)} />

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteProgram(program)}
                    className="absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={cn(
                          "vibrant-badge",
                          program.status === "completed" ? "vibrant-badge-gray" :
                          program.status === "active" ? "vibrant-badge-green" : "vibrant-badge-blue"
                        )}>
                          <span className={cn(
                            "w-[6px] h-[6px] rounded-full",
                            program.status === "completed" ? "bg-gray-400" :
                            program.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                          )} />
                          {program.status === "completed" ? "Completed" : program.status === "active" ? "Active" : "Upcoming"}
                        </span>
                        {program.status === "upcoming" && (
                          <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Starts {formatDateShort(program.startDate)}
                          </span>
                        )}
                      </div>

                      {isAdmin ? (
                        <EditableField value={program.program} fieldId={`program-${program.id}-name`}
                          onSave={v => { updateProgram(program.id, { program: v }); logActivity("Program Updated", `${program.wave} name changed`); }}
                          className="text-[20px] font-bold text-foreground tracking-[-0.01em] block mb-1" as="h2" />
                      ) : (
                        <h2 className="text-[20px] font-bold text-foreground tracking-[-0.01em] mb-1">{program.program}</h2>
                      )}

                      {isAdmin ? (
                        <EditableField value={program.wave} fieldId={`program-${program.id}-wave`}
                          onSave={v => { updateProgram(program.id, { wave: v }); logActivity("Program Updated", `Wave title changed to ${v}`); }}
                          className="text-[14px] text-muted-foreground block mb-3" as="p" />
                      ) : (
                        <p className="text-[14px] text-muted-foreground mb-3">{program.wave}</p>
                      )}

                      {isAdmin ? (
                        <EditableField value={program.description} fieldId={`program-${program.id}-desc`}
                          onSave={v => { updateProgram(program.id, { description: v }); logActivity("Program Updated", `${program.wave} description updated`); }}
                          className="text-[13px] text-muted-foreground/80 leading-relaxed block" as="p" multiline />
                      ) : (
                        <p className="text-[13px] text-muted-foreground/80 leading-relaxed">{program.description}</p>
                      )}

                      {/* Modules */}
                      {program.modules && program.modules.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Training Modules</p>
                          <div className="flex flex-wrap gap-1.5">
                            {program.modules.map((mod, mi) => (
                              <span key={mi} className="text-[11px] font-medium px-2.5 py-[3px] rounded-lg bg-secondary/70 text-secondary-foreground flex items-center gap-1">
                                {mod}
                                {isAdmin && (
                                  <button onClick={() => {
                                    const newModules = program.modules!.filter((_, i) => i !== mi);
                                    updateProgram(program.id, { modules: newModules });
                                    logActivity("Module Removed", `${mod} removed from ${program.wave}`);
                                    toast("Module removed");
                                  }} className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                            {isAdmin && (
                              <AddModuleInline onAdd={(mod) => {
                                updateProgram(program.id, { modules: [...(program.modules ?? []), mod] });
                                logActivity("Module Added", `${mod} added to ${program.wave}`);
                                toast.success("Module added");
                              }} />
                            )}
                          </div>
                        </div>
                      )}

                      {/* SMEs */}
                      {program.smesInvolved && program.smesInvolved.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">SMEs Assigned</p>
                          <div className="flex flex-wrap gap-1.5">
                            {program.smesInvolved.map((sme, si) => (
                              <span key={si} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-[3px] rounded-lg bg-primary/6 text-primary/90">
                                <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary/20 to-purple-500/15 flex items-center justify-center text-[9px] font-bold text-primary">
                                  {sme.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                                {sme}
                                {isAdmin && (
                                  <button onClick={() => {
                                    updateProgram(program.id, { smesInvolved: program.smesInvolved!.filter((_, i) => i !== si) });
                                    logActivity("SME Unassigned", `${sme} removed from ${program.wave}`);
                                    toast("SME unassigned");
                                  }} className="ml-0.5 text-primary/50 hover:text-destructive transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                            {isAdmin && (
                              <AddSMEInline onAdd={(sme) => {
                                updateProgram(program.id, { smesInvolved: [...(program.smesInvolved ?? []), sme] });
                                logActivity("SME Assigned", `${sme} assigned to ${program.wave}`);
                                toast.success("SME assigned");
                              }} />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />{program.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <CalendarDays className="w-3.5 h-3.5" />{formatDateShort(program.startDate)} – {formatDateShort(program.endDate)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />{program.daysOfWeek?.length ?? 0} days
                        </div>
                        <Link href="/schedule" onClick={() => setActiveWaveId(program.id)}>
                          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-primary/8 font-semibold rounded-xl text-[13px]">
                            View Schedule <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Quick stats */}
                    <div className="lg:w-64 shrink-0">
                      <div className="p-4 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl space-y-3 border border-border/20">
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em]">Wave Stats</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: waveSchedule.length, label: "Sessions" },
                            { value: waveSMEs.size, label: "SMEs" },
                            { value: liveSessions, label: "Live" },
                            { value: program.daysOfWeek?.length ?? 0, label: "Days" },
                          ].map(stat => (
                            <div key={stat.label}>
                              <p className="text-[24px] font-bold text-foreground tracking-[-0.02em]">{stat.value}</p>
                              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-border/30">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Breakdown</p>
                          <div className="space-y-1.5">
                            {[
                              { label: "Live Training", count: liveSessions, gradient: "from-emerald-400 to-green-500" },
                              { label: "Self Study", count: selfStudySessions, gradient: "from-amber-400 to-orange-500" },
                              { label: "Upskilling", count: upskillingCount, gradient: "from-blue-400 to-indigo-500" },
                            ].map(item => (
                              <div key={item.label} className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full bg-gradient-to-br shrink-0", item.gradient)} />
                                <span className="text-[11px] text-muted-foreground flex-1">{item.label}</span>
                                <span className="text-[11px] font-semibold text-foreground">{item.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vendor Capacity Matrix */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-[19px] font-bold text-foreground tracking-[-0.01em]">Vendor Capacity Matrix</h2>
              </div>
              <p className="text-[13px] text-muted-foreground mt-1">SME distribution across vendors and locations.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Vendor</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Location</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Total SMEs</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Market SME</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">VG SME</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Pillar Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { vendor: "Accenture Dublin", location: "Dublin" },
                    { vendor: "Teleperformance", location: "Dublin" },
                    { vendor: "Covalen", location: "Dublin" },
                    { vendor: "Accenture Bangkok", location: "Bangkok" },
                  ].map(v => {
                    const vendorSMEs = smes.filter(s =>
                      s.vendors.some(sv => sv.toLowerCase().includes(v.vendor.toLowerCase().split(" ")[0]))
                      && (v.location === "Dublin" ? s.location === "Dublin" : s.location === "Bangkok")
                    );
                    return (
                      <tr key={v.vendor} className="border-b border-border/20 hover:bg-primary/[0.02] transition-all duration-200">
                        <td className="p-3 font-semibold text-foreground">{v.vendor}</td>
                        <td className="p-3 text-muted-foreground">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{v.location}</span>
                        </td>
                        <td className="p-3 text-center"><span className="text-[17px] font-bold text-foreground">{vendorSMEs.length}</span></td>
                        <td className="p-3 text-center text-muted-foreground">{vendorSMEs.filter(s => s.roles.includes("Market SME")).length}</td>
                        <td className="p-3 text-center text-muted-foreground">{vendorSMEs.filter(s => s.roles.includes("VG SME")).length}</td>
                        <td className="p-3 text-center text-muted-foreground">{vendorSMEs.filter(s => s.roles.includes("Pillar Lead SME")).length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Inline Add Module */
function AddModuleInline({ onAdd }: { onAdd: (mod: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-[3px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">
        <Plus className="w-3 h-3" />Add Module
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input autoFocus value={value} onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); }
          if (e.key === "Escape") { setValue(""); setIsAdding(false); }
        }}
        placeholder="Module name..."
        className="text-[11px] px-2 py-[3px] rounded-lg border-2 border-primary bg-white focus:outline-none shadow-[0_0_0_3px_oklch(0.55_0.22_264_/_12%)] min-w-[120px]" />
      <button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); } }} className="p-1 text-primary hover:bg-primary/8 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
      <button onClick={() => { setValue(""); setIsAdding(false); }} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
    </div>
  );
}

/* Inline Add SME */
function AddSMEInline({ onAdd }: { onAdd: (sme: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-[3px] rounded-lg border-2 border-dashed border-primary/20 text-primary/50 hover:border-primary hover:text-primary transition-all duration-200">
        <Plus className="w-3 h-3" />Assign SME
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input autoFocus value={value} onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); }
          if (e.key === "Escape") { setValue(""); setIsAdding(false); }
        }}
        placeholder="SME name..."
        className="text-[11px] px-2 py-[3px] rounded-lg border-2 border-primary bg-white focus:outline-none shadow-[0_0_0_3px_oklch(0.55_0.22_264_/_12%)] min-w-[120px]" />
      <button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); } }} className="p-1 text-primary hover:bg-primary/8 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
      <button onClick={() => { setValue(""); setIsAdding(false); }} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
    </div>
  );
}
