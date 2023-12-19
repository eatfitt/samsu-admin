import { Component, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef, NbDialogService, NbIconLibraries } from "@nebular/theme";
import { Store } from "@ngrx/store";
import { isEmpty } from "lodash";
import { map, switchMap } from "rxjs";
import { EventProposalService } from "../../../../../services/event-propsal.service";
import {
  Event,
  EventService,
} from "../../../../@core/services/event/event.service";
import { UserService } from "../../../../@core/services/user/user.service";
import { UserState, UserSummary } from "../../../../app-state/user";
@Component({
  selector: "ngx-all-events",
  templateUrl: "./all-events.component.html",
  styleUrls: ["./all-events.component.scss"],
})
export class AllEventsComponent {
  @ViewChild("noAvailableProposalDialog", { static: true })
  noAvailableProposalDialog: TemplateRef<any>;
  
  selectedStatisticTime = "week";
  events: Event[] = [];
  filteredEvents: Event[] = [];
  filterValue = {
    id: "",
    title: "",
    creator: "",
    eventLeader: "",
    status: 0,
    time: null,
    score: 0,
  };
  approvedAroposalListLength = 0;
  private contentTemplateRef: NbDialogRef<AllEventsComponent>;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private store: Store<{ user: UserState }>,
    private router: Router,
    iconsLibrary: NbIconLibraries,
    private eventProposalService: EventProposalService,
    private dialogService: NbDialogService,
  ) {
    iconsLibrary.registerFontPack("ion", { iconClassPrefix: "ion" });
  }

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
    this.store.select(state => state.user.userSummary).pipe(
      switchMap((userSummary: UserSummary) => {
        return userSummary?.role === 'ROLE_ADMIN'
          ? this.eventProposalService.getAllAvailableEventProposals()
          : this.eventProposalService.getMyAvailableEventProposal();
      }),
      map(data => (data as any)?.filter(content => content.status === "APPROVED")),
    ).subscribe(data => this.approvedAroposalListLength = data.length);
  }

  fetchData() {
    this.eventService
      .getAllEvents()
      .subscribe(
        (data: any) => (this.events = this.filteredEvents = data.content)
      );
  }

  navigateTo(url: string) {
    console.log(this.router.url);
    this.router.navigate([url]);
    this.contentTemplateRef.close();
  }

  filter() {
    let availableProperties = [];
    for (var key in this.filterValue) {
      if (!isEmpty(this.filterValue[key])) {
        availableProperties.push(key);
      }
    }
    this.filteredEvents = this.events.filter((event) => {
      for (var key of availableProperties) {
        return event[key]
          .toString()
          .toLowerCase()
          .includes(this.filterValue[key].toString().toLowerCase());
      }
    });
    if (this.filteredEvents.length <= 0) {
      this.filteredEvents = this.events;
    }
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  getProcessStatus(status: number): string {
    switch(status) {
      case 0:
        return 'Coming';
        case 1:
        return 'Check in';
        case 2:
        return 'Processing';
        case 3:
        return 'Check out';
        case 4:
        return 'Complete';
        case 5:
        return 'Reviewed';
        case 6:
        return 'Finished';
        case 0:
        return 'Canceled';
    }
  }
}
