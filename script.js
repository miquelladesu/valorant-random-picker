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
    agentsGrid.appendChild(agentCard);
});

const agentCards = document.querySelectorAll('.agent-card');

function updateSelectedAgent(index) {
    selectedAgentIndex = index;

    agentName.style.opacity = '0';
    agentsGrid.classList.remove('selecting');

    setTimeout(() => {
        agentCards.forEach(card => card.classList.remove('active'));
        agentCards[index].classList.add('active');
        agentsGrid.classList.add('has-selection');

        setTimeout(() => {
            agentName.textContent = characters[index].name;
            agentName.style.opacity = '1';
        }, 300);
    }, 200);
}

function highlightAgent(index) {
    agentCards.forEach(card => card.classList.remove('active'));
    agentCards[index].classList.add('active');
    agentsGrid.classList.add('has-selection');
}

function pickRandomAgent() {
    if (isSelecting) return;

    randomButton.disabled = true;
    isSelecting = true;

    agentsGrid.classList.remove('has-selection');
    agentsGrid.classList.add('selecting');

    let cycles = 0;
    const maxCycles = 1;
    const totalAgents = characters.length;
    let speed = 50;
    const maxSpeed = 200;

    function cycle() {
        currentHighlight = (currentHighlight + 1) % totalAgents;
        highlightAgent(currentHighlight);

        if (currentHighlight === totalAgents - 1) {
            cycles++;
        }

        if (cycles < maxCycles) {
            speed = Math.min(maxSpeed, speed * 1.1);
            setTimeout(cycle, speed);
        } else {
            const finalIndex = Math.floor(Math.random() * totalAgents);
            setTimeout(() => {
                updateSelectedAgent(finalIndex);
                isSelecting = false;
                agentsGrid.classList.remove('selecting');
                randomButton.disabled = false;
            }, speed);
        }
    }

    cycle();
}

randomButton.addEventListener('click', pickRandomAgent);

agentImage.style.transition = 'opacity 0.3s ease';
agentName.style.transition = 'opacity 0.3s ease';

