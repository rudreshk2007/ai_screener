export interface SpecialistCenter {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  specialty: string;
  rating: number;
  googleMapsUrl: string;
  services: string[];
}

export const SPECIALIST_CENTERS: SpecialistCenter[] = [
  {
    id: "aiims-delhi",
    name: "AIIMS Center of Excellence for Child Development",
    city: "New Delhi",
    state: "Delhi",
    address: "Ansari Nagar East, New Delhi, Delhi 110029",
    phone: "+91 11 2658 8500",
    specialty: "Pediatric Neurology & Developmental Pediatrics",
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=AIIMS+Pediatrics+New+Delhi",
    services: ["Comprehensive Diagnostic Evaluation", "Early Intervention Unit", "Speech & OT Therapy"],
  },
  {
    id: "nimhans-bangalore",
    name: "NIMHANS Child & Adolescent Mental Health Services",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Hosur Road, Lakkasandra, Bengaluru, Karnataka 560029",
    phone: "+91 80 2699 5000",
    specialty: "Child Psychiatry & Developmental Neurosciences",
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=NIMHANS+Bangalore",
    services: ["Autism Spectrum Assessment", "Sensory Integration", "Parent Coaching"],
  },
  {
    id: "kem-mumbai",
    name: "KEM Hospital Child Development Clinic",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
    phone: "+91 22 2410 7000",
    specialty: "Pediatric Developmental Assessment",
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=KEM+Hospital+Mumbai",
    services: ["Multi-disciplinary Screening", "Occupational Therapy", "Audiology Screening"],
  },
  {
    id: "manipal-bangalore",
    name: "Manipal Hospital Child Development Centre",
    city: "Bengaluru",
    state: "Karnataka",
    address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017",
    phone: "+91 80 2502 4444",
    specialty: "Pediatric Neurological & Developmental Health",
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+HAL+Airport+Road+Bangalore",
    services: ["Developmental Milestones Evaluation", "Speech Language Therapy", "Behavioral Support"],
  },
  {
    id: "rainbow-hyderabad",
    name: "Rainbow Children's Hospital Developmental Clinic",
    city: "Hyderabad",
    state: "Telangana",
    address: "Road No 2, Banjara Hills, Hyderabad, Telangana 500034",
    phone: "+91 40 4466 5555",
    specialty: "Pediatric Development & Neurodevelopment",
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Banjara+Hills",
    services: ["Early Autism Screening", "Sensory Therapy", "Pediatric Physical Therapy"],
  },
  {
    id: "apollo-chennai",
    name: "Apollo Children's Hospital Child Guidance Clinic",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Thousand Lights West, Thousand Lights, Chennai, Tamil Nadu 600006",
    phone: "+91 44 2829 0200",
    specialty: "Child Development & Behavioral Pediatrics",
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Apollo+Childrens+Hospital+Chennai",
    services: ["Standardized Developmental Evaluations", "Speech & Audiology", "Psychological Counselling"],
  },
];
