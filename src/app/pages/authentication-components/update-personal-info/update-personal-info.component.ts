import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, NbRegisterComponent, getDeepFromObject } from '@nebular/auth';
import { Store } from '@ngrx/store';
import { SocialUser } from '../../../../utils/social-login/entities/social-user';
import { Observable } from 'rxjs-compat';
import { Jwt, UserState, getUserJwtState, getUserSocialUserState } from '../../../app-state/user';
import { AuthenticationService } from '../../../@core/services/authentication/authentication.service';
import { InitUserRequest, UserService } from '../../../@core/services/user/user.service';

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
    this.socialUser$ = this.store.select(state => state.user.socialUser);
    this.socialUser$.subscribe(user => {
      this.socialUser = {...user}
    });
    this.store.select(getUserJwtState).subscribe((jwt) => {
      this.jwt = {...jwt};
    })
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    const bearerToken = `${this.jwt.jwtToken.tokenType} ${this.jwt.jwtToken.accessToken}`;
    const newUser: InitUserRequest = {
      username: this.socialUser.username,
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
}
