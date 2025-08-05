import { waitlistRegistrations, users, type WaitlistRegistration, type InsertWaitlistRegistration, type User, type InsertUser, type ContactForm } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { airtableService } from "./airtable";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistRegistration(registration: InsertWaitlistRegistration): Promise<WaitlistRegistration>;
  getWaitlistRegistrationByEmail(email: string): Promise<WaitlistRegistration | undefined>;
  getWaitlistCount(): Promise<number>;
  createContactSubmission(data: ContactForm): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistRegistration(registration: InsertWaitlistRegistration): Promise<WaitlistRegistration> {
    const [result] = await db
      .insert(waitlistRegistrations)
      .values(registration)
      .returning();
    return result;
  }

  async getWaitlistRegistrationByEmail(email: string): Promise<WaitlistRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(waitlistRegistrations)
      .where(eq(waitlistRegistrations.email, email));
    return registration || undefined;
  }

  async getWaitlistCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(waitlistRegistrations);
    return result[0]?.count || 0;
  }

  async createContactSubmission(data: ContactForm): Promise<any> {
    // For now, just log contact submissions since we don't have a contacts table
    console.log('Contact submission:', data);
    return { success: true, message: 'Contact submission received' };
  }
}

// Airtable-based storage implementation
export class AirtableStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // User management still uses database for authentication
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // User management still uses database for authentication
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // User management still uses database for authentication
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistRegistration(registration: InsertWaitlistRegistration): Promise<WaitlistRegistration> {
    return await airtableService.createWaitlistRegistration(registration);
  }

  async getWaitlistRegistrationByEmail(email: string): Promise<WaitlistRegistration | undefined> {
    return await airtableService.getWaitlistRegistrationByEmail(email);
  }

  async getWaitlistCount(): Promise<number> {
    return await airtableService.getWaitlistCount();
  }

  async createContactSubmission(data: ContactForm): Promise<any> {
    return await airtableService.createContactSubmission(data);
  }
}

// Force Airtable storage for this application
console.log('Forcing Airtable storage');
export const storage = new AirtableStorage();
console.log('Using storage type:', storage.constructor.name);
