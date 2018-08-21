import { TestBed, inject } from '@angular/core/testing';

import { AccountService } from './account.service';

describe('AccountsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
