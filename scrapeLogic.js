const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    const url = process.env.TARGET_URL || "https://www.imdb.com/title/tt27922706/"; // Replace with actual URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract text inside the span with class "hero__primary-text"
    const textSelector = '.hero__primary-text[data-testid="hero__primary-text"]';
    await page.waitForSelector(textSelector);

    const extractedText = await page.$eval(textSelector, (el) => el.textContent.trim());

    console.log(`Extracted Text: ${extractedText}`);
    res.send(`Extracted Text: ${extractedText}`);
  } catch (error) {
    console.error("Puppeteer Error:", error);
    res.status(500).send(`Error occurred: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { scrapeLogic };