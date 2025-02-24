document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("gameModal");
    const closeModal = document.getElementById("closeModal");
    const hint1 = document.getElementById("hint1");
    const gameQuestion = document.getElementById("gameQuestion");
    const answerButtons = document.getElementById("answerButtons");
    const feedbackMessage = document.getElementById("feedbackMessage");

    let hintsStatus = JSON.parse(localStorage.getItem("hintsStatus")) || {};

    function loadHints() {
        if (hintsStatus["hint1"]) {
            hint1.innerHTML = hintsStatus["hint1"];
            hint1.classList.remove("locked");
        }
    }

    loadHints();

    hint1.addEventListener("click", function () {
        if (!hint1.classList.contains("locked")) {
            openGame();
        }
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    function openGame() {
        modal.style.display = "flex";
        currentQuestionIndex = 0;
        loadQuestion();
    }

    const questions = [
        { 
            question: "Które miasto jest stolicą Japonii?", 
            answers: ["A) Pekin", "B) Tokio", "C) Seul", "D) Bangkok"], 
            correct: "B" 
        },
        { 
            question: "Ile nóg ma pająk? 🕷️", 
            answers: ["A) 6", "B) 8", "C) 10", "D) 12"], 
            correct: "B" 
        },
        { 
            question: "Kto namalował Mona Lisę? 🎨", 
            answers: ["A) Vincent van Gogh", "B) Pablo Picasso", "C) Leonardo da Vinci", "D) Rembrandt"], 
            correct: "C" 
        },
        { 
            question: "Jaka jest chemiczna nazwa wody? 💧", 
            answers: ["A) CO2", "B) H2O", "C) NaCl", "D) O2"], 
            correct: "B" 
        },
        { 
            question: "Które zwierzę jest największe na świecie? 🐋", 
            answers: ["A) Słoń", "B) Rekin Wielorybi", "C) Wieloryb Błękitny", "D) Żyrafa"], 
            correct: "C" 
        }
    ];

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        gameQuestion.innerHTML = currentQuestion.question;
        answerButtons.innerHTML = "";
        feedbackMessage.classList.add("hidden");

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.innerHTML = answer;
            button.classList.add("answer-button");
            button.dataset.answer = String.fromCharCode(65 + index);
            button.addEventListener("click", checkAnswer);
            answerButtons.appendChild(button);
        });
    }

    function checkAnswer(event) {
        const selectedAnswer = event.target.dataset.answer;
        const correctAnswer = questions[currentQuestionIndex].correct;

        if (selectedAnswer === correctAnswer) {
            event.target.classList.add("correct");
            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                setTimeout(loadQuestion, 1000);
            } else {
                winGame();
            }
        } else {
            event.target.classList.add("wrong");
            feedbackMessage.innerHTML = "❌ Zła odpowiedź! Spróbuj jeszcze raz.";
            feedbackMessage.classList.remove("hidden");
            setTimeout(() => {
                event.target.classList.remove("wrong");
                feedbackMessage.classList.add("hidden");
            }, 1500);
        }
    }

    function winGame() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        alert("🎉 Brawo! Odkryłeś podpowiedź!");
        const hintHtml = `
        <p>Wygodne i ciepłe buty (albo skietki) 👢</p>
        <img src="assets/1177056-removebg-preview.png" alt="Buty" class="hint-image">
        `;
        
        hintsStatus["hint1"] = hintHtml;
        localStorage.setItem("hintsStatus", JSON.stringify(hintsStatus));

        loadHints();

        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Gratulacje!</h2>
                ${hintHtml}
                <button id="closeModal">❌ Zamknij</button>
            </div>
        `;

        document.getElementById("closeModal").addEventListener("click", function () {
            modal.style.display = "none";
        });
    }
});
