const form = document.getElementById('triviaForm');
const questionCountInput = document.getElementById('questionCount');
const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const typeSelect = document.getElementById('type');
const apiUrlDisplay = document.getElementById('apiUrl');
const startButton = document.getElementById('startButton');

const BASE_URL = 'https://opentdb.com/api.php';

function updateApiUrl() {
    const amount = questionCountInput.value || 10;
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
    
    let url = `${BASE_URL}?amount=${amount}`;
    
    if (category) {
        url += `&category=${category}`;
    }
    
    if (difficulty) {
        url += `&difficulty=${difficulty}`;
    }
    
    if (type) {
        url += `&type=${type}`;
    }
    
    apiUrlDisplay.textContent = url;
    return url;
}

function setupEventListeners() {
    [questionCountInput, categorySelect, difficultySelect, typeSelect].forEach(element => {
        element.addEventListener('change', updateApiUrl);
        element.addEventListener('input', updateApiUrl);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
   
    const amount = questionCountInput.value || 10;
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
 
    startButton.classList.add('loading');
    startButton.innerHTML = '<span>Starting Quiz...</span>';
   
    const params = new URLSearchParams({
        amount: amount,
        category: category,
        difficulty: difficulty,
        type: type
    });

    setTimeout(() => {
        window.location.href = `trivia.html?${params.toString()}`;
    }, 800);
}

function validateQuestionCount() {
    const value = parseInt(questionCountInput.value);
    if (value < 1) {
        questionCountInput.value = 1;
    } else if (value > 100) {
        questionCountInput.value = 100;
    }
    updateApiUrl();
}

function init() {
    setupEventListeners();
    form.addEventListener('submit', handleFormSubmit);
    questionCountInput.addEventListener('blur', validateQuestionCount);

    updateApiUrl();

    const formElements = document.querySelectorAll('select, input[type="number"]');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

document.addEventListener('DOMContentLoaded', init);

