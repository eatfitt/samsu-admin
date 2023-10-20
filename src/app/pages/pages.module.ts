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
    GoogleSigninButtonModule
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
  ],
})
export class PagesModule {
}
