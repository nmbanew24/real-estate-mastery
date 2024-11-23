// User Management
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                this.login(email, password, rememberMe);
            });
        }

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const agreeTerms = document.getElementById('agreeTerms').checked;
                this.register(name, email, password, confirmPassword, agreeTerms);
            });
        }

        // Social login buttons
        const googleButton = document.querySelector('.social-button.google');
        if (googleButton) {
            googleButton.addEventListener('click', () => this.socialLogin('google'));
        }

        const facebookButton = document.querySelector('.social-button.facebook');
        if (facebookButton) {
            facebookButton.addEventListener('click', () => this.socialLogin('facebook'));
        }
    }

    register(name, email, password, confirmPassword, agreeTerms) {
        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the Terms and Privacy Policy', 'error');
            return;
        }

        // Check if user already exists
        if (this.users.some(user => user.email === email)) {
            this.showNotification('Email already registered', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: this.hashPassword(password), // In production, use proper password hashing
            courses: [],
            progress: {},
            achievements: [],
            joinDate: new Date().toISOString()
        };

        // Add user to storage
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Show success message and redirect
        this.showNotification('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = 'registration-complete.html';
        }, 2000);
    }

    login(email, password, rememberMe) {
        const user = this.users.find(u => u.email === email && u.password === this.hashPassword(password));

        if (!user) {
            this.showNotification('Invalid email or password', 'error');
            return;
        }

        // Set current user
        this.currentUser = { ...user, password: undefined }; // Don't store password in session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        if (rememberMe) {
            localStorage.setItem('rememberedUser', email);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Show success message and redirect
        this.showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    socialLogin(provider) {
        // In production, implement actual OAuth flow
        this.showNotification(`${provider} login not implemented yet`, 'info');
    }

    hashPassword(password) {
        // In production, use proper password hashing
        return btoa(password);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Animate
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // User data management
    updateUserProgress(courseId, progress) {
        if (!this.currentUser) return;

        this.currentUser.progress[courseId] = progress;
        this.updateUser(this.currentUser);
    }

    addCourse(courseId) {
        if (!this.currentUser) return;

        if (!this.currentUser.courses.includes(courseId)) {
            this.currentUser.courses.push(courseId);
            this.updateUser(this.currentUser);
        }
    }

    addAchievement(achievement) {
        if (!this.currentUser) return;

        this.currentUser.achievements.push({
            ...achievement,
            date: new Date().toISOString()
        });
        this.updateUser(this.currentUser);
    }

    updateUser(userData) {
        // Update local storage
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Update users array
        const userIndex = this.users.findIndex(u => u.id === userData.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }
}

// Initialize user manager
const userManager = new UserManager();

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: var(--white);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: var(--text-color);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        background: #4caf50;
        color: white;
    }

    .notification.error {
        background: #f44336;
        color: white;
    }

    .notification.info {
        background: var(--luxury-gold);
        color: white;
    }
`;
document.head.appendChild(style);

// Export for use in other files
window.userManager = userManager;
