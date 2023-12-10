import { Component, Input } from '@angular/core';
import { EventService } from '../../../../@core/services/event/event.service';
import { Post } from '../../../../@core/services/post/post.service';
import { Observable } from 'rxjs';
import { convertMilliToDate } from '../../../../@core/utils/data-util';

@Component({
  selector: 'ngx-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  title = '';
  body = '';
  @Input() eventId: number;
  posts$ = new Observable<Post>();
  constructor(
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.posts$ = this.eventService.getPostsByEventId(this.eventId) as Observable<Post>;
  }

  getStatusPost(status: number) {
    return 'Public'; // Always public for now
  }

  getCreateTime(milli: number) {
    return convertMilliToDate(milli);
  }
}
