let allHighscores = [];
let filteredHighscores = [];

const categoryFilter = document.getElementById('categoryFilter');
const totalPlayersEl = document.getElementById('totalPlayers');
const topScoreEl = document.getElementById('topScore');
const averageScoreEl = document.getElementById('averageScore');
const scoresListEl = document.getElementById('scoresList');
const noScoresEl = document.getElementById('noScores');
const podium1 = document.getElementById('podium1');
const podium2 = document.getElementById('podium2');
const podium3 = document.getElementById('podium3');

const homeButton = document.getElementById('homeButton');
const playButton = document.getElementById('playButton');
const clearScoresButton = document.getElementById('clearScoresButton');

const categoryNames = {
    9: "General Knowledge", 10: "Books", 11: "Film", 12: "Music",
    13: "Musicals & Theatres", 14: "Television", 15: "Video Games",
    16: "Board Games", 17: "Science & Nature", 18: "Computers",
    19: "Mathematics", 20: "Mythology", 21: "Sports", 22: "Geography",
    23: "History", 24: "Politics", 25: "Art", 26: "Celebrities", 27: "Animals"
};

function initHighscores() {
    loadHighscores();
    setupEventListeners();
    filterHighscores(); 
}

function loadHighscores() {
    const stored = localStorage.getItem('triviaHighscores');
    if (stored) {
        allHighscores = JSON.parse(stored);
    } else {
        allHighscores = [];
    }
    
    allHighscores = allHighscores.filter(score => score.score >= 1);
    allHighscores.sort((a, b) => b.score - a.score);
}

function saveHighscores() {
    localStorage.setItem('triviaHighscores', JSON.stringify(allHighscores));
}

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

function showNoScores() {
    noScoresEl.style.display = 'block';
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.highscores-box').style.display = 'none';
}

function hideNoScores() {
    noScoresEl.style.display = 'none';
    document.querySelector('.stats-grid').style.display = 'grid';
    document.querySelector('.highscores-box').style.display = 'block';
}

function updateStatistics() {
    const totalPlayers = new Set(filteredHighscores.map(score => score.username)).size;
    const topScore = Math.max(0, ...filteredHighscores.map(score => score.score));
    const averageScore = filteredHighscores.length > 0 ? Math.round(
        filteredHighscores.reduce((sum, score) => sum + score.score, 0) / filteredHighscores.length
    ) : 0;
    
    animateNumber(totalPlayersEl, totalPlayers);
    animateNumber(topScoreEl, topScore);
    animateNumber(averageScoreEl, averageScore);
}

function animateNumber(element, targetValue) {
    let current = parseInt(element.textContent) || 0;
    if (current === targetValue) return;

    const duration = 500;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = (targetValue - current) / totalSteps;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current);
        }
    }, stepTime);
}

function updatePodium() {
    const podiumElements = [podium1, podium2, podium3];
    podiumElements.forEach(el => el.style.display = 'none');
    
    const sortedScores = [...filteredHighscores].sort((a, b) => b.score - a.score);

    for (let i = 0; i < Math.min(3, sortedScores.length); i++) {
        const score = sortedScores[i];
        const podiumEl = podiumElements[i];
        
        if (podiumEl) {
            podiumEl.querySelector('.podium-name').textContent = score.username;
            podiumEl.querySelector('.podium-score').textContent = `${score.score}/${score.totalQuestions || 10}`;
            podiumEl.querySelector('.podium-category').textContent = categoryNames[score.category] || 'Unknown';
            podiumEl.style.display = 'block';
        }
    }
}

function updateScoresList() {
    scoresListEl.innerHTML = '';
    const sortedScores = [...filteredHighscores].sort((a, b) => b.score - a.score);
    const listScores = sortedScores.length > 3 ? sortedScores.slice(3) : [];
    
    listScores.forEach((score, index) => {
        const row = document.createElement('div');
        const rank = index + 4;
        const date = new Date(score.date).toLocaleDateString();
        
        row.className = `score-row rank-${rank}`;
        row.innerHTML = `
            <div class="rank-col">#${rank}</div>
            <div class="name-col">${score.username}</div>
            <div class="score-col">${score.score}/${score.totalQuestions || 10}</div>
            <div class="category-col">${categoryNames[score.category] || 'Unknown'}</div>
            <div class="date-col">${date}</div>
        `;
        scoresListEl.appendChild(row);
    });
}

function clearAllScores() {
    if (confirm('Are you sure you want to clear all highscores? This cannot be undone!')) {
        allHighscores = [];
        saveHighscores();
        filterHighscores();
    }
}

function goHome() {
    window.location.href = '../HTML/index.html';
}

function startQuiz() {
    window.location.href = '../HTML/index.html';
}

function setupEventListeners() {
    categoryFilter.addEventListener('change', filterHighscores);
    homeButton.addEventListener('click', goHome);
    playButton.addEventListener('click', startQuiz);
    clearScoresButton.addEventListener('click', clearAllScores);
}

document.addEventListener('DOMContentLoaded', initHighscores);

window.TriviaHighscores = {
    addHighscore: addHighscore
};