import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDistillationOperationSchema, insertMixingCalculationSchema } from "@shared/schema";

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

  // Mixing calculations routes
  app.get("/api/mixing-calculations", async (req, res) => {
    try {
      const calculations = await storage.getMixingCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mixing calculations" });
    }
  });

  app.post("/api/mixing-calculations", async (req, res) => {
    try {
      const validatedData = insertMixingCalculationSchema.parse(req.body);
      const calculation = await storage.createMixingCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid mixing calculation data" });
    }
  });

  app.patch("/api/mixing-calculations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertMixingCalculationSchema.partial().parse(req.body);
      const calculation = await storage.updateMixingCalculation(id, data);
      res.json(calculation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/mixing-calculations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMixingCalculation(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
