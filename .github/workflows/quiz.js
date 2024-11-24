const quizQuestions = [
    {
        question: "What is the most effective way to build rapport with a potential client?",
        options: [
            "Talk about yourself and your achievements",
            "Listen actively and ask relevant questions about their needs",
            "Show them as many properties as possible"
        ],
        correct: 1
    },
    {
        question: "Which factor is most important when determining a property's market value?",
        options: [
            "The seller's emotional attachment to the property",
            "Recent comparable sales in the area",
            "The current owner's purchase price"
        ],
        correct: 1
    },
    {
        question: "What is the best approach when handling objections from clients?",
        options: [
            "Immediately counter their concerns",
            "Listen, acknowledge, and address concerns with relevant information",
            "Change the subject to avoid confrontation"
        ],
        correct: 1
    },
    {
        question: "Which negotiation technique is most effective in real estate?",
        options: [
            "Always starting with your highest offer",
            "Using silence and patience strategically",
            "Being aggressive and pushy"
        ],
        correct: 1
    },
    {
        question: "What is the key to a successful property presentation?",
        options: [
            "Highlighting every single feature of the property",
            "Focusing on features that match the client's specific needs",
            "Rushing through to show as many properties as possible"
        ],
        correct: 1
    }
];

class Quiz {
    constructor() {
        this.questions = quizQuestions;
        this.currentQuestion = 0;
        this.score = 0;
        this.quizContainer = document.getElementById('quiz-question');
        this.nextButton = document.querySelector('.next-button');
        this.nextButton.addEventListener('click', () => this.checkAnswer());
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.quizContainer.innerHTML = `
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="answer" value="${index}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
            <button class="next-button">Next Question</button>
        `;

        this.nextButton = document.querySelector('.next-button');
        this.nextButton.addEventListener('click', () => this.checkAnswer());
    }

    checkAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedOption) {
            alert('Please select an answer!');
            return;
        }

        const answer = parseInt(selectedOption.value);
        if (answer === this.questions[this.currentQuestion].correct) {
            this.score++;
        }

        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const percentage = (this.score / this.questions.length) * 100;
        this.quizContainer.innerHTML = `
            <h3>Quiz Complete!</h3>
            <p>Your Score: ${this.score} out of ${this.questions.length}</p>
            <p>Percentage: ${percentage}%</p>
            ${percentage < 70 ? 
                `<p>Need to improve? Check out our <a href="#premium">Premium Course</a>!</p>` :
                '<p>Great job! You show excellent understanding of real estate sales principles!</p>'
            }
            <button class="next-button" onclick="new Quiz()">Restart Quiz</button>
        `;
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
