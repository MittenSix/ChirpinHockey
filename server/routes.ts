import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistRegistrationSchema, contactFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist registration endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistRegistrationSchema.parse(req.body);
      
      // Check if email already exists
      const existingRegistration = await storage.getWaitlistRegistrationByEmail(validatedData.email);
      if (existingRegistration) {
        return res.status(400).json({ 
          message: "This email is already registered for the waitlist." 
        });
      }

      const registration = await storage.createWaitlistRegistration(validatedData);
      res.status(201).json({ 
        message: "Successfully joined the waitlist!",
        registration: {
          id: registration.id,
          fullName: registration.fullName,
          email: registration.email
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data",
          errors: error.errors 
        });
      }
      
      console.error("Error creating waitlist registration:", error);
      res.status(500).json({ 
        message: "Failed to join waitlist. Please try again." 
      });
    }
  });

  // Get waitlist count endpoint
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      res.status(500).json({ 
        message: "Failed to get waitlist count" 
      });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      const result = await storage.createContactSubmission(validatedData);
      res.status(201).json({ 
        message: "Thank you for your message! We'll get back to you soon.",
        submission: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data",
          errors: error.errors 
        });
      }
      
      console.error("Error creating contact submission:", error);
      res.status(500).json({ 
        message: "Failed to send message. Please try again." 
      });
    }
  });

  // Debug endpoint to check Airtable configuration
  app.get("/api/debug/airtable", async (req, res) => {
    res.json({
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      apiKeyPrefix: process.env.AIRTABLE_API_KEY?.substring(0, 10) || 'missing',
      baseIdPrefix: process.env.AIRTABLE_BASE_ID?.substring(0, 10) || 'missing',
      storageType: storage.constructor.name
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
