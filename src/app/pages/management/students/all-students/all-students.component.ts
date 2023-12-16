import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  NbDialogRef,
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Store } from "@ngrx/store";
import { LocalDataSource } from "ng2-smart-table";
import { Observable, Subscription, map } from "rxjs";
import { DepartmentService } from "../../../../@core/services/department/department.service";
import {
  AddListUserRequest,
  AddListUserResponse,
  GetAllUsersListResponse,
  GetAllUsersResponse,
  UserImportsFail,
  UserService,
} from "../../../../@core/services/user/user.service";
import { convertToDate } from "../../../../@core/utils/data-util";
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
    perPage: 10,
  };
  @Input() showAction = true;
  @Input() showImport = true;
  @ViewChild("dialog", { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild("importResultDialog", { static: true })
  importResultDialog: TemplateRef<any>;
  @ViewChild("failedImportListDialog", { static: true })
  failedImportListDialog: TemplateRef<any>;
  @ViewChild("deleteUserDialog", { static: true })
  deleteUserDialog: TemplateRef<any>;
  @ViewChild("updateUserDialog", { static: true })
  updateUserDialog: TemplateRef<any>;
  @ViewChild("excelImporterDialog", { static: true })
  excelImporterDialog: TemplateRef<any>;

  // TODO: chia tab user, student tab rieng, dau tien - achievement + grade
  studentList = [];
  staffList = [];
  managerList = [];
  pageSize: number = 6; // Number of items per page
  currentPage: number = 1; // Current page number
  totalItems: number = 0; // Total number of items

  importAmount = 0;
  importSuccess = 0;
  importFailed = 0;

  selectedK = "";
  selectedMajor = "";

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
      // confirmDelete: true,
    },
    columns: {
      rollnumber: {
        title: "Rollnumber",
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
        defaultValue: "ROLE_STUDENT",
        //addable: false,
        filter: false,
        editor: {
          type: "list",
          config: {
            selectText: "Select...",
            list: [
              { value: "ROLE_ADMIN", title: "Admin" },
              { value: "ROLE_MANAGER", title: "Manager" },
              { value: "ROLE_STAFF", title: "Staff" },
              { value: "ROLE_STUDENT", title: "Student" },
            ],
          },
        },
      },
      dob: {
        title: "DOB",
        defaultValue: '01/01/2001',
        filter: false,
      },
      avatar: {
        title: "Avatar",
        defaultValue: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
        filter: false,
      }
    },
  };

  reimportFailSetting = {
    actions: {
      add: false,
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
        defaultValue: "ROLE_STUDENT",
        //addable: false,
        filter: false,
        editor: {
          type: "list",
          config: {
            selectText: "Select...",
            list: [
              { value: "ROLE_ADMIN", title: "Admin" },
              { value: "ROLE_MANAGER", title: "Manager" },
              { value: "ROLE_STAFF", title: "Staff" },
              { value: "ROLE_STUDENT", title: "Student" },
            ],
          },
        },
      },
      dob: {
        title: "DOB",
        defaultValue: '29/11/2001',
        filter: false,
      },
      avatar: {
        title: "Avatar",
        defaultValue: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
        filter: false,
      },
      message: {
        title: "Reason Failed",
        type: "string",
        editable: false,
        filter: false,
      },
    },
  };

  allUserList: GetAllUsersListResponse[] = [];

  addingData: Partial<AddListUserRequest>[] = [];

  source: LocalDataSource | any = new LocalDataSource();
  sourceAddingStudents: LocalDataSource | any = new LocalDataSource();

  bearerToken = "";
  selectedStudent: Partial<AddListUserRequest> = null;
  items = [{ title: "Import List User" }, { title: "Add User Manually" }];
  singleUserAction = [{ title: "Update" }, { title: "Delete" }];
  test: Subscription;
  singleUserActionSubscription: Subscription;
  departments$: Observable<any> = this.departmentService.getAllDepartments().pipe(map((data: any) => data.content));
  private contentTemplateRef: NbDialogRef<AllStudentsComponent>;

  constructor(
    protected userService: UserService,
    protected store: Store<{ user: UserState }>,
    protected dialogService: NbDialogService,
    protected router: Router,
    protected toastrService: NbToastrService,
    protected menuService: NbMenuService,
    protected departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
    this.test = this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === "Import List User") {
        this.openDialog(this.excelImporterDialog);
      } else if (event.item.title === "Add User Manually") {
        this.importFromExcel([]);
      }
    });
    this.singleUserActionSubscription = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (this.selectedStudent !== undefined || this.selectedStudent !== null) {
          if (event.item.title === "Update") {
            this.openDialog(this.updateUserDialog);
          } else if (event.item.title === "Delete") {
            this.openDialog(this.deleteUserDialog);
          }
        }
      });
  }

  importFromExcel(data: any[][]) {
    this.addingData = data.splice(1, data.length).map((item) => {
      return {
        rollnumber: item[0],
        name: item[1],
        email: item[2],
        username: item[3],
        role: item[4],
        dob: item[5] ?? '01/01/2001',
        avatar: item[6] ?? 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
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
            this.allUserList = users.content;
            this.pageSize = users.size;
            this.currentPage = users.page;
            this.totalItems = users.totalElements;
            this.studentList = users.content.filter((user) => user.role === 3);
            this.staffList = users.content.filter((user) => user.role === 2);
            this.managerList = users.content.filter((user) => user.role === 1);
            // .map((c) => {
            //   return {
            //     avatar: c.avatar ?? '../../../../../assets/images/kitten-default.png',
            //     rollnumber: c.rollnumber,
            //     name: c.name,
            //     email: c.email,
            //     username: c.username,
            //     role: RoleEnum[c.role],
            //   };
            // });
            // this.source.load(this.allUserList);
          });
      });
  }

  openToBeImported() {
    this.contentTemplateRef = this.dialogService.open(this.contentTemplate, {
      context: "this is some additional data passed to dialog",
    });
  }

  openFailedList() {
    this.closeDialog();
    this.sourceAddingStudents.load(this.addingData);
    this.contentTemplateRef = this.dialogService.open(
      this.failedImportListDialog,
      {
        context: "this is some additional data passed to dialog",
      }
    );
  }

  closeDialog() {
    this.contentTemplateRef.close();
  }

  importStudent() {
    this.sourceAddingStudents.getAll()
    .then((value) => {
      const tmpValue = value.map(v => {
        return {
          ...v,
          dob: convertToDate(v.dob),
          role: v.role
        }
      })
      console.log(tmpValue);
      this.closeDialog();
      this.userService.addListUser(this.bearerToken, tmpValue).subscribe(
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
              message: item.message,
            };
          });
          this.contentTemplateRef = this.dialogService.open(
            this.importResultDialog,
            {
              context: "Import Result",
            }
          );
          this.fetchData();
        },
        (error) => {
          console.log(error);
          alert(`Error: ${error.error.message}`);
        }
      );
    });
  }

  navigateUser(event) {
    console.log(event);
    this.router.navigate(["pages", "user", event.data.username]);
  }

  filterTable() {
    this.source.setFilter([
      { field: "rollnumber", search: this.selectedMajor + this.selectedK },
    ]);
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
    this.deleteUserObservable().subscribe(
      (data) => {
        this.toastrService.show("Deleted Successfully", `Success`, {
          status: "success",
        });
        this.closeDialog();
        this.fetchData();
      },
      (error) => {
        // them error tu api
        this.toastrService.show("Deleted Failed", `Failed`, {
          status: "danger",
        });
        this.closeDialog();
      }
    );
  }

  deleteUserObservable() {
    return this.userService.deleteUser(
      this.selectedStudent.rollnumber
    );
  }

  updateUser() {
    let {department, ...studentPayload}: any = this.selectedStudent;
    // studentPayload.role = RoleEnum[studentPayload.role];
    studentPayload.role = this.getUserRoleString(this.selectedStudent.role as number);
    studentPayload.status = 1;
    studentPayload.departmentId = this.selectedStudent?.department?.id;
    // studentPayload.dob = convertToDate(this.selectedStudent.dob as string)
    this.userService
      .updateUser(
        this.bearerToken,
        this.selectedStudent.rollnumber,
        studentPayload as AddListUserRequest
      )
      .subscribe(
        (data) => {
          this.toastrService.show("Update Successfully", `Success`, {
            status: "success",
          });
          this.closeDialog();
          this.fetchData();
        },
        (error) => {
          // them error tu api
          this.toastrService.show("Update Failed", `Failed`, {
            status: "danger",
          });
          this.closeDialog();
        }
      );
  }

  onCustomAction(event) {
    const data = event.data;
    console.log(event);
    switch (event.action) {
      case "View":
        this.router.navigateByUrl(`pages/user/${data.username}`);
        break;
    }
  }

  selectUser(event) {
    const user = {
      ... event,
      dob: new Date(event.dob),
    }
    this.selectedStudent = user;

  }

  getUserRole(role: string): number {
    if (role === 'ROLE_ADMIN') return 0;
    if (role === 'ROLE_MANAGER') return 1;
    if (role === 'ROLE_STAFF') return 2;
    if (role === 'ROLE_STUDENT') return 3;
  }
  getUserRoleString(role: number): string {
    if (role === 0) return 'ROLE_ADMIN';
    if (role === 1) return 'ROLE_MANAGER';
    if (role === 2) return 'ROLE_STAFF';
    if (role === 3) return 'ROLE_STUDENT';
  }

  ngOnDestroy() {
    this.test?.unsubscribe();
  }
}
