/*
 * Home / Dashboard — Communication Hub landing page
 * Design: Meta/Facebook — White cards on #F0F2F5, blue accents, system fonts
 * Shows wave timeline: Wave 1 (completed), Wave 2 (active), Wave 3 (upcoming)
 */
import { Link } from "wouter";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import {
  CalendarDays,
  Users,
  FolderKanban,
  ArrowRight,
  Clock,
  MapPin,
  BookOpen,
  Zap,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionTypeBadge, getStatusBadge } from "@/lib/data";
import { cn } from "@/lib/utils";

const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/efuXWrtrHCVcyFeE.png";

const COLLAB_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/fJvZySFLDFDVWonB.png";

function formatDateShort(dateStr: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = months[parseInt(parts[1]) - 1] ?? parts[1];
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}

export default function Home() {
  const { schedule, programs, smes, getScheduleForWave, updateProgram, updateSession } = useData();
  const { isAdmin, logActivity } = useAdmin();
  const activeProgram = programs.find(p => p.status === "active");
  const upcomingProgram = programs.find(p => p.status === "upcoming");
  const uniqueSMEs = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
  const totalSessions = schedule.length;
  const liveSessions = schedule.filter(s => s.type === "live").length;

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#E7F3FF] text-primary">
                  <span className="w-2 h-2 rounded-full bg-[#42B72A]" />
                  Active Program
                </span>
              </div>
              {isAdmin && activeProgram ? (
                <EditableField
                  value={activeProgram.program}
                  fieldId="home-program-name"
                  onSave={v => { updateProgram(activeProgram.id, { program: v }); logActivity("Program Updated", `Program name changed to ${v}`); }}
                  className="text-[28px] md:text-[32px] font-bold text-[#050505] leading-tight block mb-2"
                  as="h1"
                />
              ) : (
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#050505] leading-tight mb-2">
                  {activeProgram?.program || "Communication Hub"}
                </h1>
              )}
              {isAdmin && activeProgram ? (
                <EditableField
                  value={activeProgram.wave}
                  fieldId="home-wave-name"
                  onSave={v => { updateProgram(activeProgram.id, { wave: v }); logActivity("Program Updated", `Wave name changed to ${v}`); }}
                  className="text-[17px] text-[#65676B] block mb-1"
                  as="p"
                />
              ) : (
                <p className="text-[17px] text-[#65676B] mb-1">
                  {activeProgram?.wave || "Vendor Training Management"}
                </p>
              )}
              <p className="text-[15px] text-[#8A8D91] leading-relaxed mb-5 max-w-xl">
                {activeProgram?.description || "Centralized communication platform for training schedules, SME coordination, and vendor management."}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/schedule">
                  <Button className="gap-2 bg-primary hover:bg-[#1565D8] text-white font-semibold text-[15px] h-10 px-5 rounded-lg shadow-none">
                    <CalendarDays className="w-4 h-4" />
                    View Schedule
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/directory">
                  <Button variant="outline" className="gap-2 border-[#CED0D4] text-[#050505] font-semibold text-[15px] h-10 px-5 rounded-lg bg-white hover:bg-[#F2F2F2]">
                    <Users className="w-4 h-4 text-[#65676B]" />
                    SME Directory
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="gap-2 border-primary/30 text-primary font-semibold text-[15px] h-10 px-5 rounded-lg bg-[#E7F3FF] hover:bg-[#D0E8FF]">
                      <Settings className="w-4 h-4" />
                      Control Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden lg:block w-64 h-40 rounded-xl overflow-hidden shrink-0">
              <img
                src={HERO_IMG}
                alt="Training program"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Training Sessions", value: totalSessions, icon: BookOpen, color: "text-primary" },
            { label: "Active SMEs", value: uniqueSMEs.size, icon: Users, color: "text-[#42B72A]" },
            { label: "Live Sessions", value: liveSessions, icon: Zap, color: "text-[#F7B928]" },
            { label: "Training Waves", value: programs.length, icon: FolderKanban, color: "text-[#E4405F]" },
          ].map((stat) => (
            <div key={stat.label} className="meta-card p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-[13px] text-[#65676B] font-medium">
                  {stat.label}
                </span>
              </div>
              <p className="text-[28px] font-bold text-[#050505]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wave Timeline — The key new section */}
      <section className="container pb-4">
        <div className="meta-card">
          <div className="flex items-center justify-between p-4 border-b border-[#CED0D4]/60">
            <div>
              <h2 className="text-[20px] font-bold text-[#050505]">Training Wave Timeline</h2>
              <p className="text-[13px] text-[#65676B] mt-0.5">
                Track past, current, and upcoming training waves
              </p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-[#E7F3FF] font-semibold text-[14px]">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="p-4">
            {/* Timeline connector */}
            <div className="relative">
              {programs.map((prog, idx) => {
                const status = getStatusBadge(prog.status);
                const waveSchedule = getScheduleForWave(prog.id);
                const waveSMEs = new Set(waveSchedule.map(s => s.sme).filter(s => s !== "N/A"));
                const isLast = idx === programs.length - 1;

                return (
                  <div key={prog.id} className="relative flex gap-4 pb-6">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center shrink-0">
                      {prog.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-[#65676B] shrink-0 z-10 bg-white" />
                      ) : prog.status === "active" ? (
                        <div className="w-6 h-6 rounded-full border-[2.5px] border-primary flex items-center justify-center shrink-0 z-10 bg-white">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-[#CED0D4] shrink-0 z-10 bg-white" />
                      )}
                      {!isLast && (
                        <div className={cn(
                          "w-[2px] flex-1 mt-1",
                          prog.status === "completed" ? "bg-[#CED0D4]" : "bg-[#E4E6EB]"
                        )} />
                      )}
                    </div>

                    {/* Wave content card */}
                    <div className={cn(
                      "flex-1 rounded-xl border p-4 transition-all duration-200",
                      prog.status === "active"
                        ? "border-primary/20 bg-[#E7F3FF]/30"
                        : prog.status === "upcoming"
                        ? "border-[#E4E6EB] bg-[#FAFAFA]"
                        : "border-[#E4E6EB] bg-white"
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isAdmin ? (
                              <EditableField
                                value={prog.wave}
                                fieldId={`home-timeline-${prog.id}-wave`}
                                onSave={v => { updateProgram(prog.id, { wave: v }); logActivity("Program Updated", `Wave name changed to ${v}`); }}
                                className="text-[16px] font-bold text-[#050505]"
                                as="h3"
                              />
                            ) : (
                              <h3 className="text-[16px] font-bold text-[#050505]">
                                {prog.wave}
                              </h3>
                            )}
                            <span className={cn(
                              "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                              status.bgColor, status.textColor
                            )}>
                              <span className="flex items-center gap-1">
                                <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)} />
                                {status.label}
                              </span>
                            </span>
                          </div>
                          <p className="text-[13px] text-[#65676B]">
                            {prog.program} · {prog.location}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-semibold text-[#050505]">
                            {formatDateShort(prog.startDate)} – {formatDateShort(prog.endDate)}
                          </p>
                          <p className="text-[11px] text-[#8A8D91]">
                            {prog.daysOfWeek?.length ?? 0} days
                          </p>
                        </div>
                      </div>

                      {isAdmin ? (
                        <EditableField
                          value={prog.description}
                          fieldId={`home-timeline-${prog.id}-desc`}
                          onSave={v => { updateProgram(prog.id, { description: v }); logActivity("Program Updated", `${prog.wave} description updated`); }}
                          className="text-[14px] text-[#65676B] leading-relaxed block mb-3"
                          as="p"
                          multiline
                        />
                      ) : (
                        <p className="text-[14px] text-[#65676B] leading-relaxed mb-3">
                          {prog.description}
                        </p>
                      )}

                      {/* Modules */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {prog.modules?.map((mod, mi) => (
                          <span key={mi} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F2F5] text-[#65676B]">
                            {mod}
                          </span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-[13px] text-[#8A8D91]">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {waveSchedule.length} sessions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {waveSMEs.size} SMEs
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {prog.location}
                        </span>
                      </div>

                      {/* SMEs involved */}
                      {prog.smesInvolved && prog.smesInvolved.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#E4E6EB]">
                          <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-1.5">SMEs Involved</p>
                          <div className="flex flex-wrap gap-1.5">
                            {prog.smesInvolved.map((sme, si) => (
                              <span key={si} className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full bg-[#E7F3FF] text-primary">
                                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                                  {sme.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                                {sme}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upcoming wave CTA */}
                      {prog.status === "upcoming" && (
                        <div className="mt-3 pt-3 border-t border-[#E4E6EB]">
                          <div className="flex items-center gap-2 text-[13px] text-primary">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-semibold">Prepare for this wave</span>
                            <span className="text-[#8A8D91]">— starts {formatDateShort(prog.startDate)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container pb-8">
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Schedule Preview — 3 cols */}
          <div className="lg:col-span-3">
            <div className="meta-card">
              <div className="flex items-center justify-between p-4 border-b border-[#CED0D4]/60">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050505]">
                    Current Wave Schedule
                  </h2>
                  <p className="text-[13px] text-[#65676B] mt-0.5">
                    {activeProgram ? `${formatDateShort(activeProgram.startDate)} – ${formatDateShort(activeProgram.endDate)}` : ""} · {activeProgram?.location ?? "Dublin"}
                  </p>
                </div>
                <Link href="/schedule">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-[#E7F3FF] font-semibold text-[14px]">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="divide-y divide-[#CED0D4]/40">
                {schedule.slice(0, 6).map((session) => {
                  const badge = getSessionTypeBadge(session.type);
                  const dotColor = session.type === 'live'
                    ? 'bg-[#42B72A]'
                    : session.type === 'upskilling'
                    ? 'bg-primary'
                    : 'bg-[#8A8D91]';
                  const badgeClass = session.type === 'live'
                    ? 'meta-badge meta-badge-green'
                    : session.type === 'upskilling'
                    ? 'meta-badge meta-badge-blue'
                    : 'meta-badge meta-badge-yellow';

                  return (
                    <div
                      key={session.id}
                      className="px-4 py-3 flex items-center gap-4 hover:bg-[#F2F2F2] transition-colors duration-150"
                    >
                      <div className="w-20 shrink-0">
                        <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide">
                          {session.day}
                        </p>
                        <p className="text-[13px] text-[#050505] font-medium mt-0.5">
                          {session.timeStart}
                        </p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#050505] truncate">
                          {session.training}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={badgeClass}>
                            {badge.label}
                          </span>
                          {session.sme !== "N/A" && (
                            <span className="text-[13px] text-[#65676B]">
                              {session.sme}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {/* Upcoming Wave Preview */}
            {upcomingProgram && (
              <div className="meta-card overflow-hidden">
                <div className="h-28 relative">
                  <img
                    src={COLLAB_IMG}
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-primary shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Up Next
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[17px] font-bold text-[#050505] mb-1">
                    {upcomingProgram.wave}
                  </h3>
                  <p className="text-[14px] text-[#65676B] mb-3">
                    {upcomingProgram.description.slice(0, 120)}...
                  </p>
                  <div className="flex items-center gap-4 text-[13px] text-[#8A8D91] mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {upcomingProgram.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDateShort(upcomingProgram.startDate)} – {formatDateShort(upcomingProgram.endDate)}
                    </span>
                  </div>
                  <Link href="/schedule">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 border-[#CED0D4] text-[#050505] font-semibold rounded-lg bg-white hover:bg-[#F2F2F2]">
                      Preview Schedule
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="meta-card">
              <div className="p-4 border-b border-[#CED0D4]/60">
                <h3 className="text-[17px] font-bold text-[#050505]">Quick Access</h3>
              </div>
              <div className="divide-y divide-[#CED0D4]/40">
                {[
                  { label: "Weekly Calendar View", desc: "Filter by your name", href: "/schedule", icon: CalendarDays },
                  { label: "SME Directory", desc: `${smes.length} subject matter experts`, href: "/directory", icon: Users },
                  { label: "Program Itinerary", desc: `${programs.length} training waves`, href: "/programs", icon: FolderKanban },
                ].map(link => (
                  <Link key={link.href} href={link.href}>
                    <div className="px-4 py-3 flex items-center gap-3 hover:bg-[#F2F2F2] transition-colors duration-150 cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#E7F3FF] flex items-center justify-center shrink-0 group-hover:bg-[#D0E8FF] transition-colors duration-150">
                        <link.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#050505]">{link.label}</p>
                        <p className="text-[13px] text-[#65676B]">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8A8D91] group-hover:text-primary transition-colors duration-150" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SME Capacity Overview */}
            <div className="meta-card p-4">
              <h3 className="text-[17px] font-bold text-[#050505] mb-4">SME Capacity</h3>
              <div className="space-y-3">
                {[
                  { label: "Dublin", count: smes.filter(s => s.location === "Dublin").length, total: smes.length },
                  { label: "Bangkok", count: smes.filter(s => s.location === "Bangkok").length, total: smes.length },
                ].map(loc => (
                  <div key={loc.label}>
                    <div className="flex items-center justify-between text-[14px] mb-1.5">
                      <span className="text-[#65676B] font-medium">{loc.label}</span>
                      <span className="text-[#050505] font-bold">{loc.count} SMEs</span>
                    </div>
                    <div className="h-2 bg-[#E4E6EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(loc.count / loc.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
