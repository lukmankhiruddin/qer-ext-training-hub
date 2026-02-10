/*
 * Home / Dashboard — Communication Hub landing page
 * Design: "Anthropic Warmth" — Glanceable Intelligence
 * Shows at-a-glance overview: active program, today's sessions, quick stats
 */
import { Link } from "wouter";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  FolderKanban,
  ArrowRight,
  Clock,
  MapPin,
  BookOpen,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSessionTypeBadge } from "@/lib/data";

const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/efuXWrtrHCVcyFeE.png";

const COLLAB_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663316909266/fJvZySFLDFDVWonB.png";

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
};

export default function Home() {
  const { schedule, programs, smes } = useData();
  const activeProgram = programs.find(p => p.status === "active");
  const uniqueSMEs = new Set(schedule.map(s => s.sme).filter(s => s !== "N/A"));
  const totalSessions = schedule.length;
  const liveSessions = schedule.filter(s => s.type === "live").length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="relative container pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="font-mono-label text-sage uppercase tracking-wider">
                Active Program
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-4">
              {activeProgram?.program || "Communication Hub"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-2">
              {activeProgram?.wave || "Vendor Training Management"}
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-8 max-w-lg">
              {activeProgram?.description || "Centralized communication platform for training schedules, SME coordination, and vendor management."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/schedule">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <CalendarDays className="w-4 h-4" />
                  View Schedule
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/directory">
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="w-4 h-4" />
                  SME Directory
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container -mt-8 relative z-10">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {[
            { label: "Training Sessions", value: totalSessions, icon: BookOpen, color: "text-amber" },
            { label: "Active SMEs", value: uniqueSMEs.size, icon: Users, color: "text-sage" },
            { label: "Live Sessions", value: liveSessions, icon: Zap, color: "text-primary" },
            { label: "Programs", value: programs.length, icon: FolderKanban, color: "text-amber-dark" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={stagger.item}>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="font-mono-label text-muted-foreground/60">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-display text-3xl md:text-4xl text-foreground">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Quick Overview: Today's Schedule + Active Program */}
      <section className="container py-12 md:py-16">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-5 gap-6 md:gap-8"
        >
          {/* Schedule Preview — 3 cols */}
          <motion.div variants={stagger.item} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  This Week's Schedule
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeProgram?.startDate} — {activeProgram?.endDate} · Dublin
                </p>
              </div>
              <Link href="/schedule">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {schedule.slice(0, 6).map((session, i) => {
                const badge = getSessionTypeBadge(session.type);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Card className="border-border/40 shadow-none hover:shadow-sm transition-all duration-200 hover:border-border">
                      <CardContent className="p-3.5 md:p-4 flex items-center gap-4">
                        {/* Day + Time */}
                        <div className="w-20 md:w-24 shrink-0">
                          <p className="font-mono-label text-muted-foreground/70 text-[11px] uppercase">
                            {session.day}
                          </p>
                          <p className="font-mono-label text-foreground text-xs mt-0.5">
                            {session.timeStart}
                          </p>
                        </div>

                        {/* Amber timeline dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full ${session.type === 'live' ? 'bg-amber' : session.type === 'upskilling' ? 'bg-primary' : 'bg-sage-light'}`} />
                          <div className="w-px h-6 bg-border/40 mt-1" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {session.training}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                            {session.sme !== "N/A" && (
                              <span className="text-xs text-muted-foreground">
                                {session.sme}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right sidebar — 2 cols */}
          <motion.div variants={stagger.item} className="lg:col-span-2 space-y-6">
            {/* Active Program Card */}
            <Card className="border-border/50 overflow-hidden">
              <div className="h-32 relative">
                <img
                  src={COLLAB_IMG}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-sage/20 text-sage border border-sage/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage mr-1.5 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-display text-xl text-foreground mb-1">
                  {activeProgram?.program}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {activeProgram?.wave}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeProgram?.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {activeProgram?.startDate} — {activeProgram?.endDate}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg text-foreground mb-3">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { label: "Weekly Calendar View", desc: "Filter by your name", href: "/schedule", icon: CalendarDays },
                  { label: "SME Directory", desc: "44 subject matter experts", href: "/directory", icon: Users },
                  { label: "Program Itinerary", desc: "3 active programs", href: "/programs", icon: FolderKanban },
                ].map(link => (
                  <Link key={link.href} href={link.href}>
                    <Card className="border-border/40 shadow-none hover:shadow-sm hover:border-border transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                          <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{link.label}</p>
                          <p className="text-xs text-muted-foreground">{link.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* SME Capacity Overview */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <h3 className="font-display text-lg text-foreground mb-3">SME Capacity</h3>
                <div className="space-y-3">
                  {[
                    { label: "Dublin", count: smes.filter(s => s.location === "Dublin").length, total: smes.length },
                    { label: "Bangkok", count: smes.filter(s => s.location === "Bangkok").length, total: smes.length },
                  ].map(loc => (
                    <div key={loc.label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{loc.label}</span>
                        <span className="font-mono-label text-foreground">{loc.count} SMEs</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(loc.count / loc.total) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                          className="h-full bg-amber rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
