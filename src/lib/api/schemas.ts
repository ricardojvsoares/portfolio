import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(4000),
});

export const guestbookSchema = z.object({
  body: z.string().trim().min(2).max(280),
});

export const sessionSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
});

export const echoSchema = z.object({
  message: z.string().trim().min(1).max(500).optional(),
});
