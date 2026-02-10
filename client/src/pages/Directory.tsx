/*
 * Directory — SME Directory with search, filter, and capacity overview
 * Design: Meta/Facebook — Circular avatars, white cards, blue hover states
 * 44 real SMEs from QERName.xlsx
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import {
  Search,
  X,
  MapPin,
  Users,
  Globe,
  Building2,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SME } from "@/lib/data";

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

  // Generate consistent color from name — Meta style colors
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-[#E7F3FF] text-primary",
      "bg-[#E8F5E9] text-[#2E7D32]",
      "bg-[#FFF3E0] text-[#E65100]",
      "bg-[#F3E5F5] text-[#7B1FA2]",
      "bg-[#E3F2FD] text-[#1565C0]",
      "bg-[#FBE9E7] text-[#BF360C]",
      "bg-[#E0F2F1] text-[#00695C]",
      "bg-[#FCE4EC] text-[#C62828]",
    ];
    const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Header — Meta style: white banner */}
      <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="container py-5">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold text-primary uppercase tracking-wide">
                  SME Directory
                </span>
              </div>
              <h1 className="text-[24px] font-bold text-[#050505] mb-1">
                Subject Matter Experts
              </h1>
              <p className="text-[15px] text-[#65676B]">
                {smes.length} experts across {locations.length} locations and {markets.length} markets
              </p>
            </div>

            {/* Capacity summary — Meta style */}
            <div className="flex gap-3">
              {locations.map(loc => {
                const count = smes.filter(s => s.location === loc).length;
                return (
                  <div key={loc} className="meta-card px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E7F3FF] flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#65676B]">{loc}</p>
                      <p className="text-[20px] font-bold text-[#050505]">{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Filters — Meta style */}
        <div className="meta-card p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8D91]" />
              <input
                placeholder="Search by name, market, or policy..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] border-none rounded-full text-[15px] text-[#050505] placeholder-[#8A8D91] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors duration-150"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D91] hover:text-[#050505]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-[#F0F2F5] border-none rounded-lg h-9 text-[14px]">
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
              <SelectTrigger className="w-full sm:w-[180px] bg-[#F0F2F5] border-none rounded-lg h-9 text-[14px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-[13px] text-[#8A8D91] font-medium ml-auto">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* SME Grid — Meta style: Facebook people cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((sme) => (
            <div
              key={sme.id}
              className="meta-card hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-200 cursor-pointer group"
              onClick={() => setSelectedSME(sme)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar — Meta style: circular */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0",
                    getAvatarColor(sme.name)
                  )}>
                    {getInitials(sme.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#050505] truncate group-hover:text-primary transition-colors duration-150">
                      {sme.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3 text-[#8A8D91]" />
                      <span className="text-[13px] text-[#65676B] truncate">
                        {sme.market}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roles — Meta style badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {sme.roles.slice(0, 3).map(role => {
                    const roleClass = role === "Pillar Lead SME"
                      ? "bg-[#FFF3E0] text-[#E65100]"
                      : role === "Site Lead"
                      ? "bg-[#E8F5E9] text-[#2E7D32]"
                      : role === "VG SME"
                      ? "bg-[#E7F3FF] text-primary"
                      : "bg-[#F0F2F5] text-[#65676B]";
                    return (
                      <span
                        key={role}
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-semibold",
                          roleClass
                        )}
                      >
                        {role}
                      </span>
                    );
                  })}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#CED0D4]/40">
                  <MapPin className="w-3 h-3 text-[#8A8D91]" />
                  <span className="text-[12px] text-[#65676B]">{sme.location || "—"}</span>
                  {sme.space.includes("Complex") && (
                    <span className="ml-auto text-[11px] font-semibold text-primary bg-[#E7F3FF] px-2 py-0.5 rounded">
                      Complex
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SME Detail Dialog — Meta style */}
        <Dialog open={!!selectedSME} onOpenChange={open => !open && setSelectedSME(null)}>
          <DialogContent className="max-w-md rounded-xl">
            {selectedSME && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold",
                      getAvatarColor(selectedSME.name)
                    )}>
                      {getInitials(selectedSME.name)}
                    </div>
                    <div>
                      <DialogTitle className="text-[20px] font-bold text-[#050505]">{selectedSME.name}</DialogTitle>
                      <p className="text-[14px] text-[#65676B]">{selectedSME.market}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Roles */}
                  <div>
                    <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSME.roles.map(role => (
                        <span key={role} className="px-2.5 py-1 rounded-lg text-[13px] font-semibold bg-[#F0F2F5] text-[#050505]">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vendors */}
                  <div>
                    <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Vendors</p>
                    <div className="space-y-1.5">
                      {selectedSME.vendors.map(v => (
                        <div key={v} className="flex items-center gap-2 text-[14px] text-[#050505]">
                          <Building2 className="w-3.5 h-3.5 text-[#65676B]" />
                          {v}
                        </div>
                      ))}
                      {selectedSME.vendors.length === 0 && (
                        <span className="text-[14px] text-[#65676B]">—</span>
                      )}
                    </div>
                  </div>

                  {/* Policy SME */}
                  {selectedSME.policySME && (
                    <div>
                      <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Policy Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSME.policySME.split(",").map((p, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[13px] font-medium bg-[#E7F3FF] text-primary">
                            {p.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Space */}
                  <div>
                    <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Space</p>
                    <p className="text-[14px] text-[#050505]">{selectedSME.space}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-[12px] text-[#8A8D91] font-semibold uppercase tracking-wide mb-2">Location</p>
                    <div className="flex items-center gap-2 text-[14px] text-[#050505]">
                      <MapPin className="w-3.5 h-3.5 text-[#65676B]" />
                      {selectedSME.location || "Not specified"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Vendor Contacts Section */}
        <div className="mt-8">
          <div className="meta-card">
            <div className="p-4 border-b border-[#CED0D4]/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-[20px] font-bold text-[#050505]">Vendor Contacts</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-[#CED0D4]/40">
              {contacts.map(contact => (
                <div key={contact.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E7F3FF] flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#050505]">{contact.vendor}</h3>
                  </div>
                  <p className="text-[14px] text-[#050505] mb-0.5">{contact.primaryContact}</p>
                  <p className="text-[13px] text-[#65676B]">{contact.role}</p>
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#CED0D4]/30">
                    <MapPin className="w-3 h-3 text-[#8A8D91]" />
                    <span className="text-[12px] text-[#65676B]">{contact.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
