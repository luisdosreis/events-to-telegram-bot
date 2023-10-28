const puppeteer = require("puppeteer");

(async () => {
  // Create a Date object to get the current date and time
  const currentDate = new Date();

  // Get the current month (0-based index, so add 1 for the actual month)
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  // Get the current year
  const currentYear = currentDate.getFullYear();

  // Format as "MM-YYYY"
  const formattedDate = `${currentMonth}-${currentYear}`;

  console.log(`Formatted Date: ${formattedDate}`);

  // The URL of the website you want to scrape
  const url =
    "https://www.coimbraexplore.com/eventos?view=calendar&month=" +
    formattedDate;

  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the website you want to scrape
  await page.goto(url);

  // Function to extract quote data
  const extractQuotes = async () => {
    const quotes = [];

    // Find and loop through each quote element
    const quoteElements = document.querySelectorAll('td[class*="has-event"]');

    const refs = [];

    for (const quoteElement of quoteElements) {
      const day = quoteElement.querySelector(
        'div[class="marker"] div[class="marker-daynum"]'
      ).textContent;

      const currentDay = new Date().getDate().toString();

      if (day == currentDay) {
        const itemsList = quoteElement.querySelectorAll(
          'ul[class*="itemlist"]:not([class*="flyoutitemlist"]) li'
        );

        for (const item of itemsList) {
          const href = item.querySelector("a").href;

          const title = item.querySelector(
            'a span[class*="item-title"]'
          ).textContent;

          const time = item.querySelector(
            'a span[class*="item-time--24hr"]'
          ).textContent;

          refs.push({ day, time, title, href });
        }
      }
    }

    return refs;
  };

  // Use Puppeteer to scrape and traverse child nodes
  const scrapedData = await page.evaluate(extractQuotes);

  // Log the scraped data
  console.log(scrapedData);

  // Close the browser
  await browser.close();
})();
