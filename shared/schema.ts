import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  storageUsed: integer("storage_used").default(0).notNull(),
  plan: text("plan").default("free").notNull(),
  aiCreditsUsed: integer("ai_credits_used").default(0).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  htmlContent: text("html_content"),
  cssContent: text("css_content"),
  jsContent: text("js_content"),
  lastModified: text("last_modified").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  domain: text("domain"),
});

export const storageItems = pgTable("storage_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  lastModified: text("last_modified").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  plan: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebsiteSchema = createInsertSchema(websites).omit({
  id: true,
  lastModified: true,
});

export const insertStorageItemSchema = createInsertSchema(storageItems).omit({
  id: true,
  lastModified: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type InsertStorageItem = z.infer<typeof insertStorageItemSchema>;
export type User = typeof users.$inferSelect;
export type Website = typeof websites.$inferSelect;
export type StorageItem = typeof storageItems.$inferSelect;

export const PlanLimits = {
  free: {
    storage: 15 * 1024 * 1024 * 1024, // 15GB in bytes
    aiUsage: 10,
    domains: 0,
  },
  basic: {
    storage: 100 * 1024 * 1024 * 1024, // 100GB in bytes
    aiUsage: 50,
    domains: 1,
  },
  pro: {
    storage: 4 * 1024 * 1024 * 1024 * 1024, // 4TB in bytes
    aiUsage: Infinity,
    domains: 2,
  },
};
