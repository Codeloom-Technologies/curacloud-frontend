export const DOCTOR_SPECIALIZATIONS = [
  // Primary Care
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "General Practice",
  "Geriatrics",

  // Medical Specialties
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Pulmonology",
  "Rheumatology",
  "Nephrology",
  "Hematology",

  // Surgical Specialties
  "General Surgery",
  "Orthopedic Surgery",
  "Neurosurgery",
  "Cardiothoracic Surgery",
  "Plastic Surgery",
  "Vascular Surgery",

  // Other Specialties
  "Psychiatry",
  "OB/GYN",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Urology",
  "Emergency Medicine",
  "Anesthesiology",
  "Radiology",
] as const;

export const SPECIALIZATIONS_BY_CATEGORY = {
  "Primary Care": [
    "Family Medicine",
    "Internal Medicine",
    "Pediatrics",
    "General Practice",
    "Geriatrics",
  ],
  "Medical Specialties": [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Pulmonology",
    "Rheumatology",
  ],
  "Surgical Specialties": [
    "General Surgery",
    "Orthopedic Surgery",
    "Neurosurgery",
    "Cardiothoracic Surgery",
    "Plastic Surgery",
    "Vascular Surgery",
  ],
  "Hospital & Emergency": [
    "Emergency Medicine",
    "Anesthesiology",
    "Critical Care Medicine",
  ],
  "Women's Health": ["OB/GYN", "Maternal-Fetal Medicine"],
  "Mental Health": ["Psychiatry", "Child & Adolescent Psychiatry"],
  "Diagnostic & Imaging": ["Radiology", "Pathology", "Nuclear Medicine"],
} as const;
