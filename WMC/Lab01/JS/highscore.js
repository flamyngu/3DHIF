// Highscores State
let allHighscores = [];
let filteredHighscores = [];

// DOM Elements
const categoryFilter = document.getElementById('categoryFilter');
const totalPlayersEl = document.getElementById('totalPlayers');
const topScoreEl = document.getElementById('topScore');
const averageScoreEl = document.getElementById('averageScore');
const scoresListEl = document.getElementById('scoresList');
const noScoresEl = document.getElementById('noScores');
const podium1 = document.getElementById('podium1');
const podium2 = document.getElementById('podium2');
const podium3 = document.getElementById('podium3');

// Navigation buttons
const homeButton = document.getElementById('homeButton');
const playButton = document.getElementById('playButton');
const playNowButton = document.getElementById('playNowButton');
const clearScoresButton = document.getElementById('clearScoresButton');

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

// Initialize page
function initHighscores() {
    loadHighscores();
    setupEventListeners();
    displayHighscores();
}

// Load highscores from localStorage
function loadHighscores() {
    try {
        // Try to load from localStorage
        const stored = localStorage.getItem('triviaAllHighscores');
        if (stored) {
            allHighscores = JSON.parse(stored);
        } else {
            // Use demo data if localStorage is empty
            allHighscores = generateDemoData();
        }
    } catch (error) {
        console.log('localStorage not available, using demo data');
        // Fallback demo data for Claude.ai environment
        allHighscores = generateDemoData();
    }
    
    // Filter out scores less than 1
    allHighscores = allHighscores.filter(score => score.score >= 1);
    
    // Sort by score (highest first)
    allHighscores.sort((a, b) => b.score - a.score);
}



// Save highscores to localStorage
function saveHighscores() {
    try {
        localStorage.setItem('triviaAllHighscores', JSON.stringify(allHighscores));
    } catch (error) {
        console.log('Cannot save to localStorage');
    }
}

// Add a new highscore (called from quiz page)
function addHighscore(username, score, category, difficulty, totalQuestions) {
    const newScore = {
        username: username,
        score: score,
        category: category,
        difficulty: difficulty,
        date: new Date().toISOString(),
        totalQuestions: totalQuestions
    };
    
    allHighscores.push(newScore);
    allHighscores.sort((a, b) => b.score - a.score);
    saveHighscores();
}

// Filter highscores by category
function filterHighscores() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        filteredHighscores = [...allHighscores];
    } else {
        filteredHighscores = allHighscores.filter(score => 
            score.category.toString() === selectedCategory
        );
    }
    
    displayHighscores();
}

// Display highscores
function displayHighscores() {
    if (filteredHighscores.length === 0) {
        showNoScores();
        return;
    }
    
    hideNoScores();
    updateStatistics();
    updatePodium();
    updateScoresList();
}

// Show no scores message
function showNoScores() {
    noScoresEl.style.display = 'block';
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.highscores-box').style.display = 'none';
}

// Hide no scores message
function hideNoScores() {
    noScoresEl.style.display = 'none';
    document.querySelector('.stats-grid').style.display = 'grid';
    document.querySelector('.highscores-box').style.display = 'block';
}

// Update statistics cards
function updateStatistics() {
    const totalPlayers = new Set(filteredHighscores.map(score => score.username)).size;
    const topScore = Math.max(...filteredHighscores.map(score => score.score));
    const averageScore = Math.round(
        filteredHighscores.reduce((sum, score) => sum + score.score, 0) / filteredHighscores.length
    );
    
    // Animate number changes
    animateNumber(totalPlayersEl, totalPlayers);
    animateNumber(topScoreEl, topScore);
    animateNumber(averageScoreEl, averageScore);
}

// Animate number changes
function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 500;
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = duration / Math.max(steps, 1);
    
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// Update podium (top 3)
function updatePodium() {
    const podiumElements = [podium1, podium2, podium3];
    
    // Hide all podium places first
    podiumElements.forEach(el => el.style.display = 'none');
    
    // Show top 3 if they exist
    for (let i = 0; i < Math.min(3, filteredHighscores.length); i++) {
        const score = filteredHighscores[i];
        const podiumEl = podiumElements[i];
        
        if (podiumEl) {
            const nameEl = podiumEl.querySelector('.podium-name');
            const scoreEl = podiumEl.querySelector('.podium-score');
            const categoryEl = podiumEl.querySelector('.podium-category');
            
            nameEl.textContent = score.username;
            scoreEl.textContent = `${score.score}/${score.totalQuestions || 10}`;
            categoryEl.textContent = categoryNames[score.category] || 'Unknown';
            
            podiumEl.style.display = 'block';
            
            // Add entrance animation
            podiumEl.style.opacity = '0';
            podiumEl.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                podiumEl.style.transition = 'all 0.5s ease';
                podiumEl.style.opacity = '1';
                podiumEl.style.transform = 'translateY(0)';
            }, i * 200);
        }
    }
}

// Update scores list
function updateScoresList() {
    scoresListEl.innerHTML = '';
    
    // Skip top 3 for the list if we have more than 3 scores
    const listScores = filteredHighscores.length > 3 ? filteredHighscores.slice(3) : [];
    
    listScores.forEach((score, index) => {
        const row = document.createElement('div');
        row.className = `score-row rank-${index + 4}`;
        
        const rank = index + 4; // +4 because we skip top 3
        const date = new Date(score.date).toLocaleDateString();
        
        row.innerHTML = `
            <div class="rank-col">#${rank}</div>
            <div class="name-col">${score.username}</div>
            <div class="score-col">${score.score}/${score.totalQuestions || 10}</div>
            <div class="category-col">${categoryNames[score.category] || 'Unknown'}</div>
            <div class="date-col">${date}</div>
        `;
        
        // Add entrance animation
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        scoresListEl.appendChild(row);
        
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// Clear all scores
function clearAllScores() {
    if (confirm('Are you sure you want to clear all highscores? This cannot be undone!')) {
        allHighscores = [];
        filteredHighscores = [];
        saveHighscores();
        displayHighscores();
        
        // Show success message
        setTimeout(() => {
            alert('All highscores have been cleared!');
        }, 300);
    }
}

// Navigation functions
function goHome() {
    window.location.href = 'index.html';
}

function startQuiz() {
    window.location.href = 'index.html';
}

// Setup event listeners
function setupEventListeners() {
    categoryFilter.addEventListener('change', filterHighscores);
    homeButton.addEventListener('click', goHome);
    playButton.addEventListener('click', startQuiz);
    playNowButton.addEventListener('click', startQuiz);
    clearScoresButton.addEventListener('click', clearAllScores);
    
    // Initialize with all categories
    filteredHighscores = [...allHighscores];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initHighscores);

// Export function for other pages to use
window.TriviaHighscores = {
    addHighscore: addHighscore
};