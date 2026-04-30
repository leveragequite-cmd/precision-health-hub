import { motion } from "framer-motion";
import { ClipboardList, CalendarCheck, FileCheck2 } from "lucide-react";

const STEPS = [
  { icon: ClipboardList, title: "Choose Your Test", desc: "Browse 12+ categories and select the tests you need." },
  { icon: CalendarCheck, title: "Book a Slot", desc: "Pick your date, time and provide your details." },
  { icon: FileCheck2, title: "Get Results", desc: "Receive digital reports via email or WhatsApp within 24 hours." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-28 bg-accent/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Simple Process</span>
          <h2 className="mt-2 text-3xl md:text-5xl text-foreground">How it works</h2>
          <p className="mt-4 text-muted-foreground">Three simple steps from booking to your report.</p>
        </div>
        <div className="mt-16 relative grid md:grid-cols-3 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 dashed-line opacity-50" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative bg-card rounded-2xl p-7 text-center shadow-card border border-border/60"
              >
                <div className="relative inline-grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground mx-auto -mt-15 shadow-card">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold grid place-items-center ring-4 ring-card">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
