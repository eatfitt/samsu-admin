import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Event, EventService } from '../../../../@core/services/event/event.service';
import { getRandomDate } from '../../../../@core/utils/mock-data';
import { UserState } from '../../../../app-state/user';
import { UserService } from '../../../../@core/services/user/user.service';
import { isEmpty } from 'lodash' ;
@Component({
  selector: 'ngx-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AllEventsComponent {
  selectedStatisticTime = 'week';
  events: Event[] = [];
  filteredEvents: Event[] = [];
  filterValue = {
    id: '',
    title: '',
    creator: '',
    eventLeader: '',
    status: 0,
    time: null,
    score: 0,
  }
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private store: Store<{ user: UserState }>,
    private router: Router,
    iconsLibrary: NbIconLibraries
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.eventService.getAllEvents()
      .subscribe((data: any) => this.events = this.filteredEvents =data.content);
  }

  navigateTo(url: string) {
    console.log(this.router.url)
    this.router.navigate(['pages', 'events', 'add']);
  }

  filter() {
    let availableProperties = [];
    for (var key in this.filterValue) {
      if (!isEmpty(this.filterValue[key])) {
        availableProperties.push(key);
      } 
    }
    this.filteredEvents = this.events.filter((event) => {
        for (var key of availableProperties) {
          return event[key].toString().toLowerCase().includes(this.filterValue[key].toString().toLowerCase())
        }
      }
    ); 
    if (this.filteredEvents.length <= 0) {
      this.filteredEvents = this.events;
    }
  }


  mockEvents: Event[] = [
    {
      semestersName: 'SUMMER2023',
      title: 'Capstone Review 2',
      status: 1,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '2',
      attendances: 1
    },
    {
      semestersName: 'FALL2023',
      title: 'Taylor Swift Red Tour',
      status: 1,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1',
      attendances: 300
    },
    {
      semestersName: 'SUMMER2023',
      title: 'Entrepeuneurship Seminar',
      status: 2,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1.5',
      attendances: 27
    },
    {
      semestersName: 'SPRING2023',
      title: 'Capstone Review 3',
      status: 2,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '2',
      attendances: 160
    },
    {
      semestersName: 'FALL2023',
      title: 'Hackathon',
      status: 3,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1',
      attendances: 75
    },
    {
      semestersName: 'SPRING2023',
      title: 'Ho Sen Cho Ai',
      status: 1,
      startTime: getRandomDate(),
      bannerUrls: 'https://images.unsplash.com/photo-1683009427513-28e163402d16?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '1.5',
      attendances: 60
    },
  ]
} 
