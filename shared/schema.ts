import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const distillationOperations = pgTable("distillation_operations", {
  id: serial("id").primaryKey(),
  operatorName: text("operator_name").notNull(),
  towerType: text("tower_type").notNull(),
  operationDate: text("operation_date").notNull(),
  operationTime: text("operation_time").notNull(),
  outputVolume: real("output_volume").notNull(),
  rawAlcohol: real("raw_alcohol"),
  heads: real("heads"),
  tails: real("tails"),
  timestamp: text("timestamp").notNull(),
});

export const mixingCalculations = pgTable("mixing_calculations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  components: text("components").notNull(), // JSON string of components
  finalVolume: real("final_volume").notNull(),
  finalAlcoholContent: real("final_alcohol_content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertDistillationOperationSchema = createInsertSchema(distillationOperations).omit({
  id: true,
});

export const insertMixingCalculationSchema = createInsertSchema(mixingCalculations).omit({
  id: true,
});

export type InsertDistillationOperation = z.infer<typeof insertDistillationOperationSchema>;
export type DistillationOperation = typeof distillationOperations.$inferSelect;

export type InsertMixingCalculation = z.infer<typeof insertMixingCalculationSchema>;
export type MixingCalculation = typeof mixingCalculations.$inferSelect;
