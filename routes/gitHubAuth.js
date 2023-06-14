import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2';
import session from 'express-session'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router()

router.use(cookieParser())

router.use(session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
})
)

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user)
})

passport.deserializeUser((user, done) => {
    console.log(user)
    done(null, user)
})

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile, accessToken, refreshToken)
        return done(null, profile)
    })
)

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(redirectUrl)
})

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.SECRET_JWT_KEY);
    const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl)
})

router.get('/decode-cookie', (req, res) => {
    const cookie = req.cookies['connect.sid']
    const decodedCookie = decodeURIComponent(cookie)

    res.send(decodedCookie)
})

export default router