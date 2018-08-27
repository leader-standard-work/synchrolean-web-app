import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/Account';

@Injectable()
export class DataSharingService {
    public isUserLoggedIn: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
}