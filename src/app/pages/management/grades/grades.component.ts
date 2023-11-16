import { Component } from '@angular/core';
import { NbDialogRef, NbDialogService, NbIconLibraries } from '@nebular/theme';
import { UserService } from '../../../@core/services/user/user.service';
import { PolicyDocument, PolicyDocumentService } from '../../../@core/services/policy-document/policy-document.service';

@Component({
  selector: 'ngx-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent {

  private contentTemplateRef: NbDialogRef<GradesComponent>;
  policyDocuments: PolicyDocument[] = [];

  constructor(
    iconsLibrary: NbIconLibraries,
    private dialogService: NbDialogService,
    private userService: UserService,
    private policyService: PolicyDocumentService
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.policyService.getAllPolicyDocuments()
      .subscribe((data: any) => this.policyDocuments = data.content);
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }
}
