/*
 * Programs — Program Itinerary Management with Wave 1/2/3
 * Design: Meta/Facebook — Clean white cards, blue accents, system fonts
 * Shows all waves with their schedules, modules, and SME assignments
 * Admin can add/edit/delete programs and manage modules inline
 */
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import {
  FolderKanban,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Circle,
  Timer,
  Users,
  Building2,
  ArrowRight,
  BookOpen,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  X,
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
import { Link } from "wouter";
import { getSessionTypeBadge, getStatusBadge, type ProgramItinerary } from "@/lib/data";
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
  const { programs, smes, schedule, contacts, updateProgram, deleteProgram, addProgram, getScheduleForWave, setActiveWaveId } = useData();
  const { isAdmin, logActivity } = useAdmin();
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

  const handleAddProgram = () => {
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

  const statusConfig = {
    active: {
      icon: Timer,
      label: "Active",
      color: "bg-[#E8F5E9] text-[#2E7D32]",
      dotColor: "bg-[#42B72A]",
      barColor: "bg-[#42B72A]",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      color: "bg-[#F0F2F5] text-[#65676B]",
      dotColor: "bg-[#8A8D91]",
      barColor: "bg-[#8A8D91]",
    },
    upcoming: {
      icon: Circle,
      label: "Upcoming",
      color: "bg-[#E7F3FF] text-primary",
      dotColor: "bg-primary",
      barColor: "bg-primary",
    },
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">
                  Program Itinerary
                </span>
              </div>
              <h1 className="text-[24px] font-bold text-[#050505] mb-1">
                Training Programs
              </h1>
              <p className="text-[15px] text-[#65676B] max-w-lg">
                Track all training waves — past, current, and upcoming. View schedules, SME assignments, and program status at a glance.
              </p>
            </div>

            {/* Admin: Add Program */}
            {isAdmin && (
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
                        placeholder="Brief description of the program..."
                      />
                    </div>
                    <div>
                      <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">Modules (comma-separated)</Label>
                      <Input value={newProg.modules} onChange={e => setNewProg(p => ({ ...p, modules: e.target.value }))} placeholder="e.g., Video Review, Photo Moderation" className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="text-[13px] text-[#65676B] mb-1.5 block font-semibold">SMEs Involved (comma-separated)</Label>
                      <Input value={newProg.smes} onChange={e => setNewProg(p => ({ ...p, smes: e.target.value }))} placeholder="e.g., Farrukh Ahmed, Corneliu Onica" className="rounded-lg" />
                    </div>
                    <Button onClick={handleAddProgram} className="w-full bg-primary hover:bg-[#1565D8] text-white font-semibold rounded-lg shadow-none h-10" disabled={!newProg.wave || !newProg.startDate}>
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
        {/* Programs Timeline */}
        <div className="space-y-4">
          {programs.map((program) => {
            const status = statusConfig[program.status];
            const waveSchedule = getScheduleForWave(program.id);
            const waveSMEs = new Set(waveSchedule.map(s => s.sme).filter(s => s !== "N/A"));
            const liveSessions = waveSchedule.filter(s => s.type === "live").length;
            const selfStudySessions = waveSchedule.filter(s => s.type === "self-study").length;
            const upskillingCount = waveSchedule.filter(s => s.type === "upskilling").length;

            return (
              <div
                key={program.id}
                className={cn(
                  "meta-card overflow-hidden transition-shadow duration-200 relative group",
                  program.status === "active" && "shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)]"
                )}
              >
                {/* Status bar */}
                <div className={cn("h-[3px]", status.barColor)} />

                {/* Admin: Delete program */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteProgram(program)}
                    className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#65676B] hover:text-[#FA3E3E] transition-all duration-150 z-10"
                    title="Delete program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    {/* Left: Program info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold",
                          status.color
                        )}>
                          <span className={cn("w-2 h-2 rounded-full", status.dotColor, program.status === "active" && "animate-pulse")} />
                          {status.label}
                        </span>
                        {program.status === "upcoming" && (
                          <span className="text-[12px] text-primary font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Starts {formatDateShort(program.startDate)}
                          </span>
                        )}
                      </div>

                      {isAdmin ? (
                        <EditableField
                          value={program.program}
                          fieldId={`program-${program.id}-name`}
                          onSave={v => { updateProgram(program.id, { program: v }); logActivity("Program Updated", `${program.wave} name changed`); }}
                          className="text-[22px] font-bold text-[#050505] block mb-1"
                          as="h2"
                        />
                      ) : (
                        <h2 className="text-[22px] font-bold text-[#050505] mb-1">
                          {program.program}
                        </h2>
                      )}

                      {isAdmin ? (
                        <EditableField
                          value={program.wave}
                          fieldId={`program-${program.id}-wave`}
                          onSave={v => { updateProgram(program.id, { wave: v }); logActivity("Program Updated", `Wave title changed to ${v}`); }}
                          className="text-[15px] text-[#65676B] block mb-3"
                          as="p"
                        />
                      ) : (
                        <p className="text-[15px] text-[#65676B] mb-3">{program.wave}</p>
                      )}

                      {isAdmin ? (
                        <EditableField
                          value={program.description}
                          fieldId={`program-${program.id}-desc`}
                          onSave={v => { updateProgram(program.id, { description: v }); logActivity("Program Updated", `${program.wave} description updated`); }}
                          className="text-[14px] text-[#8A8D91] leading-relaxed block"
                          as="p"
                          multiline
                        />
                      ) : (
                        <p className="text-[14px] text-[#8A8D91] leading-relaxed">
                          {program.description}
                        </p>
                      )}

                      {/* Modules */}
                      {program.modules && program.modules.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Training Modules</p>
                          <div className="flex flex-wrap gap-1.5">
                            {program.modules.map((mod, mi) => (
                              <span key={mi} className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#F0F2F5] text-[#65676B] flex items-center gap-1">
                                {mod}
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      const newModules = program.modules!.filter((_, i) => i !== mi);
                                      updateProgram(program.id, { modules: newModules });
                                      logActivity("Module Removed", `${mod} removed from ${program.wave}`);
                                      toast("Module removed");
                                    }}
                                    className="ml-0.5 text-[#8A8D91] hover:text-[#FA3E3E] transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                            {isAdmin && (
                              <AddModuleInline
                                onAdd={(mod) => {
                                  const newModules = [...(program.modules ?? []), mod];
                                  updateProgram(program.id, { modules: newModules });
                                  logActivity("Module Added", `${mod} added to ${program.wave}`);
                                  toast.success("Module added");
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* SMEs Involved */}
                      {program.smesInvolved && program.smesInvolved.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">SMEs Assigned</p>
                          <div className="flex flex-wrap gap-1.5">
                            {program.smesInvolved.map((sme, si) => (
                              <span key={si} className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#E7F3FF] text-primary">
                                <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                                  {sme.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                                {sme}
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      const newSMEs = program.smesInvolved!.filter((_, i) => i !== si);
                                      updateProgram(program.id, { smesInvolved: newSMEs });
                                      logActivity("SME Unassigned", `${sme} removed from ${program.wave}`);
                                      toast("SME unassigned");
                                    }}
                                    className="ml-0.5 text-primary/60 hover:text-[#FA3E3E] transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                            {isAdmin && (
                              <AddSMEInline
                                onAdd={(sme) => {
                                  const newSMEs = [...(program.smesInvolved ?? []), sme];
                                  updateProgram(program.id, { smesInvolved: newSMEs });
                                  logActivity("SME Assigned", `${sme} assigned to ${program.wave}`);
                                  toast.success("SME assigned");
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#CED0D4]/40">
                        <div className="flex items-center gap-1.5 text-[14px] text-[#65676B]">
                          <MapPin className="w-3.5 h-3.5" />
                          {program.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-[14px] text-[#65676B]">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDateShort(program.startDate)} – {formatDateShort(program.endDate)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[14px] text-[#65676B]">
                          <Clock className="w-3.5 h-3.5" />
                          {program.daysOfWeek?.length ?? 0} days
                        </div>
                        <Link href="/schedule" onClick={() => setActiveWaveId(program.id)}>
                          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-[#E7F3FF] font-semibold">
                            View Schedule <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Quick stats */}
                    <div className="lg:w-64 shrink-0">
                      <div className="p-4 bg-[#F0F2F5] rounded-xl space-y-3">
                        <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide">
                          Wave Stats
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[24px] font-bold text-[#050505]">
                              {waveSchedule.length}
                            </p>
                            <p className="text-[12px] text-[#65676B]">Sessions</p>
                          </div>
                          <div>
                            <p className="text-[24px] font-bold text-[#050505]">
                              {waveSMEs.size}
                            </p>
                            <p className="text-[12px] text-[#65676B]">SMEs</p>
                          </div>
                          <div>
                            <p className="text-[24px] font-bold text-[#050505]">
                              {liveSessions}
                            </p>
                            <p className="text-[12px] text-[#65676B]">Live</p>
                          </div>
                          <div>
                            <p className="text-[24px] font-bold text-[#050505]">
                              {program.daysOfWeek?.length ?? 0}
                            </p>
                            <p className="text-[12px] text-[#65676B]">Days</p>
                          </div>
                        </div>

                        {/* Session type breakdown */}
                        <div className="pt-3 border-t border-[#CED0D4]/40">
                          <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Breakdown</p>
                          <div className="space-y-1.5">
                            {[
                              { label: "Live Training", count: liveSessions, color: "bg-[#42B72A]" },
                              { label: "Self Study", count: selfStudySessions, color: "bg-[#8A8D91]" },
                              { label: "Upskilling", count: upskillingCount, color: "bg-primary" },
                            ].map(item => (
                              <div key={item.label} className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full shrink-0", item.color)} />
                                <span className="text-[12px] text-[#65676B] flex-1">{item.label}</span>
                                <span className="text-[12px] font-semibold text-[#050505]">{item.count}</span>
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
        <div className="mt-8">
          <div className="meta-card overflow-hidden">
            <div className="p-4 border-b border-[#CED0D4]/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-[20px] font-bold text-[#050505]">Vendor Capacity Matrix</h2>
              </div>
              <p className="text-[14px] text-[#65676B] mt-1">
                SME distribution across vendors and locations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#CED0D4]/60 bg-[#F0F2F5]">
                    <th className="text-left p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Vendor</th>
                    <th className="text-left p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Location</th>
                    <th className="text-center p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Total SMEs</th>
                    <th className="text-center p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Market SME</th>
                    <th className="text-center p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">VG SME</th>
                    <th className="text-center p-3 text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Pillar Lead</th>
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
                      <tr key={v.vendor} className="border-b border-[#CED0D4]/30 hover:bg-[#F2F2F2] transition-colors duration-150">
                        <td className="p-3 font-semibold text-[#050505]">{v.vendor}</td>
                        <td className="p-3 text-[#65676B]">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {v.location}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[18px] font-bold text-[#050505]">{vendorSMEs.length}</span>
                        </td>
                        <td className="p-3 text-center text-[#65676B]">
                          {vendorSMEs.filter(s => s.roles.includes("Market SME")).length}
                        </td>
                        <td className="p-3 text-center text-[#65676B]">
                          {vendorSMEs.filter(s => s.roles.includes("VG SME")).length}
                        </td>
                        <td className="p-3 text-center text-[#65676B]">
                          {vendorSMEs.filter(s => s.roles.includes("Pillar Lead SME")).length}
                        </td>
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

/* ============================================================
 * Inline Add Module Button
 * ============================================================ */
function AddModuleInline({ onAdd }: { onAdd: (mod: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full border-2 border-dashed border-[#CED0D4] text-[#8A8D91] hover:border-primary hover:text-primary transition-colors duration-150"
      >
        <Plus className="w-3 h-3" />
        Add Module
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); }
          if (e.key === "Escape") { setValue(""); setIsAdding(false); }
        }}
        placeholder="Module name..."
        className="text-[12px] px-2 py-1 rounded-lg border-2 border-primary bg-white focus:outline-none shadow-[0_0_0_2px_rgba(24,119,242,0.2)] min-w-[120px]"
      />
      <button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); } }} className="p-1 text-primary hover:bg-[#E7F3FF] rounded">
        <CheckCircle2 className="w-4 h-4" />
      </button>
      <button onClick={() => { setValue(""); setIsAdding(false); }} className="p-1 text-[#8A8D91] hover:bg-[#F0F2F5] rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ============================================================
 * Inline Add SME Button
 * ============================================================ */
function AddSMEInline({ onAdd }: { onAdd: (sme: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full border-2 border-dashed border-primary/30 text-primary/60 hover:border-primary hover:text-primary transition-colors duration-150"
      >
        <Plus className="w-3 h-3" />
        Assign SME
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); }
          if (e.key === "Escape") { setValue(""); setIsAdding(false); }
        }}
        placeholder="SME name..."
        className="text-[12px] px-2 py-1 rounded-lg border-2 border-primary bg-white focus:outline-none shadow-[0_0_0_2px_rgba(24,119,242,0.2)] min-w-[120px]"
      />
      <button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); setIsAdding(false); } }} className="p-1 text-primary hover:bg-[#E7F3FF] rounded">
        <CheckCircle2 className="w-4 h-4" />
      </button>
      <button onClick={() => { setValue(""); setIsAdding(false); }} className="p-1 text-[#8A8D91] hover:bg-[#F0F2F5] rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
