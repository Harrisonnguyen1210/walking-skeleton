import { browser } from "k6/browser";

export const options = {
  scenarios: {
    client: {
      vus: 5,
      duration: "20s",
      executor: "constant-vus",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async () => {
  const page = await browser.newPage();
  await page.goto("http://localhost:8000/public/ssg.html");

  try {
    await page.locator(`//li[text()="Item 999"]`).isVisible();
  } finally {
    await page.close();
  }
};