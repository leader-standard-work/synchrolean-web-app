import { Task } from "src/app/models/Task";

export class WeeklyRollup {
    teamId: number;
    outstandingTasks: Task[];
    completion: number;
}