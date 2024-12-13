import {BaseForms} from "./base-forms";

export class LogInForm extends BaseForms {
    usernameOrEmail: string = "";
    password: string = "";
}

export class ErrorInLogInForm extends LogInForm {
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

    override fill(body: Record<string, any>): ErrorInLogInForm {
        super.fill(body);
        return this;
    }
}




