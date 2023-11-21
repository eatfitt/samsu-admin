import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../app-state/user';
import { UserService } from '../../../../@core/services/user/user.service';
import { Event, EventService } from '../../../../@core/services/event/event.service';

@Component({
  selector: 'ngx-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.scss']
})
export class SingleEventComponent {
  id: number;
  event: Event = null;
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
    this.fetchData();
  }

  fetchData() {
    this.userService.checkLoggedIn();
    this.eventService.getEvent(this.id)
      .subscribe((data: Event) => this.event = data);
  }
}
