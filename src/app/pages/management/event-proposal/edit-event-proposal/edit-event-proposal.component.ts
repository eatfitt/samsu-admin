import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastRef, NbToastrService } from '@nebular/theme';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { EventProposal, EventProposalService, EventProposalStatus } from '../../../../../services/event-propsal.service';
import { FILE_URL_SEPARATOR, FileUploadService } from '../../../../../services/file-upload.service';

@Component({
  selector: 'ngx-edit-event-proposal',
  templateUrl: './edit-event-proposal.component.html',
  styleUrls: ['./edit-event-proposal.component.scss']
})
export class EditEventProposalComponent implements OnInit {
  selectedFileNames: string = 'Choose files';
  editorContent: string;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  eventProposal: EventProposal;
  eventProposalId: string;
  selectedFiles: File[] = [];
  title: string;
  constructor(private uploadService: FileUploadService, private eventProposalService: EventProposalService, private toastrService: NbToastrService, private activatedRoute: ActivatedRoute, private router: Router
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.eventProposalId = id;
      if (id) {
        this.eventProposalService.getEventProposalById(id).subscribe(
          proposal => {
            this.eventProposal = proposal;
            console.log(proposal);
            this.title = proposal.title;
            this.editorContent = proposal.content;
            // You can now use this.eventProposal in your template or perform other actions.
          },
          error => {
            console.error('Error fetching event proposal:', error);
            // Handle error as needed
          }
        );
      }
    });
  }
  onFileChange(event: any) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      // Add selected files to the array
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files as File[])];
      this.updateFileInputLabel();
    }
  }

  removeFile(index: number) {
    // Remove a file from the array
    this.selectedFiles.splice(index, 1);
    this.updateFileInputLabel();
  }

  getSelectedFileNames(): string {
    return this.selectedFiles.length > 0 ? this.selectedFiles.map(file => file.name).join(', ') : 'Choose files';
  }

  resetForm() {
    // Reset form fields and selected files
    this.title = '';
    this.editorContent = '';
    this.selectedFiles = [];
  }

  submitEventProposal() {
    // Show loading indicator
    const toastRef: NbToastRef = this.toastrService.show('Submitting event proposal...', 'Loading', {
      duration: 0,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      status: 'info',
    });

    // Upload files first and then submit the event proposal
    this.uploadFiles().pipe(
      switchMap(fileUrls => {
        // Build the proposal body
        const files = fileUrls.join(FILE_URL_SEPARATOR);
        const proposalBody = {
          title: this.title,
          content: this.editorContent,
          fileUrls: files,
          status: EventProposalStatus.PROCESSING
        };

        // Submit the event proposal
        return this.eventProposalService.putEventProposalManager(this.eventProposalId, proposalBody);
      }),
      catchError(error => {
        // Handle error and show toastr
        toastRef.close();
        this.toastrService.show('Failed to update event proposal', 'Error', {
          duration: 3000,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          status: 'danger',
        });

        return throwError(error);
      }),
    ).subscribe((createdProposal: EventProposal) => {
      // Hide loading indicator on success
      toastRef.close();

      // Show success toastr
      this.toastrService.show('Event proposal update successfully!', 'Success', {
        duration: 5000,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: 'success',
      });
      this.router.navigate(['/pages/event-proposal/view', createdProposal.id]);

      // Reset the form or navigate to another page as needed
      this.resetForm();

    });
  }

  updateFileInputLabel() {
    // Update the label text with the names of the selected files
    const label = document.querySelector('.custom-file-label');
    if (label) {
      label.textContent = this.getSelectedFileNames();
    }
  }
  goBack() {
    // Navigate back to the previous page
    this.router.navigate(['/pages/event-proposal/view', this.eventProposalId]);
  }
  uploadFiles(): Observable<string[]> {
    // Use the FileUploadService to upload files
    // Assuming the FileUploadService returns an observable with the file URLs
    return this.uploadService.uploadFiles(this.selectedFiles);
  }
}
