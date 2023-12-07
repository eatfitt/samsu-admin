import { Component } from "@angular/core";
import { Observable, map } from "rxjs";
import {
  Semester,
  SemesterService,
} from "../../../@core/services/semester/semester.service";
import {
  GetAllGradesBySemesterResponse,
  GradeCriteriaResponse,
  GradeService,
  StudentGrade,
} from "../../../@core/services/grade/grade.service";
import { GradeSubCriteria } from "../../../@core/services/grade-sub-criteria/grade-sub-criteria.service";
import { GradeCriteria } from "../../../@core/services/grade-criateria/grade-criteria.service";

@Component({
  selector: "ngx-all-grades",
  templateUrl: "./all-grades.component.html",
  styleUrls: ["./all-grades.component.scss"],
})
export class AllGradesComponent {
  semesters$: Observable<Semester[]> = null;
  selectedSemester = "FA23";
  tableAllGrades: GetAllGradesBySemesterResponse = null;

  constructor(
    private semesterService: SemesterService,
    private gradeService: GradeService
  ) {}

  ngOnInit() {
    this.semesters$ = this.semesterService.getAllSemesters().pipe(
      map((data: any) => {
        return data.content.sort((a, b) => {
          const semesterOrder = ["FA", "SU", "SP"];
          const yearA = parseInt(a.name.slice(-2), 10);
          const yearB = parseInt(b.name.slice(-2), 10);
          const semesterA = a.name.slice(0, -2);
          const semesterB = b.name.slice(0, -2);

          if (yearA !== yearB) {
            // Sort by year in descending order
            return yearB - yearA;
          } else {
            // If the years are the same, sort by semester
            return (
              semesterOrder.indexOf(semesterA) -
              semesterOrder.indexOf(semesterB)
            );
          }
        });
      })
    );
  }

  selectSemester(semester) {
    this.selectedSemester = semester.tabTitle;
    this.gradeService
      .getAllGradesBySemester(this.selectedSemester)
      .subscribe((data: GetAllGradesBySemesterResponse) => {
        this.tableAllGrades = data;
      });
  }

  getSubCriteriasByCriteriaId(id: number) {
    return this.tableAllGrades.gradeSubCriteriaResponses.filter(
      (subCrit) => subCrit.gradeCriteriaId === id
    );
  }

  getGradeByStudentAndSubCritId(student: StudentGrade, subCritId: number) {
    return student.scoreWithSubCriteria[subCritId];
  }

  sumSubCrit(gradeCrit: GradeCriteriaResponse, student: StudentGrade) {
    const subCrits = this.getSubCriteriasByCriteriaId(gradeCrit.id);
    return subCrits.reduce((total, value) => {
      let grade = this.getGradeByStudentAndSubCritId(student, value.id);
      return typeof grade === "number" ? total + grade : total;
      // return sum > gradeCrit.maxScore ? gradeCrit.maxScore : sum;
    }, 0);
  }

  sumAllStudentGrade(gradeCrits: GradeCriteriaResponse[], student: StudentGrade) {
    // return Object.values(student.scoreWithSubCriteria).reduce(
    //   (total, value) => total + value,
    //   0
    // );
    return gradeCrits.reduce((total, value) => {
      let sum = this.sumSubCrit(value, student);
      return typeof sum === 'number' ? total + sum: total
    }, 0)
  }
}
