import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

async function seed() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    connectTimeout: 10000,
  });

  const db = drizzle(connection, { schema, mode: "planetscale" });

  console.log("Inserting universities...");
  await db.insert(schema.universities).values([
    { name: "Belarusian State University", location: "Minsk", established: 1921, programs: '["Medicine","Engineering","Economics"]', tuition: "$2,500/yr", badge: "top-ranked", description: "The flagship university of Belarus." },
    { name: "BNTU", location: "Minsk", established: 1920, programs: '["Technology","Architecture","IT"]', tuition: "$2,800/yr", badge: "popular", description: "Leading technical university." },
    { name: "Belarusian State Medical University", location: "Minsk", established: 1921, programs: '["General Medicine","Dentistry","Pharmacy"]', tuition: "$4,100/yr", badge: "medical", description: "Premier medical university." },
    { name: "Grodno State Medical University", location: "Grodno", established: 1958, programs: '["Medicine","Pediatrics","Nursing"]', tuition: "$3,500/yr", description: "Excellent medical programs." },
    { name: "Vitebsk State Medical University", location: "Vitebsk", established: 1934, programs: '["Medicine","Dentistry","Pre-med"]', tuition: "$3,200/yr", description: "One of the oldest medical universities." },
    { name: "Gomel State Medical University", location: "Gomel", established: 1990, programs: '["Medicine","Pharmacy","Nursing"]', tuition: "", description: "Modern medical education." },
    { name: "Sukhoi State Technical University of Gomel", location: "Gomel", established: 1968, programs: '["Engineering","IT","Mechanical Engineering"]', tuition: "", badge: "popular", description: "A leading technical university in Gomel." },
  ]);

  console.log("Inserting testimonials...");
  await db.insert(schema.testimonials).values([
    { name: "Chinedu Okafor", country: "Nigeria", program: "Medicine", university: "BSMU", quote: "Belarus Study Bridge made my dream come true. From admission to settling in Minsk, they handled everything professionally. Now I'm in my 3rd year of Medicine!", rating: 5 },
    { name: "Ama Serwaa", country: "Ghana", program: "Engineering", university: "BNTU", quote: "The visa process seemed impossible until I found this consultancy. They prepared me for everything. I'm now studying Computer Engineering in Minsk!", rating: 5 },
    { name: "Jean-Pierre Mutombo", country: "DRC", program: "Economics", university: "BSU", quote: "Affordable tuition, quality education, and amazing support from the team. They even helped me find part-time work legally. Highly recommended!", rating: 5 },
  ]);

  console.log("Inserting services...");
  await db.insert(schema.services).values([
    { title: "Admission Processing", description: "Complete university application support, document preparation, and admission letter acquisition.", icon: "FileText", color: "bg-blue-100 text-blue-600" },
    { title: "Visa Assistance", description: "Expert guidance on Belarus student visa requirements, documentation, and interview preparation.", icon: "Globe", color: "bg-emerald-100 text-emerald-600" },
    { title: "Travel & Pickup", description: "Airport pickup, accommodation arrangement, and city orientation upon arrival in Belarus.", icon: "Plane", color: "bg-amber-100 text-amber-600" },
    { title: "Accommodation", description: "University hostel placement or private apartment assistance with affordable options.", icon: "Home", color: "bg-purple-100 text-purple-600" },
    { title: "Language Prep", description: "Pre-departure Russian language courses and ongoing academic support during studies.", icon: "BookOpen", color: "bg-rose-100 text-rose-600" },
    { title: "Medical Insurance", description: "Mandatory health insurance setup and guidance on medical facilities in Belarus.", icon: "Heart", color: "bg-teal-100 text-teal-600" },
    { title: "Residency Permit", description: "Complete support for temporary residency registration and renewal processes.", icon: "CreditCard", color: "bg-indigo-100 text-indigo-600" },
    { title: "Career Support", description: "Internship placements, licensing exam prep (USMLE, PLAB), and career counseling.", icon: "Briefcase", color: "bg-orange-100 text-orange-600" },
  ]);

  await connection.end();
  console.log("Done!");
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
