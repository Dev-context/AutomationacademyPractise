import { sessionLogin as test } from "../../src/fixtures/loginSession.fixture.spec";
import expect from "../../src/fixtures/loginSession.fixture.spec";
import Dashboard from "../model/dashboard/dashboardPage";

let dashboardPage: Dashboard;

test.describe("Dashboard suite", () => {
  test.beforeEach(async ({ page }) => {
    dashboardPage = new Dashboard(page);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("CT001 Add products into card", async () => {
    const [alert1, cart1] = await dashboardPage.factoryProducts("ADIDAS ORIGINAL");
    await expect(alert1).toBeVisible();
    await expect(cart1).toHaveText("1", { timeout: 180000 });
    const [alert2, cart2] = await dashboardPage.factoryProducts("ZARA COAT 3");
    await expect(alert2).toBeVisible();
    await expect(cart2).toHaveText("2", { timeout: 180000 });
    const [alert3, cart3] = await dashboardPage.factoryProducts("IPHONE 13 PRO");
    await expect(alert3).toBeVisible();
    await expect(cart3).toHaveText("3", { timeout: 180000 });
  });

  test("CT002 Filter products By paramiters", async () => {
    await dashboardPage.filterProducts("ADIDAS", "0", "2000000");
    const [alert, cart] = await dashboardPage.factoryProducts("ADIDAS ORIGINAL");
    await expect(alert).toBeVisible();
    await expect(cart).toHaveText("1");
  });
});
