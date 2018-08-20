import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TaskService } from '../../services/task.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Team } from '../../models/Team';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { AuthService } from '../../services/auth.service';
import { Chart } from 'node_modules/chart.js';

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
  public teamPercentages: number[] = [];                // weekly completion rates of team
  public week: string[] = [];                 // each Sunday contained within startDate and endDate (including start and end dates)
  public accounts: Account[] = [];            // team members
  public accountPercentages: number[] = [];   // completion percentages per week per team member
  LineChart = [];

  constructor(private teamService: TeamService,
    private taskService: TaskService,
    private accountService: AccountService,
    private authService: AuthService,
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
      this.accountService.getAccountsByTeamId(this.team.id)
        .subscribe((accounts) => {
          console.log('TeamMetricsComponent: accounts: ', accounts);
          this.accounts = accounts;
        }, (err) => {
          console.log(err);
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
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.week,
        datasets: [{
          label: 'Team Metrics',
          data: this.teamPercentages,
          fill: false,
          lineTension: 0.2,
          borderColor: "red",
          borderWidth: 1
        }]
      },
      options: {
        title: {
          tesxt: "Line Chart",
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

  /**
   * Retrieves the teams completion rate
   */
  getMetrics() {
    const range = this.rangeForm.controls['range'].value;
    this.startDate = range[0];
    this.endDate = range[1];
    this.taskService.getTeamMetricsByDateRange(this.team.id, this.startDate.toDateString(), this.endDate.toDateString())
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.teamMetrics = metrics;
        } else {
          this.teamMetrics = 0;
        }
      }, (err) => console.log(err));
  }

  /**
   * Retrieves completion log entries for team to determine graph values
   */
  getLineGraphMetrics() {
    this.accountPercentages = [];
    this.teamPercentages = [];
    this.week = [];
    
    this.getWeeks();

    for (let account of this.accounts) {
      this.taskService.getUserTeamMetricsByDateRange(this.team.id, account.email, this.startDate.toDateString(), this.endDate.toDateString())
        .subscribe((percentage) => {
          this.accountPercentages.push(percentage);
        }, (err) => {
          console.log(err);
        })
    }
    this.getWeeklyTeamMetrics();
    this.fillTable();
    console.log('TeamMetricsComponent: accountPercentages = ', this.accountPercentages);
  }

  /**
   * Gets teams weekly methods
   */
  getWeeklyTeamMetrics() {
    for (let i = 0; i < this.week.length - 1; ++i) {
      console.log('TeamMetricsComponent: for ' , this.week[i], ' thru ' , this.week[i + 1]);
      this.taskService.getTeamMetricsByDateRange(this.team.id, this.week[i], this.week[i + 1])
        .subscribe((percentage) => {
          this.teamPercentages.push(percentage * 100);
        })
    }
    console.log('TeamMetricsComponent: Team percentages: ', this.teamPercentages);
  }

  /**
   * Finds how many weeks in date range and adds dates to this.weeks array
   * to be used as x-coordinate in graph
   */
  getWeeks() {
    // Add starting date
    this.week.push(this.startDate.toDateString());

    // Get the following sunday
    let sunday = new Date();
    let day = this.startDate.getDay();
    sunday.setDate(this.startDate.getDate() + (7 - day));
    // Fill weeks array with Sunday dates
    while(sunday.getTime() < this.endDate.getTime()) {
      // Determine next sundays date
      this.week.push(sunday.toDateString());
      sunday.setDate(sunday.getDate() + 7);
    }

    // Add ending date
    this.week.push(this.endDate.toDateString());
    
    console.log("TeamMetricsComponent: Weeks: ", this.week);
  }

  fillTable() {
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.week,
        datasets: [{
          label: 'Team Metrics',
          data: this.teamPercentages,
          fill: false,
          lineTension: 0.2,
          borderColor: "red",
          borderWidth: 1
        }]
      },
      options: {
        title: {
          tesxt: "Line Chart",
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

  dateRangeSet() {
    return this.week.length === 0;
  }

}
