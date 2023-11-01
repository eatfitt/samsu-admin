import { Component, TemplateRef, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import {
  AddListUserRequest,
  GetAllUsersResponse,
  UserService,
} from "../../../../@core/services/user/user.service";
import { UserState } from "../../../../app-state/user";
import { Store } from "@ngrx/store";
import { NbDialogService } from "@nebular/theme";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-all-students",
  templateUrl: "./all-students.component.html",
  styleUrls: ["./all-students.component.scss"],
})

// TODO: Thêm hình sinh viên thì tốt
export class AllStudentsComponent {
  @ViewChild("dialog", { static: true }) contentTemplate: TemplateRef<any>;

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
      confirmDelete: true,
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
      dob: {
        title: "DOB",
        type: "string",
      },
    },
  };

  data: AddListUserRequest[] = [
    {
      rollnumber: "SE161779",
      name: "Đỗ Ngân Hà",
      email: "hadnse161779@fpt.edu.vn",
      username: "elnganha",
      dob: "14/09/2001",
      role: "ROLE_MANAGER",
    },
    {
      rollnumber: "SE151779",
      name: "Nguyễn Trần Thiên Đức",
      email: "duc79@fpt.edu.vn",
      username: "ducduc",
      dob: "01/01/2001",
      role: "ROLE_MANAGER",
    },
    {
      rollnumber: "SE151773",
      name: "Trương Nguyễn Anh Huy",
      email: "huy73@fpt.edu.vn",
      username: "huyhuy",
      dob: "02/02/2001",
      role: "ROLE_MANAGER",
    },
    {
      rollnumber: "SE161777",
      name: "Thái Văn Mẫn",
      email: "man77@fpt.edu.vn",
      username: "manman",
      dob: "03/03/2001",
      role: "ROLE_MANAGER",
    },
  ];

  addingData: AddListUserRequest[] = [];

  source: LocalDataSource | any = new LocalDataSource();
  sourceAddingStudents: LocalDataSource | any = new LocalDataSource();

  bearerToken = "";

  constructor(
    private userService: UserService,
    private store: Store<{ user: UserState }>,
    private dialogService: NbDialogService,
    private router: Router
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
    this.open2();
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

  open2() {
    this.dialogService.open(this.contentTemplate, {
      context: "this is some additional data passed to dialog",
    });
  }

  importStudent() {
    this.sourceAddingStudents.getAll().then((value) => {
      console.log(value);
      this.userService.addListUser(this.bearerToken, value).subscribe(
        (data) => {
          console.log(data);
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
