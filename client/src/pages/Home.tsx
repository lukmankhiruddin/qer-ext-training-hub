/*
 * Home / Dashboard — Communication Hub landing page
 * Design: Meta/Facebook — White cards on #F0F2F5, blue accents, system fonts
 * Clean, information-dense layout with subtle transitions
 */
import { Link } from "wouter";
import { useData } from "@/contexts/DataContext";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionTypeBadge } from "@/lib/data";

const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/efuXWrtrHCVcyFeE.png";

const COLLAB_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/fJvZySFLDFDVWonB.png";

export default function Home() {
  const { schedule, programs, smes } = useData();
  const activeProgram = programs.find(p => p.status === "active");
  const uniqueSMEs = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
  const totalSessions = schedule.length;
  const liveSessions = schedule.filter(s => s.type === "live").length;

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Hero Banner — Meta style: clean white card with blue accent */}
      <section className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#E7F3FF] text-primary">
                  <span className="w-2 h-2 rounded-full bg-[#42B72A]" />
                  Active Program
                </span>
              </div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-[#050505] leading-tight mb-2">
                {activeProgram?.program || "Communication Hub"}
              </h1>
              <p className="text-[17px] text-[#65676B] mb-1">
                {activeProgram?.wave || "Vendor Training Management"}
              </p>
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
              </div>
            </div>

            {/* Right image */}
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

      {/* Stats Cards — Meta style: white cards with subtle shadow */}
      <section className="container py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Training Sessions", value: totalSessions, icon: BookOpen, color: "text-primary" },
            { label: "Active SMEs", value: uniqueSMEs.size, icon: Users, color: "text-[#42B72A]" },
            { label: "Live Sessions", value: liveSessions, icon: Zap, color: "text-[#F7B928]" },
            { label: "Programs", value: programs.length, icon: FolderKanban, color: "text-[#E4405F]" },
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

      {/* Main Content Grid */}
      <section className="container pb-8">
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Schedule Preview — 3 cols */}
          <div className="lg:col-span-3">
            <div className="meta-card">
              <div className="flex items-center justify-between p-4 border-b border-[#CED0D4]/60">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050505]">
                    This Week's Schedule
                  </h2>
                  <p className="text-[13px] text-[#65676B] mt-0.5">
                    {activeProgram?.startDate} — {activeProgram?.endDate} · Dublin
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
                      {/* Day + Time */}
                      <div className="w-20 shrink-0">
                        <p className="text-[11px] text-[#8A8D91] font-semibold uppercase tracking-wide">
                          {session.day}
                        </p>
                        <p className="text-[13px] text-[#050505] font-medium mt-0.5">
                          {session.timeStart}
                        </p>
                      </div>

                      {/* Status dot */}
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />

                      {/* Content */}
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
            {/* Active Program Card */}
            <div className="meta-card overflow-hidden">
              <div className="h-28 relative">
                <img
                  src={COLLAB_IMG}
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <div className="absolute bottom-2.5 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-[#42B72A] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#42B72A]" />
                    Active
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[17px] font-bold text-[#050505] mb-1">
                  {activeProgram?.program}
                </h3>
                <p className="text-[14px] text-[#65676B] mb-3">
                  {activeProgram?.wave}
                </p>
                <div className="flex items-center gap-4 text-[13px] text-[#8A8D91]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeProgram?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeProgram?.startDate} — {activeProgram?.endDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="meta-card">
              <div className="p-4 border-b border-[#CED0D4]/60">
                <h3 className="text-[17px] font-bold text-[#050505]">Quick Access</h3>
              </div>
              <div className="divide-y divide-[#CED0D4]/40">
                {[
                  { label: "Weekly Calendar View", desc: "Filter by your name", href: "/schedule", icon: CalendarDays },
                  { label: "SME Directory", desc: `${smes.length} subject matter experts`, href: "/directory", icon: Users },
                  { label: "Program Itinerary", desc: `${programs.length} active programs`, href: "/programs", icon: FolderKanban },
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
