import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { EventProposal, EventProposalService, EventProposalStatus } from '../../../../services/event-propsal.service';


@Component({
  selector: 'ngx-event-proposal',
  templateUrl: './event-proposal.component.html',
  styleUrls: ['./event-proposal.component.scss']
})
export class EventProposalComponent implements OnInit {
  constructor(iconsLibrary: NbIconLibraries,
    private store: Store, private eventProposalService: EventProposalService, private router: Router,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }
  sortingOptions: { label: string, value: string }[] = [
    { label: 'Title (A-Z)', value: 'titleAsc' },
    { label: 'Title (Z-A)', value: 'titleDesc' },
    { label: 'Modify Date (Oldest first)', value: 'modifyDateAsc' },
    { label: 'Modify Date (Newest first)', value: 'modifyDateDesc' },
    { label: 'Create Date (Oldest first)', value: 'createDateAsc' },
    { label: 'Create Date (Newest first)', value: 'createDateDesc' },
  ];

  pageSize: number = 6; // Number of items per page
  currentPage: number = 1; // Current page number
  totalItems: number = 0; // Total number of items
  paginatedEventProposals: EventProposal[];
  EventProposalStatus = EventProposalStatus;
  myEventProposals$: Observable<EventProposal[]>;
  myEventProposals: EventProposal[];
  filteredEventProposals: EventProposal[];
  searchQuery: string = '';
  selectedSortingOption: string = '';
  selectedStatus: EventProposalStatus = null;
  ngOnInit(): void {
    this.myEventProposals$ = this.eventProposalService.getMyEventProposal().pipe(map(data => (data as any)?.content));
    this.myEventProposals$.subscribe(data => {
      this.myEventProposals = [...data];
      this.applyFilters();
    });
  }

  onSortingChange() {
    this.applyFilters();
  }

  navigateTo(url: string) {
    console.log(this.router.url)
    this.router.navigate(['pages', 'event-proposal', 'add']);
  }
  getStatusColor(status: EventProposalStatus): string {
    switch (status) {
      case EventProposalStatus.PROCESSING:
        return 'basic'; // Set your color for PROCESSING status
      case EventProposalStatus.APPROVED:
        return 'success'; // Set your color for APPROVED status
      case EventProposalStatus.REVIEWED:
        return 'warning'; // Set your color for REVIEWED status
      case EventProposalStatus.REJECTED:
        return 'danger'; // Set your color for REJECTED status
      case EventProposalStatus.USED:
        return 'info'; // Set your color for USED status
      default:
        return 'gray'; // Set a default color for unknown statuses
    }
  }
  onTabChange(event: any) {
    const selectedStatus = EventProposalStatus[(event.tabTitle as string).toUpperCase()];
    this.onStatusFilterChange(selectedStatus);
  }
  onStatusFilterChange(status: EventProposalStatus) {
    this.selectedStatus = status;
    this.applyFilters(); // Call applyFilters to update the totalItems and trigger sorting/pagination
  }
  applyFilters() {
    // Filter by search query and status
    this.filteredEventProposals = this.myEventProposals.filter(proposal => {
      const titleMatch = proposal.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const statusMatch = this.selectedStatus ? proposal.status === this.selectedStatus : true;

      return titleMatch && statusMatch;
    });
    this.totalItems = this.filteredEventProposals.length;

    // Sort and paginate the filtered event proposals
    this.sortAndPaginateEventProposals();
  }

  sortAndPaginateEventProposals() {
    // Sort the filtered event proposals based on the selected sorting option
    this.sortFilteredEventProposals();

    // Paginate the event proposals
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEventProposals = this.filteredEventProposals.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
    this.sortAndPaginateEventProposals();
  }


  onSearchChange() {
    this.applyFilters();
  }

  getFilteredByStatus(status: EventProposalStatus): EventProposal[] {
    return this.filteredEventProposals?.filter(proposal => proposal.status === status);
  }
  sortFilteredEventProposals() {
    switch (this.selectedSortingOption) {
      case 'titleAsc':
        this.filteredEventProposals.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        this.filteredEventProposals.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'modifyDateAsc':
        this.filteredEventProposals.sort((a, b) => new Date(a.modifyAt).getTime() - new Date(b.modifyAt).getTime());
        break;
      case 'modifyDateDesc':
        this.filteredEventProposals.sort((a, b) => new Date(b.modifyAt).getTime() - new Date(a.modifyAt).getTime());
        break;
      case 'createDateAsc':
        this.filteredEventProposals.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
        break;
      case 'createDateDesc':
        this.filteredEventProposals.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
        break;
      default:
        // No sorting
        break;
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
