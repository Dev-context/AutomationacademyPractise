import { Locator, Page, expect } from "@playwright/test";
import locators from "./locators.json";

export default class Dashboard {
  private readonly page: Page;
  private readonly productsList: Locator;
  private readonly viewButton: Locator;
  private readonly loading: Locator;
  private readonly searchFilter: Locator;
  private readonly priceMin: Locator;
  private readonly priceMax: Locator;
  private readonly productName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsList = this.page.locator(locators.productList);
    this.viewButton = this.page.locator(locators.viewButton);
    this.loading = this.page.locator(locators.loading);
    this.searchFilter = this.page.locator(locators.searchFilterInputDesktop);
    this.priceMin = this.page.locator(locators.minPriceRangeInputDesktop);
    this.priceMax = this.page.locator(locators.maxPriceRangeInputDesktop);
    this.productName = this.page.locator(locators.productName);
  }

  async getAddProductByText(productName: string) {
    const containerProduct = this.productsList.filter({ hasText: productName });
    await expect(containerProduct).toBeVisible();
    await containerProduct.locator(locators.addToCardButton).click();
    await this.loading.waitFor({ state: "hidden" });
  }

  async filterProducts(item?: string, priceMin?: string, priceMax?: string) {
    console.log(this.page.workers());
    if (item) await this.searchFilter.fill(item);
    if (priceMin) await this.priceMin.fill(priceMin);
    if (priceMax) await this.priceMax.fill(priceMax);

    await this.page.keyboard.press("Enter");
    await this.page.waitForResponse("**/api/ecom/product/get-all-products");
    await this.getFilteredProductList(item as string, Number(priceMin), Number(priceMax));
  }

  private async getFilteredProductList(item: string, priceMax: number, priceMin: number) {
    const products = await this.productsList.all();

    for (const product of products) {
      const productName = await this.productName.textContent();
      const priceText = await product.locator(locators.productPrice).textContent();
      const priceValue = Number(priceText?.replace(/[^0-9.]/g, ""));

      if (item) {
        expect(productName).toContain(item);
      }
      if (priceMin) {
        expect(priceValue).toBeLessThanOrEqual(Number(priceMin));
      }
      if (priceMax) {
        expect(priceValue).toBeGreaterThanOrEqual(Number(priceMax));
      }
    }
  }
}
