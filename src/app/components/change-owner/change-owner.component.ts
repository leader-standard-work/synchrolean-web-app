import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/Team';
import { Account } from '../../models/Account';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-owner',
  templateUrl: './change-owner.component.html',
  styleUrls: ['./change-owner.component.css']
})
export class ChangeOwnerComponent implements OnInit {
  public newOwnerForm: FormGroup;
  @Input() team = new Team();
  @Input() accounts: Account[];
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
    });
  }

  changeOwner() {
    const email = this.newOwnerForm.controls['email'].value;
    const oldOwnerEmail = this.team.ownerEmail;
    // Validate account exists
    this.accountService.getAccountByEmail(email)
      .subscribe((account: Account) => {
        // If successful, update team owner email and edit team.
        this.team.ownerEmail = email;
        this.teamService.editTeam(this.team)
          .subscribe((team) => {
            // If team edit successful, remove owner from team
            this.team = team;
              }, err => {
            this.team.ownerEmail = oldOwnerEmail;
            this.updatedTeam.emit(this.team);
            console.log(err);
          });
      }, err => console.log(err));
  }

}
