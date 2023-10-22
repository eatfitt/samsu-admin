import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, NbLoginComponent, getDeepFromObject } from '@nebular/auth';
import { AuthenticationService } from '../../../@core/services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { decrement, increment, reset, setUser } from '../../../app-state/user';

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
    private http: HttpClient,
    private auth: AuthenticationService,
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router, private socialAuthService: SocialAuthService,
    private store: Store<{ user: number }>
  ) {
    super(service, options, cd, router);
    this.count$ = store.select('user');
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
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;
  alive = true;
  loginFail = false;
  @ViewChild('oauthIframe') oauthIframe: ElementRef;
  oauthWindow: Window | null;
  count$: Observable<number>

  openIframeInNewWindow() {
    const oauthUrl = 'http://localhost:8081/oauth2/authorization/google';

    this.oauthWindow = window.open(oauthUrl, '_blank', 'width=600,height=400');

    // Add an interval to check the URL of the popup window
    window.addEventListener('message', (event) => {
      // Ensure the message is from the expected origin
      if (event.origin === 'http://localhost:8081') {
        if (event.data === 'success') {
          // Handle the success message (e.g., you can close the current window)
          window.close();
        }
      }
    });
  }
  getResponseFromBody(popupWindow: Window) {
    const popupWindowHtml = popupWindow.document.documentElement.innerHTML;
    popupWindow.close();

    // Handle the HTML content as needed
    console.log('Popup Window HTML:', popupWindowHtml);

  }

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
      this.store.dispatch(setUser({ googleUser: user }));
      this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(((value) => {
        console.log(value);
        this.auth.getServerToken(value).subscribe(
          value => {
            console.log('jwt', value)
            const googleLoginResponse: GoogleLoginResponse = value as GoogleLoginResponse;
            if (googleLoginResponse.firstTime) {
              this.router.navigate(['auth', 'register']);
            } else {
              this.router.navigate(['pages']);
            }
          },
          error => {
            this.loginFail = true;
          }
        )
        // this.accessToken$ = value;
      }))
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  login(): void {
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
    this.auth.getUserToken();
  }

  loginWithAccessToken(data) {
    console.log('loginWithAccessToken', data)
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  onGoogleSigninSuccess(data){
    console.log(data);
  }
}