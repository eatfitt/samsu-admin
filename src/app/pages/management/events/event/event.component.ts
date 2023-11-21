import { Component, Input } from '@angular/core';
import { Event } from '../../../../@core/services/event/event.service';

@Component({
  selector: 'ngx-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event = null;
}
