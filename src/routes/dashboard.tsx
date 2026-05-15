import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { Download, Trash2, Search, FlaskConical, Calendar, User, Phone, Mail, MapPin, Lock, LogOut, RefreshCw, Settings, Plus, X, Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TIME_SLOTS, type Booking } from "@/lib/lab-data";

const DEFAULT_ADMIN_PASSWORD = "medilab2025";
const AUTH_KEY = "medilab-admin-auth";
const ADMIN_PASSWORD_KEY = "medilab-admin-password";
const SLOT_AVAILABILITY_KEY = "medilab-slot-availability";
const CUSTOM_TIME_SLOTS_KEY = "medilab-custom-time-slots";

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const getDefaultAvailability = () => {
  return TIME_SLOTS.reduce((acc, slot) => {
    acc[slot] = true;
    return acc;
  }, {} as Record<string, boolean>);
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MediLab" },
      { name: "description", content: "View and manage patient appointments." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "1";
  });
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [currentAdminPassword, setCurrentAdminPassword] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === currentAdminPassword) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setPwError("");
      setPwInput("");
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("medilab-bookings");
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState("");
  const [slotAvailability, setSlotAvailability] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("medilab-slot-availability");
    return stored ? JSON.parse(stored) : {};
  });
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<string>(todayStr());
  const [customTimeSlots, setCustomTimeSlots] = useState<string[]>(() => {
    if (typeof window === "undefined") return TIME_SLOTS;
    const stored = localStorage.getItem(CUSTOM_TIME_SLOTS_KEY);
    return stored ? JSON.parse(stored) : TIME_SLOTS;
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("");
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [editingSlotValue, setEditingSlotValue] = useState("");
  // Sync with localStorage changes
  useEffect(() => {
    const syncBookings = () => {
      const stored = localStorage.getItem("medilab-bookings");
      const latestBookings = stored ? JSON.parse(stored) : [];
      setBookings(latestBookings);
    };

    const syncAvailability = () => {
      const stored = localStorage.getItem(SLOT_AVAILABILITY_KEY);
      const latestAvailability = stored ? JSON.parse(stored) : {};
      setSlotAvailability(latestAvailability);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "medilab-bookings") {
        syncBookings();
      }
      if (event.key === SLOT_AVAILABILITY_KEY) {
        syncAvailability();
      }
    };

    // Listen for storage changes (when bookings or availability is updated in another tab)
    window.addEventListener('storage', handleStorage);

    // Also check periodically for changes (in case of same-tab updates)
    const interval = setInterval(() => {
      syncBookings();
      syncAvailability();
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const refreshBookings = () => {
    const stored = localStorage.getItem("medilab-bookings");
    const latestBookings = stored ? JSON.parse(stored) : [];
    setBookings(latestBookings);
  };

  const saveAvailability = (availability: Record<string, Record<string, boolean>>) => {
    setSlotAvailability(availability);
    localStorage.setItem(SLOT_AVAILABILITY_KEY, JSON.stringify(availability));
  };

  const toggleAvailability = (slot: string) => {
    const date = selectedAvailabilityDate;
    const next = {
      ...slotAvailability,
      [date]: {
        ...(slotAvailability[date] ?? getDefaultAvailability()),
        [slot]: !(slotAvailability[date]?.[slot] ?? true),
      },
    };
    saveAvailability(next);
  };

  const resetAvailabilityForDate = () => {
    const next = {
      ...slotAvailability,
      [selectedAvailabilityDate]: getDefaultAvailability(),
    };
    saveAvailability(next);
  };

  const currentAvailability = slotAvailability[selectedAvailabilityDate] ?? getDefaultAvailability();

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (oldPassword !== currentAdminPassword) {
      setPasswordError("Current password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const updated = newPassword;
    setCurrentAdminPassword(updated);
    localStorage.setItem(ADMIN_PASSWORD_KEY, updated);
    setPasswordSuccess("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess("");
    }, 1500);
  };

  const handleAddSlot = () => {
    if (!newSlotTime.trim()) return;
    if (customTimeSlots.includes(newSlotTime)) {
      alert("This slot already exists.");
      return;
    }
    const updated = [...customTimeSlots, newSlotTime];
    setCustomTimeSlots(updated);
    localStorage.setItem(CUSTOM_TIME_SLOTS_KEY, JSON.stringify(updated));
    setNewSlotTime("");
    setShowAddSlotModal(false);
  };

  const handleDeleteSlot = (index: number) => {
    const updated = customTimeSlots.filter((_, i) => i !== index);
    setCustomTimeSlots(updated);
    localStorage.setItem(CUSTOM_TIME_SLOTS_KEY, JSON.stringify(updated));
  };

  const handleEditSlot = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    const updated = [...customTimeSlots];
    updated[index] = newValue;
    setCustomTimeSlots(updated);
    localStorage.setItem(CUSTOM_TIME_SLOTS_KEY, JSON.stringify(updated));
    setEditingSlotIndex(null);
    setEditingSlotValue("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-card border border-border p-8"
        >
          <Link to="/" className="flex items-center gap-2 mb-6 justify-center">
            <span className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-card">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl text-primary">MediLab</span>
          </Link>
          <div className="text-center mb-6">
            <span className="inline-flex h-12 w-12 rounded-full bg-accent items-center justify-center mb-3">
              <Lock className="h-5 w-5 text-primary" />
            </span>
            <h1 className="font-display text-2xl text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the admin password to view appointments.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              autoFocus
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Password"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-secondary transition-colors shadow-card"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-5">
            Authorized personnel only.
          </p>
        </motion.div>
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.fullName.toLowerCase().includes(q) ||
      b.mobile.includes(q) ||
      b.categoryName.toLowerCase().includes(q) ||
      b.testName.toLowerCase().includes(q) ||
      b.place.toLowerCase().includes(q)
    );
  });

  const removeBooking = (id: number) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("medilab-bookings", JSON.stringify(updated));
  };

  const exportExcel = () => {
    const rows = bookings.map((b, i) => ({
      "S.No": i + 1,
      "Reference ID": b.referenceId,
      "Full Name": b.fullName,
      "Place": b.place,
      "Mobile Number": b.mobile,
      "Email ID": b.email || "—",
      "Test Category": b.categoryName,
      "Specific Test": b.testName,
      "Collection Type": b.collectionType,
      "Appointment Date": b.date,
      "Time Slot": b.timeSlot,
      "Booked At (Timestamp)": b.bookedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 26 },
      { wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");
    XLSX.writeFile(wb, `medilab-patients-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple admin header */}
      <header className="sticky top-0 z-50 glass-nav border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-card">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span className="font-display text-xl text-primary">MediLab</span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider bg-secondary/15 text-secondary px-2 py-0.5 rounded-full">Admin</span>
          </Link>
          <Link to="/" className="text-sm text-foreground/60 hover:text-primary transition-colors">
            ← Back to Site
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-primary transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {/* Settings Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-lg border border-border p-8 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Admin Settings</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Change Password Section */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Change Admin Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Current Password</label>
                    <input
                      type={showPasswordFields ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 h-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">New Password</label>
                    <input
                      type={showPasswordFields ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (minimum 6 characters)"
                      className="w-full px-4 h-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                    <input
                      type={showPasswordFields ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 h-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={showPasswordFields}
                      onChange={(e) => setShowPasswordFields(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-foreground">Show passwords</span>
                  </label>
                  {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                  {passwordSuccess && <p className="text-sm text-emerald-600">{passwordSuccess}</p>}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-secondary transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordModal(false);
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordError("");
                      }}
                      className="flex-1 h-11 rounded-xl bg-muted/10 text-foreground font-semibold hover:bg-muted/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Manage Time Slots Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Manage Time Slots</h3>
                <div className="mb-4">
                  <button
                    onClick={() => setShowAddSlotModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-4 h-10 text-sm font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Slot
                  </button>
                </div>

                {showAddSlotModal && (
                  <div className="mb-4 p-4 bg-accent rounded-xl border border-border">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-foreground mb-1">New Slot Time</label>
                        <input
                          type="text"
                          value={newSlotTime}
                          onChange={(e) => setNewSlotTime(e.target.value)}
                          placeholder="e.g., 6AM – 8AM"
                          className="w-full px-3 h-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <button
                        onClick={handleAddSlot}
                        className="px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSlotModal(false);
                          setNewSlotTime("");
                        }}
                        className="px-4 h-10 bg-muted/10 text-foreground rounded-lg text-sm font-semibold hover:bg-muted/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {customTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-accent/30 rounded-lg border border-border">
                      {editingSlotIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editingSlotValue}
                            onChange={(e) => setEditingSlotValue(e.target.value)}
                            className="flex-1 px-3 h-9 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <button
                            onClick={() => handleEditSlot(index, editingSlotValue)}
                            className="px-3 h-9 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSlotIndex(null)}
                            className="px-3 h-9 bg-muted/10 text-foreground rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium text-foreground">{slot}</span>
                          <button
                            onClick={() => {
                              setEditingSlotIndex(index);
                              setEditingSlotValue(slot);
                            }}
                            className="px-3 h-9 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(index)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Confidential Patient Data</h3>
              <p className="text-sm text-amber-700 mt-1">
                This dashboard contains sensitive patient information. Access is restricted to authorized medical personnel only.
                All patient data is handled in accordance with privacy regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: bookings.length, icon: Calendar },
            { label: "Home Collections", value: bookings.filter((b) => b.collectionType === "Home Collection").length, icon: MapPin },
            { label: "Walk-in Visits", value: bookings.filter((b) => b.collectionType === "Walk-in Visit").length, icon: User },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-5 shadow-card border border-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="h-10 w-10 rounded-xl bg-accent grid place-items-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-3xl font-display text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshBookings}
              className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-4 h-10 text-sm font-semibold hover:bg-accent/80 transition-colors"
              title="Refresh bookings"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={exportExcel}
              disabled={bookings.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 h-10 text-sm font-semibold hover:bg-secondary transition-colors shadow-card disabled:opacity-50 disabled:pointer-events-none"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Slot Availability Editor */}
        <div className="mb-8 p-6 bg-card rounded-3xl border border-border shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manage Slot Availability</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Lock or unlock time slots for a specific date. Locked slots cannot be booked by patients.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-foreground/80">Date:</label>
              <input
                type="date"
                value={selectedAvailabilityDate}
                min={todayStr()}
                onChange={(e) => setSelectedAvailabilityDate(e.target.value)}
                className="h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={resetAvailabilityForDate}
                className="inline-flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground px-4 h-11 text-sm font-semibold hover:bg-secondary/90 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => {
              const available = currentAvailability[slot] ?? true;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleAvailability(slot)}
                  className={`rounded-2xl border p-4 text-left transition-all ${available ? "border-border bg-card hover:border-secondary" : "border-destructive bg-destructive/10 text-destructive"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{slot}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${available ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive"}`}>
                      {available ? "Available" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Click to {available ? "lock" : "unlock"} this slot for the selected date.</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {bookings.length === 0 ? "No appointments yet" : "No results found"}
            </p>
            {bookings.length === 0 && (
              <Link to="/book" search={{ category: undefined }} className="mt-3 inline-block text-sm text-primary hover:underline">
                Book an appointment →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-accent/60 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground/70">#</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Patient</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Reference</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Contact</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Test</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Type</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Date & Time</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Booked</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70 w-14"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} className="border-t border-border hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{b.fullName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.place}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/80">
                      <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-1">{b.referenceId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1 text-foreground"><Phone className="h-3 w-3 text-muted-foreground" />{b.mobile}</p>
                      {b.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{b.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full mb-0.5">{b.categoryName}</span>
                      <p className="text-foreground">{b.testName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${b.collectionType === "Home Collection" ? "bg-secondary/15 text-secondary" : "bg-accent text-primary"}`}>
                        {b.collectionType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{b.date}</p>
                      <p className="text-xs text-muted-foreground">{b.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{b.bookedAt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeBooking(b.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}