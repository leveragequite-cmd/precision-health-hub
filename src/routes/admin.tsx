import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { Download, Trash2, Search, FlaskConical, Calendar, User, Phone, Mail, MapPin, Lock, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BOOKING_STATUSES, type Booking, type BookingStatus } from "@/lib/lab-data";

const ADMIN_PASSWORD = "medilab2025";
const AUTH_KEY = "medilab-admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — MediLab" },
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
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
    const parsed: Booking[] = stored ? JSON.parse(stored) : [];
    return parsed.map((b) => ({ ...b, status: b.status ?? "Booked" }));
  });
  const [search, setSearch] = useState("");

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

  const updateStatus = (id: number, status: BookingStatus) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    localStorage.setItem("medilab-bookings", JSON.stringify(updated));
  };

  const statusClass = (s: BookingStatus) =>
    s === "Completed"
      ? "bg-secondary/15 text-secondary border-secondary/30"
      : s === "Cancelled"
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : "bg-primary/10 text-primary border-primary/30";

  const exportExcel = () => {
    const rows = bookings.map((b, i) => ({
      "S.No": i + 1,
      "Full Name": b.fullName,
      "Place": b.place,
      "Mobile Number": b.mobile,
      "Email ID": b.email || "—",
      "Test Category": b.categoryName,
      "Specific Test": b.testName,
      "Collection Type": b.collectionType,
      "Appointment Date": b.date,
      "Time Slot": b.timeSlot,
      "Status": b.status ?? "Booked",
      "Booked At (Timestamp)": b.bookedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 26 },
      { wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 22 },
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
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-destructive transition-colors ml-4"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: bookings.length, icon: Calendar },
            { label: "Booked", value: bookings.filter((b) => (b.status ?? "Booked") === "Booked").length, icon: Calendar },
            { label: "Completed", value: bookings.filter((b) => b.status === "Completed").length, icon: Calendar },
            { label: "Cancelled", value: bookings.filter((b) => b.status === "Cancelled").length, icon: Calendar },
            { label: "Home Collections", value: bookings.filter((b) => b.collectionType === "Home Collection").length, icon: MapPin },
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
          <button
            onClick={exportExcel}
            disabled={bookings.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 h-10 text-sm font-semibold hover:bg-secondary transition-colors shadow-card disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
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
                  <th className="px-4 py-3 font-semibold text-foreground/70">Contact</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Test</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Type</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Date & Time</th>
                  <th className="px-4 py-3 font-semibold text-foreground/70">Status</th>
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
                    <td className="px-4 py-3">
                      <select
                        value={b.status ?? "Booked"}
                        onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${statusClass(b.status ?? "Booked")}`}
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                        ))}
                      </select>
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