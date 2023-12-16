import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastRef, NbToastrService } from '@nebular/theme';
import { isString } from 'lodash';
import { catchError, throwError } from 'rxjs';
import { EventProposal, EventProposalService, EventProposalStatus } from '../../../../../services/event-propsal.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../app-state/user';
import { UserService } from '../../../../@core/services/user/user.service';

interface Feedback {
  content: string;
  time: number;
  isResolved: boolean;
}
@Component({
  selector: 'ngx-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.scss']
})
export class ViewProposalComponent implements OnInit {
  eventProposal: EventProposal;
  dialogRef: NbDialogRef<any>;
  editorContent: string;
  selectedStatus = EventProposalStatus.REVIEWED.toString();
  statusOptions: string[];
  mockFeedback = '1699927012002|Myfeedback$$$1699927012099|My content$$$1700502118009|My feedbacks ahhsdasj';
  constructor(private toastrService: NbToastrService, private router: Router, private eventProposalService: EventProposalService, private activatedRoute: ActivatedRoute, private dialogService: NbDialogService,
    private store: Store<{ user: UserState }>,
    private userService: UserService,
    ) { }

  // CHECK ROLE
  isAdmin = false;

  ngOnInit(): void {
    this.userService.checkLoggedIn();
    this.store.select(state => state.user.userSummary).subscribe(userSummary => {
      this.isAdmin = (userSummary.role === 'ROLE_ADMIN');
    });
    this.statusOptions = [
      EventProposalStatus.REVIEWED,
      EventProposalStatus.APPROVED,
      EventProposalStatus.REJECTED
    ].map(status => status.toString()); // Map enum values to strings

    // Set a default selectedStatus (you can choose another status from statusOptions)
    this.selectedStatus = EventProposalStatus.REVIEWED.toString();
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.eventProposalService.getEventProposalById(id).subscribe(
          proposal => {
            this.eventProposal = proposal;

          },
          error => {
            console.error('Error fetching event proposal:', error);
            // Handle error as needed
          }
        );
      }
    });

  }

  getFileIcon(extension: string): string {
    // Map file extensions to appropriate icons
    const iconMappings: { [key: string]: string } = {
      png: 'image-outline',
      jpg: 'image-outline',
      jpeg: 'image-outline',
      pdf: 'file-pdf-outline',
      // Add more mappings as needed
    };

    // Use a default icon if no mapping is found
    return iconMappings[extension] || 'file-outline';
  }

  getFileUrls(fileUrls: string): { url: string; name: string; extension: string }[] {
    if (!fileUrls) {
      return [];
    }

    return fileUrls.split('$$$').map((url) => {
      const parts = url.split('.');
      const extension = parts[parts.length - 1];
      const nameStartIndex = url.lastIndexOf('/') + 1;
      const nameEndIndex = url.lastIndexOf('.') - 1;
      let name = url.substring(nameStartIndex, nameEndIndex);

      // Limit the name to a maximum of 20 characters
      name = name.length > 20 ? name.substring(0, 20) + '...' : name;

      return { url, name, extension };
    });
  }

  getFeedbackContent(feedback: string): Feedback[] {
    return feedback.split('$$$').map((entry) => {
      const [time, content] = entry.split('|');

      return {
        content,
        time: Number(time),
        isResolved: Number(time) < (Number(this.eventProposal?.modifyAt)),
      };
    });
  }

  openFeedbackModal(modal: any) {
    // Open the modal using NbDialogService
    this.dialogRef = this.dialogService.open(modal, {
      context: {
        statusOptions: [EventProposalStatus.REVIEWED, EventProposalStatus.APPROVED, EventProposalStatus.REJECTED], // Add other status options as needed
      },
    });
  }

  submitFeedback() {
    if (this.editorContent?.trim() !== '' && isString(this.editorContent)) {
      const currentTimeUnix = Math.floor(new Date().getTime()); // Current time in Unix format
      let newFeedback = `${currentTimeUnix}|${this.editorContent}`;
      const toastRef: NbToastRef = this.toastrService.show('Submitting event proposal feedback...', 'Loading', {
        duration: 0,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: 'info',
      });

      if (isString(this.eventProposal.feedback)) {
        newFeedback = `${this.eventProposal.feedback}$$$${newFeedback}`;
      }

      this.eventProposalService.putEventProposalAdmin(this.eventProposal.id.toString(), {
        status: this.selectedStatus,
        feedback: `${newFeedback}`

      }).pipe(catchError(error => {
        // Handle error and show toastr
        toastRef.close();
        this.toastrService.show('Failed to update event proposal', 'Error', {
          duration: 3000,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          status: 'danger',
        });

        return throwError(error);
      })).subscribe((createdProposal: EventProposal) => {
        // Hide loading indicator on success
        toastRef.close();

        // Show success toastr
        this.toastrService.show('Event proposal update successfully!', 'Success', {
          duration: 5000,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          status: 'success',
        });
        this.editorContent = '';
        this.eventProposalService.getEventProposalById(this.eventProposal.id.toString()).subscribe(
          proposal => {
            this.eventProposal = proposal;

          },
          error => {
            console.error('Error fetching event proposal:', error);
            // Handle error as needed
          }
        );
        // Reset the form or navigate to another page as needed
      });
    } else {
      this.toastrService.show('Content of feedback should not be empty', 'Error', {
        duration: 2000,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: 'danger',
      });
    }

    // Close the dialog
    this.dialogRef.close();
  }

  handleOnClick() {
    this.router.navigate(['/pages/event-proposal/edit', this.eventProposal.id]);
  }

  isEditable(): boolean {
    return this.eventProposal.status === EventProposalStatus.PROCESSING || this.eventProposal.status === EventProposalStatus.REVIEWED;
  }
  // Close the dialog
  close() {
    this.dialogRef.close();
  }
  goBack() {
    // Navigate back to the previous page
    this.router.navigate(['/pages/my-event-proposal']);
  }
}
