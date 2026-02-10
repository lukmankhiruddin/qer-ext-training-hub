/*
 * Directory — SME Directory with search, filter, capacity overview, and admin CRUD
 * Design: Modern Meta/Apple hybrid — glass cards, gradient avatars, vibrant badges
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Search, X, MapPin, Users, Globe, Building2, UserPlus, Trash2,
  Plus, Phone, Mail,
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
import { toast } from "sonner";
import type { SME, VendorContact } from "@/lib/data";

const AVATAR_GRADIENTS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-purple-400 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-red-500",
  "from-lime-400 to-green-500",
  "from-fuchsia-400 to-purple-500",
];

export default function Directory() {
  const { smes, contacts, addSME, deleteSME, addContact, deleteContact } = useData();
  const { isAdmin, logActivity } = useAdmin();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedSME, setSelectedSME] = useState<SME | null>(null);
  const [addSMEOpen, setAddSMEOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newSME, setNewSME] = useState({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" });
  const [newContact, setNewContact] = useState({ name: "", role: "", vendor: "", email: "", phone: "" });

  const locations = useMemo(() => Array.from(new Set(smes.map(s => s.location).filter(Boolean))).sort(), [smes]);
  const roles = useMemo(() => Array.from(new Set(smes.flatMap(s => s.roles))).sort(), [smes]);
  const markets = useMemo(() => Array.from(new Set(smes.map(s => s.market))).sort(), [smes]);

  const filtered = useMemo(() => {
    return smes.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.market.toLowerCase().includes(search.toLowerCase()) || s.policySME.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === "all" || s.location === locationFilter;
      const matchRole = roleFilter === "all" || s.roles.includes(roleFilter);
      return matchSearch && matchLocation && matchRole;
    });
  }, [smes, search, locationFilter, roleFilter]);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const getAvatarGradient = (name: string) => {
    const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[idx];
  };

  const handleAddSME = () => {
    const sme: SME = {
      id: `sme-${Date.now()}`, name: newSME.name, market: newSME.market, vendors: [],
      roles: newSME.roles.split(",").map(r => r.trim()).filter(Boolean), policySME: "",
      space: newSME.space, location: newSME.location,
    };
    addSME(sme);
    logActivity("SME Added", `${sme.name} added to directory`);
    setAddSMEOpen(false);
    setNewSME({ name: "", market: "", location: "Dublin", space: "Simple Object", roles: "Market SME" });
    toast.success("SME added to directory");
  };

  const handleDeleteSME = (sme: SME, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSME(sme.id);
    logActivity("SME Removed", `${sme.name} removed from directory`);
    toast("SME removed");
  };

  const handleAddContact = () => {
    const contact: VendorContact = {
      id: `vc-${Date.now()}`, name: newContact.name, vendor: newContact.vendor, location: "Dublin",
      primaryContact: newContact.role, email: newContact.email, phone: newContact.phone, role: newContact.role,
    };
    addContact(contact);
    logActivity("Contact Added", `${contact.name} added as vendor contact`);
    setAddContactOpen(false);
    setNewContact({ name: "", role: "", vendor: "", email: "", phone: "" });
    toast.success("Contact added");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-blue-500/[0.03]" />
        <div className="container relative py-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                <Users className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.08em]">SME Directory</span>
              </div>
              <h1 className="text-[26px] font-bold text-foreground tracking-[-0.02em] mb-1 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
                Subject Matter Experts
              </h1>
              <p className="text-[14px] text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {smes.length} experts across {locations.length} locations and {markets.length} markets
              </p>
            </div>

            <div className="flex gap-3 items-end animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
              {locations.map(loc => {
                const count = smes.filter(s => s.location === loc).length;
                return (
                  <div key={loc} className="glass-card px-4 py-3 flex items-center gap-3 hover-lift">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[12px] text-muted-foreground">{loc}</p>
                      <p className="text-[22px] font-bold text-foreground tracking-[-0.02em]">{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Filters */}
        <div className="glass-card p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.14s" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search by name, market, or policy..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-secondary/60 border-none rounded-xl text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-secondary/60 border-none rounded-xl h-9 text-[13px] focus:ring-primary/20">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_oklch(0.4_0.1_270_/_12%)]">
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-secondary/60 border-none rounded-xl h-9 text-[13px] focus:ring-primary/20">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_oklch(0.4_0.1_270_/_12%)]">
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <span className="text-[12px] text-muted-foreground font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>

            {isAdmin && (
              <Dialog open={addSMEOpen} onOpenChange={setAddSMEOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] hover:opacity-90 transition-all duration-300 border-0 ml-auto">
                    <UserPlus className="w-3.5 h-3.5" />
                    Add SME
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[420px]">
                  <DialogHeader>
                    <DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Subject Matter Expert</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-3">
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Full Name</Label>
                      <Input value={newSME.name} onChange={e => setNewSME(p => ({ ...p, name: e.target.value }))} placeholder="e.g., John Smith" className="rounded-xl border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Market</Label>
                        <Input value={newSME.market} onChange={e => setNewSME(p => ({ ...p, market: e.target.value }))} placeholder="e.g., Arabic" className="rounded-xl border-border/50" />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Location</Label>
                        <Select value={newSME.location} onValueChange={v => setNewSME(p => ({ ...p, location: v }))}>
                          <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Dublin">Dublin</SelectItem><SelectItem value="Bangkok">Bangkok</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Space</Label>
                      <Select value={newSME.space} onValueChange={v => setNewSME(p => ({ ...p, space: v }))}>
                        <SelectTrigger className="rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simple Object">Simple Object</SelectItem>
                          <SelectItem value="Complex Object">Complex Object</SelectItem>
                          <SelectItem value="Simple Object & Complex Object">Simple & Complex Object</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Roles (comma-separated)</Label>
                      <Input value={newSME.roles} onChange={e => setNewSME(p => ({ ...p, roles: e.target.value }))} placeholder="Market SME, VG SME" className="rounded-xl border-border/50" />
                    </div>
                    <Button onClick={handleAddSME} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newSME.name || !newSME.market}>
                      Add SME
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* SME Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((sme, i) => (
            <div
              key={sme.id}
              className="glass-card hover-lift cursor-pointer group relative animate-fade-in-up"
              style={{ animationDelay: `${0.16 + i * 0.02}s` }}
              onClick={() => setSelectedSME(sme)}
            >
              {isAdmin && (
                <button
                  onClick={(e) => handleDeleteSME(sme, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm",
                    getAvatarGradient(sme.name)
                  )}>
                    {getInitials(sme.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                      {sme.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[12px] text-muted-foreground truncate">{sme.market}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {sme.roles.slice(0, 3).map(role => {
                    const roleClass = role === "Pillar Lead SME"
                      ? "bg-gradient-to-r from-amber-500/10 to-orange-500/8 text-amber-700"
                      : role === "Site Lead"
                      ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/8 text-emerald-700"
                      : role === "VG SME"
                      ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/8 text-blue-700"
                      : "bg-secondary/70 text-secondary-foreground";
                    return (
                      <span key={role} className={cn("px-2 py-0.5 rounded-lg text-[10px] font-semibold", roleClass)}>
                        {role}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{sme.location || "—"}</span>
                  {sme.space.includes("Complex") && (
                    <span className="ml-auto vibrant-badge vibrant-badge-blue">Complex</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SME Detail Dialog */}
        <Dialog open={!!selectedSME} onOpenChange={open => !open && setSelectedSME(null)}>
          <DialogContent className="max-w-md rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)]">
            {selectedSME && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-[18px] font-bold text-white shadow-md",
                      getAvatarGradient(selectedSME.name)
                    )}>
                      {getInitials(selectedSME.name)}
                    </div>
                    <div>
                      <DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">{selectedSME.name}</DialogTitle>
                      <p className="text-[13px] text-muted-foreground">{selectedSME.market}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSME.roles.map(role => (
                        <span key={role} className="px-2.5 py-1 rounded-xl text-[12px] font-semibold bg-secondary/70 text-foreground">{role}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Vendors</p>
                    <div className="space-y-1.5">
                      {selectedSME.vendors.map(v => (
                        <div key={v} className="flex items-center gap-2 text-[13px] text-foreground">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />{v}
                        </div>
                      ))}
                      {selectedSME.vendors.length === 0 && <span className="text-[13px] text-muted-foreground">—</span>}
                    </div>
                  </div>
                  {selectedSME.policySME && (
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Policy Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSME.policySME.split(",").map((p, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg text-[12px] font-medium bg-primary/8 text-primary">{p.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Space</p>
                    <p className="text-[13px] text-foreground">{selectedSME.space}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em] mb-2">Location</p>
                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />{selectedSME.location || "Not specified"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Vendor Contacts */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h2 className="text-[19px] font-bold text-foreground tracking-[-0.01em]">Vendor Contacts</h2>
                </div>
                {isAdmin && (
                  <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1.5 gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] hover:opacity-90 transition-all duration-300 border-0">
                        <Plus className="w-3.5 h-3.5" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border-border/40 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_oklch(0.4_0.1_270_/_12%)] sm:max-w-[420px]">
                      <DialogHeader>
                        <DialogTitle className="text-[18px] font-bold text-foreground tracking-[-0.01em]">Add Vendor Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-3">
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Full Name</Label>
                          <Input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} className="rounded-xl border-border/50" />
                        </div>
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Role / Title</Label>
                          <Input value={newContact.role} onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))} placeholder="e.g., Training Manager" className="rounded-xl border-border/50" />
                        </div>
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Vendor</Label>
                          <Input value={newContact.vendor} onChange={e => setNewContact(p => ({ ...p, vendor: e.target.value }))} placeholder="e.g., Teleperformance" className="rounded-xl border-border/50" />
                        </div>
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Email</Label>
                          <Input value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} type="email" className="rounded-xl border-border/50" />
                        </div>
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Phone</Label>
                          <Input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="rounded-xl border-border/50" />
                        </div>
                        <Button onClick={handleAddContact} className="w-full gradient-hero text-white font-semibold rounded-xl shadow-[0_2px_8px_oklch(0.55_0.22_264_/_20%)] h-10 border-0 hover:opacity-90 transition-all duration-300" disabled={!newContact.name}>
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-border/20">
              {contacts.map(contact => (
                <div key={contact.id} className="p-4 relative group hover:bg-primary/[0.02] transition-all duration-200">
                  {isAdmin && (
                    <button
                      onClick={() => { deleteContact(contact.id); logActivity("Contact Removed", `${contact.name} removed`); toast("Contact removed"); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-foreground">{contact.vendor}</h3>
                  </div>
                  <p className="text-[13px] font-medium text-foreground mb-0.5">{contact.name}</p>
                  <p className="text-[12px] text-muted-foreground">{contact.role}</p>
                  {contact.email && (
                    <div className="flex items-center gap-1.5 mt-2 text-[12px] text-primary">
                      <Mail className="w-3 h-3" />{contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-muted-foreground">
                      <Phone className="w-3 h-3" />{contact.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/20">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{contact.location}</span>
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
