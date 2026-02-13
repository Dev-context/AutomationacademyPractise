import { test, expect } from "@playwright/test";
import { ENV } from "../config/env";
import LoginPage from "../model/login/LoginPage";

let loginPage: LoginPage;

test.describe("Login Suite", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });
  test("@CT001 Successfully logged in", async ({ page }) => {
    await loginPage.goTo();
    await loginPage.login(ENV.USEREMAIL, ENV.USERPASSWORD, true);
  });

  test("@CT002 UnSuccessFully Logged in", async ({ page }) => {
    await loginPage.goTo();
    await loginPage.login(ENV.USEREMAIL, "Error_error", false);
  });
});
