import { testeBase as test } from "../fixtures/base.fixture.spec.ts";
import { ENV } from "../config/env";
import LoginPage from "../model/login/LoginPage";

let loginPage: LoginPage;

test.describe("Login Suite", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test("@CT001 Successfully logged in", async () => {
    await loginPage.goTo();
    await loginPage.login(ENV.USEREMAIL, ENV.USERPASSWORD, true);
  });

  test("@CT002 Unsuccessfully logged in with invalid password", async () => {
    await loginPage.goTo();
    await loginPage.login(ENV.USEREMAIL, "WrongPassword123!", false);
  });

  test("@CT003 Unsuccessfully logged in with empty fields", async () => {
    await loginPage.goTo();
    await loginPage.login("", "", false);
  });

  test("@CT004 Unsuccessfully logged in with invalid email format", async () => {
    await loginPage.goTo();
    await loginPage.login("invalidemail.com", ENV.USERPASSWORD, false);
  });
});
