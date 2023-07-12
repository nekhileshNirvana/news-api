const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Import your routes
const languageRoute = require('./language/languageRoute');
const countryRoute = require('./country/countryRoute');
const articlesRoute = require('./articles/articlesRoute');
const categoryRoute = require('./category/categoryRoute');
const sourceRoute = require('./source/sourceRoute');

const app = express();
const PORT = 8080;

// Enable CORS
app.use(cors());

// Configure Express middleware
app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  })
);

// Configure Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define the Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '51200461855-qtjkic8mekk4g9l5tt171k4bk6675jaj.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8080/auth/google/callback' // Update with your desired React route
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user authentication and save necessary information
      // (e.g., profile data, access token) in your database or session
      // You can customize this function according to your needs
      
      // Assuming you have a User model/schema, you can create or find the user
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          // User already exists, update the access token or other relevant information if needed
          user.accessToken = accessToken;
          user.save();
        } else {
          // User does not exist, create a new user with the necessary information
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            accessToken: accessToken
          });
          newUser.save();
        }
        
        // Call 'done' to proceed after authentication, passing the authenticated user as the second parameter
        done(null, user);
      });
    }
  )
);


// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Implement the Google OAuth 2.0 authentication route
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

// Use your routes
app.use('/', languageRoute);
app.use('/', countryRoute);
app.use('/', articlesRoute);
app.use('/', categoryRoute);
app.use('/', sourceRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});