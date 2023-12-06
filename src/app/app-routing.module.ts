import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from '@nebular/auth';
import { LoginComponent } from './pages/authentication-components/login/login.component';
import { UpdatePersonalInfoComponent } from './pages/authentication-components/update-personal-info/update-personal-info.component';
import { GuarantorVerifyComponent } from './pages/management/invoke-point/guarantor-verify/guarantor-verify.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: UpdatePersonalInfoComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  {
    path: 'guarantorVerify/:code',
    component: GuarantorVerifyComponent,
  },
  {
    path: 'guarantorVerify/:code/:code',
    component: GuarantorVerifyComponent,
  },
  {
    path: 'guarantorVerify/:code/:code/:code',
    component: GuarantorVerifyComponent,
  },
  {
    path: 'guarantorVerify/:code/:code/:code/:code',
    component: GuarantorVerifyComponent,
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // { path: 'guarantorVerify/**', component: GuarantorVerifyComponent },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [GoogleSigninButtonModule, RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
