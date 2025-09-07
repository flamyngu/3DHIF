document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    const userScoresEl = document.getElementById('userScores');
    const noScoresMessageEl = document.getElementById('noScoresMessage');
    const switchAccountBtn = document.getElementById('switchAccountBtn');
    const goHomeBtn = document.getElementById('goHomeBtn');

    const categoryNames = {
        9: "General Knowledge", 10: "Books", 11: "Film", 12: "Music",
        13: "Musicals & Theatres", 14: "Television", 15: "Video Games",
        16: "Board Games", 17: "Science & Nature", 18: "Computers",
        19: "Mathematics", 20: "Mythology", 21: "Sports", 22: "Geography",
        23: "History", 24: "Politics", 25: "Art", 26: "Celebrities", 27: "Animals"
    };

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../HTML/login.html';
        return;
    }

    usernameEl.textContent = currentUser;

    const allScores = JSON.parse(localStorage.getItem('triviaHighscores')) || [];
    const userScores = allScores.filter(score => score.username === currentUser);

    if (userScores.length === 0) {
        noScoresMessageEl.style.display = 'block';
    } else {
        const scoresByCategory = userScores.reduce((acc, score) => {
            const category = score.category;
            if (!acc[category] || score.score > acc[category].score) {
                acc[category] = score;
            }
            return acc;
        }, {});

        for (const categoryId in scoresByCategory) {
            const score = scoresByCategory[categoryId];
            const card = document.createElement('div');
            card.className = 'score-card';
            card.innerHTML = `
                <div class="category-name">${categoryNames[categoryId] || 'Unknown Category'}</div>
                <div class="score-value">${score.score} / ${score.totalQuestions}</div>
            `;
            userScoresEl.appendChild(card);
        }
    }

    switchAccountBtn.addEventListener('click', () => {
        if (confirm('Möchtest du dich wirklich abmelden?')) {
            localStorage.removeItem('currentUser');
            window.location.href = '../HTML/login.html';
        }
    });

    goHomeBtn.addEventListener('click', () => {
        window.location.href = '../HTML/index.html';
    });
});