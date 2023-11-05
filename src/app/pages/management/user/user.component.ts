import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Jwt, UserState, UserSummary, getUserJwtState, getUserUserSummaryState } from '../../../app-state/user';
import { UserService } from '../../../@core/services/user/user.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  constructor(
    private router: Router,
    protected userService: UserService,
    protected store: Store<{ user: UserState }>,

  ) {
    console.log(this.router);
  }
  //TODO: API lấy info user chưa có /profile -> đang lấy của thằng login
  user: UserSummary;
  jwt: Jwt;
  groups = ['SE1622', 'SE1511', 'SS1612'];
  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.store.select(getUserUserSummaryState).subscribe((userSummary) => {
      this.user = {...userSummary};
    })
    this.store.select(getUserJwtState).subscribe((jwt) => {
      this.jwt = {...jwt};
    })
  }
}
