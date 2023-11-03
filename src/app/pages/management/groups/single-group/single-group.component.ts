import { Component } from '@angular/core';
import { AddListUserRequest, RoleEnum, UserService } from '../../../../@core/services/user/user.service';
import { AllStudentsComponent } from '../../students/all-students/all-students.component';
import { UserState } from '../../../../app-state/user';
import { Store } from '@ngrx/store';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { GetSingleGroupResponse, GroupService } from '../../../../@core/services/group/group.service';

@Component({
  selector: 'ngx-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent extends AllStudentsComponent  {
  groupId = 0;
constructor(
  public userService: UserService,
  public store: Store<{ user: UserState }>,
  public dialogService: NbDialogService,
  public router: Router,
  public groupService: GroupService,
  public toastrService: NbToastrService
) {
  super(userService, store, dialogService, router, toastrService);
  let url = this.router.url;
  this.groupId = Number(url.split('/').pop());
}
  fetchData() {
    this.store
      .select((state) => state.user.jwt.jwtToken)
      .subscribe((token) => {
        this.groupService
          .getSingleGroup(`${token.tokenType} ${token.accessToken}`, this.groupId)
          .subscribe((group: GetSingleGroupResponse) => {
            this.bearerToken = `${token.tokenType} ${token.accessToken}`;
            this.data = group.users
              .map((c) => {
                return {
                  image: '../../../../../assets/images/kitten-default.png',
                  rollnumber: c.rollnumber,
                  name: c.name,
                  email: c.email,
                  username: c.username,
                  dob: c.dob,
                  role: RoleEnum[c.role],
                };
              });
            this.source.load(this.data);
          });
      });
  }
}
