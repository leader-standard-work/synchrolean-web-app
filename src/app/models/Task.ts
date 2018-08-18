export enum Frequency {
    Once,
    Daily,
    Weekly,
    Monthly
}

export class Weekday {
    value: number;
    displayName: string;
    fullName: string;
}

export const Weekdays: Weekday[] = [
    { value: 1, displayName: 'Sun', fullName: 'Sunday' },
    { value: 2, displayName: 'Mon', fullName: 'Monday' },
    { value: 4, displayName: 'Tue', fullName: 'Tuesday' },
    { value: 8, displayName: 'Wed', fullName: 'Wednesday' },
    { value: 16, displayName: 'Thu', fullName: 'Thursday' },
    { value: 32, displayName: 'Fri', fullName: 'Friday' },
    { value: 64, displayName: 'Sat', fullName: 'Saturday' },
];

export class Task {
    id: number;
    name: string;
    description: string;
    isRecurring: boolean;
    weekdays: number;
    creationDate: Date;
    isCompleted: boolean;
    completionDate: Date;
    isDeleted: boolean;
    ownerEmail: string;
    frequency: Frequency;
    teamId: number;
    
    constructor() {}
}