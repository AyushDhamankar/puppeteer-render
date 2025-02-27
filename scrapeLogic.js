const puppeteer = require("puppeteer");
require("dotenv").config();

async function getRouteDetails(source, destination, mode) {
  if (!source || !destination || !mode) {
    throw new Error("Please provide source, destination, and mode");
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Block unnecessary resources
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.time("Page Load");
  const mapsURL = `https://www.google.com/maps/dir/${encodeURIComponent(
    source
  )}/${encodeURIComponent(destination)}`;
  await page.goto(mapsURL, { waitUntil: "domcontentloaded" });

  const routeDetails = await page.evaluate((mode) => {
    let routeElements = document.querySelectorAll("div.UgZKXd.clearfix.yYG3jf");

    for (let route of routeElements) {
      let routeMode =
        route
          .querySelector(".Os0QJc.google-symbols")
          ?.getAttribute("aria-label") || "Unknown";

      if (routeMode.toLowerCase() === mode.toLowerCase()) {
        return {
          mode: routeMode,
          time:
            route.querySelector("div.Fk3sm.fontHeadlineSmall")?.innerText ||
            "Not Found",
          distance:
            route.querySelector("div.ivN21e.tUEI8e.fontBodyMedium > div")
              ?.innerText || "Not Found",
        };
      }
    }
    return { message: `No ${mode} route found` };
  }, mode);

  await browser.close();
  console.timeEnd("Page Load");
  return routeDetails;
}

module.exports = { getRouteDetails };
