import { questions, userPreferences, users, type User, type InsertUser, type Question, type InsertQuestion, type UserPreference, type InsertUserPreference } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getAllQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // User Preferences methods
  getUserPreferences(userId: number): Promise<UserPreference[]>;
  updateUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questionsList: Map<number, Question>;
  private userPrefs: Map<number, UserPreference>;
  private userId: number;
  private questionId: number;
  private prefId: number;

  constructor() {
    this.users = new Map();
    this.questionsList = new Map();
    this.userPrefs = new Map();
    this.userId = 1;
    this.questionId = 1;
    this.prefId = 1;
    
    // Add initial questions
    this.seedQuestions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questionsList.values());
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questionsList.get(id);
  }
  
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const newQuestion: Question = { ...question, id };
    this.questionsList.set(id, newQuestion);
    return newQuestion;
  }
  
  async getUserPreferences(userId: number): Promise<UserPreference[]> {
    return Array.from(this.userPrefs.values()).filter(
      (pref) => pref.userId === userId
    );
  }
  
  async updateUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    // Check if preference already exists
    const existingPref = Array.from(this.userPrefs.values()).find(
      (pref) => pref.userId === preference.userId && pref.questionId === preference.questionId
    );
    
    if (existingPref) {
      const updatedPref: UserPreference = {
        ...existingPref,
        isFavorite: preference.isFavorite,
        isCompleted: preference.isCompleted
      };
      this.userPrefs.set(existingPref.id, updatedPref);
      return updatedPref;
    } else {
      // Create new preference
      const id = this.prefId++;
      const newPref: UserPreference = { 
        ...preference, 
        id 
      };
      this.userPrefs.set(id, newPref);
      return newPref;
    }
  }
  

    
    questionsData.forEach(question => {
      this.createQuestion(question);
    });
  }
}

export const storage = new MemStorage();
