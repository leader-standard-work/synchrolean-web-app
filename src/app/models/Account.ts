/**
 * Model for client-side accounts.
 */
export class Account {
    ownerId: number;
    teamId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isDeleted: boolean;

    constructor() {}
}