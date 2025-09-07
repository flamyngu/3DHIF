// Quiz State
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let totalQuestions = 0;
let selectedAnswer = null;
let quizConfig = {};

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const resultsScreen = document.getElementById('resultsScreen');
const currentScoreEl = document.getElementById('currentScore');
const highScoreEl = document.getElementById('highScore');
const progressFill = document.getElementById('progressFill');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const categoryBadge = document.getElementById('categoryBadge');
const questionText = document.getElementById('questionText');
const answerContainer = document.getElementById('answerContainer');
const nextButton = document.getElementById('nextButton');
const resultsButton = document.getElementById('resultsButton');

// Results elements
const finalScore = document.getElementById('finalScore');
const correctCount = document.getElementById('correctCount');
const accuracy = document.getElementById('accuracy');
const newHighScore = document.getElementById('newHighScore');
const scoreMessage = document.getElementById('scoreMessage');
const playAgainButton = document.getElementById('playAgainButton');
const homeButton = document.getElementById('homeButton');

// Category mapping
const categoryNames = {
    9: "General Knowledge",
    10: "Books",
    11: "Film",
    12: "Music",
    13: "Musicals & Theatres", 
    14: "Television",
    15: "Video Games",
    16: "Board Games",
    17: "Science & Nature",
    18: "Computers",
    19: "Mathematics",
    20: "Mythology",
    21: "Sports",
    22: "Geography",
    23: "History",
    24: "Politics",
    25: "Art",
    26: "Celebrities",
    27: "Animals"
};

// Initialize quiz
function initQuiz() {
    // Get quiz config from URL params or use defaults
    const params = new URLSearchParams(window.location.search);
    quizConfig = {
        amount: params.get('amount') || 10,
        category: params.get('category') || 9,
        difficulty: params.get('difficulty') || 'easy',
        type: params.get('type') || 'multiple'
    };
    
    loadHighScore();
    fetchQuestions();
}

// Load high score from localStorage
function loadHighScore() {
    try {
        const highScore = localStorage.getItem('triviaHighScore') || 0;
        highScoreEl.textContent = highScore;
    } catch (error) {
        console.log('localStorage not available, using session storage');
        highScoreEl.textContent = '0';
    }
}

// Save high score to localStorage
function saveHighScore(score) {
    try {
        const currentHigh = parseInt(localStorage.getItem('triviaHighScore')) || 0;
        if (score > currentHigh) {
            localStorage.setItem('triviaHighScore', score.toString());
            return true; // New high score
        }
    } catch (error) {
        console.log('localStorage not available');
    }
    return false; // Not a new high score
}

// Fetch questions from API
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
            
            // Hide loading screen and start quiz
            loadingScreen.style.display = 'none';
            displayQuestion();
        } else {
            throw new Error('Failed to fetch questions');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        // Use sample questions for demo
        useSampleQuestions();
    }
}

// Use sample questions if API fails
function useSampleQuestions() {
    currentQuestions = [
        {
            category: "General Knowledge",
            type: "multiple",
            difficulty: "easy",
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"]
        },
        {
            category: "General Knowledge", 
            type: "boolean",
            difficulty: "easy",
            question: "The Great Wall of China is visible from space.",
            correct_answer: "False",
            incorrect_answers: ["True"]
        }
    ];
    
    totalQuestions = currentQuestions.length;
    totalQuestionsEl.textContent = totalQuestions;
    categoryBadge.textContent = "General Knowledge";
    
    loadingScreen.style.display = 'none';
    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    
    // Display question
    questionText.innerHTML = decodeHtml(question.question);
    
    // Create answer options
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);
    
    answerContainer.innerHTML = '';
    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.innerHTML = decodeHtml(answer);
        button.addEventListener('click', () => selectAnswer(button, answer, question.correct_answer));
        answerContainer.appendChild(button);
    });
    
    // Hide next button
    nextButton.style.display = 'none';
    resultsButton.style.display = 'none';
    selectedAnswer = null;
}

// Handle answer selection
function selectAnswer(buttonEl, selectedAns, correctAns) {
    if (selectedAnswer !== null) return; // Already answered
    
    selectedAnswer = selectedAns;
    const isCorrect = selectedAns === correctAns;
    
    // Update score
    if (isCorrect) {
        currentScore++;
        currentScoreEl.textContent = currentScore;
    }
    
    // Show visual feedback
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach(btn => {
        btn.classList.add('disabled');
        
        if (btn.innerHTML === decodeHtml(correctAns)) {
            btn.classList.add('correct');
        } else if (btn === buttonEl && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Show next button after delay
    setTimeout(() => {
        if (currentQuestionIndex === totalQuestions - 1) {
            resultsButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
        }
    }, 1500);
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Show results screen
function showResults() {
    const isNewHighScore = saveHighScore(currentScore);
    const accuracyPercent = Math.round((currentScore / totalQuestions) * 100);
    
    // Update results display
    finalScore.textContent = currentScore;
    document.querySelector('.score-total').textContent = `/ ${totalQuestions}`;
    correctCount.textContent = currentScore;
    accuracy.textContent = `${accuracyPercent}%`;
    newHighScore.textContent = isNewHighScore ? 'Yes!' : 'No';
    
    // Update high score display
    if (isNewHighScore) {
        highScoreEl.textContent = currentScore;
    }
    
    // Set score message
    if (accuracyPercent >= 90) {
        scoreMessage.textContent = '🏆 Outstanding performance!';
    } else if (accuracyPercent >= 70) {
        scoreMessage.textContent = '🎉 Great job!';
    } else if (accuracyPercent >= 50) {
        scoreMessage.textContent = '👍 Good effort!';
    } else {
        scoreMessage.textContent = '💪 Keep practicing!';
    }
    
    // Show results screen
    resultsScreen.style.display = 'flex';
}

// Restart quiz
function playAgain() {
    // Reset quiz state
    currentQuestionIndex = 0;
    currentScore = 0;
    selectedAnswer = null;
    currentScoreEl.textContent = '0';
    
    // Hide results screen
    resultsScreen.style.display = 'none';
    
    // Show loading and fetch new questions
    loadingScreen.style.display = 'flex';
    setTimeout(() => {
        fetchQuestions();
    }, 1000);
}

// Go back to home
function goHome() {
    window.location.href = 'index.html';
}

// Utility functions
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

// Event listeners
nextButton.addEventListener('click', nextQuestion);
resultsButton.addEventListener('click', showResults);
playAgainButton.addEventListener('click', playAgain);
homeButton.addEventListener('click', goHome);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initQuiz);