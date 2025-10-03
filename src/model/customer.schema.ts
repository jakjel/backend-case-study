
import { EntitySchema } from 'typeorm';
import { Customer } from './customer';

export const CustomerSchema = new EntitySchema<Customer>({
    name: 'Customer',
    target: Customer,
    columns: {
        userId: {
            type: Number,
            primary: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
        },
        birthday: {
            type: Date,
        },
        registeredAt: {
            type: Date,
            createDate: true,
        },
    },
});
