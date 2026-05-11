import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

const badges = [
  { icon: <Award className="h-4 w-4" />, label: "10,000+ Tests Done", style: "top-6 left-2 md:left-8" },
  { icon: <ShieldCheck className="h-4 w-4" />, label: "NABL Accredited", style: "bottom-10 left-4 md:-left-4" },
  { icon: <Clock className="h-4 w-4" />, label: "Results in 24hrs", style: "top-16 right-2 md:-right-2" },
];

export function Hero({ onBook, onView }: { onBook: () => void; onView: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <motion.div style={{ opacity: fade }} className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <motion.span
            variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-4 py-1.5 text-xs font-semibold ring-1 ring-primary/10"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Trusted by 10,000+ patients
          </motion.span>
          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="mt-5 text-4xl md:text-6xl leading-[1.05] text-foreground"
          >
            Precision Diagnostics.
            <span className="block text-primary">Trusted Results.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="mt-5 text-lg text-muted-foreground max-w-xl"
          >
            Book your lab test in under 2 minutes — from home or walk-in.
          </motion.p>
          <motion.div
            variants={fadeUp} custom={3} initial="hidden" animate="show"
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground h-12 px-7 font-semibold hover:bg-secondary transition-colors shadow-card"
            >
              Book Appointment <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onView}
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary text-secondary h-12 px-7 font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              View All Tests
            </button>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
            className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { n: "10K+", l: "Tests Done" },
              { n: "24h", l: "Report Time" },
              { n: "4.9★", l: "Patient Rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl text-primary">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: visualY }} className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-card shadow-elevated overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-70" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-7xl">🧬</div>
                  <div className="mt-4 font-display text-2xl text-primary">Modern Diagnostics</div>
                  <div className="text-sm text-muted-foreground mt-1">Powered by science you can trust</div>
                </div>
              </div>
            </div>
            {badges.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { delay: 0.6 + i * 0.15, duration: 0.5 },
                  y: { delay: 0.6 + i * 0.15, duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`absolute ${b.style} bg-card shadow-card rounded-full px-4 py-2 text-xs font-semibold text-primary flex items-center gap-2 ring-1 ring-border`}
              >
                <span className="text-secondary">{b.icon}</span> {b.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
