import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
declare var FB: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

       // Aquí comprobaremos si el usuario ya ha iniciado sesión.
      // porque no queremos pedir a los usuarios que inicien sesión cada vez que abren la aplicación
        this.nativeStorage.getItem('facebook_user')
        .then( data => {
          // usuario está previamente registrado y tenemos sus datos.
          // Le dejaremos acceder a la aplicación.
          this.router.navigate(["/usuario"]);
          this.splashScreen.hide();
        }, err => {
          this.router.navigate(["/home"]);
          this.splashScreen.hide();
        })
      } else{
        if(localStorage.getItem('facebook_user')){
          this.router.navigate(["/usuario"]);
          this.splashScreen.hide();
        } else{
          this.router.navigate(["/home"]);
          this.splashScreen.hide();
        }
      }
      this.statusBar.styleDefault();
    });
  }
}
