import { test as base } from "@playwright/test";
import { Logger } from "../config/Logger";

export const testeBase = base.extend<{ log: Logger }>({
  log: [
    async ({ page }, use, testInfo) => {
      console.log(
        `\n[1] SETUP: Iniciando fixture para o teste: ${testInfo.title}`,
      );
      const loggerFactory = new Logger(testInfo);
      const sessionLogs: string[] = [];

      // Monitor de rede
      page.on("response", (res) => {
        if (res.status() >= 400)
          sessionLogs.push(`[NET] ${res.status()}: ${res.url()}`);
      });

      try {
        // [2] EXECUÇÃO: Aqui o Playwright sai da fixture e roda o seu arquivo .spec.ts
        await use(loggerFactory);
        console.log("[3] SUCESSO: O código do teste terminou sem erros.");
      } catch (error) {
        // [3] FALHA: Capturamos o erro manualmente porque o testInfo.errors só popula DEPOIS da fixture
        console.log("[3] FALHA: O código do teste lançou um erro.");
        // O erro capturado aqui é o que o seu log precisa
        loggerFactory.writeLog({
          timestamp: new Date().toISOString(),
          test: testInfo.title,
          status: "failed",
          capturedErrors: sessionLogs,
          runtimeError: error instanceof Error ? error.message : String(error),
        });

        // Importante: Re-lançar o erro para o Playwright saber que o teste falhou
        throw error;
      } finally {
        // [4] FINALIZAÇÃO: Anexamos o log ao relatório
        console.log("[4] FINALLY: Verificando anexos...");

        // Se o teste passou, podemos escrever um log de sucesso ou apenas anexar o que foi capturado
        if (testInfo.status === "passed") {
          loggerFactory.writeLog({
            test: testInfo.title,
            status: "passed",
            capturedErrors: sessionLogs,
            runtimeError: "Nenhum erro detectado",
          });
        }

        loggerFactory.attachLogsToReport();
        console.log("[5] FIM: Fixture finalizada.");
      }
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
