import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed universities
  const uniData: schema.InsertUniversity[] = [
    {
      name: "Belarusian State University",
      location: "Minsk",
      established: 1921,
      programs: JSON.stringify(["Medicine", "Engineering", "Economics"]),
      tuition: "",
      badge: "top-ranked",
      description: "The flagship university of Belarus, offering world-class education since 1921.",
    },
    {
      name: "BNTU",
      location: "Minsk",
      established: 1920,
      programs: JSON.stringify(["Technology", "Architecture", "IT"]),
      tuition: "",
      badge: "popular",
      description: "Leading technical university with modern facilities and strong industry connections.",
    },
    {
      name: "Belarusian State Medical University",
      location: "Minsk",
      established: 1921,
      programs: JSON.stringify(["General Medicine", "Dentistry", "Pharmacy"]),
      tuition: "",
      badge: "medical",
      description: "Premier medical university with internationally recognized degrees.",
    },
    {
      name: "Grodno State Medical University",
      location: "Grodno",
      established: 1958,
      programs: JSON.stringify(["Medicine", "Pediatrics", "Nursing"]),
      tuition: "",
      description: "Excellent medical programs in a beautiful historic city.",
    },
    {
      name: "Vitebsk State Medical University",
      location: "Vitebsk",
      established: 1934,
      programs: JSON.stringify(["Medicine", "Dentistry", "Pre-med"]),
      tuition: "",
      description: "One of the oldest medical universities with rich academic traditions.",
    },
    {
      name: "Gomel State Medical University",
      location: "Gomel",
      established: 1990,
      programs: JSON.stringify(["Medicine", "Pharmacy", "Nursing"]),
      tuition: "",
      description: "Modern medical education with clinical training at top hospitals.",
    },
    {
      name: "Sukhoi State Technical University of Gomel",
      location: "Gomel",
      established: 1968,
      programs: JSON.stringify(["Engineering", "IT", "Mechanical Engineering"]),
      tuition: "",
      badge: "popular",
      description: "A leading technical university in Gomel with strong engineering and IT programs.",
    },
  ];

  for (const uni of uniData) {
    await db.insert(schema.universities).values(uni);
  }
  console.log("✓ Universities seeded");

  // Seed testimonials
  const testimonialData: schema.InsertTestimonial[] = [
    {
      name: "Chinedu Okafor",
      country: "Nigeria",
      program: "Medicine",
      university: "BSMU",
      quote: "Belarus Study Bridge made my dream come true. From admission to settling in Minsk, they handled everything professionally. Now I'm in my 3rd year of Medicine!",
      rating: 5,
    },
    {
      name: "Ama Serwaa",
      country: "Ghana",
      program: "Engineering",
      university: "BNTU",
      quote: "The visa process seemed impossible until I found this consultancy. They prepared me for everything. I'm now studying Computer Engineering in Minsk!",
      rating: 5,
    },
    {
      name: "Jean-Pierre Mutombo",
      country: "DRC",
      program: "Economics",
      university: "BSU",
      quote: "Affordable tuition, quality education, and amazing support from the team. They even helped me find part-time work legally. Highly recommended!",
      rating: 5,
    },
  ];

  for (const t of testimonialData) {
    await db.insert(schema.testimonials).values(t);
  }
  console.log("✓ Testimonials seeded");

  // Seed services
  const serviceData: schema.InsertService[] = [
    { title: "Admission Processing", description: "Complete university application support, document preparation, and admission letter acquisition.", icon: "FileText", color: "bg-blue-100 text-blue-600" },
    { title: "Visa Assistance", description: "Expert guidance on Belarus student visa requirements, documentation, and interview preparation.", icon: "Globe", color: "bg-green-100 text-green-600" },
    { title: "Travel & Pickup", description: "Airport pickup, accommodation arrangement, and city orientation upon arrival in Belarus.", icon: "Plane", color: "bg-amber-100 text-amber-600" },
    { title: "Accommodation", description: "University hostel placement or private apartment assistance with affordable options.", icon: "Home", color: "bg-purple-100 text-purple-600" },
    { title: "Language Prep", description: "Pre-departure Russian language courses and ongoing academic support during studies.", icon: "BookOpen", color: "bg-rose-100 text-rose-600" },
    { title: "Medical Insurance", description: "Mandatory health insurance setup and guidance on medical facilities in Belarus.", icon: "Heart", color: "bg-teal-100 text-teal-600" },
    { title: "Residency Permit", description: "Complete support for temporary residency registration and renewal processes.", icon: "CreditCard", color: "bg-indigo-100 text-indigo-600" },
    { title: "Career Support", description: "Internship placements, licensing exam prep (USMLE, PLAB), and career counseling.", icon: "Briefcase", color: "bg-orange-100 text-orange-600" },
  ];

  for (const s of serviceData) {
    await db.insert(schema.services).values(s);
  }
  console.log("✓ Services seeded");

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
