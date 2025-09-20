const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const arrayBuffer = await response.arrayBuffer(); // convert blob to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    res.json({ url: `data:image/png;base64,${base64Image}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

module.exports = router;
