import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/lab-data";

export function Categories({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Our Services</span>
          <h2 className="mt-2 text-3xl md:text-5xl text-foreground">Comprehensive lab tests, all in one place</h2>
          <p className="mt-4 text-muted-foreground">Choose from 12+ diagnostic categories with home collection and 24-hour digital reports.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative text-left bg-card rounded-2xl p-6 shadow-card border border-border/60 transition-all hover:shadow-elevated overflow-hidden"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-secondary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
              <div className="flex items-start justify-between">
                <div className="text-4xl transition-transform duration-300 group-hover:scale-110">{c.icon}</div>
                <span className="text-[10px] font-semibold text-secondary bg-accent rounded-full px-2 py-1">{c.tests.length} tests</span>
              </div>
              <h3 className="mt-5 text-xl text-foreground font-semibold">{c.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
                View Tests <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
