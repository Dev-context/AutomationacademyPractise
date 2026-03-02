import { Page } from "@playwright/test";

export default async function mock(page: Page, baseURL: string, Bodyfaker: unknown) {
  await page.route(baseURL, async (route) => {
    const response = await route.fetch();
    const json = await response.json();

    json.push(Bodyfaker);

    await route.fulfill({
      response,
      json,
      headers: {
        ...response.headers(),
      },
    });
  });
}
