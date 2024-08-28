const gridSize = 10;
const resources = {
    iron: { symbol: 'Fe', color: '#A19D94' },
    copper: { symbol: 'Cu', color: '#B87333' },
};
const playerInventory = {
    iron: 0,
    copper: 0,
};
const buildings = {
    ironMine: { symbol: '⛏️', cost: { iron: 5 }, production: { iron: 1 } },
    copperMine: { symbol: '⚒️', cost: { copper: 5 }, production: { copper: 1 } },
};

let playerPosition = { x: 0, y: 0 };
let enemies = [];
let factories = [];

function initializeGrid() {
    const grid = document.getElementById('game-grid');
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            grid.appendChild(cell);
        }
    }
    placeRandomResources();
    placePlayer();
    placeEnemies();
}

function placeRandomResources() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (Math.random() < 0.3) {
            const resourceType = Math.random() < 0.5 ? 'iron' : 'copper';
            cell.textContent = resources[resourceType].symbol;
            cell.style.backgroundColor = resources[resourceType].color;
            cell.dataset.resource = resourceType;
        }
    });
}

function placePlayer() {
    const playerCell = getCellAt(playerPosition.x, playerPosition.y);
    playerCell.textContent = '👤';
}

function placeEnemies() {
    for (let i = 0; i < 3; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while (x === playerPosition.x && y === playerPosition.y);
        
        enemies.push({ x, y });
        const enemyCell = getCellAt(x, y);
        enemyCell.textContent = '👾';
    }
}

function getCellAt(x, y) {
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function movePlayer(dx, dy) {
    const newX = Math.max(0, Math.min(gridSize - 1, playerPosition.x + dx));
    const newY = Math.max(0, Math.min(gridSize - 1, playerPosition.y + dy));

    if (newX !== playerPosition.x || newY !== playerPosition.y) {
        getCellAt(playerPosition.x, playerPosition.y).textContent = '';
        playerPosition.x = newX;
        playerPosition.y = newY;
        placePlayer();
        collectResource();
        moveEnemies();
        checkGameOver();
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        getCellAt(enemy.x, enemy.y).textContent = '';
        const dx = Math.sign(playerPosition.x - enemy.x);
        const dy = Math.sign(playerPosition.y - enemy.y);
        enemy.x = Math.max(0, Math.min(gridSize - 1, enemy.x + dx));
        enemy.y = Math.max(0, Math.min(gridSize - 1, enemy.y + dy));
        getCellAt(enemy.x, enemy.y).textContent = '👾';
    });
}

function checkGameOver() {
    if (enemies.some(enemy => enemy.x === playerPosition.x && enemy.y === playerPosition.y)) {
        alert('Game Over! You were caught by an enemy.');
        resetGame();
    }
}

function resetGame() {
    playerPosition = { x: 0, y: 0 };
    enemies = [];
    factories = [];
    playerInventory.iron = 0;
    playerInventory.copper = 0;
    updateResourceDisplay();
    initializeGrid();
}

function collectResource() {
    const playerCell = getCellAt(playerPosition.x, playerPosition.y);
    if (playerCell.dataset.resource) {
        const resourceType = playerCell.dataset.resource;
        playerInventory[resourceType]++;
        updateResourceDisplay();
        delete playerCell.dataset.resource;
        playerCell.style.backgroundColor = '';
        playerCell.textContent = '';
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
        case 'i': buildFactory('ironMine'); break;
        case 'c': buildFactory('copperMine'); break;
    }
}

function updateResourceDisplay() {
    document.getElementById('iron-count').textContent = playerInventory.iron;
    document.getElementById('copper-count').textContent = playerInventory.copper;
}

function buildFactory(type) {
    const cell = getCellAt(playerPosition.x, playerPosition.y);
    if (cell.dataset.resource || cell.dataset.factory) return;

    const building = buildings[type];
    if (canAfford(building.cost)) {
        deductResources(building.cost);
        cell.textContent = building.symbol;
        cell.dataset.factory = type;
        factories.push({ x: playerPosition.x, y: playerPosition.y, type });
        updateResourceDisplay();
    } else {
        alert("Not enough resources to build this factory!");
    }
}

function canAfford(cost) {
    return Object.entries(cost).every(([resource, amount]) => playerInventory[resource] >= amount);
}

function deductResources(cost) {
    Object.entries(cost).forEach(([resource, amount]) => {
        playerInventory[resource] -= amount;
    });
}

function produceResources() {
    factories.forEach(factory => {
        const building = buildings[factory.type];
        Object.entries(building.production).forEach(([resource, amount]) => {
            playerInventory[resource] += amount;
        });
    });
    updateResourceDisplay();
}

initializeGrid();
document.addEventListener('keydown', handleKeyPress);
setInterval(produceResources, 1000);
