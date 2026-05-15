import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Try multiple locations for .env file
const possiblePaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../.env"),
  resolve(process.cwd(), "../../.env"),
  resolve(import.meta.dirname, "../../.env"),
];

let loaded = false;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    config({ path });
    loaded = true;
    break;
  }
}
if (!loaded) {
  config();
}

function getEnv(name: string, defaultValue = ""): string {
  return process.env[name] || defaultValue;
}

export const env = {
  appId: getEnv("APP_ID"),
  appSecret: getEnv("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: getEnv("DATABASE_URL"),
  kimiAuthUrl: getEnv("KIMI_AUTH_URL", "https://auth.kimi.com"),
  kimiOpenUrl: getEnv("KIMI_OPEN_URL", "https://open.kimi.com"),
  ownerUnionId: getEnv("OWNER_UNION_ID"),
  smtpHost: getEnv("SMTP_HOST", "smtp.gmail.com"),
  smtpPort: getEnv("SMTP_PORT", "587"),
  smtpUser: getEnv("SMTP_USER"),
  smtpPass: getEnv("SMTP_PASS"),
};
