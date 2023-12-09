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
import { utils, writeFileXLSX } from "xlsx";

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
            return yearB - yearA;
          } else {
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
      let sum = typeof grade === "number" ? total + grade : total;
      return sum > gradeCrit.maxScore ? gradeCrit.maxScore : sum;
    }, gradeCrit.defaultScore);
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

  rankStudent(gradeCrits: GradeCriteriaResponse[], student: StudentGrade): string {
    const sumAllGrade = this.sumAllStudentGrade(gradeCrits, student);
    if (sumAllGrade >= 90) {
      return 'Xuất sắc'
    } else if (sumAllGrade >= 80) {
      return 'Giỏi';
    } else if (sumAllGrade >= 70) {
      return 'Khá';
    } else if (sumAllGrade >= 60) {
      return 'Trung bình khá';
    } else if (sumAllGrade >= 50) {
      return 'Trung bình';
    }
    return 'Không đạt';
  }

  exportToExcel() {
    let currentSemester = [];
    currentSemester.push({});

    let secondHeader = {
      rollnumber: 'MSSV',
      name: 'Họ tên',
    }

    this.tableAllGrades.studentGrade.forEach(student => {
      this.tableAllGrades.gradeCriteriaResponses.forEach(gradeCrit => { 
        
      })
    })

    this.tableAllGrades.gradeCriteriaResponses.forEach(gradeCrit => {
      const subs = this.getSubCriteriasByCriteriaId(gradeCrit.id);
      subs.forEach(sub => {
        secondHeader[gradeCrit.id + '-' + sub.id] = sub.content;
      })
      secondHeader[gradeCrit.id + '-sum'] = 'Tổng điểm'
    })
    secondHeader['allgrades'] = 'Tổng'
    secondHeader['ranking'] = 'Xếp hạng'

    currentSemester.push(secondHeader);

    this.tableAllGrades.studentGrade.forEach(student => { 
      let row = {
        rollnumber: student.userProfileReduce.rollnumber,
        name: student.userProfileReduce.name,
      }
      this.tableAllGrades.gradeCriteriaResponses.forEach(gradeCrit => {
        const subs = this.getSubCriteriasByCriteriaId(gradeCrit.id);
        subs.forEach(sub => {
          row[gradeCrit.id + '-' + sub.id] = this.getGradeByStudentAndSubCritId(student, sub.id) ?? 0;
        })
        row[gradeCrit.id + '-sum'] = this.sumSubCrit(gradeCrit, student);
      })
      row['allgrades'] = this.sumAllStudentGrade(this.tableAllGrades.gradeCriteriaResponses, student);
      row['ranking'] = this.rankStudent(this.tableAllGrades.gradeCriteriaResponses, student);
      currentSemester.push(row);
    })



console.log(currentSemester)
    const ws = utils.json_to_sheet(currentSemester);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, this.selectedSemester);

    // [0, 1].map((col) => {
    //   if (!ws["!cols"][col]) ws["!cols"][col] = { wch: 8 };
    //   ws["!cols"][col].wpx = 100;
    // });

    if (!ws["!rows"]) ws["!rows"] = [];
    if (!ws["!rows"][0]) ws["!rows"][0] = {};
    ws["!rows"][0].hidden = true;

    writeFileXLSX(wb, `${this.selectedSemester}_STATISTIC.xlsx`);
  }
}
