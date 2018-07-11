/**
 * A basic model for a task. We can change this as needed. For now
 * it is just set up like this for test purposes (getting and displaying
 * tasks).
 */
export class Task {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    isRecurring: boolean;
    isCompleted: boolean;
    isRemoved: boolean;
    creationDate: Date;
    completionDate: Date;
    
    constructor() {}
}