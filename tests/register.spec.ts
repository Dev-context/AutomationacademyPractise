import { test, expect } from "@playwright/test";

import LoginPage from "../model/login/LoginPage";
import RegisterPage from "../model/registerPage/RegisterPage";

let loginPage: LoginPage;
let registerPage: RegisterPage;

test.describe("Register Suite", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    await loginPage.goTo();
    registerPage = await loginPage.clickRegisterButton();
  });

  test("@CT001 Successfully registered", async ({ page }) => {
    await registerPage.fillFirstName("JohnTest123");
    await registerPage.fillLastName("DoeTest");
    await registerPage.fillEmail("test@teste123.com");
    await registerPage.fillPhone("1234567890");
    await registerPage.selectOccupation("Engineer");
    await registerPage.selectGender("Male");
    await registerPage.fillPassword("Password123!");
    await registerPage.fillConfirmPassword("Password123!");
    await registerPage.checkAgeCheckbox();
    await registerPage.clickRegister();

    await expect(page.locator("#toast-container")).toBeVisible();
  });

  test("@CT002 Use already existing email", async ({ page }) => {
    await registerPage.fillFirstName("JohnTest");
    await registerPage.fillLastName("DoeTest");
    await registerPage.fillEmail("test@teste.com");
    await registerPage.fillPhone("1234567890");
    await registerPage.selectOccupation("Engineer");
    await registerPage.selectGender("Male");
    await registerPage.fillPassword("Password123!");
    await registerPage.fillConfirmPassword("Password123!");
    await registerPage.checkAgeCheckbox();
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/ecom/auth/register") && response.request().method() === "POST"
    );
    await registerPage.clickRegister();

    const response = await responsePromise;
    const responseBody = await response.json();
    expect(responseBody.message).toBe("User already exisits with this Email Id!");

    await expect(page.locator(".toast-message")).toHaveText(
      /User already exisits with this Email Id!/i
    );
  });
});
