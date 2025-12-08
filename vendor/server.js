const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

let ARDUINO_IP = process.env.ARDUINO_IP || null;
const CONFIG_PATH = path.join(__dirname, 'config.json');

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH));
    ARDUINO_IP = cfg.ARDUINO_IP || ARDUINO_IP;
  }
}
function saveConfig() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ARDUINO_IP }));
}

loadConfig();

app.use(express.json());

const isPackaged = process.env.IS_PACKAGED === 'true';

// Serve frontend from /public folder
const publicPath = isPackaged 
  ? path.join(process.env.RESOURCES_PATH, 'app.asar.unpacked', 'public') 
  : path.join(__dirname, 'public');  // Assuming public is now in vendor/
app.use(express.static(publicPath));

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

// Arduino configuration endpoints
// get config (IP)
app.get('/api/config', (req, res) => {
  res.json({ ARDUINO_IP });
});

// set config (IP)
app.post('/api/config', (req, res) => {
  const { ARDUINO_IP: newIP } = req.body;
  if (newIP && typeof newIP === 'string') {
    ARDUINO_IP = newIP.trim();
    saveConfig();
    res.json({ status: 'ok', ARDUINO_IP });
  } else {
    res.status(400).json({ error: 'Invalid IP' });
  }
});

// test connectivity
app.get('/api/test', async (req, res) => {
  if (!ARDUINO_IP) return res.status(400).json({ error: 'No Arduino IP configured' });
  try {
    await axios.get(`http://${ARDUINO_IP}/ping`); // implement /ping Test Case on Arduino - Done
    res.json({ status: 'ok', ARDUINO_IP });
  } catch (err) {
    res.status(500).json({ error: 'Cannot reach Arduino: ' + (err.message || err) });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});