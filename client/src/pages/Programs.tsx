/*
 * Programs — Program Itinerary Management
 * Design: "Anthropic Warmth" — Editorial card layout
 * Admin can edit program details inline
 */
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditableField from "@/components/EditableField";
import { motion } from "framer-motion";
import {
  FolderKanban,
  MapPin,
  Clock,
  CalendarDays,
  CheckCircle2,
  Circle,
  Timer,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const CALENDAR_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/2Ek3I5O51CtLc8AMPuCdVC/sandbox/qXxBMGSIsheuzA4d28vcrc-img-2_1770761230000_na1fn_Y2FsZW5kYXItcGF0dGVybg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMkVrM0k1TzUxQ3RMYzhBTVB1Q2RWQy9zYW5kYm94L3FYeEJNR1NJc2hldXpBNGQyOHZjcmMtaW1nLTJfMTc3MDc2MTIzMDAwMF9uYTFmbl9ZMkZzWlc1a1lYSXRjR0YwZEdWeWJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NzsjPZgchLBllyH0VV~YSiN7SDVIfm9qYFwkouHNO69ke7HweCyFKNTurtbStSaHzD8kSQCW99XnmpLR2FeCGbuKVF77iqDeetC76BFPT~VxgbCwI-j7gK2U6f-2KLW1YR9PPgute1mn1o1s3slJ~D5VFEKMO0uIgb22vUbRIEYgQ5pKDoT599BG6r-aoPnyEXfQmYNNCAqvhpWJJfMGMNbAt1-CQuCEWqYuDGdBnBgbP9~zKLBAIi-FcaFiktVKsxxWspnBOr1LGlgGnj3zjUe6VR~jtbLd340687rIdF0Bd8fQcInEl~vKpsco~4NXoXBJ5HvMnYcMX73xZf5NVg__";

export default function Programs() {
  const { programs, smes, schedule, contacts, updateProgram } = useData();
  const { isAdmin } = useAdmin();

  const statusConfig = {
    active: {
      icon: Timer,
      label: "Active",
      color: "bg-sage/15 text-sage border-sage/20",
      dotColor: "bg-sage",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      color: "bg-muted text-muted-foreground border-border/30",
      dotColor: "bg-muted-foreground/40",
    },
    upcoming: {
      icon: Circle,
      label: "Upcoming",
      color: "bg-amber/15 text-amber-dark border-amber/20",
      dotColor: "bg-amber",
    },
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FolderKanban className="w-4 h-4 text-primary" />
          <span className="font-mono-label text-primary uppercase tracking-wider">
            Program Itinerary
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Training Programs
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Manage and track vendor training programs across all locations. View schedules, SME assignments, and program status.
        </p>
      </div>

      {/* Programs Timeline */}
      <div className="space-y-5">
        {programs.map((program, i) => {
          const status = statusConfig[program.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className={cn(
                "border overflow-hidden transition-all duration-300",
                program.status === "active"
                  ? "border-sage/30 shadow-md"
                  : "border-border/40 shadow-none hover:shadow-sm"
              )}>
                {/* Status bar */}
                <div className={cn(
                  "h-1",
                  program.status === "active" ? "bg-sage" : program.status === "upcoming" ? "bg-amber" : "bg-muted"
                )} />

                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    {/* Left: Program info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
                          status.color
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", status.dotColor, program.status === "active" && "animate-pulse")} />
                          {status.label}
                        </span>
                      </div>

                      {isAdmin ? (
                        <EditableField
                          value={program.program}
                          fieldId={`program-${program.id}-name`}
                          onSave={v => updateProgram(program.id, { program: v })}
                          className="font-display text-2xl text-foreground block mb-1"
                          as="h2"
                        />
                      ) : (
                        <h2 className="font-display text-2xl text-foreground mb-1">
                          {program.program}
                        </h2>
                      )}

                      {isAdmin ? (
                        <EditableField
                          value={program.wave}
                          fieldId={`program-${program.id}-wave`}
                          onSave={v => updateProgram(program.id, { wave: v })}
                          className="text-sm text-muted-foreground block mb-3"
                          as="p"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mb-3">{program.wave}</p>
                      )}

                      {isAdmin ? (
                        <EditableField
                          value={program.description}
                          fieldId={`program-${program.id}-desc`}
                          onSave={v => updateProgram(program.id, { description: v })}
                          className="text-sm text-muted-foreground/80 leading-relaxed block"
                          as="p"
                          multiline
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          {program.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {program.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {program.startDate} — {program.endDate}
                        </div>
                        {program.status === "active" && (
                          <Link href="/schedule">
                            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                              View Schedule <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Right: Quick stats for active program */}
                    {program.status === "active" && (
                      <div className="lg:w-64 shrink-0">
                        <div className="p-4 bg-accent/50 rounded-xl space-y-3">
                          <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase">
                            Program Stats
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="font-display text-2xl text-foreground">
                                {schedule.length}
                              </p>
                              <p className="text-[11px] text-muted-foreground">Sessions</p>
                            </div>
                            <div>
                              <p className="font-display text-2xl text-foreground">
                                {new Set(schedule.map(s => s.sme).filter(s => s !== "N/A")).size}
                              </p>
                              <p className="text-[11px] text-muted-foreground">SMEs Assigned</p>
                            </div>
                            <div>
                              <p className="font-display text-2xl text-foreground">
                                {schedule.filter(s => s.type === "live").length}
                              </p>
                              <p className="text-[11px] text-muted-foreground">Live Sessions</p>
                            </div>
                            <div>
                              <p className="font-display text-2xl text-foreground">4</p>
                              <p className="text-[11px] text-muted-foreground">Training Days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Training Modules Overview */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-4 h-4 text-amber" />
          <h2 className="font-display text-2xl text-foreground">Training Modules</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg">
          Overview of all training modules covered in the Wave 2 Complex Object Training program.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { module: "Live Video", day: "Monday", sme: "Farrukh Ahmed", type: "live" as const, desc: "Live video review training and self-study materials" },
            { module: "Threads / Simple Objects", day: "Monday", sme: "Farrukh Ahmed", type: "upskilling" as const, desc: "Threads and simple objects module training" },
            { module: "Groups", day: "Tuesday", sme: "Martin Wallin", type: "live" as const, desc: "Group review training with ops guidelines" },
            { module: "Messenger", day: "Wednesday", sme: "Corneliu Onica", type: "upskilling" as const, desc: "Messenger IIC upskilling and self-study" },
            { module: "Max Recall", day: "Thursday", sme: "Lukman Khiruddin", type: "live" as const, desc: "Max recall training and self-study session" },
            { module: "Profile", day: "Thursday", sme: "Lukman Khiruddin", type: "live" as const, desc: "Profile review training and self-study" },
          ].map((mod, i) => (
            <motion.div
              key={mod.module}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="border-border/40 hover:border-border hover:shadow-sm transition-all duration-200 h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{mod.module}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium",
                      mod.type === "live" ? "bg-amber/15 text-amber-dark" : "bg-primary/10 text-primary"
                    )}>
                      {mod.type === "live" ? "Live" : "Upskilling"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{mod.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/70 pt-2 border-t border-border/30">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {mod.day}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {mod.sme}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vendor Capacity Matrix */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4 text-sage" />
          <h2 className="font-display text-2xl text-foreground">Vendor Capacity</h2>
        </div>

        <Card className="border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">Vendor</th>
                  <th className="text-left p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">Location</th>
                  <th className="text-center p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">Total SMEs</th>
                  <th className="text-center p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">Market SME</th>
                  <th className="text-center p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">VG SME</th>
                  <th className="text-center p-3 font-mono-label text-muted-foreground/60 text-[11px] uppercase">Pillar Lead</th>
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
                    <tr key={v.vendor} className="border-b border-border/20 hover:bg-accent/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{v.vendor}</td>
                      <td className="p-3 text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {v.location}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-display text-lg text-foreground">{vendorSMEs.length}</span>
                      </td>
                      <td className="p-3 text-center text-muted-foreground">
                        {vendorSMEs.filter(s => s.roles.includes("Market SME")).length}
                      </td>
                      <td className="p-3 text-center text-muted-foreground">
                        {vendorSMEs.filter(s => s.roles.includes("VG SME")).length}
                      </td>
                      <td className="p-3 text-center text-muted-foreground">
                        {vendorSMEs.filter(s => s.roles.includes("Pillar Lead SME")).length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
