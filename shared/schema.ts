import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const waitlistRegistrations = pgTable("waitlist_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  persona: text("persona").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistRegistrationSchema = createInsertSchema(waitlistRegistrations).pick({
  fullName: true,
  email: true,
  persona: true,
}).extend({
  fullName: z.string().min(1, "Full name is required").trim(),
  email: z.string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  persona: z.string().min(1, "Persona is required"),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistRegistration = z.infer<typeof insertWaitlistRegistrationSchema>;
export type WaitlistRegistration = typeof waitlistRegistrations.$inferSelect;
export type ContactForm = z.infer<typeof contactFormSchema>;
