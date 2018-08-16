export enum Frequency {
    Once,
    Daily,
    Weekly,
    Monthly
}

export const Weekdays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

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