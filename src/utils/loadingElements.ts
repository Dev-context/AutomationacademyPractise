import { Page } from "@playwright/test";
import { loading } from "./elements.json";

export async function loadingDesapear(page: Page, locator = loading) {
  const tresMinutos = 180000;

  try {
    // Aguarda o elemento sumir do DOM ou ficar invisível
    await page.locator(locator).waitFor({
      state: "hidden",
      timeout: tresMinutos,
    });
  } catch (error) {
    await page.screenshot({ path: "timeout-loading.png" });
  }
}

export async function waitForResponse(page: Page, url: string, timeout = 180000) {
  try {
    const response = await page.waitForResponse(
      (resp) => resp.url().includes(url) && resp.status() !== 204,
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
