import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const testimonialRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.testimonials);
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        country: z.string().min(1),
        program: z.string().min(1),
        university: z.string().min(1),
        quote: z.string().min(1),
        rating: z.number().min(1).max(5).optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(schema.testimonials).values({
        ...input,
        rating: input.rating ?? 5,
      });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(schema.testimonials)
        .where(eq(schema.testimonials.id, input.id));
      return { success: true };
    }),
});
