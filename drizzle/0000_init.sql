CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "display_name" varchar(80) NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "expires_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "guestbook_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "display_name" varchar(80) NOT NULL,
  "body" text NOT NULL,
  "session_id" uuid,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(120) NOT NULL,
  "email" varchar(254) NOT NULL,
  "message" text NOT NULL,
  "ip_hash" varchar(64),
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "request_metrics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "route" varchar(160) NOT NULL,
  "method" varchar(16) NOT NULL,
  "status" integer NOT NULL,
  "latency_ms" integer NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE "guestbook_entries"
  ADD CONSTRAINT "guestbook_entries_session_id_sessions_id_fk"
  FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
  ON DELETE no action ON UPDATE no action;
