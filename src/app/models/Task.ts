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
    ownerId: number;
    name: string;
    description: string;
    isRecurring: boolean;
    isCompleted: boolean;
    isRemoved: boolean;
    creationDate: Date;
    updatedDate: Date;
    completionDate: Date;
    frequency: Frequency;
    weekdays: number;
    
    constructor() {}
}