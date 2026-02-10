/*
 * Home / Dashboard — Communication Hub landing page
 * Design: Modern Meta/Apple hybrid — glassmorphism, vibrant gradients,
 * Inter font, spring animations, colored shadows, pill badges
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
  Sparkles,
  Settings,
  TrendingUp,
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
  const { schedule, programs, smes, getScheduleForWave, updateProgram } = useData();
  const { isAdmin, logActivity } = useAdmin();
  const activeProgram = programs.find(p => p.status === "active");
  const upcomingProgram = programs.find(p => p.status === "upcoming");
  const uniqueSMEs = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
  const totalSessions = schedule.length;
  const liveSessions = schedule.filter(s => s.type === "live").length;

  return (
    <div className="min-h-screen">
      {/* Hero Section — Gradient with glass overlay */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-purple-500/[0.03]" />
        <div className="container relative py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="vibrant-badge vibrant-badge-green">
                  <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 animate-pulse" />
                  Active Program
                </span>
              </div>
              {isAdmin && activeProgram ? (
                <EditableField
                  value={activeProgram.program}
                  fieldId="home-program-name"
                  onSave={v => { updateProgram(activeProgram.id, { program: v }); logActivity("Program Updated", `Program name changed to ${v}`); }}
                  className="text-[28px] md:text-[34px] font-bold text-foreground leading-[1.15] tracking-[-0.02em] block mb-2"
                  as="h1"
                />
              ) : (
                <h1 className="text-[28px] md:text-[34px] font-bold text-foreground leading-[1.15] tracking-[-0.02em] mb-2">
                  {activeProgram?.program || "Communication Hub"}
                </h1>
              )}
              {isAdmin && activeProgram ? (
                <EditableField
                  value={activeProgram.wave}
                  fieldId="home-wave-name"
                  onSave={v => { updateProgram(activeProgram.id, { wave: v }); logActivity("Program Updated", `Wave name changed to ${v}`); }}
                  className="text-[17px] text-muted-foreground block mb-1.5"
                  as="p"
                />
              ) : (
                <p className="text-[17px] text-muted-foreground mb-1.5">
                  {activeProgram?.wave || "Vendor Training Management"}
                </p>
              )}
              <p className="text-[14px] text-muted-foreground/80 leading-relaxed mb-6 max-w-lg">
                {activeProgram?.description?.slice(0, 140) || "Centralized communication platform for training schedules, SME coordination, and vendor management."}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link href="/schedule">
                  <Button className="gap-2 gradient-hero text-white font-semibold text-[14px] h-10 px-5 rounded-xl shadow-[0_2px_12px_oklch(0.55_0.22_264_/_25%)] hover:shadow-[0_4px_20px_oklch(0.55_0.22_264_/_35%)] hover:opacity-95 transition-all duration-300 border-0">
                    <CalendarDays className="w-4 h-4" />
                    View Schedule
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/directory">
                  <Button variant="outline" className="gap-2 border-border/50 text-foreground font-semibold text-[14px] h-10 px-5 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    SME Directory
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="gap-2 border-primary/20 text-primary font-semibold text-[14px] h-10 px-5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300">
                      <Settings className="w-4 h-4" />
                      Control Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden lg:block w-56 h-36 rounded-2xl overflow-hidden shrink-0 glass-card p-1 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <img
                src={HERO_IMG}
                alt="Training program"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards — Glass with colored icons */}
      <section className="container py-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Training Sessions", value: totalSessions, icon: BookOpen, gradient: "from-blue-500/10 to-indigo-500/10", iconColor: "text-blue-600" },
            { label: "Active SMEs", value: uniqueSMEs.size, icon: Users, gradient: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-600" },
            { label: "Live Sessions", value: liveSessions, icon: Zap, gradient: "from-amber-500/10 to-orange-500/10", iconColor: "text-amber-600" },
            { label: "Training Waves", value: programs.length, icon: TrendingUp, gradient: "from-purple-500/10 to-pink-500/10", iconColor: "text-purple-600" },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card hover-lift p-4 animate-fade-in-up" style={{ animationDelay: `${0.12 + i * 0.04}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.gradient)}>
                  <stat.icon className={cn("w-[18px] h-[18px]", stat.iconColor)} />
                </div>
                <span className="text-[12px] text-muted-foreground font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p className="text-[30px] font-bold text-foreground tracking-[-0.02em]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wave Timeline */}
      <section className="container pb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div>
              <h2 className="text-[19px] font-bold text-foreground tracking-[-0.01em]">Training Wave Timeline</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Track past, current, and upcoming training waves
              </p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-primary/8 font-semibold text-[13px] rounded-xl">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="p-5">
            <div className="relative">
              {programs.map((prog, idx) => {
                const status = getStatusBadge(prog.status);
                const waveSchedule = getScheduleForWave(prog.id);
                const waveSMEs = new Set(waveSchedule.map(s => s.sme).filter(s => s !== "N/A"));
                const isLast = idx === programs.length - 1;

                return (
                  <div key={prog.id} className="relative flex gap-4 pb-6 animate-fade-in-up" style={{ animationDelay: `${0.25 + idx * 0.08}s` }}>
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center shrink-0">
                      {prog.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-muted-foreground/60 shrink-0 z-10" />
                      ) : prog.status === "active" ? (
                        <div className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_oklch(0.55_0.22_264_/_30%)]">
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-border shrink-0 z-10" />
                      )}
                      {!isLast && (
                        <div className={cn(
                          "w-[2px] flex-1 mt-1 rounded-full",
                          prog.status === "completed" ? "bg-muted-foreground/20" : "bg-border/60"
                        )} />
                      )}
                    </div>

                    {/* Wave content card */}
                    <div className={cn(
                      "flex-1 rounded-xl border p-4 transition-all duration-300",
                      prog.status === "active"
                        ? "border-primary/15 bg-gradient-to-br from-primary/[0.04] to-purple-500/[0.02] shadow-[0_2px_12px_oklch(0.55_0.22_264_/_6%)]"
                        : prog.status === "upcoming"
                        ? "border-border/40 bg-secondary/30"
                        : "border-border/30 bg-white/50"
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isAdmin ? (
                              <EditableField
                                value={prog.wave}
                                fieldId={`home-timeline-${prog.id}-wave`}
                                onSave={v => { updateProgram(prog.id, { wave: v }); logActivity("Program Updated", `Wave name changed to ${v}`); }}
                                className="text-[15px] font-bold text-foreground"
                                as="h3"
                              />
                            ) : (
                              <h3 className="text-[15px] font-bold text-foreground">{prog.wave}</h3>
                            )}
                            <span className={cn(
                              "vibrant-badge",
                              prog.status === "completed" ? "vibrant-badge-gray" :
                              prog.status === "active" ? "vibrant-badge-blue" : "vibrant-badge-amber"
                            )}>
                              <span className={cn(
                                "w-[5px] h-[5px] rounded-full",
                                prog.status === "completed" ? "bg-gray-400" :
                                prog.status === "active" ? "bg-blue-500" : "bg-amber-500"
                              )} />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground">
                            {prog.program} · {prog.location}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-semibold text-foreground">
                            {formatDateShort(prog.startDate)} – {formatDateShort(prog.endDate)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {prog.daysOfWeek?.length ?? 0} days
                          </p>
                        </div>
                      </div>

                      {isAdmin ? (
                        <EditableField
                          value={prog.description}
                          fieldId={`home-timeline-${prog.id}-desc`}
                          onSave={v => { updateProgram(prog.id, { description: v }); logActivity("Program Updated", `${prog.wave} description updated`); }}
                          className="text-[13px] text-muted-foreground leading-relaxed block mb-3"
                          as="p"
                          multiline
                        />
                      ) : (
                        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                          {prog.description}
                        </p>
                      )}

                      {/* Modules */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {prog.modules?.map((mod, mi) => (
                          <span key={mi} className="text-[11px] font-medium px-2.5 py-[3px] rounded-lg bg-secondary/70 text-secondary-foreground">
                            {mod}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{waveSchedule.length} sessions</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{waveSMEs.size} SMEs</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{prog.location}</span>
                      </div>

                      {/* SMEs */}
                      {prog.smesInvolved && prog.smesInvolved.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-1.5">SMEs Involved</p>
                          <div className="flex flex-wrap gap-1.5">
                            {prog.smesInvolved.map((sme, si) => (
                              <span key={si} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-[3px] rounded-lg bg-primary/6 text-primary/90">
                                <span className="w-4 h-4 rounded-md bg-gradient-to-br from-primary/20 to-purple-500/15 flex items-center justify-center text-[8px] font-bold text-primary">
                                  {sme.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                                {sme}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upcoming CTA */}
                      {prog.status === "upcoming" && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <div className="flex items-center gap-2 text-[12px]">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold gradient-text">Prepare for this wave</span>
                            <span className="text-muted-foreground">— starts {formatDateShort(prog.startDate)}</span>
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
      <section className="container pb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Schedule Preview */}
          <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div>
                  <h2 className="text-[19px] font-bold text-foreground tracking-[-0.01em]">Current Wave Schedule</h2>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {activeProgram ? `${formatDateShort(activeProgram.startDate)} – ${formatDateShort(activeProgram.endDate)}` : ""} · {activeProgram?.location ?? "Dublin"}
                  </p>
                </div>
                <Link href="/schedule">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-primary/8 font-semibold text-[13px] rounded-xl">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="divide-y divide-border/30">
                {schedule.slice(0, 6).map((session) => {
                  const badge = getSessionTypeBadge(session.type);
                  const badgeClass = session.type === 'live'
                    ? 'vibrant-badge vibrant-badge-green'
                    : session.type === 'upskilling'
                    ? 'vibrant-badge vibrant-badge-blue'
                    : 'vibrant-badge vibrant-badge-amber';
                  const dotGradient = session.type === 'live'
                    ? 'from-emerald-400 to-green-500'
                    : session.type === 'upskilling'
                    ? 'from-blue-400 to-indigo-500'
                    : 'from-amber-400 to-orange-500';

                  return (
                    <div
                      key={session.id}
                      className="px-5 py-3.5 flex items-center gap-4 hover:bg-primary/[0.02] transition-all duration-200"
                    >
                      <div className="w-20 shrink-0">
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em]">
                          {session.day}
                        </p>
                        <p className="text-[13px] text-foreground font-medium mt-0.5">
                          {session.timeStart}
                        </p>
                      </div>
                      <div className={cn("w-2.5 h-2.5 rounded-full bg-gradient-to-br shrink-0 shadow-sm", dotGradient)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {session.training}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={badgeClass}>{badge.label}</span>
                          {session.sme !== "N/A" && (
                            <span className="text-[12px] text-muted-foreground">{session.sme}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Upcoming Wave */}
            {upcomingProgram && (
              <div className="glass-card overflow-hidden hover-lift">
                <div className="h-28 relative">
                  <img src={COLLAB_IMG} alt="Team collaboration" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="vibrant-badge vibrant-badge-blue shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      Up Next
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-bold text-foreground mb-1 tracking-[-0.01em]">{upcomingProgram.wave}</h3>
                  <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
                    {upcomingProgram.description.slice(0, 120)}...
                  </p>
                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{upcomingProgram.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDateShort(upcomingProgram.startDate)} – {formatDateShort(upcomingProgram.endDate)}</span>
                  </div>
                  <Link href="/schedule">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 border-border/40 text-foreground font-semibold rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-300">
                      Preview Schedule <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/30">
                <h3 className="text-[16px] font-bold text-foreground tracking-[-0.01em]">Quick Access</h3>
              </div>
              <div className="divide-y divide-border/20">
                {[
                  { label: "Weekly Calendar View", desc: "Filter by your name", href: "/schedule", icon: CalendarDays, gradient: "from-blue-500/10 to-indigo-500/10", iconColor: "text-blue-600" },
                  { label: "SME Directory", desc: `${smes.length} subject matter experts`, href: "/directory", icon: Users, gradient: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-600" },
                  { label: "Program Itinerary", desc: `${programs.length} training waves`, href: "/programs", icon: FolderKanban, gradient: "from-purple-500/10 to-pink-500/10", iconColor: "text-purple-600" },
                ].map(link => (
                  <Link key={link.href} href={link.href}>
                    <div className="px-5 py-3.5 flex items-center gap-3 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer group">
                      <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105", link.gradient)}>
                        <link.icon className={cn("w-[17px] h-[17px]", link.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground">{link.label}</p>
                        <p className="text-[12px] text-muted-foreground">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SME Capacity */}
            <div className="glass-card p-5">
              <h3 className="text-[16px] font-bold text-foreground mb-4 tracking-[-0.01em]">SME Capacity</h3>
              <div className="space-y-4">
                {[
                  { label: "Dublin", count: smes.filter(s => s.location === "Dublin").length, total: smes.length, gradient: "from-blue-500 to-indigo-500" },
                  { label: "Bangkok", count: smes.filter(s => s.location === "Bangkok").length, total: smes.length, gradient: "from-purple-500 to-pink-500" },
                ].map(loc => (
                  <div key={loc.label}>
                    <div className="flex items-center justify-between text-[13px] mb-2">
                      <span className="text-muted-foreground font-medium">{loc.label}</span>
                      <span className="text-foreground font-bold">{loc.count} SMEs</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", loc.gradient)}
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
