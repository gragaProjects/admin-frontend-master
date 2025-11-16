// src/components/newdoctors/doctorsData.js
// Keep for compatibility
export const SPECIALIZATION_MAP = {
  'General Medicine': ['Internal Medicine','Family Medicine','Diabetology','Hypertension','Infectious Disease','Other'],
  Cardiology: ['Interventional Cardiology','Non-Invasive Cardiology','Pediatric Cardiology','Electrophysiology','Heart Failure','Other'],
  Neurology: ['Stroke Specialist','Epileptology','Neurocritical Care','Neuromuscular','Pediatric Neurology','Other'],
  Orthopedics: ['Joint Replacement','Spine Surgery','Sports Injury','Trauma & Fracture','Pediatric Orthopedics','Other'],
};
// ================================
// 🏥 Category Data (Dynamic Structure)
// ================================
export const CATEGORY_DATA = {
  Cardiology: {
    services: [
      'Consultation',
      'ECG',
      'Echocardiogram',
      'Angiogram',
      'Angioplasty',
      'Heart Surgery'
    ],
    subServices: {
      Consultation: ['Offline', 'Online', 'Teleconsultation'],
      ECG: ['Resting ECG', 'Treadmill Test', 'Holter Monitoring'],
      Echocardiogram: ['2D Echo', 'Doppler Echo', 'Stress Echo'],
      Angiogram: ['Coronary Angiogram', 'CT Angiogram'],
      Angioplasty: ['Balloon Angioplasty', 'Stent Placement'],
      HeartSurgery: ['Bypass Surgery', 'Valve Replacement']
    }
  },
  Neurology: {
    services: [
      'EEG',
      'Stroke Care',
      'Epilepsy Management',
      'Nerve Conduction Study'
    ],
    subServices: {
      EEG: ['Routine EEG', 'Video EEG', 'Sleep EEG'],
      StrokeCare: ['Rehab', 'Speech Therapy', 'Neuro Recovery'],
      EpilepsyManagement: ['Medication', 'Neuro Surgery'],
      NerveConductionStudy: ['Motor Nerve', 'Sensory Nerve']
    }
  },
  Orthopedics: {
    services: [
      'Fracture Clinic',
      'Joint Replacement',
      'Arthroscopy',
      'Sports Injury',
      'Spine Surgery'
    ],
    subServices: {
      FractureClinic: ['Casting', 'Bone Alignment'],
      JointReplacement: ['Knee Replacement', 'Hip Replacement'],
      Arthroscopy: ['ACL Repair', 'Shoulder Arthroscopy'],
      SportsInjury: ['Rehab', 'Ligament Repair'],
      SpineSurgery: ['Microdiscectomy', 'Spinal Fusion']
    }
  },
  Pediatrics: {
    services: ['Child Consultation', 'Vaccination', 'Growth Check'],
    subServices: {
      ChildConsultation: ['Routine Check', 'Fever Treatment'],
      Vaccination: ['Flu Shot', 'Hepatitis B', 'MMR'],
      GrowthCheck: ['BMI Analysis', 'Nutritional Advice']
    }
  },
  Dermatology: {
    services: [
      'Skin Checkup',
      'Acne Treatment',
      'Laser Procedures',
      'Cosmetic Consultation'
    ],
    subServices: {
      SkinCheckup: ['Mole Mapping', 'Skin Allergy Test'],
      AcneTreatment: ['Peeling', 'Medication', 'Laser Therapy'],
      LaserProcedures: ['Hair Removal', 'Scar Removal'],
      CosmeticConsultation: ['Anti-Aging', 'Botox', 'Fillers']
    }
  },
  Dentistry: {
    services: [
      'Tooth Extraction',
      'Root Canal',
      'Orthodontics',
      'Teeth Whitening'
    ],
    subServices: {
      ToothExtraction: ['Simple Extraction', 'Surgical Extraction'],
      RootCanal: ['Single Sitting', 'Multi Sitting'],
      Orthodontics: ['Braces', 'Aligners'],
      TeethWhitening: ['In-Clinic', 'Home Kit']
    }
  },
  Physiotherapy: {
    services: [
      'Joint Mobilization',
      'Pain Management',
      'Sports Rehab',
      'Neuro Rehab'
    ],
    subServices: {
      JointMobilization: ['Manual Therapy', 'Stretching'],
      PainManagement: ['Ultrasound', 'TENS', 'Hot Pack'],
      SportsRehab: ['Strength Training', 'Balance Training'],
      NeuroRehab: ['Gait Training', 'Motor Skills Rehab']
    }
  }
};

// ================================
// 👨‍⚕️ Sample Doctors (Static Data)
// ================================
export const doctorsSample = [
  {
    id: 1,
    fullName: 'Dr. Arjun Kumar',
    specialty: 'Cardiology',
    specialization: ['ECG', 'Echocardiogram'],
    consultationTypes: ['Online Consultation', 'Offline Consultation'],
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 900000001'
  },
  {
    id: 2,
    fullName: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    specialization: ['Acne Treatment', 'Laser Procedures'],
    consultationTypes: ['Offline Consultation'],
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 900000002'
  },
  {
    id: 3,
    fullName: 'Dr. Meera Narayanan',
    specialty: 'Neurology',
    specialization: ['EEG', 'Stroke Care'],
    consultationTypes: ['Online Consultation'],
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 900000003'
  },
  {
    id: 4,
    fullName: 'Dr. Suresh Reddy',
    specialty: 'Orthopedics',
    specialization: ['Fracture Clinic', 'Sports Injury'],
    consultationTypes: ['Home Visit'],
    city: 'Hyderabad',
    state: 'Telangana',
    phone: '+91 900000004'
  },
  {
    id: 5,
    fullName: 'Dr. Anitha Raj',
    specialty: 'Pediatrics',
    specialization: ['Child Consultation', 'Vaccination'],
    consultationTypes: ['Offline Consultation'],
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 900000005'
  },
  {
    id: 6,
    fullName: 'Dr. Vivek Sharma',
    specialty: 'Physiotherapy',
    specialization: ['Pain Management', 'Neuro Rehab'],
    consultationTypes: ['Online Consultation'],
    city: 'Delhi',
    state: 'Delhi',
    phone: '+91 900000006'
  },
  {
    id: 7,
    fullName: 'Dr. Kavya Lakshmi',
    specialty: 'Dentistry',
    specialization: ['Root Canal', 'Teeth Whitening'],
    consultationTypes: ['Offline Consultation'],
    city: 'Pune',
    state: 'Maharashtra',
    phone: '+91 900000007'
  }
];
// ================================
// 👨‍⚕️ Doctos Spalization
// ================================
export const DOCTOR_SPECIALTIES = {
  "General Medicine / Internal Medicine": [
    "Diabetology",
    "Hypertension Specialist",
    "Infectious Disease",
    "Critical Care Medicine"
  ],

  "Cardiology": [
    "Interventional Cardiology (Angioplasty, Stents)",
    "Non-Invasive Cardiology",
    "Pediatric Cardiology",
    "Electrophysiology (Heart Rhythm Disorders)",
    "Heart Failure Specialist"
  ],

  "Neurology": [
    "Stroke Specialist",
    "Epileptologist (Seizures)",
    "Neurocritical Care",
    "Neuromuscular Specialist",
    "Pediatric Neurology"
  ],

  "Neurosurgery": [
    "Brain Tumor Surgery",
    "Spine Surgery",
    "Vascular Neurosurgery",
    "Pediatric Neurosurgery"
  ],

  "Orthopedics": [
    "Joint Replacement (Knee, Hip)",
    "Spine Surgery",
    "Sports Injury Specialist",
    "Trauma & Fracture Specialist",
    "Pediatric Orthopedics"
  ],

  "General Surgery": [
    "Laparoscopic / Minimal Invasive Surgery",
    "Trauma Surgery",
    "Hernia Surgery",
    "Bariatric (Weight Loss) Surgery",
    "Breast Surgery"
  ],

  "Gastroenterology": [
    "Hepatology (Liver Specialist)",
    "Endoscopy Specialist",
    "Pancreatic & Biliary Disease",
    "Colorectal Specialist"
  ],

  "Surgical Gastroenterology": [
    "Liver Transplant Surgery",
    "Pancreatic Surgery",
    "Colorectal Surgery"
  ],

  "Pulmonology (Chest & Respiratory)": [
    "Asthma & Allergy Specialist",
    "Sleep Medicine",
    "Critical Respiratory Care",
    "Interventional Pulmonology"
  ],

  "Dermatology (Skin)": [
    "Cosmetic Dermatology",
    "Pediatric Dermatology",
    "Dermatosurgery (Skin Surgery, Mole Removal)",
    "Trichology (Hair Specialist)"
  ],

  "Obstetrics & Gynecology": [
    "High-Risk Pregnancy Specialist",
    "IVF / Infertility Specialist",
    "Fetal Medicine",
    "Gynecologic Oncology (Cancer)",
    "Urogynecology"
  ],

  "Pediatrics": [
    "Neonatology (Newborn Specialist/NICU)",
    "Pediatric Cardiology",
    "Pediatric Neurology",
    "Pediatric Endocrinology",
    "Pediatric Surgery"
  ],

  "Oncology (Cancer)": [
    "Medical Oncology (Chemotherapy)",
    "Surgical Oncology",
    "Radiation Oncology",
    "Pediatric Oncology",
    "Hemato-Oncology (Blood Cancer)"
  ],

  "ENT (Ear, Nose, Throat)": [
    "Head & Neck Surgery",
    "Cochlear Implant Specialist",
    "Voice & Speech Disorder",
    "Pediatric ENT"
  ],

  "Ophthalmology (Eye)": [
    "Cataract Surgery",
    "Retina Specialist",
    "Cornea & Lasik Surgery",
    "Pediatric Ophthalmology",
    "Glaucoma Specialist"
  ],

  "Urology": [
    "Andrology (Male Fertility)",
    "Endourology (Stone Removal)",
    "Kidney Transplant Surgery",
    "Female Urology"
  ],

  "Nephrology (Kidney Medicine)": [
    "Dialysis Specialist",
    "Kidney Transplant Physician",
    "Chronic Kidney Disease (CKD) Specialist"
  ],

  "Endocrinology (Hormones)": [
    "Diabetes Specialist",
    "Thyroid Specialist",
    "PCOD/PCOS in Women",
    "Adrenal & Pituitary Disorders"
  ],

  "Rheumatology (Joints & Autoimmune Diseases)": [
    "Arthritis Specialist",
    "Lupus, SLE Specialist",
    "Autoimmune Disease Expert"
  ],

  "Psychiatry (Mental Health)": [
    "Child Psychiatry",
    "Addiction Psychiatry",
    "Geriatric Psychiatry",
    "Neuropsychiatry"
  ],

  "Psychology & Counseling": [
    "Clinical Psychologist",
    "Child Psychologist",
    "Marriage / Relationship Counselor"
  ],

  "Physiotherapy & Rehabilitation": [
    "Sports Physiotherapy",
    "Neurological Rehab (Stroke Recovery)",
    "Orthopedic Rehab",
    "Cardiac Rehabilitation"
  ],

  "Dental / Dentistry": [
    "Orthodontics (Braces)",
    "Oral & Maxillofacial Surgery",
    "Prosthodontics (Dentures, Implants)",
    "Pediatric Dentistry"
  ],

  "Anesthesiology": [
    "General Anesthesia",
    "Pain Management Specialist",
    "Critical Care Anesthesia",
    "Regional / Epidural Anesthesia"
  ],

  "Radiology & Imaging": [
    "Diagnostic Radiology (X-ray, MRI, CT)",
    "Interventional Radiology",
    "Fetal Imaging"
  ],

  "Pathology / Laboratory Medicine": [
    "Clinical Pathology",
    "Histopathology / Biopsy",
    "Hematology (Blood Disorders Lab)",
    "Microbiology & Infection Testing"
  ]
};
