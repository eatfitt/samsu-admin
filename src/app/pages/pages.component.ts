import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { UserState } from '../app-state/user';
import { ADMIN_MENU_ITEMS, MANAGER_MENU_ITEMS, MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  constructor(private store: Store<{ user: UserState }>) { }
  menu = MENU_ITEMS;
  isAdmin = false;
  isManager = false;
  ngOnInit(): void {
    this.store.select(state => state.user.userSummary).subscribe(userSummary => {
      this.isAdmin = (userSummary.role === 'ROLE_ADMIN');
      this.isManager = (userSummary.role === 'ROLE_MANAGER');
      if (this.isAdmin) {
        this.menu = [...MENU_ITEMS, ...ADMIN_MENU_ITEMS];
      }
      if (this.isManager) {
        this.menu = [...MENU_ITEMS, ...MANAGER_MENU_ITEMS];
      }
    });
  }
}
