import { Page } from "@playwright/test";
type httpMethods = "post" | "get" | "delete" | "put" | "patch";

type apiRequest = {
  urlBase: string;
  httpMethod: httpMethods;
  data?: unknown;
  headers?: { [key: string]: string };
};

export default class apiServices {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async api({ httpMethod, urlBase, data, headers }: apiRequest) {
    const response = await this.page.request[httpMethod](urlBase, {
      data: data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(
        `Failed API Request:
        URL: ${urlBase}
        Status: ${response.status()}
        Message: ${errorBody}`
      );
    }

    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }
}
