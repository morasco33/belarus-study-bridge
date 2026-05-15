import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { applicationRouter } from "./routers/application";
import { universityRouter } from "./routers/university";
import { testimonialRouter } from "./routers/testimonial";
import { contactRouter } from "./routers/contact";
import { serviceRouter } from "./routers/service";
import { adminRouter } from "./routers/admin";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  application: applicationRouter,
  university: universityRouter,
  testimonial: testimonialRouter,
  contact: contactRouter,
  service: serviceRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
