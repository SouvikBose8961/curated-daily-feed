DETAILED EXPLANATION (brief)

Files of note:
- backend/server.js: Connects to MongoDB and starts the Express server.
- backend/models: Mongoose schemas: Article, MicroCard, Post.
- backend/routes: REST endpoints for articles, microcards, posts.
- frontend/src: Minimal React app which lists microcards and articles. Clicking an article loads/generates a summary.

Design notes:
- Summarization is mocked for demo — production should call an LLM asynchronously and persist results.
- Microcards are intended to be created by editors/admins once per day (you can build a scheduler or admin UI).
- Posts support voting; in production ensure idempotent voting per user (auth + userId required).

Extensibility ideas:
- Add user accounts (JWT), preferences (topics), background worker to fetch RSS and summarize, personalization algorithm for curation, and notifications for daily microcards.

