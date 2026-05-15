import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [totalApplications] = await db.select({ count: sql<number>`count(*)` }).from(schema.applications);
    const [newApplications] = await db.select({ count: sql<number>`count(*)` }).from(schema.applications).where(eq(schema.applications.status, "new"));
    const [totalContacts] = await db.select({ count: sql<number>`count(*)` }).from(schema.contacts);
    const [totalUniversities] = await db.select({ count: sql<number>`count(*)` }).from(schema.universities);
    const [totalTestimonials] = await db.select({ count: sql<number>`count(*)` }).from(schema.testimonials);

    return {
      totalApplications: Number(totalApplications?.count ?? 0),
      newApplications: Number(newApplications?.count ?? 0),
      totalContacts: Number(totalContacts?.count ?? 0),
      totalUniversities: Number(totalUniversities?.count ?? 0),
      totalTestimonials: Number(totalTestimonials?.count ?? 0),
    };
  }),

  recentApplications: adminQuery
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 5;
      return db
        .select()
        .from(schema.applications)
        .orderBy(desc(schema.applications.createdAt))
        .limit(limit);
    }),

  recentContacts: adminQuery
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 5;
      return db
        .select()
        .from(schema.contacts)
        .orderBy(desc(schema.contacts.createdAt))
        .limit(limit);
    }),
});
