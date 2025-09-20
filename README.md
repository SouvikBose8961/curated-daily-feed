# Curated Daily Feed (MERN - Starter)

This is a compact MERN starter project demonstrating:
- Backend: Express + Mongoose (MongoDB)
- Frontend: Minimal React app (no heavy scaffolding) that fetches from backend.
- Features: Articles with mock AI summaries, ELI5 simplified text, micro-learning cards, and social posts with voting.

## Quick start (local)
1. Install Node.js (16+) and MongoDB.
2. Start MongoDB locally (e.g. `mongod`) or use Atlas and set MONGO_URI.
3. Backend:
   - cd backend
   - cp .env.example .env
   - npm install
   - npm run dev
4. Frontend:
   - cd frontend
   - npm install
   - npm start
5. Open http://localhost:3000

#It uses real OPENAI api calls to generate images and summary of articles

