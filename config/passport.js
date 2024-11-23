const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    // Find user by email
                    const user = await User.findOne({ email });
                    
                    if (!user) {
                        return done(null, false, { message: 'Invalid credentials' });
                    }

                    // Check password
                    const isMatch = await user.comparePassword(password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Invalid credentials' });
                    }

                    // Check if email is verified
                    if (!user.isVerified) {
                        return done(null, false, { message: 'Please verify your email before logging in' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).select('-password');
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
