import { 
  distillationOperations, 
  mixingCalculations, 
  type DistillationOperation, 
  type MixingCalculation, 
  type InsertDistillationOperation, 
  type InsertMixingCalculation 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Distillation operations
  createDistillationOperation(operation: InsertDistillationOperation): Promise<DistillationOperation>;
  getDistillationOperations(): Promise<DistillationOperation[]>;
  
  // Mixing calculations
  createMixingCalculation(calculation: InsertMixingCalculation): Promise<MixingCalculation>;
  getMixingCalculations(): Promise<MixingCalculation[]>;
  updateMixingCalculation(id: number, calculation: Partial<InsertMixingCalculation>): Promise<MixingCalculation>;
  deleteMixingCalculation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createDistillationOperation(operation: InsertDistillationOperation): Promise<DistillationOperation> {
    const [result] = await db.insert(distillationOperations).values(operation).returning();
    return result;
  }

  async getDistillationOperations(): Promise<DistillationOperation[]> {
    return await db.select().from(distillationOperations).orderBy(distillationOperations.id);
  }

  async createMixingCalculation(calculation: InsertMixingCalculation): Promise<MixingCalculation> {
    const [result] = await db.insert(mixingCalculations).values(calculation).returning();
    return result;
  }

  async getMixingCalculations(): Promise<MixingCalculation[]> {
    return await db.select().from(mixingCalculations).orderBy(mixingCalculations.id);
  }

  async updateMixingCalculation(id: number, updateData: Partial<InsertMixingCalculation>): Promise<MixingCalculation> {
    const [result] = await db.update(mixingCalculations).set(updateData).where(eq(mixingCalculations.id, id)).returning();
    if (!result) {
      throw new Error("Mixing calculation not found");
    }
    return result;
  }

  async deleteMixingCalculation(id: number): Promise<void> {
    await db.delete(mixingCalculations).where(eq(mixingCalculations.id, id));
  }
}

export const storage = new DatabaseStorage();