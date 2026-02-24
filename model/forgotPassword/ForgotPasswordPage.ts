import { Locator, Page } from "@playwright/test";
import forgotPasswordLocators from "./locators.json";

export default class ForgotPasswordPage {
  private readonly page: Page;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly confirmPassword: Locator;
  private readonly saveNewPassword: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator(forgotPasswordLocators.email);
    this.password = page.locator(forgotPasswordLocators.password);
    this.confirmPassword = page.locator(forgotPasswordLocators.confirmPassword);
    this.saveNewPassword = page.locator(forgotPasswordLocators.saveNewPassword);
  }

  async fillEmail(email: string) {
    await this.email.fill(email);
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPassword.fill(confirmPassword);
  }

  async clickSaveNewPassword() {
    await this.saveNewPassword.click();
  }

  async resetPassword(email: string, password: string, confirmPassword: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickSaveNewPassword();
  }

  async goTo() {
    await this.page.goto("client/#/auth/password-new");
  }
}
