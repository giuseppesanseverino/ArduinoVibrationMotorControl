const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Insert Arduino's IP address here:
const ARDUINO_IP = '192.168.1.100'; 
// CORS setup
app.use(cors({
  origin: 'http://127.0.0.1:5500 ', // Adjust this to your frontend's origin
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

// Endpoint to trigger vibration pattern 3
app.get('/vibrate/pattern3', async (req, res) => {
  try {
    await axios.get(`http://${ARDUINO_IP}/VP3=ON`);
    res.json({ status: 'Pattern 3 triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger pattern 3' });
  }
});

// Endpoint to trigger vibration pattern 4
app.get('/vibrate/pattern4', async (req, res) => {
  try {
    await axios.get(`http://${ARDUINO_IP}/VP4=ON`);
    res.json({ status: 'Pattern 4 triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger pattern 4' });
  }
});

// Endpoint to trigger custom vibration pattern
app.post('/vibrate/custom', async (req, res) => {
  try {
    await axios.post(`http://${ARDUINO_IP}/vibrate/custom`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json({ status: 'Custom pattern triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger custom pattern' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});