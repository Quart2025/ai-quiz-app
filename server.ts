// Import required dependencies
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file (contains API key)
dotenv.config();

// Initialize Express app and set port
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request
app.use(express.json());

// Serve static files (index.html, etc.) from current directory
app.use(express.static("."));

// Initialize Google Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// TypeScript interface defining the structure of a quiz question
// This ensures type safety when working with quiz data
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

// POST endpoint to generate quiz questions based on a topic
app.post("/api/quiz", async (req, res) => {
  // Extract topic from request body
  const { topic } = req.body;
  
  // Validate that a topic was provided
  if (!topic) return res.status(400).json({ error: "No topic provided" });

  // Construct the prompt for the AI
  // Explicitly request JSON format and specify the structure needed
  const prompt = `Create 5 multiple-choice quiz questions about "${topic}". 
Format as JSON array with no markdown formatting, just raw JSON. 
Please include the letters A, B, C, and D with a colon and space at the beginning of each answer respectively:
[{ "question": "string", "options": ["A","B","C","D"], "answer": "A" }]`;

  try {
    // Get the Gemini AI model (using the free-tier compatible model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Send prompt to AI and wait for response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Validate that AI returned content
    if (!rawText) return res.status(500).json({ error: "No text returned from API" });

    // Clean up the response text
    // Sometimes AI wraps JSON in markdown code blocks (```json ... ```)
    // This removes those markers to get pure JSON
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
    }

    // Parse the cleaned text into a JavaScript object
    let quiz: QuizQuestion[];
    try {
      quiz = JSON.parse(cleanedText);
    } catch {
      // If JSON parsing fails, log the problematic text and return error
      console.error("Failed to parse quiz JSON:", cleanedText);
      return res.status(500).json({ error: "Failed to parse quiz JSON" });
    }

    // Successfully generated quiz - send it back to the client
    res.json({ questions: quiz });
  } catch (err) {
    // Handle any errors during AI generation (network issues, API errors, etc.)
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// Start the server and listen on specified port
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));