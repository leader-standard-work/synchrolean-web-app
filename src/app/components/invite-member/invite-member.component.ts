import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from './../../services/team.service';
import { AuthService } from './../../services/auth.service';
import { AccountService } from './../../services/account.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css']
})
export class InviteMemberComponent implements OnInit {
  public inviteForm: FormGroup;
  @Input() teamId: number;

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.maxLength(50)
      ])
    });
  }

  submit() {
    this.teamService.inviteMemberToTeam(this.teamId, this.inviteForm.controls['email'].value)
      .subscribe(() => {}, (err) => console.log('Invite was not created. Error: ' + err));
  }

}
