import { Component, TemplateRef, ViewChild } from "@angular/core";
import { GradeTicket, GradeTicketService, UpdateGradeTicketRequest } from '../../../@core/services/grade-ticket/grade-ticket.service';
import { Subscription } from 'rxjs';
import { NbDialogRef, NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { isImageFile } from "../../../@core/utils/data-util";
import { GradeSubCriteria, GradeSubCriteriaService } from "../../../@core/services/grade-sub-criteria/grade-sub-criteria.service";

@Component({
  selector: 'ngx-invoke-point',
  templateUrl: './invoke-point.component.html',
  styleUrls: ['./invoke-point.component.scss']
})
export class InvokePointComponent {

  @ViewChild("viewSingleTicketTemplate", { static: true }) viewSingleTicketTemplate: TemplateRef<any>;
  @ViewChild("eventBannerDialog", { static: true }) eventBannerDialog: TemplateRef<any>;
  
  gradeTickets: GradeTicket[] = [];
  filteredGradeTickets: GradeTicket[] = [];
  gradeSubCriterias: GradeSubCriteria[] = [];
  menu = [{ title: "View ticket" }];
  menuSubscription: Subscription;
  private contentTemplateRef: NbDialogRef<InvokePointComponent>;
  statusToFilter = -1; 

  // Approve - Reject ticket
  selectedGradeTicket: GradeTicket = null;
  feedbackForSelectedGradeTicket = ''
  statusForSelectedGradeTicket = 0;
  gradeSubCriteriaIdForSelectedGradeTicket = 0;
  scoreForSelectedGradeTicket = 0;


  pageSize: number = 6; // Number of items per page
  currentPage: number = 1; // Current page number
  totalItems: number = 0; // Total number of items

  constructor(
    private gradeTicketService: GradeTicketService,
    private subCrit: GradeSubCriteriaService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
  ) {}

  ngOnInit() {
    this.fetchData();
    this.menuSubscription = this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === "View ticket") {
        this.openDialog(this.viewSingleTicketTemplate);
      }
    });
  }

  fetchData() {
    this.gradeTicketService.getAllGradeTickets()
      .subscribe(
        (data: any) => {
          this.gradeTickets = data.content;
          this.pageSize = data.size;
          this.currentPage = data.page; 
          this.totalItems = data.totalElements;
        }
      );
    this.subCrit.getAllGradeSubCriterias()
      .subscribe((data: any) => this.gradeSubCriterias = data.content);
  }

  getStatusText(no: number) {
    switch (no) {
      case 0:
        return 'Processing';
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
    }
  }
  getStatusColor(no: number): string {
    switch (no) {
      case 0:
        return 'basic'; // Set your color for PROCESSING status
      case 1:
        return 'success';
      case 2:
        return 'danger';
    }
  }
  openDialog(dialog, data?) {
    this.contentTemplateRef = this.dialogService.open(dialog,
      { context: data });
  }

  isImageFile(fileUrl: string) {
    return isImageFile(fileUrl);
  }

  resolveTicket() {
    const payload: UpdateGradeTicketRequest = {
      status: this.statusForSelectedGradeTicket,
      score: this.scoreForSelectedGradeTicket,
      feedback: this.feedbackForSelectedGradeTicket,
      gradeSubCriteriaId: this.gradeSubCriteriaIdForSelectedGradeTicket,
    }
    this.gradeTicketService.updateGradeTicket(this.selectedGradeTicket.id, payload)
      .subscribe(
        (success: any) => {
          this.toastrService.show("Resolve successfully", "Success", {
            status: "success",
          });
          this.resetResolveFields();
          this.contentTemplateRef.close();
          this.fetchData();
        },
        failed => {
          this.toastrService.show("An error has occured", "Failed", {
            status: "danger",
          });
        }
      )
  }

  selectSubCriteriaId(event: GradeSubCriteria) {
    this.gradeSubCriteriaIdForSelectedGradeTicket = event.id;
  }

  resetResolveFields() {
    this.selectedGradeTicket = null;
    this.feedbackForSelectedGradeTicket = ''
    this.statusForSelectedGradeTicket = 0;
    this.gradeSubCriteriaIdForSelectedGradeTicket = 0;
    this.scoreForSelectedGradeTicket = 0;
  }

  filterByStatus(arr: GradeTicket[]): GradeTicket[] {
    if (this.statusToFilter === -1) return arr;
    return arr.filter(ticket => ticket.status === this.statusToFilter);
  }
}
