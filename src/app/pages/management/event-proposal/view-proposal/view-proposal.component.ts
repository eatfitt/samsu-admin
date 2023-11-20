import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventProposal, EventProposalService, EventProposalStatus } from '../../../../../services/event-propsal.service';

@Component({
  selector: 'ngx-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.scss']
})
export class ViewProposalComponent implements OnInit {
  eventProposal: EventProposal;

  constructor(private router: Router, private eventProposalService: EventProposalService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.eventProposalService.getEventProposalById(id).subscribe(
          proposal => {
            this.eventProposal = proposal;
            console.log(proposal)
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
  handleOnClick() {
    this.router.navigate(['/pages/event-proposal/edit', this.eventProposal.id]);
  }

  isEditable(): boolean {
    return this.eventProposal.status === EventProposalStatus.PROCESSING || this.eventProposal.status === EventProposalStatus.REVIEWED;
  }

  goBack() {
    // Navigate back to the previous page
    this.router.navigate(['/pages/my-event-proposal']);
  }
}
