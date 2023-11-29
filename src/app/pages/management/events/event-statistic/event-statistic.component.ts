import { Component, Input, SimpleChanges } from '@angular/core';
import { Event, EventParticipant } from '../../../../@core/services/event/event.service';
import _ from 'lodash';
import { UserService } from '../../../../@core/services/user/user.service';

@Component({
  selector: 'ngx-event-statistic',
  templateUrl: './event-statistic.component.html',
  styleUrls: ['./event-statistic.component.scss']
})
export class EventStatisticComponent {
  @Input() event: Event = null;
  @Input() participants: EventParticipant[] = [];

  progressInfoData = []

  studentCount: number;
  attendanceCount: number;
  checkInCount: number;
  checkOutCount: number;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getAllUsers()
      .subscribe((data: any) => {
        this.studentCount = data.totalElements
        this.calculateStat();
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    const { event, participants } = changes;
    if (_.isObject(event) || _.isObject(participants)) {
      this.attendanceCount = this.participants.length;
      this.checkInCount = this.participants
        .filter(participant => participant.checkin !== null)
        .length;
      this.checkOutCount = this.participants
        .filter(participant => participant.checkout !== null)
        .length;
      this.calculateStat;
    }
  }

  calculateStat() {
    this.progressInfoData = [
      {
        title: 'Attendance',
        value: this.attendanceCount,
        activeProgress: (this.attendanceCount / this.studentCount) * 100,
        description: `Out of all FPT members (${ (this.attendanceCount / this.studentCount) * 100}%)`,
      },
      {
        title: 'Check in',
        value: this.checkInCount,
        activeProgress:  (this.checkInCount / this.attendanceCount) * 100,
        description: `Out of all attendants (${ (this.checkInCount / this.attendanceCount) * 100}%)`,
      },
      {
        title: 'Check out',
        value: this.checkOutCount,
        activeProgress:  (this.checkOutCount / this.attendanceCount) * 100,
        description: `Out of all attendants (${ (this.checkOutCount / this.attendanceCount) * 100}%)`,
      },
    ]
  }
}
