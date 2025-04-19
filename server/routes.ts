import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  generateWebsite, 
  analyzeCanvaDesign 
} from "./ai-service";
import { 
  insertWebsiteSchema, 
  insertStorageItemSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middleware to check if user is authenticated
function isAuthenticated(req: Express.Request, res: Express.Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });
  
  // Setup authentication routes
  setupAuth(app);

  // API Routes
  // Websites
  app.get("/api/websites", isAuthenticated, async (req, res) => {
    try {
      const websites = await storage.getWebsitesByUserId(req.user!.id);
      res.json(websites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  app.get("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const website = await storage.getWebsite(parseInt(req.params.id));
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      if (website.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(website);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website" });
    }
  });

  app.post("/api/websites", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertWebsiteSchema.parse({
        ...req.body,
        userId: req.user!.id,
        lastModified: new Date().toISOString(),
      });

      const website = await storage.createWebsite(validatedData);
      res.status(201).json(website);
    } catch (error) {
      res.status(400).json({ message: "Invalid website data" });
    }
  });

  app.put("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const website = await storage.getWebsite(websiteId);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      if (website.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedWebsite = await storage.updateWebsite(websiteId, {
        ...req.body,
        lastModified: new Date().toISOString(),
      });
      
      res.json(updatedWebsite);
    } catch (error) {
      res.status(500).json({ message: "Failed to update website" });
    }
  });

  app.delete("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const website = await storage.getWebsite(websiteId);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      if (website.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteWebsite(websiteId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete website" });
    }
  });

  // Storage
  app.get("/api/storage/items", isAuthenticated, async (req, res) => {
    try {
      const path = req.query.path as string || "/";
      const items = await storage.getStorageItemsByPath(req.user!.id, path);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch storage items" });
    }
  });

  app.get("/api/storage/usage", isAuthenticated, async (req, res) => {
    try {
      const usage = await storage.getStorageUsage(req.user!.id);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch storage usage" });
    }
  });

  app.post("/api/storage/folders", isAuthenticated, async (req, res) => {
    try {
      const { path } = req.body;
      
      if (!path) {
        return res.status(400).json({ message: "Path is required" });
      }

      const folderName = path.split("/").filter(Boolean).pop();
      
      const storageItem = await storage.createStorageItem({
        userId: req.user!.id,
        name: folderName,
        path,
        type: "folder",
        size: 0,
        lastModified: new Date().toISOString(),
      });
      
      res.status(201).json(storageItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to create folder" });
    }
  });

  app.post("/api/storage/upload", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = req.user!;
      const path = req.body.path || "/";
      const file = req.file;

      // Check user's storage limit
      const { used, total } = await storage.getStorageUsage(user.id);
      if (used + file.size > total) {
        return res.status(400).json({ message: "Storage limit exceeded" });
      }

      // Create storage item
      const storageItem = await storage.createStorageItem({
        userId: user.id,
        name: file.originalname,
        path: `${path}/${file.originalname}`.replace("//", "/"),
        type: file.mimetype,
        size: file.size,
        lastModified: new Date().toISOString(),
      });

      // Update user's storage usage
      await storage.updateStorageUsed(user.id, used + file.size);

      res.status(201).json(storageItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.delete("/api/storage/items/:id", isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.getStorageItem(itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      if (item.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteStorageItem(itemId);
      
      // Update user's storage usage if it's a file
      if (item.type !== "folder") {
        const user = req.user!;
        await storage.updateStorageUsed(user.id, Math.max(0, user.storageUsed - item.size));
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // AI Generation
  app.post("/api/ai/generate-website", isAuthenticated, async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const user = req.user!;
      
      // Check AI usage limit for non-pro users
      if (user.plan !== "pro") {
        const planLimits = {
          free: 10,
          basic: 50,
        };
        
        const limit = user.plan === "basic" ? planLimits.basic : planLimits.free;
        
        if (user.aiCreditsUsed >= limit) {
          return res.status(403).json({ message: "AI generation limit reached. Please upgrade your plan." });
        }
      }

      const result = await generateWebsite(prompt);
      
      // Update AI usage
      await storage.incrementAIUsage(user.id);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate website" });
    }
  });

  app.post("/api/ai/analyze-canva", isAuthenticated, async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }

      const user = req.user!;
      
      // Check AI usage limit for non-pro users
      if (user.plan !== "pro") {
        const planLimits = {
          free: 10,
          basic: 50,
        };
        
        const limit = user.plan === "basic" ? planLimits.basic : planLimits.free;
        
        if (user.aiCreditsUsed >= limit) {
          return res.status(403).json({ message: "AI generation limit reached. Please upgrade your plan." });
        }
      }

      const result = await analyzeCanvaDesign(imageData);
      
      // Update AI usage
      await storage.incrementAIUsage(user.id);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze design" });
    }
  });

  // Payment and subscription endpoints
  app.post("/api/create-checkout-session", isAuthenticated, async (req, res) => {
    try {
      const { plan } = req.body;
      
      if (!plan || !["basic", "pro"].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }
      
      // Set price based on plan
      const prices = {
        basic: 1200, // $12.00
        pro: 2900,   // $29.00
      };
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `SPX STUDIO ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                description: plan === "basic" 
                  ? "100GB storage, standard AI features, 1 custom domain" 
                  : "4TB storage, unlimited AI, 2 custom domains, priority support",
              },
              unit_amount: prices[plan as keyof typeof prices],
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        customer_email: req.user!.email,
        client_reference_id: req.user!.id.toString(),
      });
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe session creation error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  app.post("/api/subscription/success", isAuthenticated, async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Retrieve the session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session || !session.subscription) {
        return res.status(400).json({ message: "Invalid session" });
      }
      
      // Update user's plan
      const plan = session.amount_total === 1200 ? "basic" : "pro";
      
      // Save subscription info to user profile
      const user = await storage.updateUserPlan(req.user!.id, {
        plan,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
      });
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Subscription success handling error:", error);
      res.status(500).json({ message: "Failed to process subscription" });
    }
  });
  
  app.post("/api/subscription/cancel", isAuthenticated, async (req, res) => {
    try {
      const user = req.user!;
      
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }
      
      // Cancel subscription at period end
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
