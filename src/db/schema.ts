import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const guestbookEntries = pgTable("guestbook_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  body: text("body").notNull(),
  sessionId: uuid("session_id").references(() => sessions.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  message: text("message").notNull(),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const requestMetrics = pgTable("request_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  route: varchar("route", { length: 160 }).notNull(),
  method: varchar("method", { length: 16 }).notNull(),
  status: integer("status").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
