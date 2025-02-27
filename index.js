const express = require("express");
const { getRouteDetails } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
    getRouteDetails("Virar East", "Olympus-A", "Driving");
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});