const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const CAMERA_OFFSET_X = GAME_WIDTH / 2;

let score = 0;
let lives = 3;
let gameOver = false;
let attackEffect = null;
let bullets = [];

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.jumpForce = 15;
        this.velocityY = 0;
        this.isJumping = false;
        this.canJump = true;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.direction = 1; // 1 for right, -1 for left
    }

    draw(cameraX) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);

        if (this.isAttacking) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - cameraX, this.y + this.height / 2, this.width, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    move(direction) {
        this.x += direction * this.speed;
        this.direction = direction;
    }

    jump() {
        if (this.canJump) {
            this.velocityY = -this.jumpForce;
            this.isJumping = true;
            this.canJump = false;
        }
    }

    update(platforms) {
        this.velocityY += 0.6;
        this.y += this.velocityY;

        let onGround = false;

        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                onGround = true;
            }
        });

        if (this.y + this.height > GAME_HEIGHT) {
            this.y = GAME_HEIGHT - this.height;
            this.velocityY = 0;
            onGround = true;
        }

        if (onGround) {
            this.isJumping = false;
            this.canJump = true;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        } else {
            this.isAttacking = false;
        }
    }

    shoot() {
        if (this.attackCooldown === 0) {
            this.isAttacking = true;
            this.attackCooldown = 20; // 20 frames cooldown

            const bulletX = this.direction > 0 ? this.x + this.width : this.x;
            const bulletY = this.y + this.height / 2;
            bullets.push(new Bullet(bulletX, bulletY, this.direction));
        }
    }

    checkCollision(enemies) {
        enemies.forEach(enemy => {
            if (this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y) {
                lives--; // Decrease lives when player collides with an enemy
                if (lives <= 0) {
                    gameOver = true;
                }
                // Reset player position
                this.x = 50;
                this.y = 0;
            }
        });
    }
}

class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = 10;
        this.direction = direction;
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw(cameraX) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(cameraX) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.direction = 1;
    }

    draw(cameraX) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }

    update(platforms) {
        this.x += this.speed * this.direction;

        // Simple AI: change direction when hitting a platform edge
        platforms.forEach(platform => {
            if (this.x <= platform.x || this.x + this.width >= platform.x + platform.width) {
                this.direction *= -1;
            }
        });
    }
}

const player = new Player(50, 0, 40, 60);
let platforms = [];
let enemies = [];

function generateMap(startX) {
    const platformCount = 5;
    const enemyCount = 3;
    const sectionWidth = GAME_WIDTH * 3;

    for (let i = 0; i < platformCount; i++) {
        const x = startX + Math.random() * sectionWidth;
        const y = 200 + Math.random() * (GAME_HEIGHT - 300);
        const width = 100 + Math.random() * 200;
        const height = 20;
        platforms.push(new Platform(x, y, width, height));
    }

    for (let i = 0; i < enemyCount; i++) {
        const platformIndex = Math.floor(Math.random() * platformCount);
        const platform = platforms[platforms.length - platformCount + platformIndex];
        const x = platform.x + Math.random() * (platform.width - 30);
        const y = platform.y - 30;
        enemies.push(new Enemy(x, y, 30, 30));
    }

    // Add ground platform
    platforms.push(new Platform(startX, GAME_HEIGHT - 20, sectionWidth, 20));
}

// Generate initial map
generateMap(0);

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (keys['ArrowLeft']) player.move(-1);
    if (keys['ArrowRight']) player.move(1);
    if (keys['Space']) player.jump();
    // Press 'X' to shoot
    if (keys['KeyX']) player.shoot();

    player.update(platforms);
    player.checkCollision(enemies);
    enemies.forEach(enemy => enemy.update(platforms));

    // Update and draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        
        // Remove bullets that are off-screen
        if (bullets[i].x < 0 || bullets[i].x > player.x + GAME_WIDTH) {
            bullets.splice(i, 1);
            continue;
        }

        // Check for collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i] && 
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y) {
                
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 10;
                attackEffect = { x: enemies[j].x, y: enemies[j].y, radius: 0, maxRadius: 50 };
                break;
            }
        }
    }

    const cameraX = player.x - CAMERA_OFFSET_X;

    // Generate new map section when player approaches the end of the current section
    if (player.x > platforms[platforms.length - 1].x - GAME_WIDTH) {
        generateMap(platforms[platforms.length - 1].x + GAME_WIDTH * 3);
    }

    // Remove off-screen platforms and enemies
    platforms = platforms.filter(platform => platform.x + platform.width > player.x - GAME_WIDTH);
    enemies = enemies.filter(enemy => enemy.x > player.x - GAME_WIDTH);

    platforms.forEach(platform => platform.draw(cameraX));
    enemies.forEach(enemy => enemy.draw(cameraX));
    bullets.forEach(bullet => bullet.draw(cameraX));
    player.draw(cameraX);

    // Draw attack effect
    if (attackEffect) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(attackEffect.x - cameraX, attackEffect.y, attackEffect.radius, 0, Math.PI * 2);
        ctx.fill();
        attackEffect.radius += 5;
        if (attackEffect.radius >= attackEffect.maxRadius) {
            attackEffect = null;
        }
    }

    // Draw score and lives
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, GAME_WIDTH - 100, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();

// How to use the new functionality:
// 1. The map now generates indefinitely as the player moves to the right.
// 2. New platforms and enemies are created ahead of the player.
// 3. Off-screen platforms and enemies are removed to optimize performance.
// 4. The game continues infinitely, allowing for endless gameplay.
// 5. All other functionalities (shooting, enemy behavior, scoring) remain the same.
