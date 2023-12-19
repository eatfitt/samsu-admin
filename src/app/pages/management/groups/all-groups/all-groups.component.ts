import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbIconLibraries } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Group, GroupService } from '../../../../@core/services/group/group.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { UserState } from '../../../../app-state/user';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-all-groups',
  templateUrl: './all-groups.component.html',
  styleUrls: ['./all-groups.component.scss']
})
export class AllGroupsComponent {
  @ViewChild("createGorupDialog", { static: true }) createGorupDialog: TemplateRef<any>;

  groups: Group[] = [];
  selectedGroup: Group;
  bearerToken = '';
  newGroupName = '';
  isApiSuccess: boolean;
  isApiFailed: boolean;
  private contentTemplateRef: NbDialogRef<AllGroupsComponent>;
  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private store: Store<{ user: UserState }>,
    private dialogService: NbDialogService,
    iconsLibrary: NbIconLibraries,
    private router: Router,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.store
      .select((state) => state.user?.jwt?.jwtToken)
      .subscribe((token) => {
        this.bearerToken = `${token.tokenType} ${token.accessToken}`;
        this.groupService
          .getAllGroups(`${token.tokenType} ${token.accessToken}`)
          .subscribe((groups: Group[]) => this.groups = groups);
      });
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  identify(index, item) {
    return item.id;
  }

  createGroup() {
    this.groupService.createGroup(this.bearerToken, {name: this.newGroupName, userRollnumbers: []})
    .subscribe(
      (data: any) => {
        this.isApiFailed = false;
        this.isApiSuccess = true;
        this.fetchData();
        this.contentTemplateRef.close();
        this.router.navigate(['pages', 'group', data.id])
      },
      error => {
        console.error(error);
        this.isApiSuccess = false;
        this.isApiFailed = true;
      }
    )
  }
}
