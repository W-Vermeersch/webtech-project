
export class CommentForms {
    user_id: number
    post_id: number;
    description: string;

    public toObject(): object {
        var result: any = {};
        for (const key in this) {
            const value = this[key as keyof this];
            result[key] = String(value);
        }
        return result;
    }

    public fill(body: Record<string, any>): CommentForms {
        for (const key in body) {
            if (key in this) {
                const value = body[key];
                (this as any)[key] = value;
            }
        }
        return this;
    }
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

