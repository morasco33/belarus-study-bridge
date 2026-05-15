import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const universityRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.universities).orderBy(desc(schema.universities.established));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(schema.universities)
        .where(eq(schema.universities.id, input.id))
        .limit(1);
      return rows[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        established: z.number(),
        programs: z.string(),
        tuition: z.string().optional(),
        badge: z.enum(["top-ranked", "popular", "medical"]).optional(),
        image: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.universities).values(input);
      return { success: true };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        established: z.number().optional(),
        programs: z.string().optional(),
        tuition: z.string().optional(),
        badge: z.enum(["top-ranked", "popular", "medical"]).optional(),
        image: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db
        .update(schema.universities)
        .set(data)
        .where(eq(schema.universities.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(schema.universities)
        .where(eq(schema.universities.id, input.id));
      return { success: true };
    }),
});
