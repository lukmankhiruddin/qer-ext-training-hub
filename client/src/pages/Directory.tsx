/*
 * Directory — SME Directory with search, filter, and capacity overview
 * Design: "Anthropic Warmth" — Warm cards with editorial typography
 * 44 real SMEs from QERName.xlsx
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import {
  Search,
  X,
  MapPin,
  Shield,
  Tag,
  Users,
  ChevronDown,
  Globe,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import type { SME } from "@/lib/data";

const TRAINING_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/2Ek3I5O51CtLc8AMPuCdVC/sandbox/qXxBMGSIsheuzA4d28vcrc-img-4_1770761237000_na1fn_dHJhaW5pbmctaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMkVrM0k1TzUxQ3RMYzhBTVB1Q2RWQy9zYW5kYm94L3FYeEJNR1NJc2hldXpBNGQyOHZjcmMtaW1nLTRfMTc3MDc2MTIzNzAwMF9uYTFmbl9kSEpoYVc1cGJtY3RhV3hzZFhOMGNtRjBhVzl1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=SirMrGB6azVCvIFKMFw29eubEt9gmB8V7QdJRS1X7tfyQIO3E~rlI--7nOGTvN0BS9WRg~-Ie1rr9jXtmRAA24DkaIDnEraM2JkQiN7ynF04EAHdwTcnF9BVdG2hEcWxlzzL3mlkWTSBQe62LrYOZIVQtywtOgpUYrSUMnZI7VvnNQcGzzEfTvzsWHm4OCdlf57knuCVytyR3rVWEc~1Lcgog8CS1LYRceKZIDGLv3EvkJT38C~K~DL55EGEtIevv7B7VpbjktJ9jIXHgZebNSshMf~SA1QRp~sxCElbCgTQKok48AY8aNKDrthaKxfGZ-AC6XkKM~8Sd5xJl-OQpg__";

export default function Directory() {
  const { smes, contacts } = useData();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedSME, setSelectedSME] = useState<SME | null>(null);

  // Unique locations and roles
  const locations = useMemo(() => {
    const locs = new Set(smes.map(s => s.location).filter(Boolean));
    return Array.from(locs).sort();
  }, [smes]);

  const roles = useMemo(() => {
    const r = new Set(smes.flatMap(s => s.roles));
    return Array.from(r).sort();
  }, [smes]);

  // Markets
  const markets = useMemo(() => {
    const m = new Set(smes.map(s => s.market));
    return Array.from(m).sort();
  }, [smes]);

  // Filtered SMEs
  const filtered = useMemo(() => {
    return smes.filter(s => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.market.toLowerCase().includes(search.toLowerCase()) ||
        s.policySME.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === "all" || s.location === locationFilter;
      const matchRole = roleFilter === "all" || s.roles.includes(roleFilter);
      return matchSearch && matchLocation && matchRole;
    });
  }, [smes, search, locationFilter, roleFilter]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Generate consistent color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-amber/20 text-amber-dark",
      "bg-sage/20 text-sage",
      "bg-primary/15 text-primary",
      "bg-rose-100 text-rose-700",
      "bg-sky-100 text-sky-700",
      "bg-violet-100 text-violet-700",
      "bg-emerald-100 text-emerald-700",
      "bg-orange-100 text-orange-700",
    ];
    const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-sage" />
            <span className="font-mono-label text-sage uppercase tracking-wider">
              SME Directory
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Subject Matter Experts
          </h1>
          <p className="text-muted-foreground">
            {smes.length} experts across {locations.length} locations and {markets.length} markets
          </p>
        </div>

        {/* Capacity summary */}
        <div className="flex gap-3">
          {locations.map(loc => {
            const count = smes.filter(s => s.location === loc).length;
            return (
              <Card key={loc} className="border-border/40">
                <CardContent className="p-3 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{loc}</p>
                    <p className="font-display text-xl text-foreground">{count}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 bg-card rounded-xl border border-border/50">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, market, or policy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(l => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="font-mono-label text-muted-foreground/60 text-[11px] ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* SME Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((sme, i) => (
          <motion.div
            key={sme.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
          >
            <Card
              className="border-border/40 shadow-none hover:shadow-md hover:border-border transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSME(sme)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0",
                    getAvatarColor(sme.name)
                  )}>
                    {getInitials(sme.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {sme.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3 text-muted-foreground/50" />
                      <span className="text-xs text-muted-foreground truncate">
                        {sme.market}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roles */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {sme.roles.slice(0, 3).map(role => (
                    <span
                      key={role}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium",
                        role === "Pillar Lead SME"
                          ? "bg-amber/15 text-amber-dark"
                          : role === "Site Lead"
                          ? "bg-sage/15 text-sage"
                          : role === "VG SME"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border/30">
                  <MapPin className="w-3 h-3 text-muted-foreground/50" />
                  <span className="text-[11px] text-muted-foreground">{sme.location || "—"}</span>
                  {sme.space.includes("Complex") && (
                    <span className="ml-auto text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      Complex
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* SME Detail Dialog */}
      <Dialog open={!!selectedSME} onOpenChange={open => !open && setSelectedSME(null)}>
        <DialogContent className="max-w-md">
          {selectedSME && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold",
                    getAvatarColor(selectedSME.name)
                  )}>
                    {getInitials(selectedSME.name)}
                  </div>
                  <div>
                    <DialogTitle className="font-display text-xl">{selectedSME.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedSME.market} Market</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Roles */}
                <div>
                  <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-2">Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSME.roles.map(role => (
                      <span key={role} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-accent text-accent-foreground">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vendors */}
                <div>
                  <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-2">Vendors</p>
                  <div className="space-y-1.5">
                    {selectedSME.vendors.map(v => (
                      <div key={v} className="flex items-center gap-2 text-sm text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {v}
                      </div>
                    ))}
                    {selectedSME.vendors.length === 0 && (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                {/* Policy SME */}
                {selectedSME.policySME && (
                  <div>
                    <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-2">Policy Expertise</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSME.policySME.split(",").map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-xs bg-amber/10 text-amber-dark border border-amber/15">
                          {p.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Space */}
                <div>
                  <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-2">Space</p>
                  <p className="text-sm text-foreground">{selectedSME.space}</p>
                </div>

                {/* Location */}
                <div>
                  <p className="font-mono-label text-muted-foreground/60 text-[11px] uppercase mb-2">Location</p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                    {selectedSME.location || "Not specified"}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor Contacts Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-amber" />
          <h2 className="font-display text-2xl text-foreground">Vendor Contacts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {contacts.map(contact => (
            <Card key={contact.id} className="border-border/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-amber" />
                  <h3 className="text-sm font-medium text-foreground">{contact.vendor}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{contact.primaryContact}</p>
                <p className="text-xs text-muted-foreground/70">{contact.role}</p>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/30">
                  <MapPin className="w-3 h-3 text-muted-foreground/50" />
                  <span className="text-[11px] text-muted-foreground">{contact.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
