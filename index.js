const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();

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

app.get("/", async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/api', (req, res, next) => {
  const { authorization } = req.headers;
  
  if (authorization == '') {
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


require('./routes/permissionRoutes')(app);

app.listen(2000, '127.0.0.1', () => {
  console.log('Server listening on port 2000');
});