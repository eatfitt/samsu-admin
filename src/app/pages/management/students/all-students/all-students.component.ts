import { Component, TemplateRef, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import {
  AddListUserRequest,
  AddListUserResponse,
  GetAllUsersResponse,
  UserImportsFail,
  UserService,
} from "../../../../@core/services/user/user.service";
import { UserState } from "../../../../app-state/user";
import { Store } from "@ngrx/store";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-all-students",
  templateUrl: "./all-students.component.html",
  styleUrls: ["./all-students.component.scss"],
})

// TODO: Thêm hình sinh viên thì tốt
export class AllStudentsComponent {
  @ViewChild("dialog", { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild("importResultDialog", { static: true }) importResultDialog: TemplateRef<any>;
  @ViewChild("failedImportListDialog", { static: true }) failedImportListDialog: TemplateRef<any>;

  importAmount = 0;
  importSuccess = 0;
  importFailed = 0;

  settings = {
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
      message: {
        title: "Reason Failed",
        type: "string",
        editable: false,
        // filter: false,
      }
    },
  };

  data: AddListUserRequest[] = [];

  addingData: Partial<AddListUserRequest>[] = [];

  source: LocalDataSource | any = new LocalDataSource();
  sourceAddingStudents: LocalDataSource | any = new LocalDataSource();

  bearerToken = "";
  private contentTemplateRef: NbDialogRef<AllStudentsComponent>;

  constructor(
    private userService: UserService,
    private store: Store<{ user: UserState }>,
    private dialogService: NbDialogService,
    private router: Router,
  ) {
    // this.source.load(this.data);
    // this.source.setFilter([{field: 'rollnumber', search: '79'}, {field: 'name', search: 'ha'}, ])
  }
  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  importFromExcel(data: any[][]) {
    this.addingData = data.map((item) => {
      return {
        rollnumber: item[0],
        name: item[1],
        email: item[2],
        username: item[3],
        dob: item[4], // you might need to convert this to a date format
        role: "ROLE_STUDENT",
      };
    });
    this.sourceAddingStudents.load(this.addingData);
    this.openToBeImported();
  }

  fetchData() {
    this.store
      .select((state) => state.user.jwt.jwtToken)
      .subscribe((token) => {
        this.userService
          .getAllUsers(`${token.tokenType} ${token.accessToken}`)
          .subscribe((users: GetAllUsersResponse) => {
            this.bearerToken = `${token.tokenType} ${token.accessToken}`;
            this.data = users.content
              .filter((c) => c.role === 3)
              .map((c) => {
                return {
                  rollnumber: c.rollnumber,
                  name: c.name,
                  email: c.email,
                  username: c.username,
                  dob: c.dob,
                  role: c.role.toString(),
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
    this.contentTemplateRef.close();
    this.sourceAddingStudents.load(this.addingData);
    this.contentTemplateRef = this.dialogService.open(this.failedImportListDialog, {
      context: "this is some additional data passed to dialog",
    });
  }

  importStudent() {
    this.sourceAddingStudents.getAll().then((value) => {
      console.log(value);
      this.contentTemplateRef.close();
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
              role: "ROLE_STUDENT",
              message: item.message
            };
          });
          this.contentTemplateRef = this.dialogService.open(this.importResultDialog, {
            context: 'Import Result'
          });
          this.fetchData();
        },
        (error) => alert(`these are whats wrong ${error}`)
      );
    });
  }
  navigateUser(event) {
    console.log(event);
    this.router.navigate(["pages", "user", event.data.username]);
  }
}
