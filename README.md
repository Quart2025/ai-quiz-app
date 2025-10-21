# AI Quiz Generator

A simple web application that generates multiple-choice quizzes on any topic using Google's Gemini AI.

## Features

- Enter any topic and get 5 AI-generated multiple-choice questions
- Interactive quiz interface with radio button selections
- Instant feedback on correct/incorrect answers
- Score tracking

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Google Gemini API key

## Setup

1. **Clone or download the project**
```bash
   git clone <your-repo-url>
   cd ai-quiz-app
```

2. **Install dependencies**
```bash
   npm install
```

3. **Get a Google Gemini API key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

4. **Create a `.env` file**
   
   In the root of your project, create a file named `.env` and add:
```
   GOOGLE_API_KEY=your_api_key_here
```
   
   Replace `your_api_key_here` with your actual API key.
   
   **Important:** No quotes, no spaces around the `=` sign.

## Running the Application

1. **Start the server**
```bash
   npx ts-node server.ts
```

2. **Open your browser**
   
   Navigate to: `http://localhost:3000`

3. **Generate a quiz**
   - Enter a topic in the input field (e.g., "Python", "World War II", "Photosynthesis")
   - Press Enter or click "Generate Quiz"
   - Wait for the AI to generate your questions
   - Select your answers and click "Submit Quiz" to see your score

## Project Structure
```
ai-quiz-app/
├── server.ts          # Express server and API endpoint
├── index.html         # Frontend quiz interface
├── .env              # Your API key (create this yourself)
├── package.json      # Project dependencies
└── README.md         # This file
```

## Dependencies

- `express` - Web server framework
- `dotenv` - Environment variable management
- `@google/generative-ai` - Google Gemini AI SDK
- `typescript` - TypeScript support
- `ts-node` - Run TypeScript directly

## Troubleshooting

**Server won't start:**
- Make sure your `.env` file exists and contains your API key
- Check that all dependencies are installed (`npm install`)

**Quiz generation fails:**
- Verify your API key is valid
- Check your internet connection
- Make sure you're using a supported model (`gemini-2.0-flash-exp`)

**"Please answer all questions" alert:**
- You must select an answer for all 5 questions before submitting
