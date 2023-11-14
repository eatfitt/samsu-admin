import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { UserService } from '../../../../@core/mock/users.service';
import { Event } from '../../../../@core/services/event/event.service';
import { getRandomDate } from '../../../../@core/utils/mock-data';
import { UserState } from '../../../../app-state/user';

@Component({
  selector: 'ngx-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AllEventsComponent {
  selectedStatisticTime = 'week';
  constructor(
    private userService: UserService,
    private store: Store<{ user: UserState }>,
    private router: Router,
    iconsLibrary: NbIconLibraries
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  navigateTo(url: string) {
    console.log(this.router.url)
    this.router.navigate(['pages', 'events', 'add']);
  }


  mockEvents: Event[] = [
    {
      semestersName: 'SUMMER2023',
      title: 'Capstone Review 2',
      status: 'Draft',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '2',
      attendances: 1
    },
    {
      semestersName: 'FALL2023',
      title: 'Taylor Swift Red Tour',
      status: 'Done',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1',
      attendances: 300
    },
    {
      semestersName: 'SUMMER2023',
      title: 'Entrepeuneurship Seminar',
      status: 'Happening',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1.5',
      attendances: 27
    },
    {
      semestersName: 'SPRING2023',
      title: 'Capstone Review 3',
      status: 'Draft',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '2',
      attendances: 160
    },
    {
      semestersName: 'FALL2023',
      title: 'Hackathon',
      status: 'Done',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1',
      attendances: 75
    },
    {
      semestersName: 'SPRING2023',
      title: 'Ho Sen Cho Ai',
      status: 'Happening',
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1.5',
      attendances: 60
    },
  ]
} 
