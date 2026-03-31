const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const SurveySchema = new mongoose.Schema({
  q1a: String,
  q1b: String,
  q1c: String,
  q2a: String,
  q2b: String,
  q2c: Array,
  q2d: String,
  q3a: String,
  q3b: Array,
  q3c: Array,
  q4a: String,
  q4b: Array,
  q4c: Array,
  q4d: String,
  q5a: Array,
  q5b: Array,
  q5c: String,
  q6a: String,
  q6b: String,
  q6c: String,
  q6d: String,
  q6e: String,
  q6f: String,
  timestamp: String,
  submittedAt: { type: Date, default: Date.now }
}, { strict: false });

const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(201).json({ message: 'Saved successfully!' });
  } catch (err) {
    console.error('Survey submit error:', err);
    res.status(500).json({ error: err.message });
  }
};
