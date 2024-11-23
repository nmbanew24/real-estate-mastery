document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous messages
        messageDiv.innerHTML = '';
        messageDiv.className = '';

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        if (formData.password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            // Show loading state
            const submitButton = registrationForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Registering...';

            // Send registration request
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Registration successful! Please check your email for verification.', 'success');
                registrationForm.reset();
                
                // Redirect to verification pending page
                setTimeout(() => {
                    window.location.href = '/registration-complete.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // Password visibility toggle
    const togglePassword = document.querySelectorAll('.toggle-password');
    togglePassword.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    // Helper function to show messages
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Contains number
        if (/\d/.test(password)) strength += 1;
        
        // Contains letter
        if (/[a-zA-Z]/.test(password)) strength += 1;
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Update strength indicator
        strengthIndicator.className = 'password-strength';
        switch(strength) {
            case 0:
                strengthIndicator.textContent = 'Weak';
                strengthIndicator.classList.add('weak');
                break;
            case 2:
                strengthIndicator.textContent = 'Medium';
                strengthIndicator.classList.add('medium');
                break;
            case 3:
            case 4:
                strengthIndicator.textContent = 'Strong';
                strengthIndicator.classList.add('strong');
                break;
            default:
                strengthIndicator.textContent = 'Very Weak';
                strengthIndicator.classList.add('very-weak');
        }
    });
});
