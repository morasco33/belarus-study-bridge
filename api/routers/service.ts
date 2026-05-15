import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

export const serviceRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.services);
  }),
});
