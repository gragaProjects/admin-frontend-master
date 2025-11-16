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
