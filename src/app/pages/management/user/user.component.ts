import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  constructor(
    private router: Router
  ) {
    console.log(this.router);
  }
}
