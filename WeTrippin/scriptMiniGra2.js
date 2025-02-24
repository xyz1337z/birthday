document.addEventListener("DOMContentLoaded", function () {
    const modal2 = document.getElementById("gameModal2");
    const closeModal2 = document.getElementById("closeModal2");
    const restartGame = document.getElementById("restartGame");
    const hint2 = document.getElementById("hint2");
    const gameArea = document.getElementById("gameArea");
    const scoreDisplay = document.getElementById("score");

    let score = 0;
    let catCount = 15;
    let totalCatsFallen = 0;
    let gameOver = false;
    let spawnInterval;
    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};

    function loadHints() {
        if (hintsStatus["hint2"]) {
            hint2.innerHTML = hintsStatus["hint2"];
            hint2.classList.remove("locked");
        }
    }

    loadHints(); // Załadowanie podpowiedzi przy starcie

    const basket = document.createElement("img");
    basket.src = "assets/1685513-removebg-preview.png";
    basket.classList.add("basket");
    basket.style.position = "absolute";
    basket.style.bottom = "5px";
    basket.style.width = "80px";
    basket.style.height = "60px";
    basket.style.left = "50%";
    basket.style.transform = "translateX(-50%)";

    let basketPosition = 50;
    const basketSpeed = 7;

    hint2.addEventListener("click", function () {
        if (!hint2.classList.contains("locked")) {
            openGame();
        }
    });

    function openGame() {
        modal2.style.display = "flex";
        resetGame();
        startGame();
    }

    closeModal2.addEventListener("click", function () {
        modal2.style.display = "none";
        resetGame();
    });

    restartGame.addEventListener("click", function () {
        resetGame();
        startGame();
    });

    function startGame() {
        score = 0;
        totalCatsFallen = 0;
        gameOver = false;
        scoreDisplay.textContent = `Gwiazdki: ${score} / ${catCount}`;
        gameArea.innerHTML = "";
        gameArea.appendChild(basket);
        setBasketPosition(basketPosition);

        spawnInterval = setInterval(() => {
            if (!gameOver) createCat();
        }, Math.random() * 800 + 1500);
    }

    function createCat() {
        if (gameOver) return;

        const cat = document.createElement("img");
        cat.src = "assets/pngtree-pink-cute-cat-icon-animal-png-yuri-png-image_5230763-removebg-preview.png";
        cat.classList.add("cat");
        cat.style.position = "absolute";
        cat.style.width = "45px";
        cat.style.height = "45px";
        cat.style.left = `${Math.random() * 88}%`;
        gameArea.appendChild(cat);

        let speed = Math.random() * 0.15 + 0.12;
        let position = 0;

        function fall() {
            if (gameOver) return;

            position += speed;
            cat.style.top = `${position}%`;

            if (position >= 85) {
                checkCatch(cat);
                return;
            }
            requestAnimationFrame(fall);
        }

        fall();
    }

    function checkCatch(cat) {
        const catRect = cat.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        const tolerance = 5;

        const isCaught =
            catRect.bottom >= basketRect.top + basketRect.height / 2 &&
            catRect.left >= basketRect.left - tolerance &&
            catRect.right <= basketRect.right + tolerance;

        if (isCaught) {
            cat.remove();
            score++;
            scoreDisplay.textContent = `Punkty: ${score}/${catCount}`;
            if (score === catCount) {
                winGame();
            }
        } else {
            totalCatsFallen++;
            cat.remove();
            if (totalCatsFallen >= 1) {
                loseGame();
            }
        }
    }

    function loseGame() {
        gameOver = true;
        clearInterval(spawnInterval);
        scoreDisplay.textContent = "❌ Przegrałaś!😔 Kliknij 'Zagraj ponownie'🤠";
        restartGame.style.display = "block";
    }

    function winGame() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

       // 🔥 Podpowiedź "Coś na deszcz (just in case)" ☔
       const hintHtml = `
       <p>☔ Coś na deszcz (just in case)</p>
       <img src="assets/parasol.png" alt="Parasol" class="hint-image">
       `;

        hintsStatus["hint2"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));
        hint2.innerHTML = hintHtml;
        hint2.classList.remove("locked");

        loadHints(); // Aktualizacja podpowiedzi po wygranej

        modal2.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Gratulacje!</h2>
                ${hintHtml}
                <button id="closeModal2">❌ Zamknij</button>
            </div>
        `;

        document.getElementById("closeModal2").addEventListener("click", function () {
            modal2.style.display = "none";
        });
    }

    function resetGame() {
        gameOver = false;
        clearInterval(spawnInterval);
        score = 0;
        totalCatsFallen = 0;
        basketPosition = 50;
        setBasketPosition(basketPosition);
        scoreDisplay.textContent = `Punkty: ${score}/${catCount}`;
        gameArea.innerHTML = "";
        gameArea.appendChild(basket);
        restartGame.style.display = "none";
    }

    function setBasketPosition(position) {
        basketPosition = position;
        basket.style.left = `${position}%`;
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" && basketPosition > 5) {
            setBasketPosition(basketPosition - basketSpeed);
        } else if (event.key === "ArrowRight" && basketPosition < 90) {
            setBasketPosition(basketPosition + basketSpeed);
        }
    });
});
