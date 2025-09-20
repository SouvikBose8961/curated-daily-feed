const express = require('express');
const router = express.Router();
const MicroCard = require('../models/MicroCard');

// Create microcard
router.post('/', async (req, res) => {
  try {
    const mc = new MicroCard(req.body);
    await mc.save();
    res.json(mc);
  } catch(e){ res.status(500).json({error:e.message}); }
});

// Get latest microcards
router.get('/', async (req, res) => {
  const list = await MicroCard.find().sort({ date: -1 }).limit(30);
  res.json(list);
});

module.exports = router;
