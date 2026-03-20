const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' 
        ? `${process.env.SERVER_URL}/api/auth/google/callback` 
        : 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if a user exists with this email but without googleId (logged in normally before)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link the googleId to the existing account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // If not, create a new user
        // Generate a base username, ensuring uniqueness
        let baseUsername = profile.displayName.replace(/\s+/g, '').toLowerCase();
        let username = baseUsername;
        let usernameExists = await User.findOne({ username });
        let counter = 1;
        
        while (usernameExists) {
            username = `${baseUsername}${counter}`;
            usernameExists = await User.findOne({ username });
            counter++;
        }

        const newUser = new User({
          googleId: profile.id,
          username: username,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value // Use Google profile picture if available
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
