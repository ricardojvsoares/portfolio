import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const url = process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url.includes("sslmode=")
      ? url
      : `${url}${url.includes("?") ? "&" : "?"}sslmode=require`,
  },
});
