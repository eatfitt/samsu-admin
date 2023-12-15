import { Component } from '@angular/core';
import { UserService } from '../../@core/services/user/user.service';
import { SemesterService } from '../../@core/services/semester/semester.service';
import { map } from 'rxjs';
import { AppState } from '../../app-state/app-state';
import { Store } from '@ngrx/store';
import { setSemesters } from '../../app-state/semester';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class ECommerceComponent {
  pager = {
    display: true,
    perPage: 3
  }
  date = new Date();

  constructor(
    private userService: UserService,
    private semesterService: SemesterService,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.semesterService.getAllSemesters().pipe(
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
    ).subscribe(data => {
      console.log(data)
      this.store.dispatch(setSemesters({semesters: data}));
    });
  }

  handleDateChange(event) {
    console.log(event)
  }

  selectedDateEvents = [
    {
      title: 'Capstone Review 2',
      time: '8:30AM'
    },
    {
      title: 'E-Club Meetup',
      time: '2:30PM'
    },
  ];
  upcomingEvents = [
    {
      title: 'E-Club Meetup',
      time: 'Nov 04 6:00PM'
    },
    {
      title: 'EXE Seminar 1',
      time: 'Nov 13 10:20AM'
    },
    {
      title: 'EXE Seminar 2',
      time: 'Nov 20 2:30PM'
    },
  ];
}
