import { NgModule } from "@angular/core";
import {
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
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
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { QuillModule } from "ngx-quill";
import { ThemeModule } from "../@theme/theme.module";
import { LoginComponent } from "./authentication-components/login/login.component";
import { UpdatePersonalInfoComponent } from "./authentication-components/update-personal-info/update-personal-info.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { AllEventsComponent } from "./management/events/all-events/all-events.component";
import { UserComponent } from "./management/user/user.component";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { TablesRoutingModule } from "./tables/tables-routing.module";
import { AllGroupsComponent } from "./management/groups/all-groups/all-groups.component";
import { GroupCardComponent } from "./management/groups/group-card/group-card.component";
import { SingleGroupComponent } from "./management/groups/single-group/single-group.component";
import { AddEventComponent } from "./management/events/add-event/add-event.component";
import { CommonModule } from "@angular/common";
import { AddEventAttendanceListComponent } from './management/events/add-event/add-event-attendance-list/add-event-attendance-list.component';
import { TaskDetailComponent } from './management/events/task-detail/task-detail.component';
import { CustomAutoselectComponent } from './custom-components/custom-autoselect/custom-autoselect.component';
import { AddTaskComponent } from './management/events/add-event/add-task/add-task.component';
// import { TasksComponent } from "./management/events/tasks/tasks.component";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
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
    NbListModule
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
    // TasksComponent,
  ],
})
export class PagesModule {}
