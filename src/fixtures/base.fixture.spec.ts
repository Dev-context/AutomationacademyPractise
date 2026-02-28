/* eslint-disable no-console */
import { test as base } from "@playwright/test";
import { Logger } from "../../config/Logger";

export const testeBase = base.extend<{ log: Logger }>({
  log: [
    async ({ page }, use, testInfo) => {
      console.log(`\n[1] SETUP: Iniciando fixture para o teste: ${testInfo.title}`);
      const loggerFactory = new Logger(testInfo);
      const sessionLogs: string[] = [];

      // Monitor de rede e console
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          sessionLogs.push(`[${new Date().toLocaleTimeString()}] [CONSOLE] ${msg.text()}`);
        }
      });

      page.on("response", (res) => {
        if (res.status() >= 400) {
          sessionLogs.push(
            `[${new Date().toLocaleTimeString()}] [NET] ${res.status()}: ${res.url()}`
          );
        }
      });

      page.on("requestfailed", (req) => {
        sessionLogs.push(
          `[${new Date().toLocaleTimeString()}] [FAIL] ${req.failure()?.errorText}: ${req.url()}`
        );
      });

      try {
        // [2] EXECUÇÃO: Aqui o Playwright sai da fixture e roda o seu arquivo .spec.ts
        console.log(`[2] EXECUÇÃO: Iniciando corpo do teste...`);
        await use(loggerFactory);
        console.log(`[3] SUCESSO: O corpo do teste foi concluído com exito.`);
      } catch (error) {
        // [3] FALHA: Capturamos o erro manualmente
        console.log(
          `[3] FALHA: Capturado erro no catch da fixture: ${error instanceof Error ? error.message : String(error)}`
        );
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
