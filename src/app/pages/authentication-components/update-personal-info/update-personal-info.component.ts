import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, NbAuthSocialLink, NbRegisterComponent, getDeepFromObject } from '@nebular/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SocialUser } from '../../../../utils/social-login/entities/social-user';
import { InitUserRequest, UserService } from '../../../@core/services/user/user.service';
import { Jwt, UserState, UserSummary, getUserJwtState, getUserUserSummaryState } from '../../../app-state/user';

@Component({
  selector: 'ngx-update-personal-info',
  templateUrl: './update-personal-info.component.html',
  styleUrls: ['./update-personal-info.component.scss']
})
export class UpdatePersonalInfoComponent extends NbRegisterComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  socialLinks: NbAuthSocialLink[] = [];
  socialUser$: Observable<SocialUser>;
  socialUser: any = null;
  jwt: Jwt = null;
  userSummary: UserSummary = null;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private store: Store<{ user: UserState }>,
    private userServive: UserService
  ) {
    super(service, options, cd, router);
    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  ngOnInit() {
    this.userServive.checkLoggedIn();
    this.socialUser$ = this.store.select(state => state.user.socialUser);
    this.socialUser$.subscribe(user => {
      this.socialUser = {...user}
    });
    this.store.select(getUserJwtState).subscribe((jwt) => {
      this.jwt = {...jwt};
    })
    this.store.select(getUserUserSummaryState).subscribe((userSummary) => {
      this.userSummary = {...userSummary};
    })
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    const bearerToken = `${this.jwt.jwtToken.tokenType} ${this.jwt.jwtToken.accessToken}`;
    const newUser: InitUserRequest = {
      password: this.socialUser.password
    }
    this.userServive.initUser(bearerToken, newUser).subscribe(
      (user) => console.log('init user', user),
      (error) => console.error(error)
    );
    console.log('update user', this.socialUser);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  back() {
    this.userServive.logOut();
  }
}
