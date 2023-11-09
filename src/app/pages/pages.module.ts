import { NgModule } from '@angular/core';
import { NbAlertModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbPopoverModule, NbSelectModule, NbStepperModule, NbTabsetModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { QuillModule } from 'ngx-quill';
import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './authentication-components/login/login.component';
import { UpdatePersonalInfoComponent } from './authentication-components/update-personal-info/update-personal-info.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { AddEventComponent } from './management/events/add-event/add-event.component';
import { AllEventsComponent } from './management/events/all-events/all-events.component';
import { SingleGroupComponent } from './management/groups/single-group/single-group.component';
import { UserComponent } from './management/user/user.component';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { TablesRoutingModule } from './tables/tables-routing.module';

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
    NbTreeGridModule,
    NbAutocompleteModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
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
  ],
})
export class PagesModule {
}
