import { Locator, Page, expect } from "@playwright/test";
import loginLocators from "./locators.json";

export default class LoginPage {
  private readonly page: Page;
  private readonly userEmail: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmail = page.locator(loginLocators.emailId);
    this.password = page.locator(loginLocators.passwordId);
    this.loginButton = page.locator(loginLocators.loginSubmit);
  }

  async goTo() {
    await this.page.goto("");
  }

  async login(userEmail: string, userPassword: string, validUser: boolean) {
    await this.userEmail.fill(userEmail);
    await this.password.fill(userPassword);
    await this.loginButton.click();

    console.log(`[DEBUG] Final URL: ${this.page.url()}`);

    if (validUser) {
      await expect(this.page).toHaveURL(/.*dashboard.*/);
    } else {
      await expect(this.page).toHaveURL(/.*login.*/);
    }
  }
}
