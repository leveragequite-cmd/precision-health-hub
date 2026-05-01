import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { Navbar } from "@/components/lab/Navbar";
import { BookingForm } from "@/components/lab/BookingForm";
import { Footer } from "@/components/lab/Footer";
import type { Booking } from "@/lib/lab-data";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book Appointment — MediLab" },
      { name: "description", content: "Schedule your lab test appointment online in minutes." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const { category } = Route.useSearch();

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
      "Booked At (Timestamp)": b.bookedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 26 },
      { wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `medilab-patients-${stamp}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBook={() => navigate({ to: "/book" })} />
      <main className="pt-16">
        <BookingForm
          presetCategory={category || null}
          onAdd={(b) => setBookings((prev) => [...prev, b])}
        />
      </main>
      <Footer />

      <AnimatePresence>
        {bookings.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={exportExcel}
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground pl-5 pr-6 h-12 font-semibold shadow-elevated hover:bg-primary transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Patient Records
            <span className="ml-1 inline-grid h-6 min-w-6 px-2 place-items-center rounded-full bg-primary-foreground/20 text-xs">
              {bookings.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}