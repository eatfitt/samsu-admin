import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NB_WINDOW, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SocialUser } from '../../../../utils/social-login/public-api';
import { UserService } from '../../../@core/services/user/user.service';
import { LayoutService } from '../../../@core/utils';
import { UserState, UserSummary } from '../../../app-state/user';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  socialUser: SocialUser = null;
  userSummary: UserSummary = null;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              @Inject(NB_WINDOW) private window,   
              private breakpointService: NbMediaBreakpointsService,
              private userService: UserService, 
              private store: Store<{ user: UserState }>) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.store.select(state => state.user.socialUser).subscribe(user => {
      this.socialUser = {...user}
    });
    this.store.select(state => state.user.userSummary).subscribe(userSummary => {
      this.userSummary = {...userSummary}
    });

    this.menuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'user-dropdown'),
      map(({ item: { title } }) => title),
    )
    .subscribe(title => {
      switch(title) {
        case 'Profile':
          console.log('To be implemented');
          break;
        case 'Log out':
          this.logout();
          break;
        default:
          break;
      }
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize(true);

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  logout() {
    this.userService.logOut();
  }
}
