export class BaseForms {
    usernameOrEmail: string = "";
    password: string = "";

    public toObject(): object {
        var result: any = {};
        for (const key in this) {
            const value = this[key as keyof this];
            result[key] = String(value);
        }
        return result;
    }

    public fill(body: Record<string, any>): BaseForms {
        for (const key in body) {
            if (key in this) {
                const value = body[key];
                (this as any)[key] = value;
            }
        }
        return this;
    }
}