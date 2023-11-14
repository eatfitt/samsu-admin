import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventProposal, EventProposalService } from '../../../../../services/event-propsal.service';

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

  goBack() {
    // Navigate back to the previous page
    this.router.navigate(['/pages/my-event-proposal']);
  }
}
