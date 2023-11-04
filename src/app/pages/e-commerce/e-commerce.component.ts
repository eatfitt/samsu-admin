import { Component } from '@angular/core';
import { UserService } from '../../@core/services/user/user.service';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  pager = {
    display: true,
    perPage: 3
  }

  constructor(
    private userService: UserService
  ) {

  }
  ngOnInit() {
    this.userService.checkLoggedIn();
  }
}
