import { Page } from "@playwright/test";

export default async function mock(
  page: Page,
  baseURL: string,
  Bodyfaker: unknown,
  shouldReload: boolean = true
) {
  await page.route(baseURL, async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(Bodyfaker),
      });
    } else {
      const response = await route.fetch();

      await route.fulfill({
        response,
        json: Bodyfaker,
        headers: {
          ...response.headers(),
        },
      });
    }
  });

  if (shouldReload) {
    await page.reload();
  }
}
