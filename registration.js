// Handle enrollment form submission
document.addEventListener('DOMContentLoaded', () => {
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', handleEnrollment);
    }

    // Setup verification code input handling
    setupVerificationInputs();
    
    // Setup resend buttons
    const resendEmail = document.getElementById('resendEmail');
    const resendSMS = document.getElementById('resendSMS');
    
    if (resendEmail) resendEmail.addEventListener('click', handleResendEmail);
    if (resendSMS) resendSMS.addEventListener('click', handleResendSMS);
});

// Handle the enrollment form submission
async function handleEnrollment(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Get form data
    const formData = new FormData(e.target);
    const userData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        payment: formData.get('payment')
    };

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store user data in session storage
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Send verification email and SMS (simulated)
        await sendVerificationEmail(userData.email);
        await sendVerificationSMS(userData.phone);
        
        // Redirect to confirmation page
        window.location.href = 'registration-complete.html';
    } catch (error) {
        showError('Registration failed. Please try again.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Setup verification code input handling
function setupVerificationInputs() {
    const inputs = document.querySelectorAll('.code-digit');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= 0 && e.key <= 9) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                validateVerificationCode();
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });
}

// Validate the verification code
function validateVerificationCode() {
    const inputs = document.querySelectorAll('.code-digit');
    const code = Array.from(inputs).map(input => input.value).join('');
    
    if (code.length === 6) {
        const verifyButton = document.getElementById('verifyCode');
        verifyButton.disabled = false;
    }
}

// Simulated email verification
async function sendVerificationEmail(email) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Verification email sent to ${email}`);
}

// Simulated SMS verification
async function sendVerificationSMS(phone) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Verification SMS sent to ${phone}`);
}

// Handle resend email
async function handleResendEmail() {
    const button = document.getElementById('resendEmail');
    button.disabled = true;
    button.textContent = 'Sending...';
    
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        await sendVerificationEmail(userData.email);
        showSuccess('Verification email resent!');
    } catch (error) {
        showError('Failed to resend email. Please try again.');
    } finally {
        button.disabled = false;
        button.textContent = 'Resend Email';
    }
}

// Handle resend SMS
async function handleResendSMS() {
    const button = document.getElementById('resendSMS');
    button.disabled = true;
    button.textContent = 'Sending...';
    
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        await sendVerificationSMS(userData.phone);
        showSuccess('Verification SMS resent!');
    } catch (error) {
        showError('Failed to resend SMS. Please try again.');
    } finally {
        button.disabled = false;
        button.textContent = 'Resend SMS';
    }
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.querySelector('.verification-status').appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.textContent = message;
    document.querySelector('.verification-status').appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Update user information on the confirmation page
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        const emailElement = document.getElementById('userEmail');
        const phoneElement = document.getElementById('userPhone');
        
        if (emailElement) emailElement.textContent = userData.email;
        if (phoneElement) phoneElement.textContent = userData.phone;
    }
});
