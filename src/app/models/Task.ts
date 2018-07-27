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
    
    constructor() {
        /**
         * When the task is created the creation date is set
         * and it defaults to a state of not complete and not
         * removed.
         */
        this.creationDate = new Date();
        this.isCompleted = false;
        this.isRemoved = false;
    }
}