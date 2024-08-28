const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 20;
const PACMAN_SIZE = 15;
const GRID_WIDTH = canvas.width / CELL_SIZE;
const GRID_HEIGHT = canvas.height / CELL_SIZE;

const WALL = 0;
const EMPTY = 1;
const DOT = 2;

let pacman = {
    x: 1,
    y: 1,
    direction: 0 // 0: right, 1: down, 2: left, 3: up
};

let ghosts = [
    {x: GRID_WIDTH - 2, y: 1, color: 'red'},
    {x: 1, y: GRID_HEIGHT - 2, color: 'pink'},
    {x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2, color: 'cyan'}
];

let maze = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,2,0,0,0,2,0,0,2,0,0,0,2,0,0,2,0],
    [0,2,0,0,2,0,0,0,2,0,0,2,0,0,0,2,0,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,2,0,2,0,0,0,0,0,0,2,0,2,0,0,2,0],
    [0,2,2,2,2,0,2,2,2,0,0,2,2,2,0,2,2,2,2,0],
    [0,0,0,0,2,0,0,0,1,0,0,1,0,0,0,2,0,0,0,0],
    [0,1,1,0,2,0,1,1,1,1,1,1,1,1,0,2,0,1,1,0],
    [0,0,0,0,2,0,1,0,0,1,1,0,0,1,0,2,0,0,0,0],
    [2,2,2,2,2,1,1,0,1,1,1,1,0,1,1,2,2,2,2,2],
    [0,0,0,0,2,0,1,0,0,0,0,0,0,1,0,2,0,0,0,0],
    [0,1,1,0,2,0,1,1,1,1,1,1,1,1,0,2,0,1,1,0],
    [0,0,0,0,2,0,1,0,0,0,0,0,0,1,0,2,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,2,0,0,0,2,0,0,2,0,0,0,2,0,0,2,0],
    [0,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,0],
    [0,0,2,0,2,0,2,0,0,0,0,0,0,2,0,2,0,2,0,0],
    [0,2,2,2,2,0,2,2,2,0,0,2,2,2,0,2,2,2,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function drawMaze() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (maze[y][x] === WALL) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (maze[y][x] === DOT) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.beginPath();
    let mouthAngle = 0.2 * Math.PI * Math.sin(Date.now() / 100); // Animated mouth
    ctx.arc(pacman.x * CELL_SIZE + CELL_SIZE / 2, pacman.y * CELL_SIZE + CELL_SIZE / 2, PACMAN_SIZE, 
        mouthAngle + pacman.direction * Math.PI / 2, 
        2 * Math.PI - mouthAngle + pacman.direction * Math.PI / 2);
    ctx.lineTo(pacman.x * CELL_SIZE + CELL_SIZE / 2, pacman.y * CELL_SIZE + CELL_SIZE / 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x * CELL_SIZE + CELL_SIZE / 2, ghost.y * CELL_SIZE + CELL_SIZE / 2, PACMAN_SIZE, Math.PI, 2 * Math.PI);
        ctx.lineTo(ghost.x * CELL_SIZE + CELL_SIZE, ghost.y * CELL_SIZE + CELL_SIZE);
        ctx.lineTo(ghost.x * CELL_SIZE, ghost.y * CELL_SIZE + CELL_SIZE);
        ctx.fill();
    });
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let validDirections = directions.filter(([dx, dy]) => 
            maze[ghost.y + dy][ghost.x + dx] !== WALL
        );
        if (validDirections.length > 0) {
            let [dx, dy] = validDirections[Math.floor(Math.random() * validDirections.length)];
            ghost.x += dx;
            ghost.y += dy;
        }
    });
}

function checkCollision() {
    return ghosts.some(ghost => ghost.x === pacman.x && ghost.y === pacman.y);
}

function gameLoop() {
    clearCanvas();
    drawMaze();
    drawPacman();
    drawGhosts();
    moveGhosts();
    if (checkCollision()) {
        alert('Game Over!');
        return;
    }
    if (maze[pacman.y][pacman.x] === DOT) {
        maze[pacman.y][pacman.x] = EMPTY;
    }
    if (maze.flat().filter(cell => cell === DOT).length === 0) {
        alert('You Win!');
        return;
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    let newX = pacman.x;
    let newY = pacman.y;
    switch (event.key) {
        case 'ArrowRight':
            pacman.direction = 0;
            newX++;
            break;
        case 'ArrowDown':
            pacman.direction = 1;
            newY++;
            break;
        case 'ArrowLeft':
            pacman.direction = 2;
            newX--;
            break;
        case 'ArrowUp':
            pacman.direction = 3;
            newY--;
            break;
    }
    if (maze[newY][newX] !== WALL) {
        pacman.x = newX;
        pacman.y = newY;
    }
});

gameLoop();
