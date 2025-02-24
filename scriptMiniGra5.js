document.addEventListener("DOMContentLoaded", function () {
    const modal5 = document.getElementById("gameModal5");
    const closeModal5 = document.getElementById("closeModal5");
    const hint5 = document.getElementById("hint5");
    const scoreDisplay5 = document.getElementById("score5");
    const canvas = document.getElementById("gameCanvas5");
    const ctx = canvas.getContext("2d");

    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};
    let gameRunning = false;
    let score = 0;
    let player, obstacles, stars, gameInterval, background, ground, playerImg, obstacleImg, starImg;
    let speed = 4;
    let gravity = 0.5;
    let jumpPower = -10;
    let lastStarTime = 0;
    let lastObstacleTime = 0;
    const requiredStars = 15;

    function loadHints() {
        if (hintsStatus["hint5"]) {
            hint5.innerHTML = hintsStatus["hint5"];
            hint5.classList.remove("locked");
        }
    }

    loadHints(); // Załadowanie podpowiedzi przy starcie

    hint5.addEventListener("click", function () {
        if (!hint5.classList.contains("locked")) {
            openGame();
        }
    });

    closeModal5.addEventListener("click", function () {
        modal5.style.display = "none";
        stopGame();
    });

    function openGame() {
        modal5.style.display = "flex";
        startGame();
    }

    function startGame() {
        canvas.width = 500;
        canvas.height = 250;
        gameRunning = true;
        score = 0;
        speed = 4;
        scoreDisplay5.textContent = `Gwiazdki: ${score} / ${requiredStars}`;
        lastStarTime = 0;
        lastObstacleTime = 0;

        background = new Image();
        background.src = "assets/kosmos.webp";

        ground = new Image();
        ground.src = "assets/platform.png";

        playerImg = new Image();
        playerImg.src = "assets/girl.png";

        obstacleImg = new Image();
        obstacleImg.src = "assets/obstacle.webp";

        starImg = new Image();
        starImg.src = "assets/star.png";

        player = { x: 50, y: 170, width: 45, height: 45, velocityY: 0, grounded: true };
        obstacles = [];
        stars = [];

        gameInterval = setInterval(updateGame, 20);

        document.addEventListener("keydown", jump);
        document.addEventListener("click", jump);

        window.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp") {
                e.preventDefault();
            }
        });
    }

    function stopGame() {
        clearInterval(gameInterval);
        gameRunning = false;
        document.removeEventListener("keydown", jump);
        document.removeEventListener("click", jump);
    }

    function jump(event) {
        if (!gameRunning) return;
        if (event.key === "ArrowUp" || event.type === "click") {
            if (player.grounded) {
                player.grounded = false;
                player.velocityY = jumpPower;
            }
        }
    }

    function updateGame() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(ground, 0, 210, canvas.width, 40);
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

        player.y += player.velocityY;
        player.velocityY += gravity;

        if (player.y >= 170) {
            player.y = 170;
            player.velocityY = 0;
            player.grounded = true;
        }

        speed += 0.002;

        let now = Date.now();
        
        if (Math.random() < 0.02 && now - lastObstacleTime > 1500) { 
            lastObstacleTime = now;
            let safeGap = Math.max(160, 250 - speed * 10);
            obstacles.push({ x: canvas.width, y: 175, width: 40, height: 50 });
        }

        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].x -= speed;
            ctx.drawImage(obstacleImg, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

            if (checkCollision(player, obstacles[i])) {
                gameOver();
            }
        }

        obstacles = obstacles.filter(obstacle => obstacle.x > -50);

        if (Math.random() < 0.02 && now - lastStarTime > 1200) { 
            lastStarTime = now;
            let randomHeight = [100, 130, 160][Math.floor(Math.random() * 3)];
            stars.push({ x: canvas.width, y: randomHeight, width: 25, height: 25 });
        }

        for (let i = 0; i < stars.length; i++) {
            stars[i].x -= speed;
            ctx.drawImage(starImg, stars[i].x, stars[i].y, stars[i].width, stars[i].height);

            if (checkCollision(player, stars[i])) {
                score++;
                scoreDisplay5.textContent = `Gwiazdki: ${score} / ${requiredStars}`;
                stars.splice(i, 1);
                i--;
            }
        }

        stars = stars.filter(star => star.x > -50);

        if (score >= requiredStars) {
            winGame();
        }
    }

    function checkCollision(player, object) {
        const buffer = 5;
        return (
            player.x + buffer < object.x + object.width - buffer &&
            player.x + player.width - buffer > object.x + buffer &&
            player.y + buffer < object.y + object.height - buffer &&
            player.y + player.height - buffer > object.y + buffer
        );
    }

    function gameOver() {
        stopGame();
        alert("💀 Wpadłaś na przeszkodę japikole! Spróbuj ponownie.");
        modal5.style.display = "none";
    }

    function winGame() {
        stopGame();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        const hintHtml = `
            <p>🗓️ 05-06 marzec</p>
            <img src="assets/kalendarz.png" alt="Kalendarz" class="hint-image">
        `;

        hintsStatus["hint5"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));
        hint5.innerHTML = hintHtml;
        hint5.classList.remove("locked");

        loadHints(); // Aktualizacja podpowiedzi po wygranej

        modal5.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Amazing!! </h2>
                ${hintHtml}
                <button id="closeModal5">❌ Zamknij</button>
            </div>
        `;

        document.getElementById("closeModal5").addEventListener("click", function () {
            modal5.style.display = "none";
        });
    }
});
