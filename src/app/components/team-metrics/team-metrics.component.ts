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
          this.teamPercentages.push(percentage);
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


    // lineChart
    public lineChartData:Array<any> = [
      //{data: this.accountPercentages, label: 'Team Metrics'}
      {data: this.teamPercentages, label: 'Team Metrics'}
    ];
    public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions:any = {
      responsive: true
    };
    public lineChartColors:Array<any> = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      },
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
  
    public randomize():void {
      let _lineChartData:Array<any> = new Array(this.lineChartData.length);
      for (let i = 0; i < this.lineChartData.length; i++) {
        _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
        for (let j = 0; j < this.lineChartData[i].data.length; j++) {
          _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
        }
      }
      this.lineChartData = _lineChartData;
    }
  
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
  
    public chartHovered(e:any):void {
      console.log(e);
    }
}
