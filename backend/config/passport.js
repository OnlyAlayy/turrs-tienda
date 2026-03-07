import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id_for_dev',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret_for_dev',
    callbackURL: '/api/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Buscar si ya existe por googleId
            let user = await User.findOne({ googleId: profile.id });

            // 2. Si no existe por googleId, buscar por email
            if (!user) {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    // Vincular cuenta existente con Google
                    user.googleId = profile.id;
                    if (!user.avatar && profile.photos && profile.photos[0]) {
                        user.avatar = profile.photos[0].value;
                    }
                    await user.save();
                }
            }

            // 3. Si no existe: crear usuario nuevo
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
                    lastName: profile.name?.familyName || profile.displayName.split(' ').slice(1).join(' '),
                    email: profile.emails[0].value,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    isEmailVerified: true,
                    authProvider: 'google',
                    profileComplete: false // Require onboarding
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

export default passport;
