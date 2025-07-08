document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const lapCounter = document.getElementById('lap-counter');

    const car = {
        x: 100,
        y: 100,
        width: 20,
        height: 40,
        color: '#FF0000', // Red car
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
        { x: 50, y: 50, width: 700, height: 500, color: '#333' }, // Outer track
        { x: 100, y: 100, width: 600, height: 400, color: '#000' }  // Inner track
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
        if (car.x < track[0].x) car.x = track[0].x;
        if (car.x + car.width > track[0].x + track[0].width) car.x = track[0].x + track[0].width - car.width;
        if (car.y < track[0].y) car.y = track[0].y;
        if (car.y + car.height > track[0].y + track[0].height) car.y = track[0].y + track[0].height - car.height;

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

        // Draw car
        ctx.save();
        ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
        ctx.rotate(car.angle);
        ctx.fillStyle = car.color;
        ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
        ctx.restore();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});