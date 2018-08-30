import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TaskService } from '../../services/task.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Team } from '../../models/Team';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';

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
  public teamPercentages: number[] = [];      // weekly completion rates of team
  public days: string[] = [];                 // stores strings of the days of the week
  public week: string[] = [];                 // stores strings of sundays and saturdays of each week
  public xAxisLabel: string[] = [];           // stores strings of weekly ranges for x-axis labels on chart
  lineChart: Chart;

  constructor(private teamService: TeamService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
      // Grab team id from url
      this.team = new Team();
      this.route.params.subscribe(p => {
        this.team.id = p['id'];
      });
      // Configure the graph
      this.datePickerConfig = Object.assign({},
        {
          containerClass: 'theme-dark-blue',
          showWeekNumbers: false,
      });
      
      // Initialize start and end dates
      this.startDate = new Date();
      this.endDate = new Date();
    }
     

  ngOnInit() {
    // Grab team info from db
    this.teamService.getTeam(this.team.id)
      .subscribe((loadedTeam) => {
        this.team = loadedTeam;
      }, err => console.log(err));

    // Create form for dateRangepicker
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
      // Reset week, x-coordinate, and graph data arrays
      this.week = [];
      this.xAxisLabel = [];
      this.teamPercentages = [];

      // Re-initialize start and end dates
      this.startDate = new Date();
      this.endDate = new Date();

      // Grab date range from dateRangepicker
      const range = this.rangeForm.controls['range'].value;

      // Set start and end dates from form
      this.startDate = range[0];
      this.endDate = range[1];

      // Set appropriate start and end date hours
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate.setHours(23, 59, 59);

      const timeRange = this.endDate.getTime() - this.startDate.getTime();
      // Check for range < week and > year
      var week = 1000 * 60 * 60 * 24 * 7;
      var year = (week / 7) * 365;
      if(timeRange <= week) {
        this.days = [];
        this.getDays();
        this.getDailyTeamMetrics();
        return;
      } else if(timeRange > year) {
        alert('Cannot calculate metrics longer than one year');
        return;
      }

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
    // Add starting date
    this.week.push(this.startDate.toDateString());

    // Get the following saturday
    let day = this.startDate.getDay();

    // Date object used to grab each day to add to week array
    let nextDayToAdd = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + (6 - day));

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
    for (let i = 0; i < this.week.length - 1; i+=2) {
      this.taskService.getTeamMetricsByDateRange(this.team.id, this.week[i], this.week[i + 1])
        .subscribe((percentage) => {
          if(!isNaN(percentage)) {
            this.teamPercentages[i/2] = percentage * 100;
            this.fillTable();
          }
          else {
            this.teamPercentages[i/2] = 0;
            this.fillTable();
          }
        })
    }
  }

  /**
   * Sets start date for previous week
   */
  getLastWeekMetrics() {
    this.startDate = new Date();
    this.endDate = new Date();
    let today = new Date();
    let day = today.getDay()
    this.startDate.setDate(today.getDate() - (7 + day));
    this.getWeeksMetrics();
  }

  /**
   * Sets start date for this week
   */
  getThisWeekMetrics() {
    this.startDate = new Date();
    this.endDate = new Date();
    let today = new Date();
    let day = today.getDay()
    this.startDate.setDate(today.getDate() - day);
    this.getWeeksMetrics();
  }

  /**
   * Sets end dates and calls metrics methods for week long range
   */
  getWeeksMetrics() {
    // Reset days, x-coordinate, and graph data arrays
    this.days = [];
    this.xAxisLabel = [];
    this.teamPercentages = [];

    // Grab the end date
    this.endDate.setDate(this.startDate.getDate() + 6);

    // Set appropriate hours for start and end dates
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59);

    this.getMetrics();                    // Gets metrics from startDate to endDate
    this.getDays();                       // Gets strings of the days of the week and populates xAxisLabel
    this.getDailyTeamMetrics();           // Gets team metrics for date ranges from getDays
  }
  
  /**
   * Gets the days of the week between startDate and endDate as strings
   */
  getDays() {
    // Date object used to grab each day to add to days array
    let nextDayToAdd = new Date();

    // Add the start date 
    this.days.push(this.startDate.toDateString());
    nextDayToAdd.setDate(this.startDate.getDate() + 1);

    // Add the next day of the week to days array
    while(nextDayToAdd.getTime() < this.endDate.getTime()) {
      this.days.push(nextDayToAdd.toDateString());
      nextDayToAdd.setDate(nextDayToAdd.getDate() + 1);
    }

    // Set the graph x-axis labels to days array
    this.xAxisLabel = this.days;
  }

  /**
   * Gets team metrics for each day
   */
  getDailyTeamMetrics() {
    // Reset graph data array
    this.teamPercentages = [];
    
    for (let i = 0; i < this.days.length; ++i) {
      // Retrieve the completion rate for each day in the week
      this.taskService.getTeamMetricsByDateRange(this.team.id, this.days[i], this.days[i+1])
        .subscribe((percentage) => {
          if(!isNaN(percentage)) {
            this.teamPercentages[i] = percentage * 100;
            this.fillTable();
          }
          else {
            this.teamPercentages[i] = 0;
            this.fillTable();
          }
        });
    }
  }

  /**
   * Sets start date for previous month's metrics and call monthly metric method
   */
  getLastMonthMetrics() {
    let date = new Date();
    this.startDate = new Date(date.getFullYear(), date.getMonth() - 1);
    this.getMonthMetrics();
  }

  /**
   * Sets start date for current month's metrics and call monthly metric method
   */
  getThisMonthMetrics() {
    let date = new Date();
    this.startDate = new Date(date.getFullYear(), date.getMonth());
    this.getMonthMetrics();
  }

  /**
   * Gets metrics for a months span
   */
  getMonthMetrics() {
    this.week = [];
    this.xAxisLabel = [];
    this.teamPercentages = [];

    // Set the end date for the end of the month metrics are being requested for
    this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, -1);

    // Set appropriate hours for start and end dates
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59);

    this.getMetrics();                    // Gets metrics from startDate to endDate
    this.getWeeks();                      // Gets strings of each Sunday and Saturday
    this.getWeeksLabel();                 // Gets strings of week range Sunday-Saturday
    this.getWeeklyTeamMetrics();          // Gets team metrics for date ranges from getWeeksLabel
  }

  /**
   * Sets start date for previous year's metrics and call yearly metric method
   */
  getLastYearMetrics() {
    this.startDate = new Date(new Date().getFullYear() - 1, 0, 1);
    this.getYearlyMetrics();
  }

  /**
   * Sets start date for current year's metrics and call yearly metric method
   */
  getThisYearMetrics() {
    this.startDate = new Date(new Date().getFullYear(), 0, 1);
    this.getYearlyMetrics();
  }

  /**
   * Gets metrics for a years span
   */
  getYearlyMetrics() {
    // Reset graph data and x-coordinate label arrays
    this.teamPercentages = [];
    this.xAxisLabel = [];

    // Set end date for end of year metrics are being calculated for
    this.endDate = new Date(this.startDate.getFullYear(), 11, 31);

    // Set appropriate hours for start and end dates
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59);

    // Create x-coordinate label array
    this.xAxisLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create date objects to store beginning and end of each month and set hours for end date
    let start = this.startDate;
    let end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
    end.setHours(23, 59, 59);

    // Grab completion rate for entire year
    this.getMetrics();

    for (let i = 0; end.getTime() < this.endDate.getTime(); ++i) {
      // Retrieve completion rate for each month
      this.taskService.getTeamMetricsByDateRange(this.team.id, start.toDateString(), end.toDateString())
        .subscribe((percentage) => {
          // 
          if(!isNaN(percentage)) {
            this.teamPercentages[i] = percentage * 100;
            this.fillTable();
          } else {
            this.teamPercentages[i] = 0;
            this.fillTable();
          }
        }, (err) => {
          console.log(err);
        });
        
      // Get the next months starting and ending dates
      start = new Date(end.getFullYear(), end.getMonth() + 1, start.getDate());
      end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate() - 1);
    }
  }
  
  /**
   * Creates a new graph for dynamically changing data (chart.js can't handle 
   * dynamically changed data. Must create new graph for each data point)
   */
  fillTable() {
    // Reset and create new line graph 
    if(this.lineChart != null) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart('lineChart', {
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
          display: true
        },
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
