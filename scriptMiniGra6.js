document.addEventListener("DOMContentLoaded", function () {
    const modal6 = document.getElementById("gameModal6");
    const hint6 = document.getElementById("hint6");
    const modalContent6 = document.querySelector("#gameModal6 .modal-content");

    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};

    if (hintsStatus["hint6"]) {
        hint6.innerHTML = hintsStatus["hint6"];
        hint6.classList.remove("locked");
    } else {
        hint6.addEventListener("click", function () {
            if (!hint6.classList.contains("locked")) {
                revealMessage();
            }
        });
    }

    function revealMessage() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Ustawienie treści modala w tym samym stylu co inne mini gry
        modalContent6.innerHTML = `
            <p>Bardzo cie kocham i mam nadzieje, ze ci sie spodoba!💕</p>
            <img src="assets/plane.png" alt="Samolot" class="hint-image">
            <button id="closeModal6">❌ Zamknij</button>
        `;

        modal6.style.display = "flex";

        // Obsługa zamknięcia modala
        document.getElementById("closeModal6").addEventListener("click", function () {
            modal6.style.display = "none";
        });

        // Po zamknięciu zmieniamy podpowiedź na kafelku
        const hintHtml = `
            <p>✈️ Lotnisko 4:30</p>
            <img src="assets/plane.png" alt="Samolot" class="hint-image">
        `;

        hintsStatus["hint6"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));
        hint6.innerHTML = hintHtml;
        hint6.classList.remove("locked");
    }
});
