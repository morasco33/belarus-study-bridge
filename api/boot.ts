console.log("[BOOT] ====== SERVER STARTING ======");
console.log("[BOOT] NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("[BOOT] PORT:", process.env.PORT || "not set");

try {
  console.log("[BOOT] Importing Hono...");
  const { Hono } = await import("hono");
  console.log("[BOOT] Hono imported OK");

  console.log("[BOOT] Importing bodyLimit...");
  const { bodyLimit } = await import("hono/body-limit");
  console.log("[BOOT] bodyLimit imported OK");

  console.log("[BOOT] Importing trpc adapter...");
  const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
  console.log("[BOOT] trpc adapter imported OK");

  console.log("[BOOT] Importing env...");
  const { env } = await import("./lib/env");
  console.log("[BOOT] env imported OK");
  console.log("[BOOT] isProduction:", env.isProduction);
  console.log("[BOOT] databaseUrl set:", !!env.databaseUrl);

  console.log("[BOOT] Importing router...");
  const { appRouter } = await import("./router");
  console.log("[BOOT] Router imported OK");

  console.log("[BOOT] Importing context...");
  const { createContext } = await import("./context");
  console.log("[BOOT] Context imported OK");

  const app = new Hono();
  app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

  // Health check
  app.get("/api/ping", (c) => c.json({ ok: true, time: Date.now() }));

  // OAuth callback
  if (env.kimiAuthUrl && env.appId && env.appSecret) {
    try {
      console.log("[BOOT] Setting up OAuth...");
      const { createOAuthCallbackHandler } = await import("./kimi/auth");
      app.get("/api/oauth/callback", createOAuthCallbackHandler());
      console.log("[BOOT] OAuth OK");
    } catch (e) {
      console.warn("[BOOT] OAuth skipped:", (e as Error).message);
    }
  } else {
    console.log("[BOOT] OAuth disabled - missing env vars");
  }

  // tRPC
  app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
  });

  app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

  // Serve frontend
  if (env.isProduction) {
    console.log("[BOOT] Production mode - serving static files");
    const { serve } = await import("@hono/node-server");
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);

    const port = parseInt(process.env.PORT || "3000");
    console.log("[BOOT] Starting on port", port);

    serve({ fetch: app.fetch, port }, () => {
      console.log(`[BOOT] Server running on port ${port}`);
    });

    // Keep process alive
    setInterval(() => {}, 60000);
  } else {
    console.log("[BOOT] Development mode - not starting server");
  }

  console.log("[BOOT] ====== BOOT COMPLETE ======");
} catch (e) {
  console.error("[BOOT] ====== FATAL ERROR ======");
  console.error("[BOOT] Message:", (e as Error).message);
  console.error("[BOOT] Stack:", (e as Error).stack);
  console.error("[BOOT] ====== SHUTTING DOWN ======");
  setInterval(() => {
    console.error("[BOOT] Process alive but failed to start");
  }, 30000);
}
