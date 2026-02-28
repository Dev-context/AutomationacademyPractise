import { sessionLogin as test } from "../../src/fixtures/loginSession.fixture.spec";
import expect from "../../src/fixtures/loginSession.fixture.spec";
import Dashboard from "../model/dashboard/dashboardPage";

let dashboardPage: Dashboard;

test.describe("Dashboard suite", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test.beforeEach(async ({ page }) => {
    await page.goto("client/#/dashboard/dash");
    dashboardPage = new Dashboard(page);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test("CT001 Add one product into card", async ({ page }) => {
    await dashboardPage.getAddProductByText("ADIDAS ORIGINAL");
    await expect(page.locator(".card-body").first()).toBeVisible();
  });

  test("CT002 Filter products By paramiters", async ({ page }) => {
    await dashboardPage.filterProducts("ADIDAS", "0", "2000000");
    await expect(page.locator(".card-body").first()).toBeVisible();
  });
});
