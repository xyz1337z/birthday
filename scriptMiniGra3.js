document.addEventListener("DOMContentLoaded", function () {
    const modal3 = document.getElementById("gameModal3");
    const closeModal3 = document.getElementById("closeModal3");
    const restartGame3 = document.getElementById("restartGame3");
    const hint3 = document.getElementById("hint3");
    const gameBoard = document.getElementById("gameBoard");
    const statusMessage = document.getElementById("statusMessage");

    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let blockClick = false;

    const images = [
        "assets/kot1.png",
        "assets/kot2.png",
        "assets/kot3.png",
        "assets/pies3.png",
        "assets/pies4.webp",
        "assets/pies5.png"
    ];

    function loadHints() {
        if (hintsStatus["hint3"]) {
            hint3.innerHTML = hintsStatus["hint3"];
            hint3.classList.remove("locked");
        }
    }

    loadHints(); // Załadowanie podpowiedzi przy starcie

    hint3.addEventListener("click", function () {
        if (!hint3.classList.contains("locked")) {
            openGame();
        }
    });

    closeModal3.addEventListener("click", function () {
        modal3.style.display = "none";
        resetGame();
    });

    restartGame3.addEventListener("click", function () {
        resetGame();
        startGame();
    });

    function openGame() {
        modal3.style.display = "flex";
        resetGame();
        startGame();
    }

    function startGame() {
        statusMessage.textContent = "Znajdź wszystkie pary!";
        matchedPairs = 0;
        flippedCards = [];
        blockClick = false;
        gameBoard.innerHTML = "";

        cards = [...images, ...images];
        cards.sort(() => 0.5 - Math.random());

        cards.forEach((imgSrc, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.dataset.image = imgSrc;

            const frontFace = document.createElement("div");
            frontFace.classList.add("front");

            const backFace = document.createElement("div");
            backFace.classList.add("back");
            const img = document.createElement("img");
            img.src = imgSrc;
            img.classList.add("card-image");
            backFace.appendChild(img);

            card.appendChild(frontFace);
            card.appendChild(backFace);

            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });

        gameBoard.style.gridTemplateColumns = "repeat(3, 1fr)";
    }

    function flipCard() {
        if (blockClick || flippedCards.length >= 2) return;
        const card = this;

        if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            blockClick = true;
            setTimeout(checkMatch, 800);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.image === card2.dataset.image) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;

            if (matchedPairs === images.length) {
                winGame();
            }
        } else {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }

        flippedCards = [];
        blockClick = false;
    }

    function winGame() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        const hintHtml = `
        <p>🎒 Spakuj plecak!</p>
        <img src="https://cdn-icons-png.flaticon.com/512/2612/2612095.png" alt="Plecak podróżniczy" class="hint-image">
        `;

        hintsStatus["hint3"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));
        hint3.innerHTML = hintHtml;
        hint3.classList.remove("locked");

        loadHints(); // Aktualizacja podpowiedzi po wygranej

        modal3.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Gratulacje!</h2>
                ${hintHtml}
                <button id="closeModal3">❌ Zamknij</button>
            </div>
        `;

        document.getElementById("closeModal3").addEventListener("click", function () {
            modal3.style.display = "none";
        });
    }

    function resetGame() {
        gameBoard.innerHTML = "";
        statusMessage.textContent = "";
        matchedPairs = 0;
        flippedCards = [];
        blockClick = false;
    }
});
