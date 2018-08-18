import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Account } from '../../models/Account';
import { TeamService } from '../../services/team.service';

declare function clickAccount(): any;

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {
  public email;
  public active = false;
  @Input() teamId: number;
  @Input() accounts: Account[];
  @Output() updatedAccounts = new EventEmitter<Account[]>();

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    
  }

  removeMember() {
    this.teamService.removeTeamMember(this.teamId, this.email)
      .subscribe(() => {
        var index = this.accounts.indexOf(this.email);
        if(index > -1) {
          this.accounts.splice(index, 1);
        }
        this.updatedAccounts.emit(this.accounts);
      }, (err) => {
        console.log(err);
      });
  }

  getEmail(account: Account) {
    this.email = account.email;
    console.log("email = ", this.email);

    clickAccount();
  }

}
