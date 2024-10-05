const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const G = 1;
const dt = 0.6;

// Body class with a tracking mechanism
class Body {
    constructor(x, y, mass, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        this.color = color;
        this.trail = []; // Store positions for the trail
    }

    // Draw the body
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.sqrt(this.mass) * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Draw the path (trail) of the body
    drawTrail() {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y); // Start at the first recorded position
        for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y); // Draw lines between each position
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

    // Update acceleration due to gravitational forces
    updateAcceleration(bodies) {
        this.ax = 0;
        this.ay = 0;
        bodies.forEach(body => {
            if (body !== this) {
                const dx = body.x - this.x;
                const dy = body.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = (G * body.mass) / (distance * distance);
                this.ax += (force * dx) / distance;
                this.ay += (force * dy) / distance;
            }
        });
    }

    // Update position based on velocity and acceleration
    updatePosition() {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Add current position to the trail
        this.trail.push({ x: this.x, y: this.y });

        // Limit the length of the trail (optional, for performance)
        if (this.trail.length > 1000) {
            this.trail.shift(); // Remove the oldest point if trail is too long
        }
    }
}

// Create three bodies
const bodies = [
    new Body(canvas.width / 2 - 100, canvas.height / 2, 100, 0, 0, "red"),
    new Body(canvas.width / 3 + 100, canvas.height / 2, 100, 0, 1, "green"),
    new Body(canvas.width / 2, canvas.height / 2 - 100, 150, 1, 0, "blue")
    // new Body(canvas.width / 2 - 50, canvas.height / 2 - 100, 50, 2, 2, "orange")
];

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bodies.forEach(body => {
        body.updateAcceleration(bodies);  // Update forces
        body.updatePosition();            // Update position
        body.drawTrail();                 // Draw the path/trail
        body.draw();                      // Draw the body itself
    });

    requestAnimationFrame(animate);
}

// Start the animation
animate();
