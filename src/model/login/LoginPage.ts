import { Locator, Page, expect } from "@playwright/test";
import loginLocators from "./locators.json";
import ForgotPasswordPage from "../forgotPassword/ForgotPasswordPage";
import RegisterPage from "../registerPage/RegisterPage";

export default class LoginPage {
  private readonly page: Page;
  private readonly userEmail: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPassword: Locator;
  private readonly registerButton: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmail = page.locator(loginLocators.emailId);
    this.password = page.locator(loginLocators.passwordId);
    this.loginButton = page.locator(loginLocators.loginSubmit);
    this.forgotPassword = page.locator(loginLocators.forgotPasswordLink);
    this.registerButton = page.locator(loginLocators.registerButton);
    this.registerLink = page.locator(loginLocators.registerLink);
  }

  async goTo() {
    await this.page.goto("client/#/auth/login");
  }

  async login(userEmail: string, userPassword: string, validUser: boolean) {
    await this.userEmail.fill(userEmail);
    await this.password.fill(userPassword);
    await this.loginButton.click();

    if (validUser) {
      await expect(this.page).toHaveURL(/.*dashboard.*/);
    } else {
      await expect(this.page).toHaveURL(/.*login.*/);
    }
  }

  async clickForgotPasswordLink(): Promise<ForgotPasswordPage> {
    await this.forgotPassword.click();
    return new ForgotPasswordPage(this.page);
  }

  async clickRegisterButton(): Promise<RegisterPage> {
    await this.registerButton.click();
    return new RegisterPage(this.page);
  }

  async clickRegisterLink(): Promise<RegisterPage> {
    await this.registerLink.click();
    return new RegisterPage(this.page);
  }
}
