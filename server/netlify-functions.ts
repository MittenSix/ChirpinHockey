import express from 'express';
import { storage } from './storage.js';
import { insertWaitlistRegistrationSchema } from '../shared/schema.js';
import { z } from 'zod';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for Netlify
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API routes - inline for Netlify Functions
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

app.get("/api/waitlist/count", async (req, res) => {
  try {
    const count = await storage.getWaitlistCount();
    res.json({ count: count.toString() });
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    res.status(500).json({ message: "Failed to get waitlist count" });
  }
});

// Export handler for Netlify Functions
// Note: Install @netlify/functions and serverless-http for actual deployment
export const handler = async (event: any, context: any) => {
  // This would use serverless-http in actual deployment
  // const handler = serverless(app);
  // return handler(event, context);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'API ready for Netlify deployment' })
  };
};