import { expect, Locator, Page } from "@playwright/test";
import locators from "./locators.json";
import mock from "../../mocks/mocks";
import { ENV } from "../../../config/env";
import getOrdersBody from "../../api/orders.json";

export default class OrdersPage {
  private readonly cartItem: Locator;
  private readonly viewButton: Locator;
  private readonly deleteButton: Locator;
  private readonly toast: Locator;
  private readonly goBackShop: Locator;
  private readonly goBackCart: Locator;

  constructor(private readonly page: Page) {
    this.page = page;
    this.cartItem = this.page.locator(locators.tableRow);
    this.viewButton = this.page.locator(locators.viewButton);
    this.deleteButton = this.page.locator(locators.deleteButton);
    this.toast = this.page.getByText("Orders Deleted Successfully");
    this.goBackShop = this.page.locator(locators.BackShopButton);
    this.goBackCart = this.page.locator(locators.BackCartButton);
  }

  async goTo() {
    await this.page.goto("client/#/dashboard/myorders");
    await this.page.getByText("Loading....").waitFor({ state: "hidden" });
  }
  async getCartItemRow(itemId: string, isRemoved: true): Promise<boolean>;

  async getCartItemRow(
    itemId: string,
    isRemoved?: false
  ): Promise<{
    productName: Locator;
    productPrice: Locator;
    productOrderDate: Locator;
  }>;

  async getCartItemRow(itemId: string, isRemoved = false) {
    const row = await this.filterItemId(itemId, isRemoved);
    if (isRemoved) {
      await row.waitFor({ state: "hidden" });
      return (await row.count()) === 0;
    }
    return {
      productName: row.locator("td").nth(1),
      productPrice: row.locator("td").nth(2),
      productOrderDate: row.locator("td").nth(3),
    };
  }

  async cartItemViewClick(itemId: string) {
    await this.cartItem.filter({ hasText: itemId }).locator(this.viewButton).click();
    await this.page.getByText("order summary").waitFor({ state: "visible" });
  }

  async cartItemDeleteById(itemId: string) {
    await this.cartItem.filter({ hasText: itemId }).locator(this.deleteButton).click();

    return this.toast;
  }
  async filterItemId(itemId: string, isRemoved?: boolean) {
    return this.cartItem.filter({
      [isRemoved ? "hasNotText" : "hasText"]: itemId,
    });
  }

  private async deleteAllOrdersByList() {
    const items = await this.cartItem.all();

    for (const order of items) {
      const id = await order.locator("th").textContent();
      const responsePromise = this.page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/ecom/order/delete-order/${id}`) &&
          response.request().method() === "DELETE" &&
          response.status() === 200
        );
      });
      await this.cartItemDeleteById(id ?? "");

      await responsePromise;
    }
    return this.page
      .locator("div", { hasText: " You have No Orders to show at this time." })
      .first();
  }

  async goBackShopPage() {
    await this.goBackShop.click();
    return this.page.url();
  }

  async goBackCartPage() {
    await this.goBackCart.click();
    return this.page.url();
  }

  async deleteAllOrders(isMock = false) {
    if (isMock) {
      await mock(this.page, ENV.API_RESOURCES.GET_ORDERS, getOrdersBody);
      await expect(this.cartItem.first()).toBeVisible();
      const data = { message: "Orders Deleted Successfully" };
      const noData = { data: [], message: "No Orders" };
      await mock(this.page, ENV.API_RESOURCES.DELETE_0RDERS, { data }, false);

      const cart = await this.deleteAllOrdersByList();
      await mock(this.page, ENV.API_RESOURCES.ORDERS_FOR_CUSTOMER, { noData });
      return cart;
    } else {
      return await this.deleteAllOrdersByList();
    }
  }
}
