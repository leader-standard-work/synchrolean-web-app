import { TeamService } from '../../services/team.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
