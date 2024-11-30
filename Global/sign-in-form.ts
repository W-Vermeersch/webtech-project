export class SignInForm {
  username: string = "";
  email: string = "";
  password: string = "";
  passwordConfirm: string = "";

  public toObject(): object {
    var result: any = {};
    for (const key in this) {
      const value = this[key as keyof this];
      result[key] = String(value);
    }
    return result;
  }

  public fill(body: Record<string, any>): SignInForm {
    for (const key in body) {
      if (key in this) {
        const value = body[key];
        (this as any)[key] = value;
      }
    }
    return this;
  }
}
export class ErrorInForm extends SignInForm {
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

  override fill(body: Record<string, any>): ErrorInForm {
    super.fill(body);
    return this;
  }
}
