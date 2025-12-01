async function activatePattern(pattern) {
  const statusContainer = document.getElementById('status-container');
  const status = document.getElementById('status');
  
  // Show the status container
  statusContainer.classList.remove('d-none');
  
  status.textContent = 'Sending...';
  let endpoint = '';
  if (pattern === 1) endpoint = '/vibrate/pattern1';
  if (pattern === 2) endpoint = '/vibrate/pattern2';
  if (pattern === 3) endpoint = '/vibrate/pattern3';
  if (pattern === 4) endpoint = '/vibrate/pattern4';
  try {
    const res = await fetch(endpoint); // Relative URL
    const data = await res.json();
    if (res.ok) {
      status.textContent = data.status;
    } else {
      status.textContent = data.error || 'Error';
    }
  } catch (err) {
    status.textContent = 'Could not reach server.';
  }
}

let steps = [];
let customPatterns = [];


function setArduinoIP() {
  const ipInput = document.getElementById('arduino-ip');
  if (ipInput.value.trim()) {
    arduinoIP = ipInput.value.trim();
    document.getElementById('status').textContent = `Set Arduino IP to ${arduinoIP}`;
  }
}

function addStep() {
  steps.push({ vibrate: 500, pause: 200 });
  renderSteps();
}

function renderSteps() {
  const stepsDiv = document.getElementById('steps');
  stepsDiv.innerHTML = '';
  steps.forEach((step, i) => {
    stepsDiv.innerHTML += `
      <div class="mb-3 p-3 border border-secondary rounded">
        <div class="mb-2">Step ${i + 1}</div>
        <div class="row g-2 mb-2">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text bg-dark text-light border-secondary">Vibrate</span>
              <input type="number" class="form-control bg-dark text-light border-secondary" value="${step.vibrate}" onchange="updateStep(${i}, 'vibrate', this.value)">
              <span class="input-group-text bg-dark text-light border-secondary">ms</span>
            </div>
          </div>
        </div>
        <div class="row g-2">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text bg-dark text-light border-secondary">Pause</span>
              <input type="number" class="form-control bg-dark text-light border-secondary" value="${step.pause}" onchange="updateStep(${i}, 'pause', this.value)">
              <span class="input-group-text bg-dark text-light border-secondary">ms</span>
            </div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-light mt-2" onclick="removeStep(${i})">Remove</button>
      </div>
    `;
  });
}

function updateStep(i, field, value) {
  steps[i][field] = parseInt(value, 10);
}

function removeStep(i) {
  steps.splice(i, 1);
  renderSteps();
}

function savePattern() {
  const name = document.getElementById('pattern-name').value.trim();
  if (!name) {
    alert('Please enter a pattern name.');
    return;
  }
  if (steps.length === 0) {
    alert('Please add at least one step.');
    return;
  }
  customPatterns.push({ name, steps: JSON.parse(JSON.stringify(steps)) });
  renderCustomPatterns();
  // Reset builder
  document.getElementById('pattern-name').value = '';
  steps = [];
  renderSteps();
}

function renderCustomPatterns() {
  const container = document.getElementById('custom-patterns');
  const section = document.getElementById('custom-patterns-section');
  
  container.innerHTML = '';
  
  if (customPatterns.length > 0) {
    // Show the section if there are patterns
    section.classList.remove('d-none');
    
    customPatterns.forEach((pattern, idx) => {
      const btn = document.createElement('button');
      btn.textContent = pattern.name;
      btn.className = 'btn btn-outline-light mb-2 me-2';
      btn.onclick = () => sendPattern(pattern.steps);
      container.appendChild(btn);
    });
  } else {
    // Hide the section if no patterns
    section.classList.add('d-none');
  }
}

async function sendPattern(patternSteps) {
  const statusContainer = document.getElementById('status-container');
  const status = document.getElementById('status');
  
  // Show the status container
  statusContainer.classList.remove('d-none');
  
  status.textContent = 'Sending pattern...';
  try {
    const res = await fetch('/vibrate/custom', {  // Fix: Use the correct endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern: patternSteps })
    });
    const data = await res.json();
    status.textContent = data.status || 'Pattern sent!';
  } catch (err) {
    status.textContent = 'Could not reach server.';
  }
}
// Frontend logic for Arduino IP configuration
async function loadConfigFromServer() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data.ARDUINO_IP) {
      document.getElementById('detected').innerText = 'Detected: ' + data.ARDUINO_IP;
      document.getElementById('arduino-ip').value = data.ARDUINO_IP;
    }
  } catch (err) {
    console.error('Cannot load config:', err);
  }
}

async function saveIP() {
  const ip = document.getElementById('arduino-ip').value.trim();
  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ARDUINO_IP: ip })
    });
    const data = await res.json();
    document.getElementById('detected').innerText = data.ARDUINO_IP ? 'Configured: ' + data.ARDUINO_IP : 'Config saved';
  } catch (err) {
    console.error('Save IP failed', err);
  }
}

async function testConnection() {
  const el = document.getElementById('detected');
  el.innerText = 'Testing...';
  try {
    const res = await fetch('/api/test');
    const data = await res.json();
    if (res.ok) el.innerText = 'Connected: ' + data.ARDUINO_IP;
    else el.innerText = 'Not reachable';
  } catch (err) {
    el.innerText = 'Test failed';
  }
}

// On load
document.addEventListener('DOMContentLoaded', loadConfigFromServer);

// Initial render
renderSteps();
renderCustomPatterns();