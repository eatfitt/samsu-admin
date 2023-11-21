import { NgModule } from "@angular/core";
import {
  NbAccordionModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbSelectModule,
  NbStepperModule,
  NbTabsetModule,
  NbTagModule,
  NbTimepickerModule,
  NbTreeGridModule,
} from "@nebular/theme";

import { GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgxPaginationModule } from "ngx-pagination";
import { QuillModule } from "ngx-quill";
import { ThemeModule } from "../@theme/theme.module";
import { LoginComponent } from "./authentication-components/login/login.component";
import { UpdatePersonalInfoComponent } from "./authentication-components/update-personal-info/update-personal-info.component";
import { CustomAutoselectComponent } from './custom-components/custom-autoselect/custom-autoselect.component';
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { EventProposalComponent } from './management/event-proposal/event-proposal.component';
import { AddEventAttendanceListComponent } from './management/events/add-event/add-event-attendance-list/add-event-attendance-list.component';
import { AddEventComponent } from "./management/events/add-event/add-event.component";
import { AddTaskComponent } from './management/events/add-event/add-task/add-task.component';
import { AllEventsComponent } from "./management/events/all-events/all-events.component";
import { TaskDetailComponent } from './management/events/task-detail/task-detail.component';
import { SingleGroupComponent } from "./management/groups/single-group/single-group.component";
import { UserComponent } from "./management/user/user.component";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { TablesRoutingModule } from "./tables/tables-routing.module";
import { AddEventProposalComponent } from './management/event-proposal/add-event-proposal/add-event-proposal.component';
import { ViewProposalComponent } from './management/event-proposal/view-proposal/view-proposal.component';
import { DepartmentsComponent } from './management/departments/departments.component';
import { GradesComponent } from './management/grades/grades.component';
import { EditEventProposalComponent } from './management/event-proposal/edit-event-proposal/edit-event-proposal.component';
import { AllEventProposalComponent } from './management/event-proposal/admin/all-event-proposal/all-event-proposal.component';
import { FeedbackEventProposalComponent } from './management/event-proposal/admin/feedback-event-proposal/feedback-event-proposal.component';
import { SingleEventComponent } from "./management/events/single-event/single-event.component";
import { EventComponent } from "./management/events/event/event.component";

// import { TasksComponent } from "./management/events/tasks/tasks.component";

@NgModule({
  imports: [NbFormFieldModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule, NgxPaginationModule,
    ECommerceModule,
    MiscellaneousModule,
    FormsModule,
    NbInputModule,
    NbLayoutModule,
    NbCardModule,
    NbCheckboxModule,
    NbAlertModule,
    NbButtonModule,
    HttpClientModule,
    GoogleSigninButtonModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbIconModule,
    NbPopoverModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbTagModule,
    NbStepperModule,
    NbDatepickerModule,
    NbTimepickerModule,
    CommonModule,
    NbAutocompleteModule,
    NbTreeGridModule,
    NbAutocompleteModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    NbListModule,
    NbAccordionModule
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
    UpdatePersonalInfoComponent,
    AllEventsComponent,
    // AllStudentsComponent,
    // AllGroupsComponent,
    // GroupCardComponent,
    UserComponent,
    SingleGroupComponent,
    AddEventComponent,
    AddEventAttendanceListComponent,
    TaskDetailComponent,
    CustomAutoselectComponent,
    AddTaskComponent,
    EventProposalComponent,
    AddEventProposalComponent,
    ViewProposalComponent,
    DepartmentsComponent,
    GradesComponent,
    EditEventProposalComponent,
    AllEventProposalComponent,
    FeedbackEventProposalComponent,
    SingleEventComponent,
    EventComponent,
    // TasksComponent,
  ],
})
export class PagesModule {}
