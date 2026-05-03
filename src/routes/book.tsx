import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const [, setBookings] = useState<Booking[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("medilab-bookings");
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();
  const { category } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBook={() => navigate({ to: "/book", search: { category: undefined } })} />
      <main className="pt-16">
        <BookingForm
          presetCategory={category || null}
          onAdd={(b) => setBookings((prev) => {
            const updated = [...prev, b];
            localStorage.setItem("medilab-bookings", JSON.stringify(updated));
            return updated;
          })}
        />
      </main>
      <Footer />
    </div>
  );
}