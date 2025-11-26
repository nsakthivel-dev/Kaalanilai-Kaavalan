import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeCropImage, getChatResponse } from "./openai";
import { insertDiagnosisSchema, insertChatMessageSchema, insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Crops endpoints
  app.get("/api/crops", async (_req, res) => {
    try {
      const crops = await storage.getCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crops" });
    }
  });

  app.get("/api/crops/:id", async (req, res) => {
    try {
      const crop = await storage.getCrop(req.params.id);
      if (!crop) {
        return res.status(404).json({ error: "Crop not found" });
      }
      res.json(crop);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crop" });
    }
  });

  // Diagnoses endpoints
  app.get("/api/diagnoses", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const diagnoses = await storage.getDiagnoses(userId);
      res.json(diagnoses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch diagnoses" });
    }
  });

  app.post("/api/diagnoses", async (req, res) => {
    try {
      const validatedData = insertDiagnosisSchema.parse(req.body);
      
      let aiResults;
      if (validatedData.imageUrl && validatedData.cropId) {
        const crop = await storage.getCrop(validatedData.cropId);
        if (!crop) {
          return res.status(400).json({ error: "Invalid crop ID" });
        }

        const base64Image = validatedData.imageUrl.split(",")[1] || validatedData.imageUrl;
        const symptoms = validatedData.symptoms || [];
        
        if (!process.env.OPENAI_API_KEY) {
          aiResults = {
            diseases: [
              { name: "AI Analysis Unavailable", confidence: 0, riskLevel: "medium" }
            ],
            analysis: "AI image analysis is currently unavailable. Please configure OPENAI_API_KEY to enable this feature.",
            recommendations: "Please consult with local agricultural experts for crop diagnosis. Visit the Experts page to find verified agricultural extension officers in your area."
          };
        } else {
          aiResults = await analyzeCropImage(base64Image, crop.name, symptoms);
        }
        
        const diagnosisData = {
          ...validatedData,
          results: aiResults.diseases,
          aiAnalysis: aiResults.analysis,
          recommendations: aiResults.recommendations,
        };

        const diagnosis = await storage.createDiagnosis(diagnosisData);
        res.json(diagnosis);
      } else {
        const diagnosis = await storage.createDiagnosis(validatedData);
        res.json(diagnosis);
      }
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      res.status(400).json({ error: error.message || "Failed to create diagnosis" });
    }
  });

  // Diseases endpoints
  app.get("/api/diseases", async (req, res) => {
    try {
      const cropId = req.query.cropId as string | undefined;
      const diseases = cropId 
        ? await storage.getDiseasesByCrop(cropId)
        : await storage.getDiseases();
      res.json(diseases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch diseases" });
    }
  });

  // Experts endpoints
  app.get("/api/experts", async (req, res) => {
    try {
      const { district, specialization, languages } = req.query;
      
      if (district || specialization || languages) {
        const filters = {
          district: district as string,
          specialization: specialization as string,
          languages: languages as string,
        };
        const experts = await storage.getExpertsByFilters(filters);
        res.json(experts);
      } else {
        const experts = await storage.getExperts();
        res.json(experts);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experts" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const alerts = activeOnly 
        ? await storage.getActiveAlerts()
        : await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      const userMessage = await storage.createChatMessage(validatedData);
      
      if (validatedData.role === "user") {
        const chatHistory = await storage.getChatMessages(validatedData.userId || "guest");
        const messages = chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        let aiResponse;
        if (!process.env.OPENAI_API_KEY) {
          aiResponse = "AI chat is currently unavailable. Please configure OPENAI_API_KEY to enable this feature. In the meantime, please visit the Experts page to connect with agricultural specialists who can help with your farming questions.";
        } else {
          aiResponse = await getChatResponse(messages, validatedData.metadata);
        }
        
        const assistantMessage = await storage.createChatMessage({
          userId: validatedData.userId,
          role: "assistant",
          content: aiResponse,
          metadata: validatedData.metadata,
        });

        res.json({
          userMessage,
          assistantMessage,
        });
      } else {
        res.json(userMessage);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(400).json({ error: error.message || "Failed to send message" });
    }
  });

  // Feedback endpoints
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to submit feedback" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
