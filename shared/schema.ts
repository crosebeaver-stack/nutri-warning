import { pgTable, text, serial, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cachedSearches = pgTable("cached_searches", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  results: jsonb("results").notNull(), // Store the processed results
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCachedSearchSchema = createInsertSchema(cachedSearches).omit({ id: true, createdAt: true });
export type CachedSearch = typeof cachedSearches.$inferSelect;
export type InsertCachedSearch = z.infer<typeof insertCachedSearchSchema>;
