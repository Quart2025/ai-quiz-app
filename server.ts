import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

app.post("/api/quiz", async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "No topic provided" });

  const prompt = `Create 5 multiple-choice quiz questions about "${topic}". 
Format as JSON array with no markdown formatting, just raw JSON. 
Please include the letters A, B, C, and D with a colon and space at the beginning of each answer respectively:
[{ "question": "string", "options": ["A","B","C","D"], "answer": "A" }]`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    if (!rawText) return res.status(500).json({ error: "No text returned from API" });

    // Remove markdown code blocks if present
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
    }

    let quiz: QuizQuestion[];
    try {
      quiz = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse quiz JSON:", cleanedText);
      return res.status(500).json({ error: "Failed to parse quiz JSON" });
    }

    res.json({ questions: quiz });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));