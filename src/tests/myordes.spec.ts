import expect, { sessionLogin as test } from "../fixtures/loginSession.fixture.spec";
import OrdersPage from "../model/oders/ordersPage";

let ordersPage: OrdersPage;
test.describe("My Orders Test suite", () => {
  test.beforeEach(async ({ page }) => {
    ordersPage = new OrdersPage(page);
    await ordersPage.goTo();
    await expect(page).toHaveURL(/.*myorders/);
  });

  test("View card item By id", async ({ page }) => {
    const id = "6988f0a2dc40b48f12c7a10d";
    const item = await ordersPage.getCartItemRow(id);

    await expect(item.productName).toHaveText("ZARA COAT 3");
    await expect(item.productPrice).toHaveText(/^\$\s.*11500$/);
    await ordersPage.cartItemViewClick(id);
    expect(page.url()).toContain(id);
  });

  test("Delete a product from the cart", async () => {
    const id = "69ac011c415d779f9b5fc3f3";
    const item = await ordersPage.getCartItemRow(id, false);
    await expect(item.productName).toHaveText("iphone 13 pro");
    await expect(item.productPrice).toHaveText(/^\$\s.*55000$/);

    const deleteMessage = await ordersPage.cartItemDeleteById(id);
    await expect(deleteMessage).toHaveText("Orders Deleted Successfully");
    const itemRemoved = await ordersPage.getCartItemRow(id, true);

    expect(itemRemoved).toBe(true);
  });

  test("Delete all orders from the cart", async () => {
    const ordersMessage = await ordersPage.deleteAllOrders(false);
    await expect(ordersMessage).toBeVisible();
  });
});
