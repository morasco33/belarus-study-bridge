import * as jose from "jose";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "../lib/env";
import type { Context, User } from "./types";

let jwks: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks && env.kimiAuthUrl) {
    try {
      jwks = jose.createRemoteJWKSet(
        new URL(`${env.kimiAuthUrl}/api/.well-known/jwks.json`),
      );
    } catch {
      // Invalid URL, ignore
    }
  }
  return jwks;
}

export async function verifyToken(token: string): Promise<User> {
  const jwksInstance = getJwks();
  if (!jwksInstance) {
    throw new Error("Auth not configured");
  }
  const { payload } = await jose.jwtVerify(token, jwksInstance, {
    clockTolerance: 60,
  });
  if (!payload.sub) {
    throw new Error("Missing sub");
  }
  return {
    unionId: payload.sub,
    email: (payload.email as string) ?? null,
    name: (payload.name as string) ?? null,
    avatar: (payload.avatar as string) ?? null,
  };
}

export async function authenticateRequest(headers: Headers) {
  const token = headers.get("x-kimi-auth-token");
  if (!token) {
    throw new Error("No auth token");
  }
  return verifyToken(token);
}

export function auth(): MiddlewareHandler<Context> {
  return async (c, next) => {
    c.set("user", null);

    const token =
      c.req.header("x-kimi-auth-token") ??
      c.req.query("x_kimi_auth_token");

    if (!token) {
      return next();
    }

    try {
      const user = await verifyToken(token);
      c.set("user", user);
    } catch {
      // Invalid token, continue without user
    }

    return next();
  };
}

export function requireAuth(): MiddlewareHandler<Context> {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    return next();
  };
}
