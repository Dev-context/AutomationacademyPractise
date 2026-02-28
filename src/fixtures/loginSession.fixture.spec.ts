/*eslint-disable playwright/no-standalone-expect*/
import { test as baseLogin, expect, Page } from "@playwright/test";
import { ENV } from "../../config/env";
import apiServices from "../services/apiServices";

type LoginResponse = {
  token?: string;
  userId?: string;
  message?: string;
};

export const sessionLogin = baseLogin.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    const apiService = new apiServices(page);

    const response = await apiService.api({
      urlBase: "https://rahulshettyacademy.com/api/ecom/auth/login",
      httpMethod: "post",
      data: {
        userEmail: ENV.USEREMAIL,
        userPassword: ENV.USERPASSWORD,
      },
    });

    const body: LoginResponse = await response;

    await page.goto("client/#");
    await page.evaluate((token) => {
      window.localStorage.setItem("token", token as string);
    }, body.token);

    const responsePromise = page.waitForResponse("**/api/ecom/product/get-all-products");
    await page.reload();

    const responseAllproducts = await responsePromise;
    const allProductsBody = await responseAllproducts.json();
    expect(allProductsBody.message).toContain("All Products fetched Successfully");
    await use(page);
  },
});

export default expect;
