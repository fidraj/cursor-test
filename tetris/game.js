const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

// Tetromino shapes
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = null;
let currentX = 0;
let currentY = 0;

function newPiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    currentPiece = SHAPES[shapeIndex];
    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
    currentY = 0;

    if (!canMove(0, 0)) {
        // Game over
        alert('Game Over!');
        board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    }
}

function canMove(offsetX, offsetY) {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                const newX = currentX + x + offsetX;
                const newY = currentY + y + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function merge() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[currentY + y][currentX + x] = 1;
            }
        }
    }
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    // Draw the current piece
    if (currentPiece) {
        ctx.fillStyle = 'red';
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    ctx.fillRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

function gameLoop() {
    if (!currentPiece) {
        newPiece();
    }

    if (canMove(0, 1)) {
        currentY++;
    } else {
        merge();
        clearLines();
        newPiece();
    }

    draw();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && canMove(-1, 0)) {
        currentX--;
    } else if (e.key === 'ArrowRight' && canMove(1, 0)) {
        currentX++;
    } else if (e.key === 'ArrowDown' && canMove(0, 1)) {
        currentY++;
    } else if (e.key === 'ArrowUp') {
        const rotated = currentPiece[0].map((_, i) => currentPiece.map(row => row[i])).reverse();
        if (canMove(0, 0, rotated)) {
            currentPiece = rotated;
        }
    }
    draw();
});

setInterval(gameLoop, 500);
