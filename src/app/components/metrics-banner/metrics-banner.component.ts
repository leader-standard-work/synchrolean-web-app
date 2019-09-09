import { AccountService } from '@app/services/account.service';
import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '@app/models/Metric';
import { TaskService } from '@app/services/task.service';
import { Account } from '@app/models/Account';

@Component({
  selector: 'app-metrics-banner',
  templateUrl: './metrics-banner.component.html',
  styleUrls: ['./metrics-banner.component.css']
})
export class MetricsBannerComponent implements OnInit {
  @Input() teamId: number;
  @Input() ownerEmail: string;
  public metrics: Metric = new Metric();
  public user: Account;

  constructor(
    private taskService: TaskService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    if (this.teamId) {
      this.getWeeklyTeamMetrics();
    } else {
      this.getWeeklyUserMetrics();
    }
    this.accountService.getAccountByEmail(this.ownerEmail)
      .subscribe((acc) => {
        this.user = acc;
      }, (err) => console.log(err));
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyUserMetrics() {
    this.taskService.getWeeklyTaskMetrics(this.ownerEmail)
      .subscribe((metrics) => {
        const newMetric = new Metric();
        newMetric.teamId = null;
        newMetric.teamValue = null;
        if (!isNaN(metrics)) {
          newMetric.userValue = metrics;
          this.metrics = newMetric;
        } else {
          newMetric.userValue = 0;
          this.metrics = newMetric;
        }
      }, (err) => {
        console.log(err);
        const newMetric = new Metric();
        newMetric.teamId = null;
        newMetric.teamValue = null;
        newMetric.userValue = 0;
        this.metrics = newMetric;
      });
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyTeamMetrics() {
    this.taskService.getWeeklyTeamMetrics(this.teamId)
      .subscribe((fetchedTeamMetrics) => {
        this.taskService.getUserTeamMetrics(this.teamId, this.ownerEmail)
          .subscribe((fetchedUserMetrics) => {
            const teamMetrics = (!isNaN(fetchedTeamMetrics)) ? fetchedTeamMetrics : 0;
            const userMetrics = (!isNaN(fetchedUserMetrics)) ? fetchedUserMetrics : 0;
            const newMetric = new Metric();
            newMetric.teamId = this.teamId;
            newMetric.teamValue = teamMetrics;
            newMetric.userValue = userMetrics;
            this.metrics = newMetric;
          }, (err) => { console.log(err); });
      }, (err) => { console.log(err); });
  }

}
