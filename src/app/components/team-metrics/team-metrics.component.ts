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
  public teamPercentagesTuple: Array<[number, number]> = [];       // tuple array that holds index of service call and team percentag
  public teamPercentages: number[] = [];      // weekly completion rates of team
  public week: string[] = [];                 // each Sunday contained within startDate and endDate (including start and end dates)
  public weekString: string[] = [];
  public accounts: Account[] = [];            // team members
  public accountPercentages: number[] = [];   // completion percentages per week per team member
  LineChart = [];

  constructor(private teamService: TeamService,
    private taskService: TaskService,
    private accountService: AccountService,
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
    this.week = [];
    this.weekString = [];
    
    this.getWeeks();
    this.getWeekStrings();
    this.getWeeklyTeamMetrics();

    for (let account of this.accounts) {
      this.taskService.getUserTeamMetricsByDateRange(this.team.id, account.email, this.startDate.toDateString(), this.endDate.toDateString())
        .subscribe((percentage) => {
          if(!isNaN(percentage))
            this.accountPercentages.push(percentage);
          else 
            this.accountPercentages.push(0);
        }, (err) => {
          console.log(err);
        })
    }
  }

  /**
   * Gets teams weekly methods.
   */
  getWeeklyTeamMetrics() {
    this.teamPercentagesTuple = [];
    for (let i = 0; i < this.week.length - 1; i+=2) {
      this.taskService.getTeamMetricsByDateRange(this.team.id, this.week[i], this.week[i + 1])
        .subscribe((percentage) => {
          if(!isNaN(percentage)) {
            this.teamPercentagesTuple.push([i/2, percentage * 100]);
            this.fillTable();
          }
          else {
            this.teamPercentagesTuple.push([i/2, 0]);
            this.fillTable();
          }
        })
    }
  }

  /**
   * Orders teamPercentagesTuple since getWeeklyTeamMetrics() taskService call does not
   * populate array in order called
   */
  orderTeamPercentages() {
    for (let i = 0; i < this.teamPercentagesTuple.length; ++i) {
      this.teamPercentages[this.teamPercentagesTuple[i][0]] = this.teamPercentagesTuple[i][1];
    }
  }

  getWeeks() {
    // Add starting date
    this.week.push(this.startDate.toDateString());

    // Get the following saturday
    let nextDayToAdd = new Date();
    let day = this.startDate.getDay();
    nextDayToAdd.setDate(this.startDate.getDate() + (6 - day));

    // Fill weeks array with Sundays or Saturdays
    while(nextDayToAdd.getTime() < this.endDate.getTime()) {
      // If day is Saturday, add to week array and set nextDayToAdd to Sunday
      if(nextDayToAdd.getDay() == 6) {
        this.week.push(nextDayToAdd.toDateString());
        nextDayToAdd.setDate(nextDayToAdd.getDate() + 1);
      } // Else if day is Sunday, add to week array and set nextDayToAdd to Saturday
      else if(nextDayToAdd.getDay() == 0) {
        this.week.push(nextDayToAdd.toDateString());
        nextDayToAdd.setDate(nextDayToAdd.getDate() + 6);
      }
    }

    // Add ending date
    this.week.push(this.endDate.toDateString());
  }

  /**
   * Finds how many weeks in date range and adds dates to this.weeks array
   * to be used as x-coordinate in graph
   */
  getWeekStrings() {
    // Get the following sunday
    let sunday = new Date();
    let saturday = new Date();
    let day = this.startDate.getDay();

    // Enter first week date range string
    saturday.setDate(this.startDate.getDate() + (6 - day));
    this.weekString.push(this.startDate.toDateString() + "-" + saturday.toDateString());
    sunday.setDate(saturday.getDate() + 1);

    // Fill weekString array with "<Sunday>-<Saturday>" strings
    while(saturday.getTime() < this.endDate.getTime()) {
      // Determine next sundays date
      saturday.setDate(sunday.getDate() + 6);
      if(saturday.getTime() < this.endDate.getTime()) {
        this.weekString.push(sunday.toDateString() + "-" + saturday.toDateString());
        sunday.setDate(saturday.getDate() + 1);
      }
    }

    // Add ending date
    this.weekString.push(sunday.toDateString() + "-" + this.endDate.toDateString());
  }

  
  fillTable() {
    this.orderTeamPercentages();
    this.LineChart = [];
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.weekString,
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
