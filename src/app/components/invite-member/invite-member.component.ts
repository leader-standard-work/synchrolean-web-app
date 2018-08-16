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
  
  constructor(
    //private accountService: AccountService,
    private teamService: TeamService,
    //private authService: AuthService,
    //private route: ActivatedRoute,
    /*private router: Router*/) { }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.maxLength(50)
      ])
    })
  }

  submit() {
    this.teamService.inviteMemberToTeam(this.teamId, this.inviteForm.controls['email'].value)
      .subscribe(() => {}, (err) => {
        console.log('InviteMemberComponent: Invite was not created');
      });
  }
  /*
  submit() {
    this.accountService.getAccountByEmail(this.email)
      .subscribe((acc) => {
        let inviteeAccount = acc;
        this.route.params.subscribe(p => {
          let teamId = +p['id'];
          this.teamService.inviteMemberToTeam(teamId, inviteeAccount.email)
            .subscribe();
          this.router.navigate(['/teams/' + teamId])
        });
      }, (err) => {
        console.log(err)
      });
  }
  */

}
