# Real Estate Mastery Platform

A comprehensive online educational platform for real estate professionals to enhance their skills and career opportunities.

## Features

- User Authentication with Email Verification
- SMS Notifications
- Downloadable Real Estate Templates
- Course Management
- Interactive Learning Interface
- Professional Development Resources

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail Account (for email notifications)
- Twilio Account (for SMS notifications)

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd real-estate-mastery
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/real-estate-mastery
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Session Secret
SESSION_SECRET=your_session_secret_here
```

4. Set up MongoDB
- Install MongoDB locally or use MongoDB Atlas
- Update the `MONGODB_URI` in `.env` with your connection string

5. Set up Email Service
- Enable 2-factor authentication in your Gmail account
- Generate an app-specific password
- Update the email configuration in `.env`

6. Set up Twilio (Optional)
- Create a Twilio account
- Get your account SID, auth token, and phone number
- Update the Twilio configuration in `.env`

7. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## Project Structure

```
real-estate-mastery/
├── config/
│   └── passport.js
├── middleware/
│   ├── auth.js
│   └── admin.js
├── models/
│   ├── User.js
│   └── Template.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── routes/
│   ├── auth.js
│   └── templates.js
├── services/
│   ├── emailService.js
│   └── smsService.js
├── uploads/
│   └── templates/
├── .env
├── package.json
├── README.md
└── server.js
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/verify-email/:token - Verify email
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password/:token - Reset password

### Templates
- GET /api/templates - Get all templates
- GET /api/templates/category/:category - Get templates by category
- POST /api/templates - Upload new template (admin only)
- GET /api/templates/download/:id - Download template
- PUT /api/templates/:id - Update template (admin only)
- DELETE /api/templates/:id - Delete template (admin only)

## Security Features

- JWT Authentication
- Password Hashing
- Email Verification
- Rate Limiting
- Input Validation
- File Upload Restrictions
- Admin Authorization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
