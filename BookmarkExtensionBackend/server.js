const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

console.log("Loaded GROQ API key:", process.env.GROQ_API_KEY ? " Loaded" : " Missing");


const app = express();
app.use(cors());
app.use(express.json());

const CATEGORIES = ["Work", "News", "Shopping", "Social Media", "Entertainment", "Education", "Uncategorized"];

app.post("/categorize", async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Missing title or url" });
  }

  const systemPrompt = `You are an assistant that classifies bookmarks based on title and URL. 
Only respond with one of the following categories:
${CATEGORIES.join(", ")}. 
If none match, respond with "Uncategorized".`;

  const userPrompt = `Title: ${title}\nURL: ${url}\nCategory:`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content.trim();
    const category = CATEGORIES.includes(aiReply) ? aiReply : "Uncategorized";

    res.json({ category });
  } catch (error) {
    console.error("Error calling GROQ API:", error.response?.data || error.message);
    res.status(500).json({ error: "GROQ API call failed" });
}

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Smart Bookmark Proxy running on port ${PORT}`);
});
