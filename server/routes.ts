import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.food.search.path, async (req, res) => {
    try {
      const q = req.query.q as string;
      if (!q) {
        return res.status(400).json({ message: "Search term is required" });
      }

      const results = await storage.searchFood(q);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.food.compare.path, async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getComparison(id);
      
      if (!comparison) {
        return res.status(404).json({ message: "Food item not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      console.error("Comparison error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed the cache with some common items if empty
  const bigMac = await storage.searchFood("Big Mac");
  if (bigMac.length > 0) {
    console.log("Seeded cache with Big Mac");
  }

  return httpServer;
}
