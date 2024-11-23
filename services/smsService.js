const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
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
        throw error;
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
    sendVerificationCode: (to, code) => sendSMS(to, templates.verificationCode(code)),
    sendWelcomeMessage: (to, firstName) => sendSMS(to, templates.welcomeMessage(firstName)),
    sendCourseEnrollmentMessage: (to, courseName) => sendSMS(to, templates.courseEnrollment(courseName))
};
