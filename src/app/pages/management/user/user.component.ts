import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Jwt,
  UserState,
  UserSummary,
  getUserJwtState,
  getUserUserSummaryState,
} from "../../../app-state/user";
import { UserService } from "../../../@core/services/user/user.service";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, filter, map, switchMap, tap } from "rxjs";
import {
  Semester,
  SemesterService,
} from "../../../@core/services/semester/semester.service";
import { GradeService } from "../../../@core/services/grade/grade.service";

@Component({
  selector: "ngx-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent {
  semesters$: Observable<Semester[]> = null;
  selectedSemester = "FA23";
  rollNumber: string;
  gradesBySemester$: Observable<any>;
  ticketGradesBySemester$: Observable<any>;
  participantsGradesBySemester$: Observable<any>;
  taskGradesBySemester$: Observable<any>;
  ticketGradesBySemester: any;
  participantsGradesBySemester: any;
  taskGradesBySemester: any;
  user$: Observable<any>;

  constructor(
    private router: Router,
    private userService: UserService,
    private semesterService: SemesterService,
    private gradeService: GradeService,
    private route: ActivatedRoute
  ) {
    console.log(this.router.url);
  }
  user: UserSummary;
  jwt: Jwt;
  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => {
        return this.userService.findUserByRollnumber(params.get("id"));
      })
    );
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

    this.gradesBySemester$ = combineLatest([
      this.route.paramMap,
      this.semesters$,
    ]).pipe(
      switchMap(([params, semesters]) => {
        this.rollNumber = params.get("id");
        return this.gradeService.getGradeBySemesterAndRollnumber(
          this.selectedSemester ?? semesters[0].name,
          params.get("id")
        );
      })
    );
    this.gradesBySemester$.subscribe((data) => {
      this.ticketGradesBySemester = data.filter((d) => d.type === 0);
      this.participantsGradesBySemester = data.filter((d) => d.type === 1);
      this.taskGradesBySemester = data.filter((d) => d.type === 2);
    });
    this.ticketGradesBySemester$ = this.gradesBySemester$.pipe(
      map((grades) => grades.filter((grade) => grade.type === 0))
    );
    this.participantsGradesBySemester$ = this.gradesBySemester$.pipe(
      map((grades) => grades.filter((grade) => grade.type === 1))
    );
    this.taskGradesBySemester$ = this.gradesBySemester$.pipe(
      map((grades) => grades.filter((grade) => grade.type === 2))
    );
  }

  fetchData() {}
  selectSemester(semester) {
    this.selectedSemester = semester.tabTitle;
    this.gradeService
      .getGradeBySemesterAndRollnumber(this.selectedSemester, this.rollNumber)
      .subscribe((data: any) => {
        this.ticketGradesBySemester = data.filter((d) => d.type === 0);
        this.participantsGradesBySemester = data.filter((d) => d.type === 1);
        this.taskGradesBySemester = data.filter((d) => d.type === 2);
      });
    console.log(this.participantsGradesBySemester);
  }
}
