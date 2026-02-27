import { sessionLogin as test } from "../fixtures/loginSession.fixture.spec";

test.describe("Dashboard suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("client/#/dashboard/dash");
  });
});
