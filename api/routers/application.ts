import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { sendApplicationNotificationEmail } from "../lib/email";

export const applicationRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Valid email is required"),
        whatsapp: z.string().min(1, "WhatsApp number is required"),
        country: z.string().min(1, "Country is required"),
        program: z.string().min(1, "Preferred program is required"),
        educationLevel: z.string().min(1, "Education level is required"),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.applications).values({
        ...input,
        status: "new",
      });

      // Send email notification (non-blocking - don't fail the request if email fails)
      sendApplicationNotificationEmail(input).catch((err) => {
        console.error("[Application] Email notification failed:", err);
      });

      return { success: true };
    }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        status: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(schema.applications.status, input.status as "new" | "reviewing" | "contacted" | "enrolled" | "rejected"));
      }
      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        conditions.push(
          sql`${schema.applications.firstName} LIKE ${searchTerm} OR ${schema.applications.lastName} LIKE ${searchTerm} OR ${schema.applications.email} LIKE ${searchTerm}`
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(schema.applications)
        .where(whereClause)
        .orderBy(desc(schema.applications.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.applications)
        .where(whereClause);

      const total = Number(countResult[0]?.count ?? 0);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(schema.applications)
        .where(eq(schema.applications.id, input.id))
        .limit(1);
      return rows[0] ?? null;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "reviewing", "contacted", "enrolled", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.applications)
        .set({ status: input.status })
        .where(eq(schema.applications.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(schema.applications)
        .where(eq(schema.applications.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const total = await db.select({ count: sql<number>`count(*)` }).from(schema.applications);
    const newCount = await db.select({ count: sql<number>`count(*)` }).from(schema.applications).where(eq(schema.applications.status, "new"));
    const reviewingCount = await db.select({ count: sql<number>`count(*)` }).from(schema.applications).where(eq(schema.applications.status, "reviewing"));
    const contactedCount = await db.select({ count: sql<number>`count(*)` }).from(schema.applications).where(eq(schema.applications.status, "contacted"));
    const enrolledCount = await db.select({ count: sql<number>`count(*)` }).from(schema.applications).where(eq(schema.applications.status, "enrolled"));

    return {
      total: Number(total[0]?.count ?? 0),
      new: Number(newCount[0]?.count ?? 0),
      reviewing: Number(reviewingCount[0]?.count ?? 0),
      contacted: Number(contactedCount[0]?.count ?? 0),
      enrolled: Number(enrolledCount[0]?.count ?? 0),
    };
  }),
});
