import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/lab/Navbar";
import { Hero } from "@/components/lab/Hero";
import { Categories } from "@/components/lab/Categories";
import { HowItWorks } from "@/components/lab/HowItWorks";
import { WhyChooseUs } from "@/components/lab/WhyChooseUs";
import { Testimonials } from "@/components/lab/Testimonials";
import { Footer } from "@/components/lab/Footer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();

  const goToBooking = (cat?: string) => {
    navigate({ to: "/book", search: { category: cat } });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBook={() => goToBooking()} />
      <main>
        <Hero onBook={() => goToBooking()} onView={() => scrollTo("services")} />
        <Categories onPick={(id) => goToBooking(id)} />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
