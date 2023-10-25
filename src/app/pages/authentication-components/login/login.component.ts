import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, NbLoginComponent, getDeepFromObject } from '@nebular/auth';
import { SocialAuthService } from '../../../../utils/social-login/socialauth.service';
import { AuthenticationService, SignInRequest } from '../../../@core/services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Jwt, UserState, setUserJwt, setUserSocialUser } from '../../../app-state/user';

export interface GoogleLoginResponse {
  email: string,
  firstTime: boolean,
  jwtToken: JwtToken,
}
export interface JwtToken {
  accessToken: string,
  tokenType: string,
}

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthenticationService,
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router, private socialAuthService: SocialAuthService,
    private store: Store<{ user: UserState }>
  ) {
    super(service, options, cd, router);
  }

  imageURL  : string;
  email : string;
  name  : string; 
  token  : string;
  @Output() signinSuccess = new EventEmitter();
  // @Input() clientId: string = '1004958657894-sunq3ge7uur617frmlvndco7l6b1b6v3.apps.googleusercontent.com';
  @Input() clientId: string = '233487864072-ldpmp56m9cr11utl8ev17l94a5jf63h9.apps.googleusercontent.com';

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: SignInRequest = {
    usernameOrEmail: '',
    password: ''
  };
  errorMessage = '';
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;
  alive = true;
  loginFail = false;
  @ViewChild('oauthIframe') oauthIframe: ElementRef;
  oauthWindow: Window | null;
  count$: Observable<number>

  onIframeLoad(event: any) {
    const iframe = this.oauthIframe.nativeElement;

    if (event.target === iframe.contentWindow) {
      // Check the current URL of the iframe
      const currentUrl = iframe.contentWindow.location.href;

      if (currentUrl.includes('http://localhost:8081/api/auth/login-google')) {
        // Handle the response as needed

        // Close the popup window
        this.oauthWindow?.close();
      }
    }
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      this.store.dispatch(setUserSocialUser({ socialUser: user }));
      this.auth.getServerToken(user.authToken).subscribe(
        value => {
          console.log('jwt', value)
          const googleLoginResponse: Jwt = value as Jwt;
          this.store.dispatch(setUserJwt({jwt: googleLoginResponse}))
          if (googleLoginResponse.firstTime) {
            this.router.navigate(['auth', 'register']);
          } else {
            this.router.navigate(['pages']);
          }
        },
        error => {
          this.loginFail = true;
          this.errorMessage = 'Login Failed';
        }
      )
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  login(): void {
    if (!this.user.password.trim() || !this.user.usernameOrEmail.trim()) {
      this.loginFail = true;
      this.errorMessage = "Please fill in all fields"
    } else {
      this.loginFail = false;
    }
    this.auth.signIn(this.user).subscribe(
      (token: JwtToken) => {
        const jwt: Jwt = {
          email: this.user.usernameOrEmail,
          firstTime: false,
          jwtToken: token
        }
        this.store.dispatch(setUserJwt({jwt: jwt}));
        this.router.navigate(['pages']);
      },
      error => {
        this.loginFail = true;
        this.errorMessage = 'Login Failed';
      }
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

}