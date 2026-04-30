import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Priya S.", city: "Mumbai", rating: 5, text: "Home collection was on time, the technician was professional, and reports arrived the next morning. Truly hassle-free." },
  { name: "Rahul K.", city: "Bengaluru", rating: 5, text: "Booking took two minutes. The whole experience felt modern and trustworthy — exactly what healthcare should be." },
  { name: "Anita M.", city: "Delhi", rating: 5, text: "Loved how clear my full body checkup report was. Detailed, easy to read, and I got it on email and WhatsApp." },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-accent/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-2 text-3xl md:text-5xl text-foreground">Loved by patients across India</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-7 shadow-card border border-border/60"
            >
              <div className="flex gap-1 text-secondary">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-foreground/90 leading-relaxed">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
