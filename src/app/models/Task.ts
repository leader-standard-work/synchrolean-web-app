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