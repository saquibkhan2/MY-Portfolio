    const car = {
        x: 100,
        y: 100,
        width: 20,
        height: 40,
        color: '#00BFFF', // Sky Blue car
        speed: 0,
        angle: 0,
        rotationSpeed: 0.05,
        maxSpeed: 5,
        acceleration: 0.1,
        deceleration: 0.05,
        laps: 0,
        checkpoint: false // To track if car passed checkpoint
    };

    const track = [
        // Outer boundary
        { x: 50, y: 50, width: 700, height: 500, color: '#555' }, // Outer track
        // Inner boundary
        { x: 150, y: 150, width: 500, height: 300, color: '#000' }, // Inner track
        // Track segments to create a path
        { x: 50, y: 50, width: 100, height: 100, color: '#444' }, // Top-left corner
        { x: 650, y: 50, width: 100, height: 100, color: '#444' }, // Top-right corner
        { x: 50, y: 450, width: 100, height: 100, color: '#444' }, // Bottom-left corner
        { x: 650, y: 450, width: 100, height: 100, color: '#444' }, // Bottom-right corner
        { x: 150, y: 50, width: 500, height: 100, color: '#444' }, // Top straight
        { x: 150, y: 450, width: 500, height: 100, color: '#444' }, // Bottom straight
        { x: 50, y: 150, width: 100, height: 300, color: '#444' }, // Left straight
        { x: 650, y: 150, width: 100, height: 300, color: '#444' }  // Right straight
    ];

    const finishLine = {
        x: 100,
        y: 100,
        width: 5, // Thin line
        height: 100,
        color: '#00FF00' // Green finish line
    };

    let keys = {};

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function update() {
        // Car movement
        if (keys['ArrowUp']) {
            car.speed += car.acceleration;
        } else {
            car.speed -= car.deceleration;
        }
        car.speed = Math.max(0, Math.min(car.speed, car.maxSpeed));

        if (keys['ArrowLeft']) {
            car.angle -= car.rotationSpeed;
        }
        if (keys['ArrowRight']) {
            car.angle += car.rotationSpeed;
        }

        car.x += Math.sin(car.angle) * car.speed;
        car.y -= Math.cos(car.angle) * car.speed;

        // Simple collision with track boundaries (stay within outer track)
        // This logic needs to be updated for the new track shape
        // For now, keeping it simple to avoid car going off screen
        if (car.x < 0) car.x = 0;
        if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
        if (car.y < 0) car.y = 0;
        if (car.y + car.height > canvas.height) car.y = canvas.height - car.height;

        // Lap counter logic
        if (car.x > finishLine.x && car.x < finishLine.x + finishLine.width &&
            car.y > finishLine.y && car.y < finishLine.y + finishLine.height) {
            if (!car.checkpoint) {
                car.laps++;
                lapCounter.textContent = `Lap: ${car.laps}/3`;
                car.checkpoint = true;
                if (car.laps >= 3) {
                    alert('Race Finished! You completed 3 laps!');
                    car.laps = 0;
                    lapCounter.textContent = `Lap: ${car.laps}/3`;
                }
            }
        } else {
            car.checkpoint = false;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw track
        track.forEach(segment => {
            ctx.fillStyle = segment.color;
            ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
        });

        // Draw finish line
        ctx.fillStyle = finishLine.color;
        ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);

        // Draw car doodle
        ctx.save();
        ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
        ctx.rotate(car.angle);
        ctx.fillStyle = car.color;

        // Main body of the car
        ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

        // Simple cabin/roof
        ctx.fillStyle = '#333'; // Darker color for cabin
        ctx.fillRect(-car.width / 4, -car.height / 2 + 5, car.width / 2, car.height / 3);

        // Headlights (small rectangles at the front)
        ctx.fillStyle = 'yellow';
        ctx.fillRect(-car.width / 2 + 2, car.height / 2 - 8, 4, 4); // Left headlight
        ctx.fillRect(car.width / 2 - 6, car.height / 2 - 8, 4, 4); // Right headlight

        ctx.restore();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});