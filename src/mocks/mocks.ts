import { Page } from "@playwright/test";

export default async function mock(page: Page, baseURL: string, Bodyfaker: unknown) {
  await page.route(baseURL, async (route) => {
    const response = await route.fetch();

    await route.fulfill({
      response,
      json: Bodyfaker,
      headers: {
        ...response.headers(),
      },
    });
  });
}
