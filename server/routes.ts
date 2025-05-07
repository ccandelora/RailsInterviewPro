import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserPreferenceSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // API route to get a single question by ID
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const question = await storage.getQuestionById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      console.error(`Error fetching question with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });
  
  // API route to get user preferences
  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error(`Error fetching preferences for user ${req.params.userId}:`, error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });
  
  // API route to update user preference (favorite/completed status)
  app.post("/api/user-preferences", async (req, res) => {
    try {
      const parseResult = insertUserPreferenceSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedPreference = await storage.updateUserPreference(parseResult.data);
      res.json(updatedPreference);
    } catch (error) {
      console.error("Error updating user preference:", error);
      res.status(500).json({ message: "Failed to update user preference" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
