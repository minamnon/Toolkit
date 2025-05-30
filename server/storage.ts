import { 
  distillationOperations, 
  mixingCalculations,
  type DistillationOperation, 
  type MixingCalculation,
  type InsertDistillationOperation, 
  type InsertMixingCalculation 
} from "@shared/schema";

export interface IStorage {
  // Distillation operations
  createDistillationOperation(operation: InsertDistillationOperation): Promise<DistillationOperation>;
  getDistillationOperations(): Promise<DistillationOperation[]>;
  
  // Mixing calculations
  createMixingCalculation(calculation: InsertMixingCalculation): Promise<MixingCalculation>;
  getMixingCalculations(): Promise<MixingCalculation[]>;
}

export class MemStorage implements IStorage {
  private distillationOps: Map<number, DistillationOperation>;
  private mixingCalcs: Map<number, MixingCalculation>;
  private currentDistillationId: number;
  private currentMixingId: number;

  constructor() {
    this.distillationOps = new Map();
    this.mixingCalcs = new Map();
    this.currentDistillationId = 1;
    this.currentMixingId = 1;
  }

  async createDistillationOperation(insertOperation: InsertDistillationOperation): Promise<DistillationOperation> {
    const id = this.currentDistillationId++;
    const operation: DistillationOperation = { 
      ...insertOperation, 
      id,
      rawAlcohol: insertOperation.rawAlcohol ?? null,
      heads: insertOperation.heads ?? null,
      tails: insertOperation.tails ?? null
    };
    this.distillationOps.set(id, operation);
    return operation;
  }

  async getDistillationOperations(): Promise<DistillationOperation[]> {
    return Array.from(this.distillationOps.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createMixingCalculation(insertCalculation: InsertMixingCalculation): Promise<MixingCalculation> {
    const id = this.currentMixingId++;
    const calculation: MixingCalculation = { ...insertCalculation, id };
    this.mixingCalcs.set(id, calculation);
    return calculation;
  }

  async getMixingCalculations(): Promise<MixingCalculation[]> {
    return Array.from(this.mixingCalcs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const storage = new MemStorage();
