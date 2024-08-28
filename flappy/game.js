const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    maxVelocity: 10,
    minVelocity: -10
};

let pipes = [];
let score = 0;
let gameOver = false;

const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    if (gameOver) return;

    // Update bird
    bird.velocity += bird.gravity;
    bird.velocity = Math.max(Math.min(bird.velocity, bird.maxVelocity), bird.minVelocity);
    bird.y += bird.velocity;

    // Check collision with ground or ceiling
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        gameOver = true;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        // Remove off-screen pipes
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
            score++;
        }

        // Check collision with pipes
        if (
            bird.x < pipes[i].x + PIPE_WIDTH &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)
        ) {
            gameOver = true;
        }
    }

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const pipeY = Math.random() * (canvas.height - PIPE_GAP);
        pipes.push({
            x: canvas.width,
            top: pipeY,
            bottom: pipeY + PIPE_GAP
        });
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.jump;
    }
    if (e.code === 'Space' && gameOver) {
        resetGame();
    }
});

// Reset game
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameLoop();
}

// Start the game
gameLoop();
