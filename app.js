const { axiosc } = require('./config.json');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const corsOptions = {
  origin: axiosc.url,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  handler: (req, res) => {
    console.log(`[Rate limited] Received ${req.method} request at ${req.url}`);
    console.log(`[Rate limited] Request from IP: ${req.ip}`);

    res.status(429).json({ error: 'Rate limited' });
  },
});

app.get("/", cors(corsOptions), async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/api', (req, res, next) => {
  const { authorization } = req.headers;
  
  if (authorization == '' || authorization == '') {
    limiter(req, res, (err) => {
      if (!err) {
        console.log(`Received ${req.method} request at ${req.url}`);
      }
  
      next();
    });
  } else {
    next();
  }
});

// Require and set up the permission routes
require('./routes/permissionRoutes')(app, corsOptions);

// Require and set up the staff routes
require('./routes/staffRoutes')(app, corsOptions);

// Require and set up the discord routes
require('./routes/discordRoutes')(app, corsOptions);

// Require and set up the sa routes
require('./routes/saRoutes')(app, corsOptions);

// Other routes and configurations

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});