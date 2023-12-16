import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Notification, NotificationService, SendNotificationRequest } from '../../../../@core/services/notification/notification.service';
import { NbToastrService } from '@nebular/theme';
import { convertMilliToDate } from '../../../../@core/utils/data-util';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-notification-configuration',
  templateUrl: './notification-configuration.component.html',
  styleUrls: ['./notification-configuration.component.scss'],
})
export class NotificationConfigurationComponent {
  @Input() notificationId: number = null;
  @Input() rollnumbers: string[];
  @Input() eventTitle = '';
  @Input() rescheduleDate: Date = null;
  @Output() send = new EventEmitter<void>();
  notification: Notification = null;
  isSendNotification = true;
  isSendEmail = true;
  constructor(
    private notiService: NotificationService,
    public toastrService: NbToastrService,
    private datePipe: DatePipe,
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    this.fetchData();
  }

  fetchData() {
    this.notiService.getNotification(this.notificationId).subscribe((data: any) => {
      this.notification = {
        ...data,
        title: `${data.title} ${this.eventTitle}`,
        content: this.notificationId === 117 ?  `${data.content}` : `${data.content}${this.datePipe.transform( convertMilliToDate(this.rescheduleDate), ' EEE, dd MMMM yyyy')}`,
      }
    })
  }

  sendNotification() {
    this.send.emit();
    const payload: SendNotificationRequest = {
      title: this.notification.title,
      content: this.notification.content,
      image: '',
      isSendEmail: this.isSendEmail,
      isSendNotification: this.isSendNotification,
      rollnumbers: this.rollnumbers,
    }
    this.notiService.sendNotification(payload).subscribe(
      (data: any) => this.toastrService.show("Send notification successfully", "Success", {
        status: "success",
      }),
      (failed: any) => this.toastrService.show(failed, "Failed", {
        status: "danger",
      })
    )
  }

}
