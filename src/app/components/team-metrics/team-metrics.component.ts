import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TaskService } from '../../services/task.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Team } from '../../models/Team';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  public week: string[] = [];                 // stores strings of sundays and saturdays of each week
  public xAxisLabel: string[] = [];           // stores strings of weekly ranges for x-axis labels on chart
  public days: string[] = [];                 // stores strings of the days of the week
  LineChart = [];

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
      
      this.startDate = new Date();
      this.endDate = new Date();
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
   * Retrieves start and end dates from daterangepicker
   */
  getDatePickerMetrics() {
    if(this.rangeForm.controls['range'].value != null) {
      this.days = [];
      this.week = [];
      this.xAxisLabel = [];
      const range = this.rangeForm.controls['range'].value;
      this.startDate = range[0];
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate = range[1];
      this.endDate.setHours(23, 59, 59);
      this.getMetrics();                    // Gets metrics from startDate to endDate
      this.getWeeks();                      // Gets strings of each Sunday and Saturday
      this.getWeeksLabel();                 // Gets strings of week range Sunday-Saturday
      this.getWeeklyTeamMetrics();          // Gets team metrics for date ranges from getWeeksLabel
    }
  }

  /**
   * Gets weekly Sunday and Saturday days to be used in receiving weekly metrics from db
   */
  getWeeks() {
    let nextDayToAdd = new Date();

    // Add starting date
    this.week.push(this.startDate.toDateString());

    // Get the following saturday
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
  getWeeksLabel() {
    for (let i = 0; i < this.week.length - 1; i+=2) {
      this.xAxisLabel.push(`${this.week[i]}-${this.week[i+1]}`);
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
   * Sets start and end dates for previous week
   */
  getLastWeekMetrics() {
    this.week = [];
    this.days = [];
    this.xAxisLabel = [];
    let today = new Date();
    let day = today.getDay()
    this.startDate.setDate(today.getDate() - (7 + day));
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setDate(this.startDate.getDate() + 6);
    this.endDate.setHours(23, 59, 59);
    this.getMetrics();                    // Gets metrics from startDate to endDate
    this.getDays();                       // Gets strings of the days of the week and populates xAxisLabel
    this.getDailyTeamMetrics();          // Gets team metrics for date ranges from getDays
  }
  
  /**
   * Gets the days of the week between startDate and endDate as strings
   */
  getDays() {
    let nextDayToAdd = new Date();

    // Add the start date 
    this.days.push(this.startDate.toDateString());
    nextDayToAdd.setDate(this.startDate.getDate() + 1);

    while(nextDayToAdd.getTime() < this.endDate.getTime()) {
      this.days.push(nextDayToAdd.toDateString());
      nextDayToAdd.setDate(nextDayToAdd.getDate() + 1);
    }

    this.xAxisLabel = this.days;
  }

  /**
   * Gets team metrics for each day
   */
  getDailyTeamMetrics() {
    this.teamPercentages = [];
    for (let i = 0; i < this.days.length; ++i) {
      this.taskService.getTeamMetricsByDateRange(this.team.id, this.days[i], this.days[i+1])
        .subscribe((percentage) => {
          if(!isNaN(percentage)) {
            this.teamPercentagesTuple.push([i, percentage * 100]);
            this.fillTable();
          }
          else {
            this.teamPercentagesTuple.push([i, 0]);
            this.fillTable();
          }
        });
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
  
  /**
   * Creates a new graph for dynamically changing data
   */
  fillTable() {
    this.orderTeamPercentages();
    this.LineChart = [];
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
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
        scaleShowValues: true,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }
  
}
