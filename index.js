const express = require("express");
const { getRouteDetails } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  try {
    const result = await getRouteDetails("Virar East", "Olympus-A", "Driving");
    res.send(result); // Send the scraped data as response
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("An error occurred while scraping route details.");
  }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
