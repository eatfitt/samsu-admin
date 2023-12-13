import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GradeTicketCodeService } from '../../../../@core/services/grade-ticket-code/grade-ticket-code.service';
import { isImageFile } from '../../../../@core/utils/data-util';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-guarantor-verify',
  templateUrl: './guarantor-verify.component.html',
  styleUrls: ['./guarantor-verify.component.scss']
})
export class GuarantorVerifyComponent {

  ticketInfo = null;
  code = '';
  alreadyApproved = false;
  alreadyRejected = false;
  apiCalledSuccess: boolean;
  private contentTemplateRef: NbDialogRef<GuarantorVerifyComponent>;
  constructor(private router: Router, private gradeTicketCodeService: GradeTicketCodeService, private dialogService: NbDialogService,) { }
  ngOnInit() {
    let url = this.router.url;  // e.g. "/guarantorVerify/something/something"
    let param = url.split('/').slice(2).join('/');  // "something/something"
    // Now you can use the code
    this.code = param.replace(/%2B/gi, '+');
    this.gradeTicketCodeService.getGradeTicketInfoForGuarantorVerify(this.code)
      .subscribe((data: any) => {
        this.ticketInfo = data
        if (data.status === 1 || data.status === 3) this.alreadyApproved = true;
        if (data.status === 2 || data.status === 4) this.alreadyRejected = true;
      });
  }
  updateTicketStatus(status: number) {
    this.gradeTicketCodeService.postGradeTicketInfoForGuarantorVerify(status, this.code).subscribe(
      (success) => [
        this.apiCalledSuccess = true
      ]
    );
  }

  isImageFile(fileUrl: string) {
    return isImageFile(fileUrl);
  }

  openDialog(dialog, data?) {
    this.contentTemplateRef = this.dialogService.open(dialog,
      { context: data });
  }
}
