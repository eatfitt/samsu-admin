import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Notification, NotificationService } from '../../../@core/services/notification/notification.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  @ViewChild("editNotificationTemplate", { static: true }) editNotificationTemplate: TemplateRef<any>;
  cancelEventNotification: Notification = null;
  checkInEventNotification: Notification = null;
  processingEventNotification: Notification = null;
  checkoutEventNotification: Notification = null;
  completeEventNotification: Notification = null;
  
  rescheduleEventNotification: Notification = null;
  private contentTemplateRef: NbDialogRef<NotificationsComponent>;

  constructor(
    private notiService: NotificationService,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
  ) {}
  
  ngOnInit() {
    this.fetchData();
  }

  // NOTE:
  // PROCESS
  // cancel - 117
  // check in - 125
  // processing - 126
  // check out - 127
  // complete - 128

  fetchData() {
    this.notiService.getCancelEventTemplate().subscribe((data: any) => this.cancelEventNotification = data);
    this.notiService.getNotification(125).subscribe((data: any) => this.checkInEventNotification = data);
    this.notiService.getNotification(126).subscribe((data: any) => this.processingEventNotification = data);
    this.notiService.getNotification(127).subscribe((data: any) => this.checkoutEventNotification = data);
    this.notiService.getNotification(128).subscribe((data: any) => this.completeEventNotification = data);


    this.notiService.getNotification(120).subscribe((data: any) => this.rescheduleEventNotification = data);
  }

  openDialog(dialog, data?) {
    console.log(data)
    this.contentTemplateRef = this.dialogService.open(dialog,
      { context: data });
  }

  editNotification(notification: Notification) {
    this.notiService.editNotification(notification.id, notification).subscribe(
      (url) => {
        this.toastrService.show("Notification Template edited successfully", "Success", {
          status: "success",
        });
        this.fetchData();
        this.contentTemplateRef.close();
      },
      (error) => {
        this.toastrService.show(error, "Failed", {
          status: "danger",
        });
      }
    )
  }

}
