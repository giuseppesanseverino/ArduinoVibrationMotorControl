async function activatePattern(pattern) {
  const status = document.getElementById('status');
  status.textContent = 'Sending...';
  let endpoint = '';
  if (pattern === 1) endpoint = '/vibrate/pattern1';
  if (pattern === 2) endpoint = '/vibrate/pattern2';
  if (pattern === 3) endpoint = '/vibrate/pattern3';
  if (pattern === 4) endpoint = '/vibrate/pattern4';
  try {
    const res = await fetch('http://localhost:3000' + endpoint);
    //const res = await fetch('http://' + arduinoIP + endpoint);
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

function addStep() {
  steps.push({ vibrate: 500, pause: 200 });
  renderSteps();
}

function renderSteps() {
  const stepsDiv = document.getElementById('steps');
  stepsDiv.innerHTML = '';
  steps.forEach((step, i) => {
    stepsDiv.innerHTML += `
      Step ${i + 1}: 
      Vibrate <input type="number" value="${step.vibrate}" onchange="updateStep(${i}, 'vibrate', this.value)"> ms,
      Pause <input type="number" value="${step.pause}" onchange="updateStep(${i}, 'pause', this.value)"> ms
      <button onclick="removeStep(${i})">Remove</button>
      <br>`;
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
  container.innerHTML = '';
  customPatterns.forEach((pattern, idx) => {
    const btn = document.createElement('button');
    btn.textContent = pattern.name;
    btn.onclick = () => sendPattern(pattern.steps);
    container.appendChild(btn);
  });
}

async function sendPattern(patternSteps) {
  const status = document.getElementById('status');
  status.textContent = 'Sending pattern...';
  try {
    const res = await fetch('http://' + arduinoIP + '/vibrate/custom', {
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

// Initial render
renderSteps();
renderCustomPatterns();