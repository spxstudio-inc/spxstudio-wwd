import { users, websites, storageItems, type User, type InsertUser, type Website, type InsertWebsite, type StorageItem, type InsertStorageItem, PlanLimits } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, and, like, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStorageUsed(userId: number, storageUsed: number): Promise<User>;
  incrementAIUsage(userId: number): Promise<User>;
  updateUserPlan(userId: number, data: { 
    plan: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }): Promise<User>;
  
  // Website operations
  getWebsite(id: number): Promise<Website | undefined>;
  getWebsitesByUserId(userId: number): Promise<Website[]>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: number, data: Partial<Website>): Promise<Website>;
  deleteWebsite(id: number): Promise<void>;
  
  // Storage operations
  getStorageItem(id: number): Promise<StorageItem | undefined>;
  getStorageItemsByPath(userId: number, path: string): Promise<StorageItem[]>;
  createStorageItem(item: InsertStorageItem): Promise<StorageItem>;
  deleteStorageItem(id: number): Promise<void>;
  getStorageUsage(userId: number): Promise<{ used: number, total: number }>;
  
  // Session store
  sessionStore: any;
}

/**
 * Database implementation of IStorage
 */
export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        storageUsed: 0,
        plan: insertUser.plan || "free",
        aiCreditsUsed: 0
      })
      .returning();
    
    return user;
  }
  
  async updateStorageUsed(userId: number, storageUsed: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ storageUsed })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }
  
  async incrementAIUsage(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ aiCreditsUsed: user.aiCreditsUsed + 1 })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async updateUserPlan(userId: number, data: { 
    plan: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  // Website operations
  async getWebsite(id: number): Promise<Website | undefined> {
    const [website] = await db.select().from(websites).where(eq(websites.id, id));
    return website;
  }
  
  async getWebsitesByUserId(userId: number): Promise<Website[]> {
    return await db.select().from(websites).where(eq(websites.userId, userId));
  }
  
  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const [website] = await db
      .insert(websites)
      .values({
        ...insertWebsite,
        lastModified: new Date().toISOString()
      })
      .returning();
    
    return website;
  }
  
  async updateWebsite(id: number, data: Partial<Website>): Promise<Website> {
    const [updatedWebsite] = await db
      .update(websites)
      .set({
        ...data,
        lastModified: new Date().toISOString()
      })
      .where(eq(websites.id, id))
      .returning();
    
    if (!updatedWebsite) {
      throw new Error("Website not found");
    }
    
    return updatedWebsite;
  }
  
  async deleteWebsite(id: number): Promise<void> {
    await db.delete(websites).where(eq(websites.id, id));
  }
  
  // Storage operations
  async getStorageItem(id: number): Promise<StorageItem | undefined> {
    const [item] = await db.select().from(storageItems).where(eq(storageItems.id, id));
    return item;
  }
  
  async getStorageItemsByPath(userId: number, path: string): Promise<StorageItem[]> {
    // Normalize path
    path = path.endsWith("/") ? path : `${path}/`;
    
    if (path === "/") {
      // Get items directly in the root
      const results = await db.select()
        .from(storageItems)
        .where(and(
          eq(storageItems.userId, userId),
          sql`(${storageItems.path} = '/' OR 
               (${storageItems.path} NOT LIKE '%/%/%' AND ${storageItems.path} NOT LIKE '/%/%'))`
        ));
      
      return results;
    }
    
    // Get items in the specified path
    const pathPattern = path + '%';
    const results = await db.select()
      .from(storageItems)
      .where(and(
        eq(storageItems.userId, userId),
        like(storageItems.path, pathPattern),
        sql`(LENGTH(REPLACE(${storageItems.path}, ${path}, '')) - LENGTH(REPLACE(REPLACE(${storageItems.path}, ${path}, ''), '/', '')) <= 1)`
      ));
    
    return results;
  }
  
  async createStorageItem(insertItem: InsertStorageItem): Promise<StorageItem> {
    const [item] = await db
      .insert(storageItems)
      .values({
        ...insertItem,
        lastModified: new Date().toISOString()
      })
      .returning();
    
    return item;
  }
  
  async deleteStorageItem(id: number): Promise<void> {
    const item = await this.getStorageItem(id);
    if (!item) return;
    
    // If it's a folder, delete all items inside it
    if (item.type === "folder") {
      // Delete all items with paths that start with this folder's path
      await db.delete(storageItems)
        .where(and(
          eq(storageItems.userId, item.userId),
          like(storageItems.path, item.path + '%')
        ));
    }
    
    // Delete the item itself
    await db.delete(storageItems).where(eq(storageItems.id, id));
  }
  
  async getStorageUsage(userId: number): Promise<{ used: number, total: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Calculate total size by summing all storage items for this user
    const result = await db
      .select({ totalSize: sql`SUM(${storageItems.size})` })
      .from(storageItems)
      .where(eq(storageItems.userId, userId));
    
    const used = Number(result[0]?.totalSize || 0);
    
    // Get the storage limit based on the user's plan
    const planLimit = PlanLimits[user.plan as keyof typeof PlanLimits].storage;
    
    return { used, total: planLimit };
  }
}

// Use in-memory storage for this example, but the DatabaseStorage is available
// export const storage = new MemStorage();

// Use database storage
export const storage = new DatabaseStorage();
