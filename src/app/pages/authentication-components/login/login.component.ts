import { ChangeDetectorRef, Component, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, NbLoginComponent, getDeepFromObject } from '@nebular/auth';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../@core/services/authentication/authentication.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent {
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router) {
    super(service, options, cd, router);
  }

  imageURL  : string;
  email : string;
  name  : string; 
  token  : string;
  @Output() signinSuccess = new EventEmitter();
  // @Input() clientId: string = '1004958657894-sunq3ge7uur617frmlvndco7l6b1b6v3.apps.googleusercontent.com';
  @Input() clientId: string = '262091523626-tu5ffnitduakqqanvmf6m84rbg2co5ra.apps.googleusercontent.com';

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;

  login(): void {
    console.log('hehe');
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  loginWithGoogle() {
    // this.auth.login().then(() => {
    //   this.router.navigate(['pages']);
    // })
    this.auth.authenticateUser(this.clientId, this.onGoogleSigninSuccess);
    
    //window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }

  loginWithAccessToken(data) {
    console.log('log moi ne', data)
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  onGoogleSigninSuccess(data){
    console.log(data);
  }
}

function loginWithAccessToken(data) {
  console.log('log moi ne', data)
}