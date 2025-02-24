document.addEventListener("DOMContentLoaded", function () {
    const isSecondPage = document.body.classList.contains("second-page");

    if (isSecondPage) {
        setupHints();
    } else {
        const button = document.querySelector("button");
        if (button) {
            button.addEventListener("click", function () {
                window.location.href = "third.html";
            });
        }
    }
});



// -------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const hints = document.querySelectorAll(".hint");
    const hintsStatusKey = "hintsStatus"; // Klucz do zapamiętywania odkrytych podpowiedzi
    const hintsUnlockTimes = [
        new Date("2025-02-26T00:00:00").getTime(), // Podpowiedź 1 - 26 lutego 2025, 00:00
        new Date("2025-02-27T00:00:00").getTime(), // Podpowiedź 2 - 27 lutego 2025, 00:00
        new Date("2025-02-28T00:00:00").getTime(), // Podpowiedź 3 - 28 lutego 2025, 00:00
        new Date("2025-03-01T00:00:00").getTime(), // Podpowiedź 4 - 1 marca 2025, 00:00
        new Date("2025-03-02T00:00:00").getTime(),  // Podpowiedź 5 - 2 marca 2025, 00:00
        new Date("2025-03-03T00:00:00").getTime()  // Podpowiedź 5 - 2 marca 2025, 00:00
    ];

    // Pobieramy status odkrytych podpowiedzi
    let hintsStatus = JSON.parse(localStorage.getItem(hintsStatusKey)) || {};

    // Funkcja aktualizująca timer
    function updateHints() {
        const now = new Date().getTime(); // Pobieramy aktualny czas

        hints.forEach((hint, index) => {
            const hintNumber = index + 1;
            const unlockTime = hintsUnlockTimes[index]; // Pobieramy datę odblokowania
            const timeLeft = unlockTime - now;
            const countdown = hint.querySelector(".countdown");

            if (hintsStatus[`hint${hintNumber}`]) {
                // Jeśli podpowiedź została odkryta, wyświetlamy jej treść
                hint.innerHTML = `<p>💡 Podpowiedź ${hintNumber}: ${hintsStatus[`hint${hintNumber}`]}</p>`;
                hint.classList.remove("locked");
            } else if (timeLeft <= 0) {
                // Jeśli czas minął, odblokowujemy podpowiedź
                hint.classList.remove("locked");
                countdown.textContent = "🎉 Kliknij, aby odkryć!";
                hint.addEventListener("click", () => startMiniGame(hintNumber));
            } else {
                // Jeśli jeszcze nie czas, pokazujemy dynamiczny licznik
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                countdown.textContent = `⏳ Odblokowanie za: ${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        });
    }

    updateHints(); // Wywołanie na start
    setInterval(updateHints, 1000); // Odświeżanie co sekundę
});
