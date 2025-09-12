let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let totalQuestions = 0;
let selectedAnswer = null;
let quizConfig = {};

const loadingScreen = document.getElementById('loadingScreen');
const resultsScreen = document.getElementById('resultsScreen');
const currentScoreEl = document.getElementById('currentScore');
const progressFill = document.getElementById('progressFill');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const categoryBadge = document.getElementById('categoryBadge');
const questionText = document.getElementById('questionText');
const answerContainer = document.getElementById('answerContainer');
const nextButton = document.getElementById('nextButton');
const resultsButton = document.getElementById('resultsButton');

const finalScore = document.getElementById('finalScore');
const correctCount = document.getElementById('correctCount');
const accuracy = document.getElementById('accuracy');
const newHighScore = document.getElementById('newHighScore');
const scoreMessage = document.getElementById('scoreMessage');
const playAgainButton = document.getElementById('playAgainButton');
const homeButton = document.getElementById('homeButton');
const highscoreButton = document.getElementById('highscoreButton');

const categoryNames = {
    9: "General Knowledge", 10: "Books", 11: "Film", 12: "Music",
    13: "Musicals & Theatres", 14: "Television", 15: "Video Games",
    16: "Board Games", 17: "Science & Nature", 18: "Computers",
    19: "Mathematics", 20: "Mythology", 21: "Sports", 22: "Geography",
    23: "History", 24: "Politics", 25: "Art", 26: "Celebrities", 27: "Animals"
};

function initQuiz() {
    const params = new URLSearchParams(window.location.search);
    quizConfig = {
        amount: params.get('amount') || 10,
        category: params.get('category') || 9,
        difficulty: params.get('difficulty') || 'easy',
        type: params.get('type') || 'multiple'
    };
    fetchQuestions();
}

function saveQuizResult() {
    const username = localStorage.getItem('currentUser') || 'Anonymous';
    let allScores = JSON.parse(localStorage.getItem('triviaHighscores')) || [];

    const newScore = {
        username: username,
        score: currentScore,
        totalQuestions: totalQuestions,
        category: quizConfig.category,
        difficulty: quizConfig.difficulty,
        date: new Date().toISOString()
    };

    allScores.push(newScore);
    localStorage.setItem('triviaHighscores', JSON.stringify(allScores));

    const userScoresForCategory = allScores.filter(s => s.username === username && s.category === quizConfig.category);
    const maxScore = Math.max(...userScoresForCategory.map(s => s.score));
    
    return currentScore >= maxScore && userScoresForCategory.length > 1;
}


async function fetchQuestions() {
    try {
        const url = `https://opentdb.com/api.php?amount=${quizConfig.amount}&category=${quizConfig.category}&difficulty=${quizConfig.difficulty}&type=${quizConfig.type}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.response_code === 0) {
            currentQuestions = data.results;
            totalQuestions = currentQuestions.length;
            totalQuestionsEl.textContent = totalQuestions;
            categoryBadge.textContent = categoryNames[quizConfig.category] || 'Unknown';
            loadingScreen.style.display = 'none';
            displayQuestion();
        } else {
            throw new Error('Failed to fetch questions');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        useSampleQuestions();
    }
}

function useSampleQuestions() {
    currentQuestions = [
        { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "What is the capital of France?", correct_answer: "Paris", incorrect_answers: ["London", "Berlin", "Madrid"] },
        { category: "General Knowledge", type: "boolean", difficulty: "easy", question: "The Great Wall of China is visible from space.", correct_answer: "False", incorrect_answers: ["True"] }
    ];
    totalQuestions = currentQuestions.length;
    totalQuestionsEl.textContent = totalQuestions;
    categoryBadge.textContent = "General Knowledge";
    loadingScreen.style.display = 'none';
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    questionText.innerHTML = decodeHtml(question.question);
    
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);
    
    answerContainer.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.innerHTML = decodeHtml(answer);
        button.addEventListener('click', () => selectAnswer(button, answer, question.correct_answer));
        answerContainer.appendChild(button);
    });
    
    nextButton.style.display = 'none';
    resultsButton.style.display = 'none';
    selectedAnswer = null;
}

function selectAnswer(buttonEl, selectedAns, correctAns) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = selectedAns;
    const isCorrect = selectedAns === correctAns;
    
    if (isCorrect) {
        currentScore++;
        currentScoreEl.textContent = currentScore;
    }
    
    document.querySelectorAll('.answer-button').forEach(btn => {
        btn.classList.add('disabled');
        if (btn.innerHTML === decodeHtml(correctAns)) {
            btn.classList.add('correct');
        } else if (btn === buttonEl && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    setTimeout(() => {
        if (currentQuestionIndex === totalQuestions - 1) {
            resultsButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
        }
    }, 1500);
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showResults() {
    const isNewHighScore = saveQuizResult();
    const accuracyPercent = Math.round((currentScore / totalQuestions) * 100);
    
    finalScore.textContent = currentScore;
    document.querySelector('.score-total').textContent = `/ ${totalQuestions}`;
    correctCount.textContent = currentScore;
    accuracy.textContent = `${accuracyPercent}%`;
    newHighScore.textContent = isNewHighScore ? 'Yes!' : 'No';
    
    if (accuracyPercent >= 90) scoreMessage.textContent = 'Outstanding performance!';
    else if (accuracyPercent >= 70) scoreMessage.textContent = 'Great job!';
    else if (accuracyPercent >= 50) scoreMessage.textContent = 'Good effort!';
    else scoreMessage.textContent = 'Keep practicing!';
    
    resultsScreen.style.display = 'flex';
}

function playAgain() {
    window.location.reload();
}

function goHome() {
    window.location.href = 'index.html';
}

function viewHighscores() {
    window.location.href = 'highscore.html';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

nextButton.addEventListener('click', nextQuestion);
resultsButton.addEventListener('click', showResults);
playAgainButton.addEventListener('click', playAgain);
homeButton.addEventListener('click', goHome);
highscoreButton.addEventListener('click', viewHighscores);

document.addEventListener('DOMContentLoaded', initQuiz);
