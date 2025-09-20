const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
// Create or import an article (mock import or manual)
router.post('/', async (req, res) => {
  try {
    const { title, url, content } = req.body;
    const article = new Article({ title, url, content });
    await article.save();
    res.json(article);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get list
router.get('/', async (req, res) => {
  const q = await Article.find().sort({ createdAt: -1 }).limit(50);
  res.json(q);
});

// Get one with generated summary + simplified version (mocked)
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    // If no summary, call AI
    if (!article.summary) {
      const prompt = `
        Summarize the following article into 3 concise bullet points.
        Then, explain it in simple language as if to a 5-year-old.

        Article:
        Title: ${article.title}
        Content: ${article.content || article.title}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          },
        ],
        temperature: 0.5,
      });

      const aiText = response.choices[0].message.content;

      // Split AI response into bullets + simplified
      const parts = aiText.split('Explain it in simple language:');
      article.summary = parts[0].trim();
      article.simplified = (parts[1] || '').trim();

      await article.save();
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
