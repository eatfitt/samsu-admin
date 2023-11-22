import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Event } from '../../../../@core/services/event/event.service';
import { NbDialogService } from '@nebular/theme';
import { isImageFile } from '../../../../@core/utils/data-util';

@Component({
  selector: 'ngx-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @ViewChild("eventBannerDialog", { static: true }) eventBannerDialog: TemplateRef<any>;;
  @Input() event: Event = null;
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
  ) {}

  editEvent(property: string) {

  }

  isImageFile(fileUrl: string) {
    return isImageFile(fileUrl);
  }
  openDialog(dialog, data?) {
    this.dialogService.open(dialog,
      { context: data });
  }
}
