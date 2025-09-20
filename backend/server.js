const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const articleRoutes = require('./routes/articles');
const microcardRoutes = require('./routes/microcards');
const postRoutes = require('./routes/posts');
const imageRoutes = require('./routes/generateImage');

app.use('/api/articles', articleRoutes);
app.use('/api/microcards', microcardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/image', imageRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/curated_feed';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> {
        console.log('MongoDB connected');
        app.listen(PORT, ()=> console.log('Server running on port', PORT));
    })
    .catch(err => {
        console.error('Mongo connection error:', err.message);
        process.exit(1);
    });
