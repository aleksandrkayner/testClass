const express = require('express')
const cors = require('cors')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

let user = {}

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

const googleConfig = {
  clientID:
    '1008588747303-ljut6o3hq2ahlha7hnlcif77eaann8vr.apps.googleusercontent.com',
  clientSecret: 'XcTI14oq4tbjCHH9SfCqTnq6',
  callbackURL: 'http://localhost:8080/auth/google/callback'
}

const strategy = new GoogleStrategy(
  googleConfig,
  (accessToken, refreshToken, profile, cb) => {
    console.log(JSON.stringify(profile))
    user = {...profile}
    return cb(null, profile)
    // const googleId = profileObj.id
    // const email = profileObj.email
    // const imgUrl = profileObj.imageUrl
    // const firstName = profileObj.givenName
    // const lastName = profileObj.familyName
    // const fullName = profileObj.name

    // User.findOrCreate({
    //   where: {googleId},
    //   defaults: {email, imgUrl, firstName, lastName, fullName},
    // })
    //   .then(([user]) => done(null, user))
    //   .catch(done)
  }
)

passport.use(strategy)

const app = express()
app.use(cors())
app.use(passport.initialize())

app.get(
  'auth/google',
  passport.authenticate('google', {scope: ['email', 'profile']})
)
app.get(
  'auth/google/callback',
  passport.authenticate(
    ('google',
    (req, res) => {
      res.redirect('/home')
    })
  )
)

app.get('/user', (req, res) => {
  console.log('getting user data!')
  res.send(user)
})

app.get('/auth/logout', (req, res) => {
  console.log('logging out')
  user = {}
  res.redirect('/')
})

const PORT = 8080
app.listen(PORT)
