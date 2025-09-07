// DOM Elements
const form = document.getElementById('triviaForm');
const questionCountInput = document.getElementById('questionCount');
const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const typeSelect = document.getElementById('type');
const apiUrlDisplay = document.getElementById('apiUrl');
const startButton = document.getElementById('startButton');

// Base API URL
const BASE_URL = 'https://opentdb.com/api.php';

// Update API URL based on current selections
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

// Add event listeners to all form elements
function setupEventListeners() {
    [questionCountInput, categorySelect, difficultySelect, typeSelect].forEach(element => {
        element.addEventListener('change', updateApiUrl);
        element.addEventListener('input', updateApiUrl);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const amount = questionCountInput.value || 10;
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
    
    // Add loading state to button
    startButton.classList.add('loading');
    startButton.innerHTML = '<span>Starting Quiz...</span>';
    
    // Build URL parameters for quiz page
    const params = new URLSearchParams({
        amount: amount,
        category: category,
        difficulty: difficulty,
        type: type
    });
    
    // Navigate to quiz page with parameters
    setTimeout(() => {
        window.location.href = `trivia.html?${params.toString()}`;
    }, 800);
}

// Validate question count input
function validateQuestionCount() {
    const value = parseInt(questionCountInput.value);
    if (value < 1) {
        questionCountInput.value = 1;
    } else if (value > 50) {
        questionCountInput.value = 50;
    }
    updateApiUrl();
}

// Initialize the page
function init() {
    setupEventListeners();
    form.addEventListener('submit', handleFormSubmit);
    questionCountInput.addEventListener('blur', validateQuestionCount);
    
    // Set initial URL
    updateApiUrl();
    
    // Add some visual feedback for better UX
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

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);