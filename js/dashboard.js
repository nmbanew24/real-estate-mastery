document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    initializeDashboard();
});

function initializeDashboard() {
    const user = auth.getCurrentUser();
    updateUserInfo(user);
    initializeProgressCircles();
    loadRecentActivity();
    loadRecommendations();
    loadAchievements();
    loadUpcomingEvents();
    initializeAnimations();
}

function updateUserInfo(user) {
    document.getElementById('userNameHeader').textContent = user.name;
    document.getElementById('lastLogin').textContent = new Date().toLocaleString();
}

function initializeProgressCircles() {
    const circles = document.querySelectorAll('.circular-progress');
    circles.forEach(circle => {
        const progress = parseInt(circle.dataset.progress);
        animateProgress(circle, progress);
    });
}

function animateProgress(element, targetProgress) {
    let progress = 0;
    const speed = 1000 / targetProgress; // Adjust animation speed

    const interval = setInterval(() => {
        if (progress >= targetProgress) {
            clearInterval(interval);
        } else {
            progress++;
            element.style.background = `conic-gradient(
                var(--accent-color) ${progress * 3.6}deg,
                var(--primary-color) ${progress * 3.6}deg
            )`;
            element.querySelector('.progress-value').textContent = progress + '%';
        }
    }, speed);
}

function loadRecentActivity() {
    const activities = [
        {
            type: 'course',
            icon: 'book',
            text: 'Started "Real Estate Fundamentals"',
            time: '2 hours ago'
        },
        {
            type: 'quiz',
            icon: 'question-circle',
            text: 'Completed Quiz: Property Laws',
            time: 'Yesterday'
        },
        {
            type: 'achievement',
            icon: 'trophy',
            text: 'Earned "Quick Learner" Badge',
            time: '2 days ago'
        }
    ];

    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.map(activity => `
        <li class="activity-item" data-type="${activity.type}">
            <i class="fas fa-${activity.icon}"></i>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </li>
    `).join('');
}

function loadRecommendations() {
    const recommendations = [
        {
            title: 'Advanced Property Valuation',
            description: 'Master the art of property valuation',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            title: 'Real Estate Marketing',
            description: 'Learn modern marketing strategies',
            image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
    ];

    const recommendationsContainer = document.getElementById('courseRecommendations');
    recommendationsContainer.innerHTML = recommendations.map(course => `
        <div class="recommended-course">
            <img src="${course.image}" alt="${course.title}">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button class="button gold">Start Learning</button>
            </div>
        </div>
    `).join('');
}

function loadAchievements() {
    const achievements = [
        {
            icon: 'medal',
            name: 'First Course Completed',
            unlocked: false
        },
        {
            icon: 'award',
            name: 'Quiz Master',
            unlocked: false
        },
        {
            icon: 'star',
            name: 'Perfect Score',
            unlocked: false
        }
    ];

    const badgesGrid = document.getElementById('badgesGrid');
    badgesGrid.innerHTML = achievements.map(badge => `
        <div class="badge-item ${badge.unlocked ? 'unlocked' : 'locked'}">
            <i class="fas fa-${badge.icon}"></i>
            <span>${badge.name}</span>
        </div>
    `).join('');
}

function loadUpcomingEvents() {
    const events = [
        {
            date: { day: '15', month: 'JUN' },
            title: 'Real Estate Market Analysis Webinar',
            description: 'Learn how to analyze market trends and make informed decisions'
        },
        {
            date: { day: '22', month: 'JUN' },
            title: 'Property Investment Workshop',
            description: 'Expert insights on property investment strategies'
        }
    ];

    const eventsTimeline = document.getElementById('eventsTimeline');
    eventsTimeline.innerHTML = events.map(event => `
        <div class="event-item">
            <div class="event-date">
                <span class="date">${event.date.day}</span>
                <span class="month">${event.date.month}</span>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <button class="button">Register Now</button>
            </div>
        </div>
    `).join('');
}

function initializeAnimations() {
    // Add animation classes to dashboard cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Add hover effects to interactive elements
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('pulse');
        });
        button.addEventListener('animationend', () => {
            button.classList.remove('pulse');
        });
    });

    // Add smooth transitions for progress updates
    const progressStats = document.querySelectorAll('.stat-item');
    progressStats.forEach(stat => {
        stat.addEventListener('mouseover', () => {
            stat.classList.add('scale-up');
        });
        stat.addEventListener('mouseout', () => {
            stat.classList.remove('scale-up');
        });
    });
}
