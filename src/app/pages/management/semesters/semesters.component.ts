import { Component, ViewChild, TemplateRef } from '@angular/core';
import { SemesterService } from '../../../@core/services/semester/semester.service';
import { Observable, map } from 'rxjs';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-semesters',
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.scss']
})
export class SemestersComponent {
  @ViewChild("addSemesterDialog", { static: true })
  addSemesterDialog: TemplateRef<any>;
  semesters$: Observable<any> = null;
  years$: Observable<any> = null;
  objectKeys = Object.keys;
  newSemYear = 2024;
  newSemSeason = 'SP';
  private contentTemplateRef: NbDialogRef<SemestersComponent>;

  constructor(
    private semesterService: SemesterService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {}
  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.semesters$ = this.semesterService.getAllSemesters().pipe(
      map((data: any) => {
        // First, sort the data
        const sortedData = data.content.sort((a, b) => {
          const semesterOrder = ["FA", "SU", "SP"];
          const yearA = parseInt(a.name.slice(-2), 10);
          const yearB = parseInt(b.name.slice(-2), 10);
          const semesterA = a.name.slice(0, -2);
          const semesterB = b.name.slice(0, -2);
    
          if (yearA !== yearB) {
            return yearB - yearA;
          } else {
            return (
              semesterOrder.indexOf(semesterA) -
              semesterOrder.indexOf(semesterB)
            );
          }
        });
    
        // Then, group the data by year
        const groupedData = sortedData.reduce((acc, cur) => {
          const year = '20' + cur.name.slice(-2);
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(cur);
          return acc;
        }, {});
    
        // Finally, reorder the keys
        const orderedData = {};
        Object.keys(groupedData).sort().reverse().forEach((key) => {
          orderedData[key] = groupedData[key];
        });
    
        return orderedData;
      })
    );

    this.years$ = this.semesters$.pipe(
      map(semesters => Object.keys(semesters).sort().reverse())
    );
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  addSemester() {
    this.semesterService.addSemester({name: `${this.newSemSeason}${this.newSemYear.toString().slice(-2)}`})
    .subscribe(
      (success) => {
        this.toastrService.show("Semester created successfully", "Success", {
          status: "success",
        });
        this.contentTemplateRef.close();
        this.fetchData();
      },
      (error) => {
        this.toastrService.show("Try again", "Failed", { status: "danger" });
      }
    )
  }

}
