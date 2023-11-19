import { Component } from '@angular/core';
import { NbDialogRef, NbDialogService, NbIconLibraries } from '@nebular/theme';
import { UserService } from '../../../@core/services/user/user.service';
import { PolicyDocument, PolicyDocumentService } from '../../../@core/services/policy-document/policy-document.service';
import { GradeCriteria, GradeCriteriaService } from '../../../@core/services/grade-criateria/grade-criteria.service';
import { GradeSubCriteria, GradeSubCriteriaService } from '../../../@core/services/grade-sub-criteria/grade-sub-criteria.service';

@Component({
  selector: 'ngx-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent {

  private contentTemplateRef: NbDialogRef<GradesComponent>;
  policyDocuments: PolicyDocument[] = [];
  gradeCriterias: GradeCriteria[] = [];
  filteredGradeCriterias: GradeCriteria[] = [];
  gradeSubCriterias: GradeSubCriteria[] = [];
  filteredGradeSubCriterias: GradeSubCriteria[] = [];
  selectedPolicyDocument: PolicyDocument = null;

  constructor(
    iconsLibrary: NbIconLibraries,
    private dialogService: NbDialogService,
    private userService: UserService,
    private policyService: PolicyDocumentService,
    private gradeCritService: GradeCriteriaService,
    private gradeSubCritService: GradeSubCriteriaService,
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
    this.gradeCritService.getAllGradeCriterias()
      .subscribe((data: any) => this.gradeCriterias = this.filteredGradeCriterias = data.content);
    this.gradeSubCritService.getAllGradeSubCriterias()
      .subscribe((data: any) => this.gradeSubCriterias = this.filteredGradeSubCriterias = data.content);
  }

  filterGradeCriteria(event) {
    console.log(event.target.value);
    this.filteredGradeCriterias = this.gradeCriterias.filter(item => item.content.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  filterGradeSubCriteria(event) {
    console.log(event.target.value);
    this.filteredGradeSubCriterias = this.gradeSubCriterias.filter(item => item.content.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }
}
