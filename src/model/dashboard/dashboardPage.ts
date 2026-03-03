import { Locator, Page, expect } from "@playwright/test";
import locators from "./locators.json";
import mock from "../../mocks/mocks";
import { ENV } from "../../../config/env";
import { loadingDesapear, waitForResponse } from "../../utils/loadingElements";

export default class Dashboard {
  private readonly page: Page;
  private productsList: Locator;
  private readonly viewButton: Locator;
  private readonly searchFilter: Locator;
  private readonly priceMin: Locator;
  private readonly priceMax: Locator;
  private readonly productName: Locator;
  private readonly toastAlert: Locator;
  private readonly cart: Locator;
  private cardGlobalQuantity = 1;

  constructor(page: Page) {
    this.page = page;
    this.productsList = this.page.locator(locators.productList);
    this.viewButton = this.page.locator(locators.viewButton);
    this.searchFilter = this.page.locator(locators.searchFilterInputDesktop);
    this.priceMin = this.page.locator(locators.minPriceRangeInputDesktop);
    this.priceMax = this.page.locator(locators.maxPriceRangeInputDesktop);
    this.productName = this.page.locator(locators.productName);
    this.toastAlert = this.page.getByText("Product Added to Cart");
    this.cart = this.page.locator(locators.cartLabel);
  }

  private async AddProduct(productName: string) {
    try {
      const containerProduct = this.productsList.filter({ hasText: productName });

      await expect(containerProduct).toBeVisible();
      await containerProduct.locator(locators.addToCardButton).click();
      this.cardGlobalQuantity = this.cardGlobalQuantity + 1;
      await loadingDesapear(this.page);

      return this.toastAlert;
    } catch (error) {
      throw new Error("Not possible add a Product" + error);
    }
  }

  async filterProducts(item?: string, priceMin?: string, priceMax?: string) {
    await this.fillFilters(item, priceMin, priceMax);
    await waitForResponse(this.page, ENV.API_ADDRESS.GET_ALL_PRODUCTS);
    await this.getFilteredProductList(item as string, Number(priceMin), Number(priceMax));
  }

  private async fillFilters(item?: string, priceMin?: string, priceMax?: string) {
    if (item) await this.searchFilter.fill(item);
    if (priceMin) await this.priceMin.fill(priceMin);
    if (priceMax) await this.priceMax.fill(priceMax);
    await this.page.keyboard.press("Enter");
    this.productsList = this.page.locator(locators.productList);
  }

  private async getFilteredProductList(item: string, priceMax: number, priceMin: number) {
    const products = await this.productsList.all();
    await this.productsList.last().waitFor({ state: "visible" });

    for (const product of products) {
      const productName = await product.locator(locators.productName).textContent();
      const priceText = await product.locator(locators.productPrice).textContent();
      const priceValue = Number(priceText?.replace(/[^0-9.]/g, ""));

      if (item) expect(productName).toContain(item);
      if (priceMin) expect(priceValue).toBeLessThanOrEqual(Number(priceMin));
      if (priceMax) expect(priceValue).toBeGreaterThanOrEqual(Number(priceMax));
    }

    return this.productsList;
  }

  private async myCartQuantity(cardQuantity: number) {
    const data = { count: cardQuantity, message: "Cart Data Found" };
    await mock(this.page, ENV.API_ADDRESS.GET_CART_COUNT, data);

    return this.cart;
  }

  async factoryProducts(productName: string) {
    const result = await Promise.all([
      this.AddProduct(productName),
      this.myCartQuantity(this.cardGlobalQuantity),
    ]);

    return result;
  }
}
