export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  tests: string[];
};

export const CATEGORIES: Category[] = [
  { id: "hematology", name: "Hematology", icon: "🩸", description: "Blood cell analysis & disorders.",
    tests: ["Complete Blood Count (CBC)", "ESR", "Peripheral Smear", "Reticulocyte Count", "Hemoglobin Electrophoresis"] },
  { id: "biochemistry", name: "Biochemistry", icon: "🧪", description: "Comprehensive metabolic panels.",
    tests: ["Blood Glucose (Fasting)", "Blood Glucose (Postprandial)", "Electrolytes Panel", "Calcium", "Uric Acid"] },
  { id: "microbiology", name: "Microbiology", icon: "🦠", description: "Infection & culture testing.",
    tests: ["Urine Culture", "Blood Culture", "Throat Swab", "Stool Culture", "Wound Swab"] },
  { id: "immunology", name: "Immunology", icon: "🛡️", description: "Antibody & immune profiling.",
    tests: ["ANA", "Rheumatoid Factor", "CRP", "Anti-CCP", "Allergy Panel"] },
  { id: "hormonal", name: "Hormonal Assay", icon: "⚗️", description: "Endocrine & fertility hormones.",
    tests: ["Testosterone", "Estrogen", "Progesterone", "Prolactin", "FSH / LH"] },
  { id: "urine", name: "Urine Analysis", icon: "💧", description: "Routine urine examination.",
    tests: ["Urine Routine", "Urine Microscopy", "24h Urine Protein", "Microalbumin", "Urine pH"] },
  { id: "lipid", name: "Lipid Profile", icon: "💓", description: "Cholesterol & cardiac risk.",
    tests: ["Total Cholesterol", "HDL", "LDL", "Triglycerides", "VLDL"] },
  { id: "thyroid", name: "Thyroid Function", icon: "🧬", description: "Thyroid hormone screening.",
    tests: ["TSH", "Free T3", "Free T4", "Anti-TPO", "Thyroglobulin"] },
  { id: "diabetes", name: "Diabetes Panel", icon: "📊", description: "Diabetes monitoring tests.",
    tests: ["HbA1c", "Fasting Glucose", "OGTT", "Insulin", "C-Peptide"] },
  { id: "liver", name: "Liver Function", icon: "🫀", description: "Liver enzymes & proteins.",
    tests: ["SGOT", "SGPT", "Bilirubin Total", "Alkaline Phosphatase", "Albumin"] },
  { id: "kidney", name: "Kidney Function", icon: "🫁", description: "Renal markers & clearance.",
    tests: ["Urea", "Creatinine", "Uric Acid", "eGFR", "BUN"] },
  { id: "fullbody", name: "Full Body Checkup", icon: "✅", description: "All-in-one preventive package.",
    tests: ["Basic Health Package", "Advanced Health Package", "Executive Package", "Senior Citizen Package", "Women's Wellness"] },
];

export const TIME_SLOTS = ["7AM – 9AM", "9AM – 12PM", "12PM – 3PM", "3PM – 6PM"];

export type Booking = {
  id: number;
  fullName: string;
  place: string;
  mobile: string;
  email: string;
  categoryName: string;
  testName: string;
  collectionType: "Home Collection" | "Walk-in Visit";
  date: string;
  timeSlot: string;
  bookedAt: string;
};
