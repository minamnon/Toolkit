import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDistillationOperationSchema, insertContainerClassificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Distillation operations routes
  app.get("/api/distillation-operations", async (req, res) => {
    try {
      const operations = await storage.getDistillationOperations();
      res.json(operations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distillation operations" });
    }
  });

  app.post("/api/distillation-operations", async (req, res) => {
    try {
      const validatedData = insertDistillationOperationSchema.parse(req.body);
      const operation = await storage.createDistillationOperation(validatedData);
      res.json(operation);
    } catch (error) {
      res.status(400).json({ message: "Invalid distillation operation data" });
    }
  });

  // Container classifications routes
  app.get("/api/container-classifications", async (req, res) => {
    try {
      const classifications = await storage.getContainerClassifications();
      res.json(classifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch container classifications" });
    }
  });

  app.post("/api/container-classifications", async (req, res) => {
    try {
      const validatedData = insertContainerClassificationSchema.parse(req.body);
      const classification = await storage.createContainerClassification(validatedData);
      res.json(classification);
    } catch (error) {
      res.status(400).json({ message: "Invalid container classification data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
