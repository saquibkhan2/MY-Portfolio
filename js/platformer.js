document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');

    let score = 0;

    const player = {
        x: 50,
        y: canvas.height - 70,
        width: 20,
        height: 20,
        color: '#FFF',
        velocityY: 0,
        isJumping: false,
        speed: 5
    };

    const platforms = [
        { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 }, // Ground
        { x: 100, y: canvas.height - 120, width: 150, height: 20 },
        { x: 300, y: canvas.height - 200, width: 100, height: 20 },
        { x: 500, y: canvas.height - 150, width: 120, height: 20 },
        { x: 700, y: canvas.height - 250, width: 80, height: 20 },
        { x: 50, y: canvas.height - 280, width: 70, height: 20 },
        { x: 250, y: canvas.height - 320, width: 90, height: 20 }
    ];

    let collectibles = [
        { x: 150, y: canvas.height - 150, radius: 5, color: '#FFD700', collected: false },
        { x: 320, y: canvas.height - 230, radius: 5, color: '#FFD700', collected: false },
        { x: 550, y: canvas.height - 180, radius: 5, color: '#FFD700', collected: false },
        { x: 720, y: canvas.height - 280, radius: 5, color: '#FFD700', collected: false }
    ];

    const goal = {
        x: canvas.width - 70,
        y: canvas.height - 280,
        width: 40,
        height: 40,
        color: '#0F0'
    };

    const gravity = 0.5;

    let keys = {};

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function update() {
        // Player movement
        if (keys['ArrowLeft']) {
            player.x -= player.speed;
        }
        if (keys['ArrowRight']) {
            player.x += player.speed;
        }
        if (keys['ArrowUp'] && !player.isJumping) {
            player.velocityY = -10;
            player.isJumping = true;
        }

        // Apply gravity
        player.velocityY += gravity;
        player.y += player.velocityY;

        // Collision with platforms
        player.isJumping = true; // Assume jumping until collision detected
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y < platform.y + platform.height) {

                // Collision from top
                if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                }
            }
        });

        // Keep player within canvas bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }

        // Collectibles collision
        collectibles.forEach(collectible => {
            if (!collectible.collected &&
                player.x < collectible.x + collectible.radius &&
                player.x + player.width > collectible.x - collectible.radius &&
                player.y < collectible.y + collectible.radius &&
                player.y + player.height > collectible.y - collectible.radius) {
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
                collectible.collected = true;
            }
        });

        // Check for win condition
        if (player.x < goal.x + goal.width &&
            player.x + player.width > goal.x &&
            player.y < goal.y + goal.height &&
            player.y + player.height > goal.y) {
            alert(`You reached the goal! You win with a score of ${score}!`);
            // Reset game or navigate away
            score = 0;
            scoreDisplay.textContent = `Score: ${score}`;
            player.x = 50;
            player.y = canvas.height - 70;
            player.velocityY = 0;
            player.isJumping = false;
            collectibles.forEach(c => c.collected = false); // Reset collectibles
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw platforms
        ctx.fillStyle = '#888';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Draw collectibles
        collectibles.forEach(collectible => {
            if (!collectible.collected) {
                ctx.fillStyle = collectible.color;
                ctx.beginPath();
                ctx.arc(collectible.x, collectible.y, collectible.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw goal
        ctx.fillStyle = goal.color;
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});