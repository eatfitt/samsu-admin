import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Group } from '../../../../@core/services/group/group.service';
import { isObject } from 'rxjs/internal-compatibility';

@Component({
  selector: 'ngx-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent {
  @Input() group: Group;
  memberCount = 0;
  ngOnChanges(changes: SimpleChanges): void {
    const {group} = changes;
    if (isObject(group)) {
      this.memberCount = this.group.users.length;
    }

  }

}
