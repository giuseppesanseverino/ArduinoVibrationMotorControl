const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

let ARDUINO_IP = ''; // keep editable or read from config
app.use(express.json());

// Serve frontend from ../public folder
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to trigger vibration pattern 1
app.get('/vibrate/pattern1', async (req, res) => {
  try {
    await axios.get(`http://${ARDUINO_IP}/VP1=ON`);
    res.json({ status: 'Pattern 1 triggered' });
  } catch (err) {
    console.error('Arduino error:', err.message);
    res.status(500).json({ error: 'Failed to trigger pattern 1: ' + err.message });
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

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});