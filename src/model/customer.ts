export class Customer {
    userId: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    birthday: Date;
    firstName: string;
    lastName: string;
    registeredAt: Date;

    // Přidat constructor
    constructor(data: Partial<Customer>) {
        Object.assign(this, data);
    }
}