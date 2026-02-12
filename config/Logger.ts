import { TestInfo } from "@playwright/test";
import path from "path";
import fs from "fs";

export class Logger {
  private readonly testInfo: TestInfo;
  public readonly logFilePath: string;

  constructor(testInfo: TestInfo) {
    this.testInfo = testInfo;

    // Garante que o diretório de saída existe
    if (!fs.existsSync(this.testInfo.outputDir)) {
      fs.mkdirSync(this.testInfo.outputDir, { recursive: true });
    }

    const fileName = testInfo.title
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Importante: Guardar o caminho completo
    this.logFilePath = path.join(this.testInfo.outputDir, `${fileName}.log`);
  }

  // No Logger.ts
  writeLog(data: any) {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Usamos o appendFileSync ou writeFileSync para garantir a escrita imediata
    fs.writeFileSync(this.logFilePath, JSON.stringify(data, null, 2), "utf8");
  }

  attachLogsToReport() {
    // Verificamos se o arquivo realmente existe antes de anexar
    if (fs.existsSync(this.logFilePath)) {
      this.testInfo.attachments.push({
        name: "Systemlogger",
        path: this.logFilePath, // Usar 'path' é o segredo para o Playwright achar o arquivo
        contentType: "text/plain",
      });
    }
  }
}
