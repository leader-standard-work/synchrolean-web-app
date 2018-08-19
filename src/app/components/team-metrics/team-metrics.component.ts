import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TaskService } from '../../services/task.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Team } from '../../models/Team';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormGroup, FormBuilder } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-team-metrics',
  templateUrl: './team-metrics.component.html',
  styleUrls: ['./team-metrics.component.css']
})
export class TeamMetricsComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  public team: Team;
  rangeForm: FormGroup;
  public startDate: Date;
  public endDate: Date;
  public teamMetrics: number;

  constructor(private teamService: TeamService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
      this.team = new Team();
      this.route.params.subscribe(p => {
        this.team.id = p['id'];
      });
      this.datePickerConfig = Object.assign({},
        {
          containerClass: 'theme-dark-blue',
          showWeekNumbers: false,
      });
     }

  ngOnInit() {
    this.teamService.getTeam(this.team.id)
      .subscribe((loadedTeam) => {
        this.team = loadedTeam;
      }, err => console.log(err));
    this.rangeForm = this.formBuilder.group({
      range: null
    });
  }

  getMetrics() {
    const range = this.rangeForm.controls['range'].value;
    this.startDate = range[0];
    this.endDate = range[1];
    this.taskService.getTeamMetricsByDateRange(this.team.id, this.startDate, this.endDate)
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.teamMetrics = metrics;
        } else {
          this.teamMetrics = 0;
        }
      }, (err) => console.log(err));
  }
}
