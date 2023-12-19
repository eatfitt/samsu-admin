import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DepartmentService } from '../../../../@core/services/department/department.service';

@Component({
  selector: 'ngx-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit {
  public staffList: any[];
  pageSize: number = 6; // Number of items per page
  currentPage: number = 1; // Current page number
  totalItems: number = 0;
  departmentName: string = '';
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.departmentService.getDepartmentById(id).subscribe(
          department => {
            this.departmentName = (department as any).name;
          }
        )
        this.departmentService.viewDepartmentUsers(id).subscribe(
          proposal => {
            this.staffList = [...(proposal as any)];
            this.totalItems = this.staffList.length;
          },
          error => {
            console.error('Error fetching event proposal:', error);
            // Handle error as needed
          }
        );
      }
    });
  }
  getUserDetailLink(rollnumber: string): string {
    return `/user/${rollnumber}`;
  }
  constructor(private departmentService: DepartmentService, private activatedRoute: ActivatedRoute, private store: Store) {

  }
}

