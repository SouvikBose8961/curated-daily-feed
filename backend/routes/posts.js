const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// create
router.post('/', async (req, res) => {
  try {
    const p = new Post(req.body);
    await p.save();
    res.json(p);
  } catch(e){ res.status(500).json({error:e.message}); }
});

// list
router.get('/', async (req, res) => {
  const list = await Post.find().sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

// vote
router.post('/:id/vote', async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({error:'Not found'});
    if(type === 'up') p.upvotes++;
    else if(type === 'down') p.downvotes++;
    await p.save();
    res.json(p);
  } catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = router;
