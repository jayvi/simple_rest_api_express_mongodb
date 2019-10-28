require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
const jwt = require('jsonwebtoken');
const port = 3090
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('were connected!');
});


app.use(helmet())
app.use(express.json())
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 4.2.0'
}))
const sixtyDaysInSeconds = 5184000
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds,
  // Must be enabled to be approved
  includeSubDomains: true,
  preload: true,
  force: true
}));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
    upgradeInsecureRequests: true,
    workerSrc: false
  }
}))

const whitelist = ['http://localhost:3091', 'http://example2.com']
const corsOptions = {
  origin: function (origin, callback) {
    try {
      //If you do not want to block REST tools or server-to-server requests, add a || !origin check in the origin function like so:
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } catch (error) {
      res.sendStatus(403);
    }

  }
}


const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter);


app.get('/', cors(corsOptions), (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))