const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Insert Arduino's IP address here:
const ARDUINO_IP = ''; 
// CORS setup
app.use(cors({
  origin: '', // Adjust this to your frontend's origin
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Endpoint to trigger vibration pattern 1
app.get('/vibrate/pattern1', async (req, res) => {
  try {
    await axios.get(`http://${ARDUINO_IP}/VP1=ON`);
    res.json({ status: 'Pattern 1 triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger pattern 1' });
  }
});

// Endpoint to trigger vibration pattern 2
app.get('/vibrate/pattern2', async (req, res) => {
  try {
    await axios.get(`http://${ARDUINO_IP}/VP2=ON`);
    res.json({ status: 'Pattern 2 triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger pattern 2' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});