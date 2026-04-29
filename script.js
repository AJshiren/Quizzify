let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 300; // 5 minutes in seconds
let questions;
let timerRunning = true;

// Load questions from the JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
        startTimer();
    });

// Load a question and its options
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    document.getElementById('choices').innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('btn');
        // এখানে লেটার আর অপশন যোগ করলাম
        button.textContent = `${letters[index]}. ${option}`;
        button.onclick = () => checkAnswer(option);
        document.getElementById('choices').appendChild(button);
    });

    updateProgress();
}

// Check if the answer is correct
function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (Array.isArray(correctAnswer)) {
        if (correctAnswer.includes(selectedOption)) {
            score++;
        }
    } else if (selectedOption === correctAnswer) {
        score++;
    }

    // Update score and go to the next question
    document.getElementById('current-score').textContent = `Your score: ${score}`;
    nextQuestion();
}

// Move to the next question
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < 15) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progressBarFull');
    const progressText = document.getElementById('progress-text');

    // Update progress bar width
    progressBar.style.width = `${(currentQuestionIndex / 15) * 100}%`;

    // Update progress text (e.g., "3 of 15")
    progressText.textContent = `${currentQuestionIndex} of 15`;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (timerRunning) {
                endQuiz();
            }
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// End the quiz
function endQuiz() {
    timerRunning = false;
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('progressBar').classList.add('hidden');
    document.getElementById('choices').classList.add('hidden');
    document.getElementById('question').textContent = `Quiz Finished! You scored ${score} out of 15`;
    document.getElementById('restart-btn').classList.remove('hidden');
}
// Toggle dark mode

const darkModeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeIcon.textContent = "🌞";  // light mode icon
    } else {
        themeIcon.textContent = "🌙";  // dark mode icon
    }
});


// Restart the quiz
document.getElementById('restart-btn').addEventListener('click', () => {
    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 300;
    document.getElementById('current-score').textContent = `Your score: ${score}`;
    document.getElementById('timer').classList.remove('hidden');
    document.getElementById('progressBar').classList.remove('hidden');
    document.getElementById('choices').classList.remove('hidden');
    document.getElementById('restart-btn').classList.add('hidden');
    loadQuestion();
    startTimer();
});
