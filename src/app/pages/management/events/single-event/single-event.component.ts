import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../app-state/user';
import { UserService } from '../../../../@core/services/user/user.service';
import { Event, EventParticipant, EventService } from '../../../../@core/services/event/event.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.scss']
})
export class SingleEventComponent {
  id: number;
  event: Event = null;
  participants: EventParticipant[] = [];
  mySubscription: Subscription;

  constructor(
    private router: Router,
    protected userService: UserService,
    private eventService: EventService,
    protected store: Store<{ user: UserState }>,
    private route: ActivatedRoute) {
    console.log(this.router);
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // 10s gọi 1 lần

    this.mySubscription = interval(10000).subscribe((x =>{
      this.fetchData();
    }));
    this.fetchData();
  }

  fetchData() {
    this.userService.checkLoggedIn();
    this.eventService.getEvent(this.id)
      .subscribe((data: Event) => this.event = data);
    this.eventService.getEventParticipants(this.id)
      .subscribe((data: any) => this.participants = data);
  }
}
