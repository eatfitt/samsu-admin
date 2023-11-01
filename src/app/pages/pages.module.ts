import { NgModule } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule, NbLayoutModule, NbMenuModule } from '@nebular/theme';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './authentication-components/login/login.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { UpdatePersonalInfoComponent } from './authentication-components/update-personal-info/update-personal-info.component';
import { AllEventsComponent } from './management/events/all-events/all-events.component';
import { AllStudentsComponent } from './management/students/all-students/all-students.component';
import { TablesRoutingModule } from './tables/tables-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AllGroupsComponent } from './management/groups/all-groups/all-groups.component';
import { GroupCardComponent } from './management/groups/group-card/group-card.component';
import { UserComponent } from './management/user/user.component';

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
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
    UpdatePersonalInfoComponent,
    AllEventsComponent,
    AllStudentsComponent,
    AllGroupsComponent,
    GroupCardComponent,
    UserComponent,
  ],
})
export class PagesModule {
}
