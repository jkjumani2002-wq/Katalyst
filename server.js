// Express API: SQL (SQLite) holds Bake & Freeze figures, MongoDB holds contact messages.
const express = require('express'), fs = require('fs');
const Database = require('better-sqlite3'), mongoose = require('mongoose');
const data = require('./public/data.json');
const app = express(); app.use(express.json()); app.use(express.static('public'));

const db = new Database('katalyst.db'); db.exec(fs.readFileSync('db/schema.sql', 'utf8'));
if (!db.prepare('SELECT COUNT(*) c FROM stores').get().c) {
  const s = db.prepare('INSERT INTO stores VALUES (?,?,?,?)'), b = db.prepare('INSERT INTO budget VALUES (?,?)');
  data.stores.forEach(x => s.run(x.name, x.sales, x.profit, x.sqft));
  data.budget.forEach(x => b.run(x.area, x.amount));
}
const Message = mongoose.model('Message', new mongoose.Schema({
  name: String, email: String, message: String, createdAt: { type: Date, default: Date.now } }));
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/katalyst')
  .catch(e => console.log('MongoDB offline (contact form disabled):', e.message));

app.get('/api/data', (req, res) => res.json({ ...data,
  stores: db.prepare('SELECT * FROM stores ORDER BY profit DESC').all(),
  budget: db.prepare('SELECT * FROM budget ORDER BY amount DESC').all() }));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !message) return res.status(400).json({ error: 'Check your details.' });
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database offline.' });
  await Message.create({ name, email, message }); res.json({ ok: true });
});
app.listen(process.env.PORT || 3000, () => console.log('The Katalyst: http://localhost:3000'));
