import { test, expect } from "@playwright/test";
import Login from "../model/login/loginPage";
import { ENV } from "../config/env";

let loginPage: Login;

test.describe("Login Suite", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new Login(page);
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
