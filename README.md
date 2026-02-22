# Playwright TS Pro - Automation Academy Practice

A robust and scalable end-to-end testing framework built with Playwright, TypeScript, and the Page Object Model (POM) pattern. This project is designed for automated testing of the Rahul Shetty Academy Client application.

## 🚀 Features

- **Page Object Model (POM)**: Enhanced maintainability and readability by separating page logic from test scripts.
- **TypeScript**: Static typing for better developer experience and code quality.
- **Allure Reporting**: Comprehensive and visual test reports.
- **Environment Configuration**: Secure management of credentials and environment-specific variables using `dotenv`.
- **Cross-Browser Testing**: Pre-configured for Chromium, Firefox, and WebKit.
- **CI/CD Ready**: Includes configurations for Jenkins and Docker.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd playwrigthTsPro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory and add your credentials:

```env
USEREMAIL=your-email@example.com
USERPASSWORD=your-password
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Show HTML report
```bash
npm run show:report
```

## ✨ Code Quality & Formatting

This project uses **ESLint** and **Prettier** to ensure code quality and consistent formatting. **Husky** is configured to run these checks automatically before every commit.

### Scripts

- **Lint Check**: `npm run lint`
- **Lint Fix**: `npm run lint:fix`
- **Format Code**: `npm run format`

### Pre-commit Hooks

Husky and lint-staged are set up to automatically lint and format your code when you run `git commit`. This ensures that only clean code reaches the repository.

## 📂 Project Structure

- `tests/`: Test scripts (e.g., `login.spec.ts`).
- `model/`: Page Object classes and locators.
- `config/`: Environment and global configurations.
- `specs/`: Test plans and documentation.
- `fixtures/`: Test data and custom fixtures.

## 📊 Reporting

This project uses **Allure Report** for detailed test execution visualization.

### Allure Installation

1. **Install Allure Commandline**:
   - **Windows (using Scoop)**: `scoop install allure`
   - **macOS (using Homebrew)**: `brew install allure`
   - **Linux**: Follow instructions on the [official Allure website](https://docs.qameta.io/allure/#_installing_a_commandline).

2. **Generate and Open Report**:
   The project has a built-in script to generate and serve the report:
   ```bash
   npm run allure-generate
   ```

### Default Playwright Report
Playwright also generates a standard HTML report:
```bash
npm run show:report
```

---
*Built with ❤️ for Automation Excellence. Reference: [Rahul Shetty Academy](https://rahulshettyacademy.com/)*
