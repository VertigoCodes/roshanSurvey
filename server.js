const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your HTML file to talk to this server

// Connect to MongoDB
// Use environment variables for sensitive info
const MONGO_URI = process.env.MONGO_URI; 
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to Cloud MongoDB"))
  .catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

// Define the Schema
const SurveySchema = new mongoose.Schema({
  q1a: String,
  q1b: String,
  q1c: Number,
  q2a: Number,
  openFeedback: String,
  experienceFeedback: String,
  submittedAt: { type: Date, default: Date.now }
}, { strict: false }); // 'strict: false' allows flexible fields

const Survey = mongoose.model('Survey', SurveySchema);

// POST Route to receive data
app.post('/api/survey', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(201).send({ message: "Saved successfully!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));