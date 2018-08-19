import { Task } from './../../models/Task';
import { TeamService } from './../../services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rollup',
  templateUrl: './rollup.component.html',
  styleUrls: ['./rollup.component.css']
})
export class RollupComponent implements OnInit {
  private teamId: number;
  public rollupTasks: Task[];

  constructor(private route: ActivatedRoute,
    private teamService: TeamService) {
      this.route.params
        .subscribe((p) => {
          this.teamId = +p['id'];
        }, err => console.log(err));
  }

  ngOnInit() {
    this.teamService.getTeamRollUp(this.teamId)
      .subscribe((rollup) => {
        this.rollupTasks = rollup;
      }, err => console.log(err));
  }

}
