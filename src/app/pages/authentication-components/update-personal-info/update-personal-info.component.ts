import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, NbRegisterComponent, getDeepFromObject } from '@nebular/auth';
import { Store } from '@ngrx/store';
import { SocialUser } from '../../../../utils/social-login/entities/social-user';
import { Observable } from 'rxjs-compat';
import { UserState, getUserSocialUserState } from '../../../app-state/user';

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
  socialUser: SocialUser = null;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private store: Store<{ user: UserState }>
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
      console.log('user   ddddd', user)
      this.socialUser = user
    });
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    console.log('update user', this.socialUser);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
