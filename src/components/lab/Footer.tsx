import { FlaskConical, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-primary-foreground/15 grid place-items-center">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span className="font-display text-xl">MediLab</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
            Precision diagnostics, delivered with care — wherever you are.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-secondary grid place-items-center transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
            <li><a className="hover:text-secondary transition-colors" href="#home">Home</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#services">Services</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#book">Book Test</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5" /> +91 98765 43210</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5" /> hello@medilab.health</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> 24, Wellness Road, Mumbai 400001, India</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>Mon – Sat: 7:00 AM – 9:00 PM</li>
            <li>Sunday: 8:00 AM – 2:00 PM</li>
            <li>Home collection: 7 AM – 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 text-xs text-primary-foreground/70 flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} MediLab Diagnostics. All rights reserved.</span>
          <span>NABL accredited • ISO 9001:2015</span>
        </div>
      </div>
    </footer>
  );
}
