const characters = [
  { name: 'Astra', image: 'assets/characters/astra.png' },
  { name: 'Breach', image: 'assets/characters/breach.png' },
  { name: 'Brimstone', image: 'assets/characters/brimstone.png' },
  { name: 'Chamber', image: 'assets/characters/chamber.png' },
  { name: 'Clove', image: 'assets/characters/clove.png' },
  { name: 'Cypher', image: 'assets/characters/cypher.png' },
  { name: 'Deadlock', image: 'assets/characters/deadlock.png' },
  { name: 'Fade', image: 'assets/characters/fade.png' },
  { name: 'Gekko', image: 'assets/characters/gekko.png' },
  { name: 'Harbor', image: 'assets/characters/harbor.png' },
  { name: 'Iso', image: 'assets/characters/iso.png' },
  { name: 'Jett', image: 'assets/characters/jett.png' },
  { name: 'Kayo', image: 'assets/characters/kayo.png' },
  { name: 'Killjoy', image: 'assets/characters/killjoy.png' },
  { name: 'Neon', image: 'assets/characters/neon.png' },
  { name: 'Omen', image: 'assets/characters/omen.png' },
  { name: 'Phoenix', image: 'assets/characters/phoenix.png' },
  { name: 'Raze', image: 'assets/characters/raze.png' },
  { name: 'Reyna', image: 'assets/characters/reyna.png' },
  { name: 'Sage', image: 'assets/characters/sage.png' },
  { name: 'Skye', image: 'assets/characters/skye.png' },
  { name: 'Sova', image: 'assets/characters/sova.png' },
  { name: 'Viper', image: 'assets/characters/viper.png' },
  { name: 'Vyse', image: 'assets/characters/vyse.png' },
  { name: 'Yoru', image: 'assets/characters/yoru.png' },
];

let isBanMode = false;
const bannedAgents = new Set();

function toggleBanMode() {
    isBanMode = !isBanMode;
    const banButton = document.getElementById('banButton');
    banButton.classList.toggle('active');
    agentsGrid.classList.toggle('ban-mode');

    // Update button text with current ban count
    banButton.textContent = isBanMode ? `BAN MODE (${bannedAgents.size})` : 'BAN MODE';
}

function resetBans() {
    bannedAgents.clear();
    agentCards.forEach(card => {
        card.classList.remove('banned');
        card.style.animation = 'unbanPulse 0.3s ease-out';
        setTimeout(() => card.style.animation = '', 300);
    });
    randomButton.disabled = false;
    document.getElementById('banButton').textContent = 'BAN MODE';
}

function handleAgentClick(card, index) {
    if (!isBanMode) return;

    if (bannedAgents.has(index)) {
        bannedAgents.delete(index);
        card.classList.remove('banned');
        card.style.animation = 'unbanPulse 0.3s ease-out';
        setTimeout(() => card.style.animation = '', 300);
    } else {
        bannedAgents.add(index);
        card.classList.add('banned');
        card.style.animation = 'banPulse 0.3s ease-out';
        setTimeout(() => card.style.animation = '', 300);
    }

    // Update button state and banned count
    const bannedCount = bannedAgents.size;
    randomButton.disabled = bannedCount >= characters.length;

    // Update ban button text
    const banButton = document.getElementById('banButton');
    banButton.textContent = `BAN MODE (${bannedCount})`;
}

const randomButton = document.getElementById('randomButton');
const agentImage = document.getElementById('agentImage');
const agentName = document.getElementById('agentName');
const agentsGrid = document.getElementById('agentsGrid');
let currentHighlight = -1;
let isSelecting = false;
let selectedAgentIndex = -1;

characters.forEach((agent, index) => {
    const agentCard = document.createElement('div');
    agentCard.className = 'agent-card';
    agentCard.innerHTML = `
        <img src="${agent.image}" alt="${agent.name}">
        <div class="agent-name">${agent.name}</div>
    `;
    agentCard.addEventListener('click', () => handleAgentClick(agentCard, index));
    agentsGrid.appendChild(agentCard);
});

const agentCards = document.querySelectorAll('.agent-card');

function updateSelectedAgent(index) {
    agentCards.forEach(card => card.classList.remove('active'));
    agentCards[index].classList.add('active');
    agentsGrid.classList.remove('selecting');
    agentsGrid.classList.add('has-selection');

    agentName.textContent = characters[index].name;
    agentName.style.opacity = '1';
    selectedAgentIndex = index;
}

function highlightAgent(index) {
    agentCards.forEach(card => card.classList.remove('active'));
    agentCards[index].classList.add('active');
    agentsGrid.classList.add('has-selection');
}

function pickRandomAgent() {
    if (isSelecting) return;

    const availableAgents = [];
    characters.forEach((_, index) => {
        if (!bannedAgents.has(index)) {
            availableAgents.push(index);
        }
    });

    if (availableAgents.length === 0) return;

    randomButton.disabled = true;
    isSelecting = true;
    agentsGrid.classList.remove('has-selection');
    agentsGrid.classList.add('selecting');

    let currentIndex = 0;
    let speed = 50;
    const speedIncrease = 1.2;
    const maxSpeed = 300;
    const minCycles = 20; // Minimum number of highlights before stopping

    function cycle() {
        // Remove previous highlight
        if (currentHighlight >= 0) {
            agentCards[currentHighlight].classList.remove('active');
        }

        // Get next available agent
        do {
            currentHighlight = (currentHighlight + 1) % characters.length;
        } while (bannedAgents.has(currentHighlight));

        // Highlight current agent
        agentCards[currentHighlight].classList.add('active');
        currentIndex++;

        // Continue cycling or finish
        if (currentIndex < minCycles || speed < maxSpeed) {
            speed = Math.min(maxSpeed, speed * speedIncrease);
            setTimeout(cycle, speed);
        } else {
            // Select final agent
            const finalIndex = availableAgents[Math.floor(Math.random() * availableAgents.length)];
            setTimeout(() => {
                updateSelectedAgent(finalIndex);
                isSelecting = false;
                randomButton.disabled = false;
            }, 200);
        }
    }

    cycle();
}

randomButton.addEventListener('click', pickRandomAgent);

agentImage.style.transition = 'opacity 0.3s ease';
agentName.style.transition = 'opacity 0.3s ease';

// Add these animation keyframes to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes banPulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
    @keyframes unbanPulse {
        0% { transform: scale(0.9); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

