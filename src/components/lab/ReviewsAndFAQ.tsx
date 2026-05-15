import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, Star } from "lucide-react";

const FAQ_DATA = [
  {
    q: "How quickly can I get my test results?",
    a: "Most routine tests are processed within 24-48 hours. Complex tests may take 3-5 days. You'll receive notifications via email and SMS as soon as results are ready.",
  },
  {
    q: "Is fasting required before blood tests?",
    a: "Fasting is required for certain tests like lipid profiles and glucose tests (typically 8-12 hours). We'll provide specific instructions when you book. Our team also confirms this when collecting samples.",
  },
  {
    q: "Are there any home collection charges?",
    a: "Home collection is completely FREE within our service radius. We collect samples from your home at your preferred time slot.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, credit/debit cards, UPI, and online transfers. Payment can be made before or after sample collection.",
  },
  {
    q: "Can I reschedule my appointment?",
    a: "Yes! You can reschedule up to 24 hours before your appointment. Contact us at +91 98765 43210 or visit our dashboard.",
  },
  {
    q: "Are my test results confidential?",
    a: "Absolutely. All test results are strictly confidential and comply with HIPAA regulations. Only you and authorized healthcare providers can access your results.",
  },
  {
    q: "What if I miss my appointment?",
    a: "If you miss your scheduled slot, please contact us within 24 hours to reschedule. No cancellation fees apply.",
  },
  {
    q: "Can I share my results with my doctor?",
    a: "Yes! You can download your digital reports, share them with your doctor, or request us to send them directly to your healthcare provider.",
  },
];

export function ReviewsAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Array<{ name: string; text: string; rating: number; date: string }>>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("medilab-reviews");
    return stored ? JSON.parse(stored) : [];
  });
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));

    const newReview = {
      name: reviewName.trim(),
      text: reviewText.trim(),
      rating: reviewRating,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("medilab-reviews", JSON.stringify(updated));

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setSubmitting(false);
  };

  return (
    <div className="bg-background py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">FAQ</span>
            <h2 className="mt-2 text-3xl md:text-5xl text-foreground font-display">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our lab tests, booking process, and services.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/30 transition-colors"
                >
                  <span className="font-semibold text-foreground">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border px-6 py-4 bg-accent/20 text-muted-foreground text-sm leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Reviews</span>
            <h2 className="mt-2 text-3xl md:text-5xl text-foreground font-display">Patient Feedback</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Share your experience or read what other patients think about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Review Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl border border-border p-8 shadow-card"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">Share Your Feedback</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 h-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="transition-colors"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewRating ? "fill-secondary text-secondary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>

            {/* Reviews List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet. Be the first to share your feedback!</p>
                </div>
              ) : (
                reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-secondary text-secondary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
