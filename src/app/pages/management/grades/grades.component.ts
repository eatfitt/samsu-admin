import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbIconLibraries, NbMenuService, NbToastrService } from '@nebular/theme';
import { UserService } from '../../../@core/services/user/user.service';
import { PolicyDocument, PolicyDocumentService } from '../../../@core/services/policy-document/policy-document.service';
import { GradeCriteria, GradeCriteriaService } from '../../../@core/services/grade-criateria/grade-criteria.service';
import { GradeSubCriteria, GradeSubCriteriaService } from '../../../@core/services/grade-sub-criteria/grade-sub-criteria.service';
import { Subscription, combineLatest, map } from 'rxjs';
import { FileUploadService } from '../../../../services/file-upload.service';

@Component({
  selector: 'ngx-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent {
  @ViewChild("addPolicyDialog", { static: true })
  addPolicyDialog: TemplateRef<any>;
  @ViewChild("addGradeCriteriaDialog", { static: true })
  addGradeCriteriaDialog: TemplateRef<any>;
  @ViewChild("addSubGradeCriteriaDialog", { static: true })
  addSubGradeCriteriaDialog: TemplateRef<any>;

  private contentTemplateRef: NbDialogRef<GradesComponent>;
  policyDocuments: PolicyDocument[] = [];
  gradeCriterias: GradeCriteria[] = [];
  filteredGradeCriterias = [];
  gradeSubCriterias: GradeSubCriteria[] = [];
  filteredGradeSubCriterias: GradeSubCriteria[] = [];
  combinedGradeCriterias = [];
  gradeMenuItems = [{ title: "Add Grade Criteria" }, { title: "Add Sub Grade Criteria" }, { title: "Add Policy Document" }];
  menu: Subscription;

  // Grade criteria
  gradeCriteriaContent = '';
  policyDocumentId: number;
  defaultScore: number;
  gradeCriteriaMaxScore: number;

  // Sub Grade criteria
  subGradeCriteriaContent = '';
  gradeCriteriaId: number;
  minScore: number;
  maxScore: number;

  // Policy document
  policyName: string;
  file: File;
  fileUrls: string;


  constructor(
    iconsLibrary: NbIconLibraries,
    private dialogService: NbDialogService,
    private userService: UserService,
    private policyService: PolicyDocumentService,
    private gradeCritService: GradeCriteriaService,
    private gradeSubCritService: GradeSubCriteriaService,
    private menuService: NbMenuService,
    private uploadService: FileUploadService,
    private toastrService: NbToastrService,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.menu = this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === "Add Grade Criteria") {
        this.openDialog(this.addGradeCriteriaDialog);
      } else if (event.item.title === "Add Sub Grade Criteria") {
        this.openDialog(this.addSubGradeCriteriaDialog);
      } else if (event.item.title === "Add Policy Document") {
        this.openDialog(this.addPolicyDialog);
      }      
    })
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    // this.policyService.getAllPolicyDocuments()
    //   .subscribe((data: any) => this.policyDocuments = data.content);
    // this.gradeCritService.getAllGradeCriterias()
    //   .subscribe((data: any) => this.gradeCriterias = this.filteredGradeCriterias = data.content);
    // this.gradeSubCritService.getAllGradeSubCriterias()
    //   .subscribe((data: any) => this.gradeSubCriterias = this.filteredGradeSubCriterias = data.content);

    combineLatest([
      this.policyService.getAllPolicyDocuments(),
      this.gradeCritService.getAllGradeCriterias(),
      this.gradeSubCritService.getAllGradeSubCriterias()
    ]).pipe(
      map(([policy, gradeCrit, gradeSubCrit]: [any, any, any]) => {
        this.policyDocuments = policy.content;
        this.gradeCriterias = gradeCrit.content;
        this.gradeSubCriterias = this.filteredGradeSubCriterias = gradeSubCrit.content;
        this.combinedGradeCriterias = this.filteredGradeCriterias = gradeCrit.content.map(gradeCriteria => {
          return {
            gradeCriteria: gradeCriteria,
            gradeSubCriterias: gradeSubCrit.content.filter(sub => sub.gradeCriteriaId === gradeCriteria.id),
            policyDocument: policy.content.find(pol => pol.id === gradeCriteria.policyDocumentId),
          }
        })
      })
    ).subscribe();
  }

  filterGradeCriteria(event) {
    this.filteredGradeCriterias = this.combinedGradeCriterias.filter(item => item.gradeCriteria.content.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  filterGradeSubCriteria(event) {
    this.filteredGradeSubCriterias = this.gradeSubCriterias.filter(item => item.content.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  setPolicyDocuments(event: PolicyDocument) {
    this.policyDocumentId = event.id;
  }

  createGradeCriteria() {

  }

  onFileChange(data) {
    this.file = data.target.files[0];
  }

  createPolicy() {
    this.uploadService.uploadFile(this.file).subscribe(
      (url) => {
        console.log("File uploaded successfully. URL:", url);
        this.fileUrls = url;
        this.policyService.createPolicyDocument({
          name: this.policyName,
          fileUrls: this.fileUrls
        }).subscribe(
          (success) => {
            this.toastrService.show("Policy document created successfully", "Success", {
              status: "success",
            });
            this.contentTemplateRef.close();
          },
          (error) => {
            this.toastrService.show("Try again", "Failed", { status: "danger" });
          }
        )
      },
      (error) => {
        console.error("File upload failed:", error);
      }
    );
  }
}
