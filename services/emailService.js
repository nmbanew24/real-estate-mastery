const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const templates = {
    verification: (token) => ({
        subject: 'Verify Your Email - Real Estate Mastery',
        html: `
            <h1>Welcome to Real Estate Mastery!</h1>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <a href="${process.env.BASE_URL}/verify-email/${token}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't register for Real Estate Mastery, please ignore this email.</p>
        `
    }),
    
    passwordReset: (token) => ({
        subject: 'Password Reset Request - Real Estate Mastery',
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to create a new password:</p>
            <a href="${process.env.BASE_URL}/reset-password/${token}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
        `
    }),

    welcomeEmail: (firstName) => ({
        subject: 'Welcome to Real Estate Mastery!',
        html: `
            <h1>Welcome to Real Estate Mastery, ${firstName}!</h1>
            <p>We're excited to have you on board. Here's what you can do next:</p>
            <ul>
                <li>Browse our course catalog</li>
                <li>Download real estate templates</li>
                <li>Complete your profile</li>
                <li>Join our community</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
        `
    }),

    courseEnrollment: (courseName) => ({
        subject: `Successfully Enrolled in ${courseName}`,
        html: `
            <h1>Thank you for enrolling in ${courseName}!</h1>
            <p>You now have access to all course materials. Here's what you can do next:</p>
            <ul>
                <li>Start your first lesson</li>
                <li>Download course materials</li>
                <li>Join the course discussion</li>
            </ul>
            <p>Happy learning!</p>
        `
    })
};

// Send email function
const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail: (to, token) => sendEmail(to, templates.verification(token)),
    sendPasswordResetEmail: (to, token) => sendEmail(to, templates.passwordReset(token)),
    sendWelcomeEmail: (to, firstName) => sendEmail(to, templates.welcomeEmail(firstName)),
    sendCourseEnrollmentEmail: (to, courseName) => sendEmail(to, templates.courseEnrollment(courseName))
};
