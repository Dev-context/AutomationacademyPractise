import test, { Locator, Page, expect } from "@playwright/test";
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
    await this.page.waitForLoadState("networkidle");

    validUser
      ? expect(this.page.url()).toMatch(/dash$/g)
      : expect(this.page.url()).toMatch(/login$/g);
  }
}
