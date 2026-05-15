import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "@/components/lab/Navbar";
import { Hero } from "@/components/lab/Hero";
import { Categories } from "@/components/lab/Categories";
import { HowItWorks } from "@/components/lab/HowItWorks";
import { WhyChooseUs } from "@/components/lab/WhyChooseUs";
import { Testimonials } from "@/components/lab/Testimonials";
import { ReviewsAndFAQ } from "@/components/lab/ReviewsAndFAQ";
import { Footer } from "@/components/lab/Footer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  const goToBooking = (cat?: string) => {
    navigate({ to: "/book", search: { category: cat } });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-[60]"
      />
      <Navbar onBook={() => goToBooking()} />
      <main>
        <Hero onBook={() => goToBooking()} onView={() => scrollTo("services")} />
        <Categories onPick={(id) => goToBooking(id)} />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <ReviewsAndFAQ />
      </main>
      <Footer />
    </div>
  );
}
