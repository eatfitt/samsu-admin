import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, NbAuthSocialLink, NbLoginComponent, getDeepFromObject } from '@nebular/auth';
import { Store } from '@ngrx/store';
import { isObject, isString } from 'lodash';
import { Observable, filter } from 'rxjs';
import { SocialAuthService } from '../../../../utils/social-login/socialauth.service';
import { AuthenticationService, SignInRequest } from '../../../@core/services/authentication/authentication.service';
import { UserService } from '../../../@core/services/user/user.service';
import { Jwt, UserState, UserSummary, setUserJwt, setUserSocialUser, setUserUserSummary } from '../../../app-state/user';

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
    private store: Store<{ user: UserState }>,
    private userService: UserService
  
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


  ngOnInit(): void {
    this.userService.checkLoggedIn(true);
    const loggedOut = JSON.parse(localStorage.getItem("loggedOut"));
    if (loggedOut === 'true') {
      return;
    }

    this.socialAuthService.authState.pipe(filter(user => isObject(user) && isString(user?.authToken))).subscribe((user) => {
      this.store.dispatch(setUserSocialUser({ socialUser: user }));
      this.auth.getServerToken(user.authToken).subscribe(
        value => {
          const googleLoginResponse: Jwt = value as Jwt;
          this.store.dispatch(setUserJwt({jwt: googleLoginResponse}))
          localStorage.setItem('socialUser', JSON.stringify(user));
          localStorage.setItem('jwt', JSON.stringify(googleLoginResponse));
          this.userService.getMe(`${googleLoginResponse.jwtToken.tokenType} ${googleLoginResponse.jwtToken.accessToken}`).subscribe((userSummary: UserSummary) => {
            localStorage.setItem('userSummary', JSON.stringify(userSummary));
            this.store.dispatch(setUserUserSummary({userSummary: userSummary}));
          });
          localStorage.setItem('loggedOut', 'false');
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
        localStorage.setItem('jwt', JSON.stringify(jwt));
        this.store.dispatch(setUserJwt({jwt: jwt}));
        this.userService.getMe(`${token.tokenType} ${token.accessToken}`).subscribe((userSummary: UserSummary) => {
          localStorage.setItem('userSummary', JSON.stringify(userSummary));
          this.store.dispatch(setUserUserSummary({userSummary: userSummary}));
          this.router.navigate(['pages']);
        });
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