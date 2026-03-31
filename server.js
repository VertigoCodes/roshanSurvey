const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

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

const Survey = mongoose.model('Survey', SurveySchema);

app.post('/api/survey', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(201).json({ message: 'Saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not set. Database operations will fail.');
}

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
