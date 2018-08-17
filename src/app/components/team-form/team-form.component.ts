import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  action: string;
  teamForm: FormGroup;  // Form for creating or editing a team
  @Input() teamId: number;
  @Output() teamAdded = new EventEmitter<Team>();
  @Output() teamUpdated = new EventEmitter<Team>();

  constructor(
    private teamService: TeamService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    /**
     * Determine if we are adding a new team
     * or editing a team that already exists
     * by checking if the team object has an
     * id.
     * 
     * If we are, load the team from the
     * database and save its data into our
     * team object. This populates the form
     * with the selected teams data because
     * of our ngModel bindings.
     */
    this.teamForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ]),
      description: new FormControl('', [
        Validators.maxLength(250)
      ]),
      id: new FormControl(false),
      ownerEmail: new FormControl(false)
    });
    if(this.teamId) {
      this.action = 'Edit';
      this.teamService.getTeam(this.teamId)
        .subscribe((loadedTeam: Team) => {
          this.teamForm.controls['id'].setValue(loadedTeam.id);
          //this.teamForm.controls['ownerId'].setValue(loadedTeam.ownerId);
          this.teamForm.controls['ownerEmail'].setValue(loadedTeam.ownerEmail);
          this.teamForm.controls['name'].setValue(loadedTeam.teamName);
          this.teamForm.controls['description'].setValue(loadedTeam.teamDescription);
        }, err => {
          console.log(err);
        });
    } 
    else {
      this.action = 'Add';
    }
  }

  /**
   * Determine which service to call based
   * on whether we are adding a new team
   * or editing an existing team.
   */
  submit() {
    let team = new Team();
    if (this.teamId) {
      team.id = this.teamForm.controls['id'].value;
      //team.ownerId = this.teamForm.controls['ownerId'].value;
      team.ownerEmail = this.teamForm.controls['ownerEmail'].value;
      team.teamName = this.teamForm.controls['name'].value;
      team.teamDescription = this.teamForm.controls['description'].value;
      this.teamService.editTeam(team)
        .subscribe((updatedTeam: Team) => {
          this.teamUpdated.emit(updatedTeam);
        }, err => console.log(err));
    }
    else {
      //team.ownerId = this.authService.getCurrentUserId();
      team.ownerEmail = this.authService.getEmail();
      team.teamName = this.teamForm.controls['name'].value;
      team.teamDescription = this.teamForm.controls['description'].value;
      this.teamService.addTeam(team)
        .subscribe((newTeam: Team) => {
          this.teamAdded.emit(newTeam);
          this.teamForm.reset();
        }, err => console.log(err));
    }
  }

}
