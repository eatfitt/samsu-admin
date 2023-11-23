import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CreateEventRequest, Event, EventService } from '../../../../@core/services/event/event.service';
import { NbDialogService } from '@nebular/theme';
import { isImageFile } from '../../../../@core/utils/data-util';

@Component({
  selector: 'ngx-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @ViewChild("eventBannerDialog", { static: true }) eventBannerDialog: TemplateRef<any>;;
  @Input() event: Event | CreateEventRequest = null;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  
  // CHECK FIELD IS EDITING
  isEditContent = false;

  constructor(
    private dialogService: NbDialogService,
    private eventService: EventService,
  ) {}

  editEvent(property: string) {
    // this.eventService.updateEvent({
    //   ...this.event,
    //   content: this.event.content,
    // }, this.event.id)
  }

  isImageFile(fileUrl: string) {
    return isImageFile(fileUrl);
  }
  openDialog(dialog, data?) {
    this.dialogService.open(dialog,
      { context: data });
  }
}
