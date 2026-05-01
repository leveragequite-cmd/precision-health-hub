import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Navbar({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#how", label: "How it Works" },
    { href: "/book", label: "Book Test" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "glass-nav border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-card">
            <FlaskConical className="h-5 w-5" />
          </span>
          <span className="font-display text-xl text-primary">MediLab</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground/80">
          {links.map((l) => (
            l.href.startsWith("/#") ? (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href as "/"} className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
                {l.label}
              </Link>
            )
          ))}
        </nav>
        <button
          onClick={onBook}
          className="hidden sm:inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 h-10 text-sm font-semibold hover:bg-secondary transition-colors shadow-card"
        >
          Book Appointment
        </button>
      </div>
    </motion.header>
  );
}
