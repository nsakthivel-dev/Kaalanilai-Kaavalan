import {
  type User, type InsertUser,
  type Crop, type InsertCrop,
  type Disease, type InsertDisease,
  type Diagnosis, type InsertDiagnosis,
  type Expert, type InsertExpert,
  type Alert, type InsertAlert,
  type ChatMessage, type InsertChatMessage,
  type Feedback, type InsertFeedback,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Crops
  getCrops(): Promise<Crop[]>;
  getCropsByCategory(category: string): Promise<Crop[]>;
  getCrop(id: string): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  
  // Diseases
  getDiseases(): Promise<Disease[]>;
  getDiseasesByCrop(cropId: string): Promise<Disease[]>;
  getDisease(id: string): Promise<Disease | undefined>;
  createDisease(disease: InsertDisease): Promise<Disease>;
  
  // Diagnoses
  getDiagnoses(userId?: string): Promise<Diagnosis[]>;
  getDiagnosis(id: string): Promise<Diagnosis | undefined>;
  createDiagnosis(diagnosis: InsertDiagnosis): Promise<Diagnosis>;
  
  // Experts
  getExperts(): Promise<Expert[]>;
  getExpertsByFilters(filters: { district?: string; specialization?: string; languages?: string }): Promise<Expert[]>;
  createExpert(expert: InsertExpert): Promise<Expert>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // Chat Messages
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Feedback
  getFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private crops: Map<string, Crop>;
  private diseases: Map<string, Disease>;
  private diagnoses: Map<string, Diagnosis>;
  private experts: Map<string, Expert>;
  private alerts: Map<string, Alert>;
  private chatMessages: Map<string, ChatMessage>;
  private feedbackList: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.diseases = new Map();
    this.diagnoses = new Map();
    this.experts = new Map();
    this.alerts = new Map();
    this.chatMessages = new Map();
    this.feedbackList = new Map();
    
    this.seedInitialData();
  }

  private seedInitialData() {
    const cropData: InsertCrop[] = [
      { name: "Tomato", scientificName: "Solanum lycopersicum", category: "vegetables", imageUrl: "/crops/tomato.jpg", description: "Popular vegetable crop" },
      { name: "Maize", scientificName: "Zea mays", category: "cereals", imageUrl: "/crops/maize.jpg", description: "Staple cereal crop" },
      { name: "Rice", scientificName: "Oryza sativa", category: "cereals", imageUrl: "/crops/rice.jpg", description: "Primary food crop" },
      { name: "Wheat", scientificName: "Triticum aestivum", category: "cereals", imageUrl: "/crops/wheat.jpg", description: "Essential grain crop" },
      { name: "Potato", scientificName: "Solanum tuberosum", category: "vegetables", imageUrl: "/crops/potato.jpg", description: "Tuberous crop" },
      { name: "Banana", scientificName: "Musa", category: "fruits", imageUrl: "/crops/banana.jpg", description: "Tropical fruit" },
    ];

    cropData.forEach(crop => {
      const id = randomUUID();
      this.crops.set(id, { 
        id,
        name: crop.name,
        scientificName: crop.scientificName ?? null,
        category: crop.category,
        imageUrl: crop.imageUrl ?? null,
        description: crop.description ?? null,
      });
    });

    const expertData: InsertExpert[] = [
      { name: "Dr. Rajesh Kumar", specialization: ["vegetables", "pest_management"], district: "Punjab", languages: ["English", "Hindi"], contactEmail: "rajesh@agri.gov", avatarUrl: "", verified: true },
      { name: "Mary Odhiambo", specialization: ["cereals", "disease_control"], district: "Nakuru", languages: ["English", "Swahili"], contactEmail: "mary@agri.ke", avatarUrl: "", verified: true },
      { name: "Ahmed Hassan", specialization: ["fruits", "organic_farming"], district: "Fayoum", languages: ["Arabic", "English"], contactEmail: "ahmed@agri.eg", avatarUrl: "", verified: true },
    ];

    expertData.forEach(expert => {
      const id = randomUUID();
      this.experts.set(id, { 
        id,
        name: expert.name,
        specialization: expert.specialization ?? null,
        district: expert.district ?? null,
        languages: expert.languages ?? null,
        contactEmail: expert.contactEmail ?? null,
        contactPhone: expert.contactPhone ?? null,
        avatarUrl: expert.avatarUrl ?? null,
        verified: expert.verified ?? null,
      });
    });

    const alertData: InsertAlert[] = [
      { title: "Fall Armyworm Alert", description: "Increased sightings in maize fields across the region", type: "pest_outbreak", severity: "urgent", region: "East Africa", cropIds: [] },
      { title: "Late Blight Warning", description: "Weather conditions favorable for potato late blight", type: "weather", severity: "warning", region: "South Asia", cropIds: [] },
      { title: "New Subsidy Scheme", description: "Government announces new crop insurance program", type: "scheme", severity: "info", region: "National", cropIds: [] },
    ];

    alertData.forEach(alert => {
      const id = randomUUID();
      this.alerts.set(id, { 
        id,
        type: alert.type,
        description: alert.description,
        severity: alert.severity ?? null,
        title: alert.title,
        region: alert.region ?? null,
        cropIds: alert.cropIds ?? null,
        publishedAt: new Date(),
        expiresAt: null,
      });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email ?? null,
      language: insertUser.language ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Crops
  async getCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values());
  }

  async getCropsByCategory(category: string): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(crop => crop.category === category);
  }

  async getCrop(id: string): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = randomUUID();
    const crop: Crop = { 
      id,
      name: insertCrop.name,
      scientificName: insertCrop.scientificName ?? null,
      category: insertCrop.category,
      imageUrl: insertCrop.imageUrl ?? null,
      description: insertCrop.description ?? null,
    };
    this.crops.set(id, crop);
    return crop;
  }

  // Diseases
  async getDiseases(): Promise<Disease[]> {
    return Array.from(this.diseases.values());
  }

  async getDiseasesByCrop(cropId: string): Promise<Disease[]> {
    return Array.from(this.diseases.values()).filter(disease => disease.cropId === cropId);
  }

  async getDisease(id: string): Promise<Disease | undefined> {
    return this.diseases.get(id);
  }

  async createDisease(insertDisease: InsertDisease): Promise<Disease> {
    const id = randomUUID();
    const disease: Disease = { 
      id,
      name: insertDisease.name,
      cropId: insertDisease.cropId ?? null,
      symptoms: insertDisease.symptoms ?? null,
      causes: insertDisease.causes ?? null,
      organicTreatment: insertDisease.organicTreatment ?? null,
      chemicalTreatment: insertDisease.chemicalTreatment ?? null,
      prevention: insertDisease.prevention ?? null,
      imageUrls: insertDisease.imageUrls ?? null,
      severity: insertDisease.severity ?? null,
    };
    this.diseases.set(id, disease);
    return disease;
  }

  // Diagnoses
  async getDiagnoses(userId?: string): Promise<Diagnosis[]> {
    const all = Array.from(this.diagnoses.values());
    if (userId) {
      return all.filter(d => d.userId === userId);
    }
    return all;
  }

  async getDiagnosis(id: string): Promise<Diagnosis | undefined> {
    return this.diagnoses.get(id);
  }

  async createDiagnosis(insertDiagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const id = randomUUID();
    const diagnosis: Diagnosis = { 
      id,
      imageUrl: insertDiagnosis.imageUrl ?? null,
      cropId: insertDiagnosis.cropId ?? null,
      symptoms: insertDiagnosis.symptoms ?? null,
      userId: insertDiagnosis.userId ?? null,
      results: insertDiagnosis.results ?? null,
      aiAnalysis: insertDiagnosis.aiAnalysis ?? null,
      recommendations: insertDiagnosis.recommendations ?? null,
      createdAt: new Date(),
    };
    this.diagnoses.set(id, diagnosis);
    return diagnosis;
  }

  // Experts
  async getExperts(): Promise<Expert[]> {
    return Array.from(this.experts.values());
  }

  async getExpertsByFilters(filters: { district?: string; specialization?: string; languages?: string }): Promise<Expert[]> {
    return Array.from(this.experts.values()).filter(expert => {
      if (filters.district && expert.district !== filters.district) return false;
      if (filters.specialization && !expert.specialization?.includes(filters.specialization)) return false;
      if (filters.languages && !expert.languages?.includes(filters.languages)) return false;
      return true;
    });
  }

  async createExpert(insertExpert: InsertExpert): Promise<Expert> {
    const id = randomUUID();
    const expert: Expert = { 
      id,
      name: insertExpert.name,
      specialization: insertExpert.specialization ?? null,
      district: insertExpert.district ?? null,
      languages: insertExpert.languages ?? null,
      contactEmail: insertExpert.contactEmail ?? null,
      contactPhone: insertExpert.contactPhone ?? null,
      avatarUrl: insertExpert.avatarUrl ?? null,
      verified: insertExpert.verified ?? null,
    };
    this.experts.set(id, expert);
    return expert;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => {
      const dateA = a.publishedAt?.getTime() || 0;
      const dateB = b.publishedAt?.getTime() || 0;
      return dateB - dateA;
    });
  }

  async getActiveAlerts(): Promise<Alert[]> {
    const now = new Date();
    return Array.from(this.alerts.values()).filter(alert => {
      if (!alert.expiresAt) return true;
      return alert.expiresAt > now;
    }).sort((a, b) => {
      const dateA = a.publishedAt?.getTime() || 0;
      const dateB = b.publishedAt?.getTime() || 0;
      return dateB - dateA;
    });
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      id,
      type: insertAlert.type,
      description: insertAlert.description,
      severity: insertAlert.severity ?? null,
      title: insertAlert.title,
      region: insertAlert.region ?? null,
      cropIds: insertAlert.cropIds ?? null,
      publishedAt: new Date(),
      expiresAt: insertAlert.expiresAt ?? null,
    };
    this.alerts.set(id, alert);
    return alert;
  }

  // Chat Messages
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateA - dateB;
      });
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      id,
      userId: insertMessage.userId ?? null,
      role: insertMessage.role,
      content: insertMessage.content,
      imageUrl: insertMessage.imageUrl ?? null,
      metadata: insertMessage.metadata ?? null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Feedback
  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbackList.values()).sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA;
    });
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedbackItem: Feedback = { 
      id,
      name: insertFeedback.name ?? null,
      email: insertFeedback.email ?? null,
      type: insertFeedback.type,
      message: insertFeedback.message,
      status: "pending",
      createdAt: new Date(),
    };
    this.feedbackList.set(id, feedbackItem);
    return feedbackItem;
  }
}

export const storage = new MemStorage();
