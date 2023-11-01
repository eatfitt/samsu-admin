import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UserState } from '../../../../app-state/user';
import { Store } from '@ngrx/store';
import { Group, GroupService } from '../../../../@core/services/group/group.service';
import { UserService } from '../../../../@core/services/user/user.service';

@Component({
  selector: 'ngx-all-groups',
  templateUrl: './all-groups.component.html',
  styleUrls: ['./all-groups.component.scss']
})
export class AllGroupsComponent {
  groups: Group[] = []
  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private store: Store<{ user: UserState }>,
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.store
      .select((state) => state.user.jwt.jwtToken)
      .subscribe((token) => {
        this.groupService
          .getAllGroups(`${token.tokenType} ${token.accessToken}`)
          .subscribe((groups: Group[]) => this.groups = groups);
      });
  }

}
