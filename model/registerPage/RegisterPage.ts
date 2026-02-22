import { Locator, Page } from "@playwright/test";
import registerLocators from "./locators.json";

export default class RegisterPage {
  private readonly page: Page;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly phone: Locator;
  private readonly occupation: Locator;
  private readonly genderMale: Locator;
  private readonly genderFemale: Locator;
  private readonly password: Locator;
  private readonly confirmPassword: Locator;
  private readonly ageCheckbox: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator(registerLocators.firstName);
    this.lastName = page.locator(registerLocators.lastName);
    this.email = page.locator(registerLocators.email);
    this.phone = page.locator(registerLocators.phone);
    this.occupation = page.locator(registerLocators.occupation);
    this.genderMale = page.locator(registerLocators.genderMale);
    this.genderFemale = page.locator(registerLocators.genderFemale);
    this.password = page.locator(registerLocators.password);
    this.confirmPassword = page.locator(registerLocators.confirmPassword);
    this.ageCheckbox = page.locator(registerLocators.ageCheckbox);
    this.registerButton = page.locator(registerLocators.registerSubmit);
  }

  async fillFirstName(firstName: string) {
    await this.firstName.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastName.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.email.fill(email);
  }

  async fillPhone(phone: string) {
    await this.phone.fill(phone);
  }

  async selectOccupation(occupationText: string) {
    await this.occupation.selectOption({ label: occupationText });
  }

  async selectGender(gender: "Male" | "Female") {
    if (gender === "Male") {
      await this.genderMale.check();
    } else {
      await this.genderFemale.check();
    }
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPassword.fill(password);
  }

  async checkAgeCheckbox() {
    await this.ageCheckbox.check();
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async goTo() {
    await this.page.goto("/register");
  }

  async registerByRequest(
    firstName: string,
    lastName: string,
    userEmail: string,
    userRole: string,
    occupation: string,
    gender: string,
    userMobile: string,
    userPassword: string,
    confirmPassword: string,
    required: boolean
  ) {
    await this.page.request.post("/register", {
      data: {
        firstName,
        lastName,
        userEmail,
        userRole,
        occupation,
        gender,
        userMobile,
        userPassword,
        confirmPassword,
        required,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
