import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Chat Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Prepare messages for Groq
    const messages = [
      {
        role: "system",
        content: `You are BlogHub AI Assistant, a helpful assistant for a blog website. 
        Your role is to help users with:
        - Finding and discovering blog articles
        - Explaining different categories (Technology, Lifestyle, Business, Health, Travel, Food, Design)
        - Providing information about trending and popular posts
        - Helping with navigation and site features
        - Answering questions about blogging, content creation, and reading
        - Giving recommendations based on user interests
        
        Be friendly, concise, and helpful. Keep responses under 150 words. 
        If asked about specific posts, guide users to use the search feature or browse categories.
        You are an AI assistant, so be clear about that.`
      },
      ...chatHistory.slice(-5), // Last 5 messages for context
      {
        role: "user",
        content: message,
      },
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "openai/gpt-oss-20b", // or "llama3-70b-8192" for better quality
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't process that request.";

    res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI response",
    });
  }
});

// Get blog recommendations based on user interest
router.post("/recommend", async (req, res) => {
  try {
    const { interest, posts } = req.body;

    const prompt = `Based on user interest in "${interest}", recommend relevant blog posts from these available posts: ${posts.map(p => p.title).join(", ")}. 
    Return a JSON object with: { "recommendations": ["post title 1", "post title 2"], "reason": "why these are recommended" }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 300,
    });

    let recommendations = completion.choices[0]?.message?.content;
    
    // Parse JSON from response
    try {
      const jsonMatch = recommendations.match(/\{.*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      recommendations = { recommendations: [], reason: "Check our latest posts!" };
    }

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;