import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/lab/Navbar";
import { BookingForm } from "@/components/lab/BookingForm";
import { Footer } from "@/components/lab/Footer";

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
  const navigate = useNavigate();
  const { category } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBook={() => navigate({ to: "/book", search: { category: undefined } })} />
      <main className="pt-16">
        <BookingForm
          presetCategory={category || null}
          onAdd={(b) => {
            // Store booking in localStorage for admin access
            const existing = JSON.parse(localStorage.getItem("medilab-bookings") || "[]");
            const updated = [...existing, b];
            localStorage.setItem("medilab-bookings", JSON.stringify(updated));
          }}
        />
      </main>
      <Footer />
    </div>
  );
}