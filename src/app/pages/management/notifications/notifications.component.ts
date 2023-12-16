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

  fetchData() {
    this.notiService.getCancelEventTemplate().subscribe((data: any) => this.cancelEventNotification = data);
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
