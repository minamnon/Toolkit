import { 
  distillationOperations, 
  containerClassifications,
  type DistillationOperation, 
  type ContainerClassification,
  type InsertDistillationOperation, 
  type InsertContainerClassification 
} from "@shared/schema";

export interface IStorage {
  // Distillation operations
  createDistillationOperation(operation: InsertDistillationOperation): Promise<DistillationOperation>;
  getDistillationOperations(): Promise<DistillationOperation[]>;
  
  // Container classifications
  createContainerClassification(classification: InsertContainerClassification): Promise<ContainerClassification>;
  getContainerClassifications(): Promise<ContainerClassification[]>;
}

export class MemStorage implements IStorage {
  private distillationOps: Map<number, DistillationOperation>;
  private containerClassifs: Map<number, ContainerClassification>;
  private currentDistillationId: number;
  private currentClassificationId: number;

  constructor() {
    this.distillationOps = new Map();
    this.containerClassifs = new Map();
    this.currentDistillationId = 1;
    this.currentClassificationId = 1;
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

  async createContainerClassification(insertClassification: InsertContainerClassification): Promise<ContainerClassification> {
    const id = this.currentClassificationId++;
    const classification: ContainerClassification = { ...insertClassification, id };
    this.containerClassifs.set(id, classification);
    return classification;
  }

  async getContainerClassifications(): Promise<ContainerClassification[]> {
    return Array.from(this.containerClassifs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const storage = new MemStorage();
