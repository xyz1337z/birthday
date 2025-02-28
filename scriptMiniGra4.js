document.addEventListener("DOMContentLoaded", function () {
    const modal4 = document.getElementById("gameModal4");
    const closeModal4 = document.getElementById("closeModal4");
    const hint4 = document.getElementById("hint4");
    const photoContainer = document.getElementById("photoContainer");
    const cityInput = document.getElementById("cityInput");
    const checkCityButton = document.getElementById("checkCityButton");
    const messageDisplay = document.getElementById("messageDisplay");
    const photoCounter = document.getElementById("photoCounter");

    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};
    let currentPhotoIndex = 0;

    const photos = [
        { src: 'assets/amsterdam.jpeg', city: 'Amsterdam' },
        { src: 'assets/comino.jpeg', city: 'Comino' },
        { src: 'assets/dingli_klify.jpeg', city: 'Dingli Cliffs' },
        { src: 'assets/haga.jpeg', city: 'Haga' },
        { src: 'assets/Korfu.jpeg', city: 'Korfu' },
        { src: 'assets/dolina_motyli.jpeg', city: 'Dolina motyli' },
        { src: 'assets/luzino.jpeg', city: 'Luzino' },
        { src: 'assets/rodos.jpeg', city: 'Rodos' }
        { src: 'assets/ustronie.png', city: 'Ustronie Morskie' }
    ];

    function loadHints() {
        if (hintsStatus["hint4"]) {
            hint4.innerHTML = hintsStatus["hint4"];
            hint4.classList.remove("locked");
        }
    }

    loadHints(); // Załadowanie podpowiedzi przy starcie

    hint4.addEventListener("click", function () {
        if (!hint4.classList.contains("locked")) {
            openGame();
        }
    });

    closeModal4.addEventListener("click", function () {
        modal4.style.display = "none";
        resetGame();
    });

    checkCityButton.addEventListener("click", checkCity);

    function openGame() {
        modal4.style.display = "flex";
        resetGame();
        loadPhoto();
    }

    function loadPhoto() {
        const currentPhoto = photos[currentPhotoIndex];
        photoContainer.innerHTML = `<img src="${currentPhoto.src}" alt="Zdjęcie ${currentPhotoIndex + 1}" class="photo-image-large">`;
        photoCounter.textContent = `Zdjęcie ${currentPhotoIndex + 1} / ${photos.length}`;
        cityInput.value = '';
        messageDisplay.textContent = '';
        cityInput.classList.remove('input-error');
    }

    function checkCity() {
        const currentPhoto = photos[currentPhotoIndex];
        const enteredCity = cityInput.value.trim();

        if (enteredCity.toLowerCase() === currentPhoto.city.toLowerCase()) {
            currentPhotoIndex++;
            if (currentPhotoIndex < photos.length) {
                loadPhoto();
            } else {
                winGame();
            }
        } else {
            messageDisplay.textContent = 'Ajajaja fakin pomyłka! 😅 Skupka!';
            cityInput.classList.add('input-error');
            cityInput.classList.add('shake');
            modal4.classList.add('shake');

            setTimeout(() => {
                cityInput.classList.remove('shake');
                modal4.classList.remove('shake');
            }, 500);
        }
    }

    function winGame() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        const hintHtml = `
        <p>Paszport obowiązkowy ok? ok!</p>
        <img src="assets/passport.webp" alt="Paszport" class="hint-image">
        `;

        hintsStatus["hint4"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));
        hint4.innerHTML = hintHtml;
        hint4.classList.remove("locked");

        loadHints(); // Aktualizacja podpowiedzi po wygranej

        modal4.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Gratulacje!</h2>
                ${hintHtml}
                <button id="closeModal4">❌ Zamknij</button>
            </div>
        `;

        document.getElementById("closeModal4").addEventListener("click", function () {
            modal4.style.display = "none";
        });
    }

    function resetGame() {
        currentPhotoIndex = 0;
        photoContainer.innerHTML = '';
        cityInput.value = '';
        messageDisplay.textContent = '';
        cityInput.classList.remove('input-error');
    }
});
