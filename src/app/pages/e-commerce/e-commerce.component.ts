import { Component } from '@angular/core';
import { UserService } from '../../@core/services/user/user.service';

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
    private userService: UserService
  ) {

  }
  ngOnInit() {
    this.userService.checkLoggedIn();
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
