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
    
    constructor() {
        this.creationDate = new Date();
        this.isCompleted = false;
        this.isRemoved = false;
    }

    /**
     * Bitshifts the weekdays number to get the days that the task occurs on
     * @returns The weekdays property as an array of strings of the days the task occurs on
     */
    getWeekdaysAsArray() {
        let days: number = this.weekdays;
        let weekdaysArray: string[] = [];
        for(let i = 0; days > 0; i++) {
            if (days & 1) {
                weekdaysArray.push(Weekdays[i]);
            }
            days >>= 1;
        }
        return weekdaysArray;
    }
}