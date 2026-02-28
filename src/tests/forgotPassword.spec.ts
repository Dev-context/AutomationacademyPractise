import { expect, test } from "@playwright/test";
import LoginPage from "../model/login/LoginPage";
import ForgotPasswordPage from "../model/forgotPassword/ForgotPasswordPage";
import { ENV } from "../../config/env";

let loginPage: LoginPage;
let forgotPassword: ForgotPasswordPage;

test.describe("Forgot Password Suite", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginPage.goTo();
    forgotPassword = await loginPage.clickForgotPasswordLink();
  });

  test("@CT001 Change user password with Successfully", async ({ page }) => {
    const newPasswordResponse = page.waitForResponse(
      (response) =>
        response.url().includes("new-password") && response.request().method() === "POST"
    );

    await forgotPassword.resetPassword(ENV.USEREMAIL, ENV.USERPASSWORD, ENV.USERPASSWORD);
    const response = await newPasswordResponse;
    const result = await response.json();
    expect(result).toEqual(expect.objectContaining({ message: "Password Changed Successfully" }));
    await expect(page.getByText("Password Changed Successfully")).toBeVisible();
    expect(page.url()).toMatch(/.*login.*/g);
  });

  test("@CT002 No match password into forgotPassword page", async ({ page }) => {
    await forgotPassword.resetPassword(ENV.USEREMAIL, ENV.USERPASSWORD, "123456789AsW");
    await expect(
      page.getByText("Password and Confirm Password must match with each other.")
    ).toBeVisible();
    expect(page.url()).toMatch(/.*password-new.*/g);
  });

  test("CT003 User enter with invalid E-mail", async ({ page }) => {
    await forgotPassword.resetPassword("test.com", ENV.USERPASSWORD, ENV.USERPASSWORD);
    await expect(page.getByText("Enter Valid Email")).toBeVisible();
    expect(page.url()).toMatch(/.*password-new.*/g);
  });
});
