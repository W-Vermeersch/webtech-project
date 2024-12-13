import { BaseForms } from "./base-forms";

export class SignInForm extends BaseForms{
  username: string = "";
  email: string = "";
  password: string = "";
  passwordConfirm: string = "";
}

export class ErrorInSignInForm extends SignInForm {
  total: string = "";

  public hasErrors(): boolean {
    for (const key in this) {
      const value = this[key as keyof this];
      if (typeof value === "string" && value.length > 0) {
        return true;
      }
    }
    return false; // No errors found
  }

  override fill(body: Record<string, any>): ErrorInSignInForm {
    super.fill(body);
    return this;
  }
}
