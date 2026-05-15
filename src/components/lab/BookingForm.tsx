import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Building2, CalendarDays, Loader2, Download } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { CATEGORIES, TIME_SLOTS, type Booking } from "@/lib/lab-data";

type Props = {
  presetCategory?: string | null;
  onAdd: (b: Booking) => void;
};

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const SLOT_AVAILABILITY_KEY = "medilab-slot-availability";

const getDefaultAvailability = () => {
  return TIME_SLOTS.reduce((acc, slot) => {
    acc[slot] = true;
    return acc;
  }, {} as Record<string, boolean>);
};

const generateReferenceId = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `MLB-${timestamp}-${suffix}`;
};

export function BookingForm({ presetCategory, onAdd }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, Record<string, boolean>>>({});

  const [categoryId, setCategoryId] = useState("");
  const [testName, setTestName] = useState("");
  const [collectionType, setCollectionType] = useState<"Home Collection" | "Walk-in Visit">("Home Collection");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [fullName, setFullName] = useState("");
  const [place, setPlace] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (presetCategory) {
      setCategoryId(presetCategory);
      setTestName("");
    }
  }, [presetCategory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SLOT_AVAILABILITY_KEY);
    setSlotAvailability(stored ? JSON.parse(stored) : {});

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SLOT_AVAILABILITY_KEY) {
        setSlotAvailability(event.newValue ? JSON.parse(event.newValue) : {});
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const category = useMemo(() => CATEGORIES.find((c) => c.id === categoryId), [categoryId]);

  const createPdfUrl = async (booking: Booking) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 770]);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleSize = 18;
    const bodySize = 12;
    const margin = 50;
    const title = "MediLab Appointment Confirmation";

    page.drawText(title, {
      x: margin,
      y: 720,
      size: titleSize,
      font: helvetica,
      color: rgb(0.03, 0.26, 0.47),
    });
    page.drawText("Thank you for booking your appointment with MediLab.", {
      x: margin,
      y: 694,
      size: bodySize,
      font: helvetica,
      color: rgb(0.18, 0.18, 0.18),
    });

    const lines = [
      ["Reference ID:", booking.referenceId],
      ["Booked At:", booking.bookedAt],
      ["Patient Name:", booking.fullName],
      ["City:", booking.place],
      ["Mobile:", booking.mobile],
      ["Email:", booking.email || "N/A"],
      ["Service Category:", booking.categoryName],
      ["Test:", booking.testName],
      ["Collection Type:", booking.collectionType],
      ["Appointment Date:", booking.date],
      ["Time Slot:", booking.timeSlot],
    ];

    let y = 656;
    for (const [label, value] of lines) {
      page.drawText(label, {
        x: margin,
        y,
        size: bodySize,
        font: helvetica,
        color: rgb(0.13, 0.13, 0.13),
      });
      page.drawText(value, {
        x: margin + 130,
        y,
        size: bodySize,
        font: helvetica,
        color: rgb(0.0, 0.0, 0.0),
      });
      y -= 24;
    }

    page.drawText("Please keep this confirmation for your records.", {
      x: margin,
      y: 140,
      size: 10,
      font: helvetica,
      color: rgb(0.18, 0.18, 0.18),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!categoryId) e.categoryId = "Please select a category";
      if (!testName) e.testName = "Please select a specific test";
    }
    if (s === 2) {
      if (!date) e.date = "Please pick an appointment date";
      if (!timeSlot) e.timeSlot = "Please choose a time slot";
    }
    if (s === 3) {
      if (!fullName.trim()) e.fullName = "Full name is required";
      if (!place.trim()) e.place = "City is required";
      if (!/^\d{10}$/.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
      if (!agree) e.agree = "Please confirm consent to proceed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(3, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const booking: Booking = {
      id: Date.now(),
      referenceId: generateReferenceId(),
      fullName: fullName.trim(),
      place: place.trim(),
      mobile,
      email: email.trim(),
      categoryName: category?.name || "",
      testName,
      collectionType,
      date,
      timeSlot,
      bookedAt: new Date().toLocaleString(),
    };

    onAdd(booking);
    setConfirmedBooking(booking);
    setSubmitted(true);
    setSubmitting(false);
    setPdfGenerating(true);
    try {
      const url = await createPdfUrl(booking);
      setPdfUrl(url);
    } finally {
      setPdfGenerating(false);
    }
  };

  const reset = () => {
    setStep(1); setSubmitted(false);
    setCategoryId(""); setTestName("");
    setCollectionType("Home Collection");
    setDate(""); setTimeSlot("");
    setFullName(""); setPlace(""); setMobile(""); setEmail(""); setAgree(false);
    setErrors({});
    setPdfUrl(null);
    setPdfGenerating(false);
    setConfirmedBooking(null);
  };

  return (
    <section id="book" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Book Online</span>
          <h2 className="mt-2 text-3xl md:text-5xl text-foreground">Schedule your test in minutes</h2>
          <p className="mt-4 text-muted-foreground">Fill in the form below — our team will confirm your appointment shortly.</p>
        </div>

        <div className="bg-card rounded-3xl shadow-elevated overflow-hidden border border-border/60">
          <div className="bg-primary text-primary-foreground px-6 md:px-10 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-80">Appointment Booking</div>
                <div className="font-display text-2xl">Step {step} of 3</div>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-bold transition-colors ${
                      step >= n ? "bg-secondary text-secondary-foreground" : "bg-primary-foreground/15 text-primary-foreground/70"
                    }`}>{n}</div>
                    {n < 3 && <div className={`h-0.5 w-6 transition-colors ${step > n ? "bg-secondary" : "bg-primary-foreground/15"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 min-h-[420px] relative">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto h-20 w-20 rounded-full bg-secondary/15 grid place-items-center"
                  >
                    <CheckCircle2 className="h-12 w-12 text-secondary" />
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-semibold text-foreground">Appointment Booked Successfully!</h3>
                  <p className="mt-2 text-muted-foreground">We'll contact you shortly to confirm the details.</p>
                  <div className="mt-6 inline-block bg-accent rounded-2xl p-5 text-left text-sm">
                    <div><span className="text-muted-foreground">Reference ID:</span> <strong>{confirmedBooking?.referenceId || "—"}</strong></div>
                    <div><span className="text-muted-foreground">Patient:</span> <strong>{fullName}</strong></div>
                    <div><span className="text-muted-foreground">Test:</span> <strong>{testName}</strong></div>
                    <div><span className="text-muted-foreground">When:</span> <strong>{date} • {timeSlot}</strong></div>
                    <div><span className="text-muted-foreground">Type:</span> <strong>{collectionType}</strong></div>
                  </div>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                      href={pdfUrl ?? undefined}
                      download={`MediLab-Appointment-${(confirmedBooking?.fullName || fullName).replace(/\s+/g, "-")}-${date}.pdf`}
                      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 h-11 font-semibold transition-colors ${pdfUrl ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-muted/10 text-muted-foreground cursor-not-allowed opacity-60"}`}
                    >
                      <Download className="h-4 w-4" />
                      {pdfGenerating ? "Preparing PDF..." : "Download Confirmation"}
                    </a>
                    <button onClick={reset} className="rounded-full bg-primary text-primary-foreground px-6 h-11 font-semibold hover:bg-secondary transition-colors">
                      Book Another Test
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && (
                    <div className="space-y-5">
                      <Field label="Select Category" error={errors.categoryId}>
                        <select
                          value={categoryId}
                          onChange={(e) => { setCategoryId(e.target.value); setTestName(""); }}
                          className="select-base"
                        >
                          <option value="">— Choose a category —</option>
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.icon}  {c.name}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Select Specific Test" error={errors.testName}>
                        <select
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                          disabled={!category}
                          className="select-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{category ? "— Choose a test —" : "Select a category first"}</option>
                          {category?.tests.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Field>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Collection Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            { v: "Home Collection", icon: Home, sub: "Sample picked up at home" },
                            { v: "Walk-in Visit", icon: Building2, sub: "Visit our nearest center" },
                          ] as const).map((o) => {
                            const Icon = o.icon;
                            const active = collectionType === o.v;
                            return (
                              <button
                                type="button" key={o.v}
                                onClick={() => setCollectionType(o.v)}
                                className={`text-left rounded-2xl p-4 border-2 transition-all ${
                                  active ? "border-secondary bg-accent" : "border-border bg-card hover:border-secondary/50"
                                }`}
                              >
                                <Icon className={`h-5 w-5 ${active ? "text-secondary" : "text-muted-foreground"}`} />
                                <div className="mt-2 font-semibold text-foreground text-sm">{o.v}</div>
                                <div className="text-xs text-muted-foreground">{o.sub}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <Field label="Appointment Date" error={errors.date}>
                        <div className="relative">
                          <input
                            type="date" value={date} min={todayStr()}
                            onChange={(e) => setDate(e.target.value)}
                            className="select-base pr-10"
                          />
                          <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </Field>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Time Slot</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {TIME_SLOTS.map((t) => {
                            const active = timeSlot === t;
                            const selectedDateAvailability = date ? (slotAvailability[date] ?? getDefaultAvailability()) : getDefaultAvailability();
                            const available = selectedDateAvailability[t] ?? true;
                            return (
                              <button
                                key={t} type="button"
                                onClick={() => available && setTimeSlot(t)}
                                disabled={!available}
                                className={`rounded-full px-3 h-11 text-sm font-medium border-2 transition-all ${
                                  !available ? "bg-muted/10 text-muted-foreground border-border cursor-not-allowed" : active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-secondary"
                                }`}
                              >{t}</button>
                            );
                          })}
                        </div>
                        {date && Object.values(slotAvailability[date] ?? {}).some((available) => available === false) && (
                          <p className="mt-2 text-xs text-muted-foreground">Some slots are currently locked for the selected date. Please choose another slot or date.</p>
                        )}
                        {errors.timeSlot && <p className="mt-2 text-xs text-destructive">{errors.timeSlot}</p>}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Full Name *" error={errors.fullName}>
                          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="select-base" placeholder="John Doe" />
                        </Field>
                        <Field label="Place / City *" error={errors.place}>
                          <input value={place} onChange={(e) => setPlace(e.target.value)} className="select-base" placeholder="Mumbai" />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Mobile Number *" error={errors.mobile}>
                          <input
                            type="tel" inputMode="numeric" maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="select-base" placeholder="9876543210"
                          />
                        </Field>
                        <Field label="Email ID" error={errors.email}>
                          <input
                            type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="select-base"
                            placeholder="Optional — for digital report delivery"
                          />
                        </Field>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox" checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                        />
                        <span className="text-sm text-foreground">
                          I agree to be contacted regarding my appointment.
                        </span>
                      </label>
                      {errors.agree && <p className="text-xs text-destructive -mt-3">{errors.agree}</p>}
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between">
                    <button
                      onClick={back} disabled={step === 1}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    {step < 3 ? (
                      <button
                        onClick={next}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-6 h-11 font-semibold hover:bg-secondary transition-colors shadow-card"
                      >
                        Continue <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={submit} disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 h-11 font-semibold hover:bg-secondary transition-colors shadow-card disabled:opacity-70"
                      >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm Appointment
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .select-base {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--color-border);
          background: var(--color-card);
          color: var(--color-foreground);
          padding: 0 0.875rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .select-base:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-secondary) 18%, transparent);
        }
      `}</style>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
