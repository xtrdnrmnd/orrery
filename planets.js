const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        camera.position.set(0, 20, 50);

        function createStarfield(numStars, size) {
            const starGeometry = new THREE.SphereGeometry(size, 8, 8);
            const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

            const starField = new THREE.Group();
            for (let i = 0; i < numStars; i++) {
                const star = new THREE.Mesh(starGeometry, starMaterial);
                star.position.set(
                    (Math.random() - 0.5) * 1000, // Random x position
                    (Math.random() - 0.5) * 1000, // Random y position
                    (Math.random() - 0.5) * 1000  // Random z position
                );
                starField.add(star);
            }

            starField.renderOrder = -1;  // Ensure stars are rendered behind all other objects
            scene.add(starField);
        }

        createStarfield(500, 0.5);  // Create 500 small stars with size 0.5

        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        const planetsData = [
            { name: "Mercury", distance: 5, size: 0.2, color: 0xaaaaaa, speed: 0.02, textColor: "lightgray" },
            { name: "Venus", distance: 7, size: 0.4, color: 0xffcc00, speed: 0.015, textColor: "yellow" },
            { name: "Earth", distance: 10, size: 0.5, color: 0x0000ff, speed: 0.01, textColor: "lightblue" },
            { name: "Mars", distance: 13, size: 0.3, color: 0xff0000, speed: 0.008, textColor: "red" },
            { name: "Jupiter", distance: 18, size: 1.1, color: 0xff9900, speed: 0.005, textColor: "orange" },
            { name: "Saturn", distance: 24, size: 0.9, color: 0xffff66, speed: 0.003, textColor: "lightyellow" },
            { name: "Uranus", distance: 30, size: 0.7, color: 0x66ccff, speed: 0.002, textColor: "lightcyan" },
            { name: "Neptune", distance: 35, size: 0.6, color: 0x0000ff, speed: 0.001, textColor: "lightblue" }
        ];

        const planets = [];
        const planetLabels = [];

        function createPlanet({ name, distance, size, color, textColor }) {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: color });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(distance, 0, 0);

            const orbitGeometry = new THREE.RingGeometry(distance - 0.01, distance + 0.01, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;

            scene.add(planet);
            scene.add(orbit);

            const label = createTextLabel(name, textColor, size);
            label.position.set(distance, size + 0.5, 0);
            scene.add(label);

            planetLabels.push({ mesh: label, planet: planet });

            return { mesh: planet, distance: distance, angle: 0, speed: 0.01 };
        }

        function createTextLabel(name, textColor, size) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const fontSize = size * 60;
            context.font = `Bold ${fontSize}px Arial`;
            context.fillStyle = textColor;
            context.fillText(name, 10, 50);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(10, 5, 1);

            return sprite;
        }

        planetsData.forEach(planetData => {
            const planet = createPlanet(planetData);
            planet.speed = planetData.speed;
            planets.push(planet);
        });

        function createAsteroid() {
            const size = Math.random() * 0.05 + 0.02;
            const geometry = new THREE.SphereGeometry(size, 16, 16);
            const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const asteroid = new THREE.Mesh(geometry, material);
            return asteroid;
        }

        function createAsteroidBelt(numAsteroids, innerRadius, outerRadius) {
            const asteroidBelt = new THREE.Group();
            for (let i = 0; i < numAsteroids; i++) {
                const asteroid = createAsteroid();
                const theta = Math.random() * 2 * Math.PI;
                const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
                asteroid.position.set(radius * Math.cos(theta), 0, radius * Math.sin(theta));
                asteroidBelt.add(asteroid);
            }
            scene.add(asteroidBelt);
            return asteroidBelt;
        }

        const asteroidBelt = createAsteroidBelt(1000, 14, 17);

        const light = new THREE.PointLight(0xffffff, 1.5, 100);
        light.position.set(0, 0, 0);
        scene.add(light);

        function createKuiperBelt(numObjects, innerRadius, outerRadius) {
            const kuiperBelt = new THREE.Group();
            for (let i = 0; i < numObjects; i++) {
                const objectSize = Math.random() * 0.1 + 0.02;
                const geometry = new THREE.SphereGeometry(objectSize, 16, 16);
                const material = new THREE.MeshLambertMaterial({ color: 0x5078A0 });
                const object = new THREE.Mesh(geometry, material);

                const theta = Math.random() * 2 * Math.PI;
                const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
                object.position.set(radius * Math.cos(theta), 0, radius * Math.sin(theta));

                kuiperBelt.add(object);
            }
            scene.add(kuiperBelt);
            return kuiperBelt;
        }

        const kuiperBelt = createKuiperBelt(2000, 36, 50);

        let speedFactor = 1;
        const speedControl = document.getElementById('speedControl');
        const speedValueDisplay = document.getElementById('speedValue');


        speedControl.addEventListener('input', function() {
            speedFactor = parseFloat(this.value);
            speedValueDisplay.textContent = speedFactor.toFixed(1) + 'x';
        });

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        document.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                camera.rotation.y += deltaMove.x * 0.005;
                camera.rotation.x += deltaMove.y * 0.005;
            }
            previousMousePosition = { x: event.clientX, y: event.clientY };
        });

        document.addEventListener('wheel', (event) => {
            const direction = new THREE.Vector3();
            direction.subVectors(sun.position, camera.position).normalize();
            const zoomAmount = event.deltaY * 0.05;
            camera.position.addScaledVector(direction, zoomAmount);
        });

        function animate() {
            requestAnimationFrame(animate);
            asteroidBelt.rotation.y += 0.001;

            planets.forEach(planet => {
                planet.angle += planet.speed * speedFactor;
                planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
                planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
            });

            planetLabels.forEach(label => {
                label.mesh.position.x = label.planet.position.x;
                label.mesh.position.y = label.planet.position.y + 1.5;
                label.mesh.position.z = label.planet.position.z;
                label.mesh.lookAt(camera.position);
            });

            renderer.render(scene, camera);
        }

        animate();