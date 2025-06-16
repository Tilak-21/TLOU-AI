let storyLog = [];
let health = 100;
let energy = 100;
let age = 14;

const statsEl = document.getElementById('stats');
const storyDiv = document.getElementById('story');
const inputField = document.getElementById('playerInput');
const form = document.getElementById('inputForm');
const introScreen = document.getElementById('introScreen');
const startBtn = document.getElementById('startBtn');
const infoToggle = document.getElementById('infoToggle');

if (infoToggle && introScreen) {
  infoToggle.addEventListener('click', () => {
    introScreen.style.display = 'flex'; // restore overlay
  });
}


function updateStats() {
  statsEl.innerHTML = `❤️ Health: ${health} | ⚡ Energy: ${energy} | 🎂 Age: ${age}`;
}

updateStats();

if (startBtn && introScreen) {
  startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';

  });
}

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
You are a horror-action narrator in a post-apocalyptic world of The Last of Us. I am playing as Ellie, a 14-year old. You are humorous, immersive, and fun. Respond narratively. Make it engaging and entertaining. Keep responses short dont exceed 5 sentences per response.
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
    if (!aiReply) throw new Error('No response from AI');
    storyLog.push(aiReply);

    // Remove loading and add AI reply
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



const infoBtn = document.getElementById('infoBtn');
if (infoBtn && introScreen) {
  infoBtn.addEventListener('click', () => {
    introScreen.style.display = 'flex';
  });
}

