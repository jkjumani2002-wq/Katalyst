# The Katalyst website
**Run the full version (Node + MongoDB + SQL):**
1. Install Node.js 18+ and MongoDB (or set `MONGO_URL` to a free MongoDB Atlas link).
2. `npm install` then `npm start`, then open http://localhost:3000
- SQL (SQLite file `katalyst.db`) stores Bake & Freeze stores/budget, seeded from `public/data.json`.
- MongoDB stores contact-form messages.

**GitHub Pages:** upload only the `public/` files (index.html, styles.css, app.jsx, data.json) to the repo root.
The site falls back to `data.json`; the contact form needs the Node server.
