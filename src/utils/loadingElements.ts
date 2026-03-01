import { Page } from "@playwright/test";
import { loading } from "./elements.json";
import { ENV } from "../../config/env";

export async function loadingDesapear(page: Page, timeout = 30000) {
  try {
    await page.locator(loading).waitFor({ state: "hidden", timeout: timeout });
  } catch (error) {
    throw new Error(`There an error to interact with this Element ${error})`);
  }
}

export async function waitForResponse(page: Page, timeout = 30000) {
  try {
    const response = await page.waitForResponse(
      (resp) => resp.url().includes(ENV.API_ADDRESS.GET_ALL_PRODUCTS) && resp.status() !== 204,
      { timeout: timeout }
    );
    const isSuccessFully = response.ok();

    if (!isSuccessFully) {
      const status = response.status();
      const body = await response.text();
      throw new Error(`API retornou status ${status}. Detalhes: ${body}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Falha ao interagir com a resposta da API: ${error.message}`);
    }
    throw new Error(`Erro desconhecido: ${String(error)}`);
  }
}
