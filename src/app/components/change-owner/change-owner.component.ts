import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/Team';
import { Account } from '../../models/Account';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-change-owner',
  templateUrl: './change-owner.component.html',
  styleUrls: ['./change-owner.component.css']
})
export class ChangeOwnerComponent implements OnInit {
  public newOwnerForm: FormGroup;
  @Input() team = new Team();
  @Output() updatedTeam = new EventEmitter<Team>();
  @Output() updatedAccounts = new EventEmitter<Account[]>();

  constructor(private accountService: AccountService,
    private teamService: TeamService) { }

  ngOnInit() {
    this.newOwnerForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.maxLength(50)
      ])
    })
  }

  changeOwner() {
    let email = this.newOwnerForm.controls['email'].value;
    let oldOwnerEmail = this.team.ownerEmail;
    // Validate account exists
    this.accountService.getAccountByEmail(email)
      .subscribe((account: Account) => {
        // If successful, update team owner email and edit team.
        this.team.ownerEmail = email;
        this.teamService.editTeam(this.team)
          .subscribe((team) => {
            // If team edit successful remove owner from team
            this.team = team;
            this.teamService.removeTeamMember(this.team.id, oldOwnerEmail)
              .subscribe(() => {
                // Take out account in accounts[]
              }, (err) => {
                // If remove member was unsuccessful, revert changes back to normal
                this.team.ownerEmail = oldOwnerEmail;
                this.teamService.editTeam(this.team)
                  .subscribe(() => {

                  }, (err) => {
                    console.log(err);
                  });
              });
          }, (err) => {
            this.team.ownerEmail = oldOwnerEmail;
            console.log(err);
          });
      }, (err) => {
        console.log(err);
      });
  }

}
