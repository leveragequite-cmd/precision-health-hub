import { motion } from "framer-motion";
import { Award, Clock, Truck, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: Award, title: "NABL Accredited Lab", desc: "Certified quality and accuracy you can trust." },
  { icon: Clock, title: "Reports in 24 Hours", desc: "Fast turnaround for most diagnostic tests." },
  { icon: Truck, title: "Free Home Collection", desc: "Trained phlebotomists at your doorstep." },
  { icon: ShieldCheck, title: "100% Secure & Confidential", desc: "Your data is encrypted and never shared." },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Why Choose Us</span>
          <h2 className="mt-2 text-3xl md:text-5xl text-foreground">A new standard in diagnostics</h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/60 text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-accent grid place-items-center text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-semibold text-foreground">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
