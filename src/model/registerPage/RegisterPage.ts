import { Locator, Page } from "@playwright/test";
import registerLocators from "./locators.json";
import { userRegister } from "./interface";

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

  async fillFirstName(firstName: string): Promise<void | Locator> {
    if (firstName === "") {
      return this.page.getByText("First Name is required");
    } else {
      await this.firstName.fill(firstName);
    }
  }

  async fillLastName(lastName?: string) {
    await this.lastName.fill(lastName ?? "");
  }

  async fillEmail(email: string): Promise<void | Locator> {
    if (!email) {
      return this.page.getByText("Email is required");
    } else {
      await this.email.fill(email);
    }
  }

  async fillPhone(phone: string): Promise<void | Locator> {
    if (!phone) {
      return this.page.getByText("Phone Number is required");
    } else {
      await this.phone.fill(phone);
    }
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

  async fillPassword(password: string): Promise<void | Locator> {
    if (!password) {
      return this.page.getByText("*Password is required", { exact: true });
    } else {
      await this.password.fill(password);
    }
  }

  async fillConfirmPassword(password: string): Promise<void | Locator> {
    if (!password) {
      return this.page.getByText("Confirm Password is required", { exact: true });
    } else {
      await this.confirmPassword.fill(password);
    }
  }

  async checkAgeCheckbox(isCheck: boolean): Promise<void | Locator> {
    if (isCheck) {
      await this.ageCheckbox.check();
    } else {
      return this.page.getByText("*Please check above checkbox", { exact: true });
    }
  }
  async ischecked() {
    return await this.ageCheckbox.isChecked();
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async goTo() {
    await this.page.goto("/register");
  }

  async registerByRequest(userRegister: userRegister) {
    await this.page.request.post("/register", {
      data: {
        ...userRegister,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async factoryUserMandatoryFields(userRegister: userRegister): Promise<Array<Locator>> {
    await this.clickRegister();

    const requiredFields = await Promise.all([
      this.fillFirstName(userRegister.firstName),
      this.fillEmail(userRegister.userEmail),
      this.fillPhone(userRegister.userMobile),
      this.fillPassword(userRegister.userPassword),
      this.fillConfirmPassword(userRegister.confirmPassword),
      this.checkAgeCheckbox(userRegister.required),
    ]);

    return requiredFields.filter((item): item is Locator => item !== undefined);
  }
}
