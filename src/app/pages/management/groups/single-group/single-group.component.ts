import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { GetSingleGroupResponse, GroupService, PutUpdateGroupRequest } from '../../../../@core/services/group/group.service';
import { GetAllUsersListResponse, GetAllUsersResponse, RoleEnum, UserService } from '../../../../@core/services/user/user.service';
import { UserState } from '../../../../app-state/user';
import { AllStudentsComponent } from '../../students/all-students/all-students.component';

@Component({
  selector: 'ngx-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent extends AllStudentsComponent  {
  groupId = 0;
  group: GetSingleGroupResponse;
  studentSource: LocalDataSource | any = new LocalDataSource();
  studentData: any[] = [];

  settings: any;

  importSetting = {
    actions: {
      edit: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      rollnumber: {
        title: "Roll Number",
        type: "string",
        filter: false,
        // addable: false,
      },
      // name: {
      //   title: "Name",
      //   type: "string",
      //   filter: false,
      //   addable: false,
      // },
      // email: {
      //   title: "Email",
      //   type: "string",
      //   filter: false,
      //   addable: false,
      // },
      // username: {
      //   title: "Username",
      //   type: "string",
      //   filter: false,
      //   addable: false,
      // },
      // role: {
      //   title: "Role",
      //   type: "list",
      //   addable: false,
      //   filter: false,
      //   editor: {
      //     config: {
      //       selectText: 'Select...',
      //         list: [
      //           { value: 'ROLE_ADMIN', title: 'Student' },
      //           { value: 'ROLE_MANAGER', title: 'Student' },
      //           { value: 'ROLE_STAFF', title: 'Student' },
      //           { value: 'ROLE_STUDENT', title: 'Student' },
      //         ],
      //     }
      //   }
      // }
    },
  };
  
constructor(
  public userService: UserService,
  public store: Store<{ user: UserState }>,
  public dialogService: NbDialogService,
  public router: Router,
  public groupService: GroupService,
  public toastrService: NbToastrService,
  public menuService: NbMenuService
) {
  super(userService, store, dialogService, router, toastrService, menuService);
  let url = this.router.url;
  this.groupId = Number(url.split('/').pop());
}

ngOnInit(): void {
  super.ngOnInit();
  this.fetchData();
  this.settings = {
    pager: this.pager,
    actions: {
      add: false,
      edit: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      avatar: {
        title: '',
        type: 'html',
        valuePrepareFunction: (images) => {
          return `<img class='table-avatar-img' src="${images}"/>`
        },
        // editable: false,
        filter: false,
      },
      rollnumber: {
        title: "Roll Number",
        type: "string",
      },
      name: {
        title: "Name",
        type: "string",
      },
      email: {
        title: "Email",
        type: "string",
      },
      username: {
        title: "Username",
        type: "string",
      },
      role: {
        title: "Role",
        type: "string",
        defaultValue: 'ROLE_STUDENT',
        //addable: false,
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
              list: [
                { value: 'ROLE_ADMIN', title: 'ROLE_ADMIN' },
                { value: 'ROLE_MANAGER', title: 'ROLE_MANAGER' },
                { value: 'ROLE_STAFF', title: 'ROLE_STAFF' },
                { value: 'ROLE_STUDENT', title: 'ROLE_STUDENT' },
              ],
          }
        },
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
              list: [
                { value: 'ROLE_ADMIN', title: 'ROLE_ADMIN' },
                { value: 'ROLE_MANAGER', title: 'ROLE_MANAGER' },
                { value: 'ROLE_STAFF', title: 'ROLE_STAFF' },
                { value: 'ROLE_STUDENT', title: 'ROLE_STUDENT' },
              ],
          }
        }
      }
    },
  };
}

  fetchData() {
    this.store
      .select((state) => state.user?.jwt?.jwtToken)
      .subscribe((token) => {
        this.groupService
          .getSingleGroup(`${token.tokenType} ${token.accessToken}`, this.groupId)
          .subscribe((group: GetSingleGroupResponse) => {
            this.bearerToken = `${token.tokenType} ${token.accessToken}`;
            this.group = group
            this.data = group.users
              .map((c) => {
                return {
                  avatar: '../../../../../assets/images/kitten-default.png',
                  rollnumber: c.rollnumber,
                  name: c.name,
                  email: c.email,
                  username: c.username,
                  dob: c.dob,
                  role: RoleEnum[c.role],
                };
              }) as GetAllUsersListResponse[];
            this.source.load(this.data);
          });
      });
  }

  getListUsers() {
    this.store
      .select((state) => state.user?.jwt?.jwtToken)
      .subscribe((token) => {
        this.userService
          .getAllUsers(`${token.tokenType} ${token.accessToken}`)
          .subscribe((users: GetAllUsersResponse) => {
            this.bearerToken = `${token.tokenType} ${token.accessToken}`;
            this.studentData = users.content
              .map((c) => {
                return {
                  avatar: c.avatar ?? '../../../../../assets/images/kitten-default.png',
                  rollnumber: c.rollnumber,
                  name: c.name,
                  email: c.email,
                  username: c.username,
                  role: RoleEnum[c.role],
                };
              });
            this.studentSource.setPaging({page: 1, perPage: 10 });
            this.studentSource.load(this.studentData);
          });
      });
  }

  override importStudent() {
    this.sourceAddingStudents.getAll().then((value) => {
      const importUserPayload: PutUpdateGroupRequest = {
        id: this.group.id,
        name: this.group.name,
        userRollnumbers: [...this.group.users.map(item => item.rollnumber), ...value.map(item => item.rollnumber)],
      }
      this.groupService.putUpdateGroup(this.bearerToken, importUserPayload).subscribe(
        (res) => {
          this.toastrService.show('Update Successfully', `Success`, { status: 'success'});
          this.closeDialog();
          this.fetchData();
        },
        (error) => {
        this.toastrService.show('Update Failed', `Failed`, { status: 'danger'});
          console.log(error)
          alert(`Error: ${error.error.message}`)
        }
      );
    });
  }

  override deleteUserObservable() {
    const importUserPayload: PutUpdateGroupRequest = {
      id: this.group.id,
      name: this.group.name,
      userRollnumbers: this.group.users.map(item => item.rollnumber).filter(rollno => rollno !== this.selectedStudent.rollnumber),
    }
    return this.groupService.putUpdateGroup(this.bearerToken, importUserPayload);
  }
}
