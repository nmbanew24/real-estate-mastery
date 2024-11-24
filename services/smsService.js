const twilio = require('twilio');

let client = null;

// Only initialize Twilio if credentials are provided
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER) {
    client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
}

const sendSMS = async (to, message) => {
    // If Twilio is not configured, log message and return
    if (!client) {
        console.log('SMS would have been sent:', { to, message });
        return true;
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        console.log('SMS sent:', result.sid);
        return true;
    } catch (error) {
        console.error('SMS sending failed:', error);
        // Don't throw error, just return false
        return false;
    }
};

const templates = {
    verificationCode: (code) => 
        `Your Real Estate Mastery verification code is: ${code}. This code will expire in 10 minutes.`,
    
    welcomeMessage: (firstName) =>
        `Welcome to Real Estate Mastery, ${firstName}! Thank you for joining our community.`,
    
    courseEnrollment: (courseName) =>
        `Congratulations! You've successfully enrolled in ${courseName}. Start learning now!`
};

module.exports = {
    sendVerificationCode: async (to, code) => {
        return await sendSMS(to, templates.verificationCode(code));
    },
    sendWelcomeMessage: async (to, firstName) => {
        return await sendSMS(to, templates.welcomeMessage(firstName));
    },
    sendCourseEnrollmentMessage: async (to, courseName) => {
        return await sendSMS(to, templates.courseEnrollment(courseName));
    }
};
