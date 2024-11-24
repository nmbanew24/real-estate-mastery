// Quiz Questions Database
const quizQuestions = [
    {
        question: "What is the primary purpose of a real estate comparative market analysis (CMA)?",
        options: [
            "To determine property taxes",
            "To estimate a property's value",
            "To assess structural integrity",
            "To calculate mortgage rates"
        ],
        correct: 1
    },
    {
        question: "Which factor most directly affects a property's market value?",
        options: [
            "The age of the roof",
            "The color of the front door",
            "Location",
            "The owner's purchase price"
        ],
        correct: 2
    },
    // Add more questions here
];

let currentQuestion = 0;
let userAnswers = new Array(quizQuestions.length).fill(null);
let timeLeft = 1800; // 30 minutes in seconds

// Timer Function
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        submitQuiz();
    }
}

// Update Question Display
function displayQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCount').textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    
    // Update options
    question.options.forEach((option, index) => {
        const optionElement = document.getElementById(`option${index + 1}`);
        optionElement.nextElementSibling.textContent = option;
        optionElement.checked = userAnswers[currentQuestion] === index;
    });
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
    
    // Update navigation buttons
    document.getElementById('prevQuestion').disabled = currentQuestion === 0;
    document.getElementById('nextQuestion').disabled = currentQuestion === quizQuestions.length - 1;
}

// Navigation Functions
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// Save Answer
function saveAnswer(selectedOption) {
    userAnswers[currentQuestion] = parseInt(selectedOption);
}

// Submit Quiz
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    const score = userAnswers.reduce((total, answer, index) => {
        return total + (answer === quizQuestions[index].correct ? 1 : 0);
    }, 0);
    
    const percentage = (score / quizQuestions.length) * 100;
    
    // Create result display
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <h2>Quiz Results</h2>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-number">${percentage.toFixed(1)}%</span>
                </div>
                <p>You got ${score} out of ${quizQuestions.length} questions correct!</p>
            </div>
            <button onclick="location.reload()" class="submit-button">Try Again</button>
            <button onclick="window.location.href='quiz.html'" class="submit-button">Back to Quizzes</button>
        </div>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();
    
    // Start timer
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Navigation buttons
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('prevQuestion').addEventListener('click', previousQuestion);
    
    // Answer selection
    document.querySelectorAll('input[name="answer"]').forEach(option => {
        option.addEventListener('change', (e) => {
            saveAnswer(e.target.value);
        });
    });
    
    // Submit button
    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);
});
