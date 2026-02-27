import { test as baseLogin, expect } from "@playwright/test";
import { ENV } from "../config/env";

type LoginResponse = {
  token: string;
  userId: string;
  message: string;
};

export const sessionLogin = baseLogin.extend<{ authenticatedPage: LoginResponse }>({
  authenticatedPage: async ({ page }, use) => {
    const response = await page.request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
      data: {
        userEmail: ENV.USEREMAIL,
        userPassword: ENV.USERPASSWORD,
      },
    });

    const body: LoginResponse = await response.json();
    if (!response.ok()) {
      throw new Error(
        `{Failed to Login using API
        status ${response.status()},
        Message: ${body.message}
      }`
      );
    }

    await page.goto("client/#");
    page.evaluate((token) => {
      window.localStorage.setItem("token", token);
    }, body.token);
    await page.waitForLoadState("load");
    await use(body);
  },
});

export default expect;
