import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from './../../services/team.service';
import { AuthService } from './../../services/auth.service';
import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css']
})
export class InviteMemberComponent implements OnInit {
  email: string;

  constructor(
    private accountService: AccountService,
    private teamService: TeamService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

  submit() {
    this.accountService.getAccountByEmail(this.email)
      .subscribe((acc) => {
        let inviteeAccount = acc;
        this.route.params.subscribe(p => {
          let teamId = +p['id'];
          this.teamService.inviteMemberToTeam(inviteeAccount.ownerId, this.authService.getCurrentUserId(), teamId)
            .subscribe();
          this.router.navigate(['/teams/' + teamId])
        });
      }, (err) => {
        console.log(err)
      });
  }

}
