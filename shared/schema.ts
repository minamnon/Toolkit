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

export const containerClassifications = pgTable("container_classifications", {
  id: serial("id").primaryKey(),
  alcoholContent: real("alcohol_content").notNull(),
  containerCount: integer("container_count").notNull(),
  classification: text("classification").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertDistillationOperationSchema = createInsertSchema(distillationOperations).omit({
  id: true,
});

export const insertContainerClassificationSchema = createInsertSchema(containerClassifications).omit({
  id: true,
});

export type InsertDistillationOperation = z.infer<typeof insertDistillationOperationSchema>;
export type DistillationOperation = typeof distillationOperations.$inferSelect;

export type InsertContainerClassification = z.infer<typeof insertContainerClassificationSchema>;
export type ContainerClassification = typeof containerClassifications.$inferSelect;
