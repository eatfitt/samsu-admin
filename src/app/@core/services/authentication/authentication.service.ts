import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare const gapi: any;
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // constructor() { }
  // login(): Promise<any> {
  //   return new Promise((resolve) => {
  //     localStorage.setItem('loggedIn', 'true');
  //     resolve(true);
  //   });
  // }

  // isLoggedIn(): boolean {
  //   return !!localStorage.getItem('loggedIn');
  // }
  constructor(private http : HttpClient) {}

  public authenticateUser(clientId, callback) {
    let auth2 : any;
    let result : any;
    gapi.load('auth2', function () {
      auth2 = gapi
        .auth2
        .init({client_id: clientId, scope: 'profile email'});
      //Login button reference
      let element : any = document.getElementById('google-login-button');
      auth2.attachClickHandler(element, {}, function (googleUser) {
        //Getting profile object
        let profile = googleUser.getBasicProfile();
        //Setting data to localstorage.
        localStorage.setItem('token', googleUser.getAuthResponse().id_token);
        localStorage.setItem('image', profile.getImageUrl());
        localStorage.setItem('name', profile.getName());
        localStorage.setItem('email', profile.getEmail());
        // Alternatively you can create an object and return it like that - result = {
        // token: googleUser.getAuthResponse().id_token, name: profile.getName(), image:
        // profile.getImageUrl(), email: profile.getEmail(), };
        console.log('userrrrrrr', googleUser)
        localStorage.setItem('loggedIn', 'true');
        callback.emit(googleUser);
      }, function (error) {
        alert(JSON.stringify(error, undefined, 2));
      });
    });
  }
  /**
* Logout user from Google
* @param callback Callback to function
*/
  userLogout(callback) {
    //You will be redirected to this URL after logging out from Google.
    let homeUrl = "http://localhost:4200";
    let logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah" +
        "/logout?continue=" + homeUrl;
    document.location.href = logoutUrl;
    callback();
  }
  
}
