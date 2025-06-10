async function activatePattern(pattern) {
  const status = document.getElementById('status');
  status.textContent = 'Sending...';
  let endpoint = '';
  if (pattern === 1) endpoint = '/vibrate/pattern1';
  if (pattern === 2) endpoint = '/vibrate/pattern2';
  try {
    const res = await fetch('http://localhost:3000' + endpoint);
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