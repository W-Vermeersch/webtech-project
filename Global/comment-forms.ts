import { BaseForms } from "./base-forms";

export class CommentForms extends BaseForms {
    user_id: number
    post_id: number;
    description: string;
}

export class ErrorInCommentInForm extends CommentForms {
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

    override fill(body: Record<string, any>): ErrorInCommentInForm {
        super.fill(body);
        return this;
    }
}

