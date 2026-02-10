/*
 * Programs — Program Itinerary Management with Wave 1/2/3
 * Design: Meta/Facebook — Clean white cards, blue accents, system fonts
 * Shows all waves with their schedules, modules, and SME assignments
 * Admin can edit program details inline
 */
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { getSessionTypeBadge, getStatusBadge } from "@/lib/data";

function formatDateShort(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = months[parseInt(parts[1]) - 1] ?? parts[1];
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}

export default function Programs() {
  const { programs, smes, schedule, contacts, updateProgram, getScheduleForWave, setActiveWaveId } = useData();
  const { isAdmin } = useAdmin();

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
                  "meta-card overflow-hidden transition-shadow duration-200",
                  program.status === "active" && "shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)]"
                )}
              >
                {/* Status bar */}
                <div className={cn("h-[3px]", status.barColor)} />

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
                          onSave={v => updateProgram(program.id, { program: v })}
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
                          onSave={v => updateProgram(program.id, { wave: v })}
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
                          onSave={v => updateProgram(program.id, { description: v })}
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
                              <span key={mi} className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#F0F2F5] text-[#65676B]">
                                {mod}
                              </span>
                            ))}
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
                              </span>
                            ))}
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
