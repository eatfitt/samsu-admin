import { Component } from '@angular/core';
import { UserService } from '../../@core/services/user/user.service';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  constructor(
    private userService: UserService
  ) {

  }
  ngOnInit() {
    this.userService.checkLoggedIn();
  }
}
