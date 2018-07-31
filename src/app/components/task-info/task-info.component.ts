import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent implements OnInit {
  public task: Task;

  constructor(private taskService: TaskService,
    private route: ActivatedRoute) { 
      this.task = new Task();
      this.route.params.subscribe(p => {
        this.task.id = p['id'];
        console.log(this.task.id);
      });
    }

  ngOnInit() {
    this.taskService.getTaskById(this.task.id)
      .subscribe((loadedTask) => {
        this.task = loadedTask;
      }, (err) => { console.log(err) });
  }

  /**
   * Handles when a task is edited
   * @param editedTask The task that was edited
   */
  onTaskEdited(editedTask) {
    console.log(editedTask);
    this.task = editedTask;
  }
}
