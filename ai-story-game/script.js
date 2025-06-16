let storyLog = [];
let health = 100;
let energy = 100;
let age = 14;

const statsEl = document.getElementById('stats');
const storyDiv = document.getElementById('story');
const inputField = document.getElementById('playerInput');
const form = document.getElementById('inputForm');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');

function updateStats() {
  statsEl.innerHTML = `❤️ Health: ${health} | ⚡ Energy: ${energy} | 🎂 Age: ${age}`;
}

updateStats();

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const playerInput = inputField.value.trim();
  if (!playerInput) return;

  storyLog.push(`> ${playerInput}`);
  const userEntry = document.createElement('p');
  userEntry.textContent = `> ${playerInput}`;
  storyDiv.appendChild(userEntry);
  inputField.value = '';

  const recentContext = `
You are a humorous AI narrator in a post-apocalyptic survival game.
The player is 14 years old, facing danger, scavenging, and trying to survive.
Respond narratively, no questions, no instructions. Make it immersive and fun.

Recent story:
${storyLog.slice(-3).join('\n')}
`;

  // Show loading
  const loadingEl = document.createElement('p');
  loadingEl.textContent = '[Thinking...]';
  storyDiv.appendChild(loadingEl);
  storyDiv.scrollTop = storyDiv.scrollHeight;

  try {
    const apiURL = 'https://lgwy872242.execute-api.us-west-2.amazonaws.com/default/aiTextHandler';
    console.log('Sending request to:', apiURL);

    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: recentContext })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const aiReply = data.response || '...';
    console.log('AI response:', aiReply);
    if (!aiReply) {
      throw new Error('No response from AI');
    }
    storyLog.push(aiReply);

    // Remove loading and add response
    storyDiv.removeChild(loadingEl);
    const aiEl = document.createElement('p');
    aiEl.textContent = aiReply;
    storyDiv.appendChild(aiEl);
    storyDiv.scrollTop = storyDiv.scrollHeight;

    // Simulate energy loss & aging
    energy = Math.max(0, energy - 5);
    if (storyLog.length % 4 === 0) age++;
    if (age > 25 || health <= 0) {
      const deathMsg = document.createElement('p');
      deathMsg.textContent = '☠️ You have died or aged beyond vaccine potential. Game restarts.';
      storyDiv.appendChild(deathMsg);
      health = 100;
      energy = 100;
      age = 14;
      storyLog = [];
    }
    updateStats();

  } catch (err) {
    console.error('Fetch error:', err);
    storyDiv.removeChild(loadingEl);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'An error occurred. Try again later.';
    storyDiv.appendChild(errorMsg);
  }
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem('storyLog', JSON.stringify(storyLog));
  localStorage.setItem('stats', JSON.stringify({ health, energy, age }));
});

loadBtn.addEventListener('click', () => {
  const savedLog = JSON.parse(localStorage.getItem('storyLog')) || [];
  const savedStats = JSON.parse(localStorage.getItem('stats')) || {};
  storyDiv.innerHTML = '';
  savedLog.forEach(p => {
    const el = document.createElement('p');
    el.textContent = p;
    storyDiv.appendChild(el);
  });
  storyLog = savedLog;
  health = savedStats.health || 100;
  energy = savedStats.energy || 100;
  age = savedStats.age || 14; // fixed to match initial age
  updateStats();
});
