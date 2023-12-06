import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GradeTicketCodeService } from '../../../../@core/services/grade-ticket-code/grade-ticket-code.service';

@Component({
  selector: 'ngx-guarantor-verify',
  templateUrl: './guarantor-verify.component.html',
  styleUrls: ['./guarantor-verify.component.scss']
})
export class GuarantorVerifyComponent {

  ticketInfo = null;
  code = '';
  constructor(private router: Router, private gradeTicketCodeService: GradeTicketCodeService) { }
  ngOnInit() {
    let url = this.router.url;  // e.g. "/guarantorVerify/something/something"
    let param = url.split('/').slice(2).join('/');  // "something/something"
    // Now you can use the code
    this.code = param.replace(/%2BB/gi, '+');
    this.gradeTicketCodeService.getGradeTicketInfoForGuarantorVerify(this.code)
      .subscribe(data => this.ticketInfo = data);
  }
  updateTicketStatus(status: number) {
    this.gradeTicketCodeService.postGradeTicketInfoForGuarantorVerify(status, this.code).subscribe();
  }
}
