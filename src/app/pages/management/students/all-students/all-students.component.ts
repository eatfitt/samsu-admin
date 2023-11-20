import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef, NbDialogService, NbMenuService, NbToastrService } from "@nebular/theme";
import { Store } from "@ngrx/store";
import { LocalDataSource } from "ng2-smart-table";
import { Subscription } from "rxjs";
import {
  AddListUserRequest,
  AddListUserResponse,
  GetAllUsersResponse,
  RoleEnum,
  UserImportsFail,
  UserService,
} from "../../../../@core/services/user/user.service";
import { UserState } from "../../../../app-state/user";

@Component({
  selector: "ngx-all-students",
  templateUrl: "./all-students.component.html",
  styleUrls: ["./all-students.component.scss"],
})

// TODO: Thêm hình sinh viên thì tốt
export class AllStudentsComponent {
  @Input() pager = {
    display: true,
    perPage: 10
  };
  @Input() showAction = true;
  @Input() showImport = true;
  @ViewChild("dialog", { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild("importResultDialog", { static: true }) importResultDialog: TemplateRef<any>;
  @ViewChild("failedImportListDialog", { static: true }) failedImportListDialog: TemplateRef<any>;
  @ViewChild("deleteUserDialog", { static: true }) deleteUserDialog: TemplateRef<any>;
  @ViewChild("updateUserDialog", { static: true }) updateUserDialog: TemplateRef<any>;
  @ViewChild("excelImporterDialog", { static: true }) excelImporterDialog: TemplateRef<any>;

  importAmount = 0;
  importSuccess = 0;
  importFailed = 0;

  selectedK = '';
  selectedMajor = '';

  settings: any;

  importSetting: any = {
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
      },
      name: {
        title: "Name",
        type: "string",
        filter: false,
      },
      email: {
        title: "Email",
        type: "string",
        filter: false,
      },
      username: {
        title: "Username",
        type: "string",
        filter: false,
      },
      role: {
        title: "Role",
        type: "list",
        defaultValue: 'ROLE_STUDENT',
        //addable: false,
        filter: false,
        editor: {
          config: {
            selectText: 'Select...',
              list: [
                { value: 'ROLE_ADMIN', title: 'Student' },
                { value: 'ROLE_MANAGER', title: 'Student' },
                { value: 'ROLE_STAFF', title: 'Student' },
                { value: 'ROLE_STUDENT', title: 'Student' },
              ],
          }
        }
      }
    },
  };

  reimportFailSetting = {
    actions: {
      add: false
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
      // confirmDelete: true,
    },
    columns: {
      rollnumber: {
        title: "Roll Number",
        type: "string",
        filter: false,
      },
      name: {
        title: "Name",
        type: "string",
        filter: false,
      },
      email: {
        title: "Email",
        type: "string",
        filter: false,
      },
      username: {
        title: "Username",
        type: "string",
        filter: false,
      },
      role: {
        title: "Role",
        type: "list",
        defaultValue: 'ROLE_STUDENT',
        //addable: false,
        filter: false,
        editor: {
          config: {
            selectText: 'Select...',
              list: [
                { value: 'ROLE_ADMIN', title: 'Student' },
                { value: 'ROLE_MANAGER', title: 'Student' },
                { value: 'ROLE_STAFF', title: 'Student' },
                { value: 'ROLE_STUDENT', title: 'Student' },
              ],
          }
        }
      },
      message: {
        title: "Reason Failed",
        type: "string",
        editable: false,
        filter: false,
      }
    },
  };

  data: any[] = [];

  addingData: Partial<AddListUserRequest>[] = [];

  source: LocalDataSource | any = new LocalDataSource();
  sourceAddingStudents: LocalDataSource | any = new LocalDataSource();

  bearerToken = "";
  selectedStudent: Partial<AddListUserRequest> = null;
  items = [{ title: 'Import List User' }, { title: 'Add User Manually' }];
  test: Subscription;
  private contentTemplateRef: NbDialogRef<AllStudentsComponent>;

  constructor(
    protected userService: UserService,
    protected store: Store<{ user: UserState }>,
    protected dialogService: NbDialogService,
    protected router: Router,
    protected toastrService: NbToastrService,
    protected menuService: NbMenuService,
  ) {
    // this.source.load(this.data);
    // this.source.setFilter([{field: 'rollnumber', search: '79'}, {field: 'name', search: 'ha'}, ])
  }
  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
    this.test = this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Import List User') {
        this.openDialog(this.excelImporterDialog);
      } else if (event.item.title === 'Add User Manually') {
        this.importFromExcel([]);
      }
    })
    this.settings = {
      pager: this.pager,
      actions: {
        add: false,
        edit: this.showAction,
        delete: this.showAction,
        custom: [
          {
            name: 'View',
            title: 'View Profile',
          }
        ],
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

  importFromExcel(data: any[][]) {
    this.addingData = data.splice(1, data.length).map((item) => {
      return {
        rollnumber: item[0],
        name: item[1],
        email: item[2],
        username: item[3],
        role: item[4],
      };
    });
    this.sourceAddingStudents.load(this.addingData);
    this.openToBeImported();
  }

  fetchData() {
    this.store
      .select((state) => state.user?.jwt?.jwtToken)
      .subscribe((token) => {
        this.userService
          .getAllUsers(`${token.tokenType} ${token.accessToken}`)
          .subscribe((users: GetAllUsersResponse) => {
            this.bearerToken = `${token.tokenType} ${token.accessToken}`;
            this.data = users.content
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
            this.source.load(this.data);
          });
      });
  }

  openToBeImported() {
    this.contentTemplateRef = this.dialogService.open(this.contentTemplate, {
      context: "this is some additional data passed to dialog",
    });
  }

  openFailedList() {
    this.closeDialog()
    this.sourceAddingStudents.load(this.addingData);
    this.contentTemplateRef = this.dialogService.open(this.failedImportListDialog, {
      context: "this is some additional data passed to dialog",
    });
  }

  closeDialog() {
    this.contentTemplateRef.close();
  }

  importStudent() {
    this.sourceAddingStudents.getAll().then((value) => {
      console.log(value);
      this.closeDialog()
      this.userService.addListUser(this.bearerToken, value).subscribe(
        (res: AddListUserResponse) => {
          this.importAmount = res.amount;
          this.importSuccess = res.success;
          this.importFailed = res.failed;
          console.log(res);
          this.addingData = res.userImportsFail.map((item: UserImportsFail) => {
            return {
              rollnumber: item.userImport.rollnumber,
              name: item.userImport.name,
              email: item.userImport.email,
              username: item.userImport.username,
              role: item.userImport.role,
              message: item.message
            };
          });
          this.contentTemplateRef = this.dialogService.open(this.importResultDialog, {
            context: 'Import Result'
          });
          this.fetchData();
        },
        (error) => {
          console.log(error)
          alert(`Error: ${error.error.message}`)
        }
      );
    });
  }

  navigateUser(event) {
    console.log(event);
    this.router.navigate(["pages", "user", event.data.username]);
  }

  filterTable() {
    this.source.setFilter([{field: 'rollnumber', search: this.selectedMajor + this.selectedK}])
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  onDeleteConfirm(event) {
    console.log(event);
    this.selectedStudent = event.data;
    this.openDialog(this.deleteUserDialog);
  }

  onEditConfirm(event) {
    console.log(event);
    this.selectedStudent = event.newData;
    this.openDialog(this.updateUserDialog);
  }

  deleteUser() {
    this.deleteUserObservable()
    .subscribe(
      data => {
        this.toastrService.show('Deleted Successfully', `Success`, { status: 'success'});
        this.closeDialog();
        this.fetchData();
      },
      error => { // them error tu api
        this.toastrService.show('Deleted Failed', `Failed`, { status: 'danger'});
        this.closeDialog();
      },
    )
  }

  deleteUserObservable() {
    return this.userService.deleteUser(this.bearerToken, this.selectedStudent.rollnumber);
  }

  updateUser() {
    let studentPayload = this.selectedStudent;
    studentPayload.role = RoleEnum[studentPayload.role];
    studentPayload.status = 1;
    this.userService.updateUser(this.bearerToken, this.selectedStudent.rollnumber, studentPayload as AddListUserRequest)
    .subscribe(
      data => {
        this.toastrService.show('Update Successfully', `Success`, { status: 'success'});
        this.closeDialog();
        this.fetchData();
      },
      error => { // them error tu api
        this.toastrService.show('Update Failed', `Failed`, { status: 'danger'});
        this.closeDialog();
      },
    )
  }

  onCustomAction(event) {
    const data = event.data;
    console.log(event)
    switch (event.action) {
      case 'View':
        this.router.navigateByUrl(`pages/user/${data.username}`)
        break;
    }
  }

  ngOnDestroy() {
    this.test?.unsubscribe();
  }
}
