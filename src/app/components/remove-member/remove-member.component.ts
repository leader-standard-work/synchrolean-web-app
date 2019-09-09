import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Account } from '@app/models/Account';
import { TeamService } from '@app/services/team.service';

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {
  public email;
  @Input() teamId: number;
  @Input() accounts: Account[];
  @Output() updatedAccounts = new EventEmitter<Account[]>();

  constructor(private teamService: TeamService) { }

  ngOnInit() {
  }

  removeMember() {
    this.teamService.removeTeamMember(this.teamId, this.email)
      .subscribe(() => {
        this.updatedAccounts.emit(this.accounts);
      }, err => console.log(err));
  }

  getEmail(email: string) {
    this.email = email;
  }

}
