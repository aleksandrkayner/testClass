const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
const {spawn} = require('child_process')
const credentials = require('../credentials')
const {google} = require('googleapis')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
require('coffee-register')

const axios = require('axios')
module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // app.post('/api/fsb', {
  //   ownerId: 'aleksandrkayner6@gmail.com',
  //   name: 'hello2'
  // })

  // body parsing middleware

  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  ///////////////////////////////////////
  ////////////////////////////////////////

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)
}

const syncDb = () => db.sync()

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}

// const Client = require('google-classroom')

// const client = new Client({
//   clientId:
//     '"428921941916-nkie51v0vi06rdpki4h02rqpllkc0d4j.apps.googleusercontent.com"',
//   clientSecret: '1LTRvnmPOqVHss8B9Sbbs_Wa',
//   refreshToken:
//     '1//0df0MGx7EhG--CgYIARAAGA0SNgF-L9Ir3S52NZGKvmVjmswWefLRJpY2cZWfoBJ3sMifLBgaXijQkiNTkmJL-xaT5w8KlUMM5g'
// })

// client.on('ready', async classr => {
//   console.log('1111111111111111', classr)
// client.getCourses().then(data => {
//   console.log('dadadadadadadadadadta', data)
// })
//})

const gapi = require('gapi')
gapi.server.setApiKey('AIzaSyB2iHRFwlBunTSTdF08jsnLsnq0sGWEAd4')
const fs = require('fs')
const readline = require('readline')
//const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listCourses)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
  @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id} = credentials
  const redirect_uris = 'http://localhost:8080/course'
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
  )

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    console.log('token', oAuth2Client)
    callback(oAuth2Client)
    //gapi.load(oAuth2Client, initClient)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function listCourses(auth) {
  const classroom = google.classroom({version: 'v1', auth})
  let payload = JSON.stringify({
    ownerId: 'aleksandrkayner6@gmail.com',
    name: 'BIO'
  })

  classroom.courses.list(
    {
      pageSize: 10
    },
    (err, res) => {
      if (err) return console.error('The API returned an error: ' + err)
      const courses = res.data.courses

      if (courses && courses.length) {
        //console.log('Courses:')
        courses.forEach(course => {
          console.log(`${course.name} (${course.id})`)

          return res.data
        })
      } else {
        console.log('No courses found.')
      }
    }
  )
}
