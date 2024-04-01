const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  handler: (req: any, res: any) => {
    console.log(`[Rate limited] Received ${req.method} request at ${req.url}`);
    console.log(`[Rate limited] Request from IP: ${req.ip}`);

    res.status(429).json({ error: 'Rate limited' });
  },
});

app.get("/", limiter, async (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
});

import { router as staffRoutes } from "routes/staff";
app.use("/staff", limiter, staffRoutes);

import { router as discordRoutes } from "routes/discord";
app.use("/discord", limiter, discordRoutes);

import { router as saRoutes } from "routes/sa";
app.use("/sa", limiter, saRoutes);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});