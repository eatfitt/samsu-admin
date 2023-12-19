import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbIconLibraries, NbToastrService } from '@nebular/theme';
import { Department, DepartmentService } from '../../../@core/services/department/department.service';
import { UserService } from '../../../@core/services/user/user.service';

interface GetAllDepartmentsResponse {
  content: Department[];
}
@Component({
  selector: 'ngx-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {
  @ViewChild("createDepartmentDialog", { static: true }) createDepartmentDialog: TemplateRef<any>;

  departments: Department[] = [];
  newDepartmentName = '';
  selectedDepartment: Department = null;
  editMode: boolean[] = [];

  private contentTemplateRef: NbDialogRef<DepartmentsComponent>;


  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    iconsLibrary: NbIconLibraries,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.departmentService.getAllDepartments().subscribe((departments: GetAllDepartmentsResponse) => {
      this.departments = departments.content
      this.selectedDepartment = departments.content[0];
    })
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  createDepartment() {
    this.departmentService.createDepartment(this.newDepartmentName).subscribe(
      success => {
        this.toastrService.show('Added Department Successfully', `Success`, { status: 'success'});
        this.fetchData();
        this.contentTemplateRef.close();
      },
      failed => {
        this.toastrService.show('Add Department Failed', `Failed`, { status: 'danger'});
      }
    )
  }
  deleteDepartment(department: Department) {
    this.departmentService.deleteDepartment(department.id).subscribe(
      success => {
        this.toastrService.show('Delete Department Successfully', `Success`, { status: 'success' });
        this.fetchData();
        this.contentTemplateRef.close();
      },
      failed => {
        this.toastrService.show('Delete Department Failed', `Failed`, { status: 'danger' });
      }
    )
  }
  editDepartment(department: Department) {
    this.departmentService.updateDepartment(department.id, department.name)
      .subscribe(
        success => {
          this.toastrService.show('Edit Department Successfully', `Success`, { status: 'success'});
          this.fetchData();
        },
        failed => {
          this.toastrService.show('Edit Department Failed', `Failed`, { status: 'danger'});
        }
      )
  }
}
