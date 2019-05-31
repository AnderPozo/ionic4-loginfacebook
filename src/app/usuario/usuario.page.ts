import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
declare var FB: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  constructor(
    private fb: Facebook,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private platform: Platform,
    private router: Router,
  ) { }

  user: any;
  userReady: boolean = false;

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
     await loading.present();
     if (this.platform.is('cordova')) {
       this.nativeStorage.getItem('facebook_user')
      .then(data => {
        this.user = {
          name: data.name,
          email: data.email,
          picture: data.picture
        };
        loading.dismiss();
        this.userReady = true;
      }, error =>{
        console.log(error);
        loading.dismiss();
      });
    } else{
      let data = localStorage.getItem('facebook_user');
      let data_split = data.split(';');
      this.user = {
        name: data_split[0],
        email: data_split[1],
        picture: data_split[2]
      };
      loading.dismiss();
      this.userReady = true;
    }
  }

  doFbLogout(){
    if (this.platform.is('cordova')) {
      this.fb.logout()
      .then(res => {
        // el usuario se desconecta por lo que se elimina del NativeStorage
        this.nativeStorage.remove('facebook_user');
        this.router.navigate(["/home"]);
      }, err => {
        console.log(err);
      });
    } else{
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          FB.logout(res => {
            localStorage.removeItem('facebook_user');
            this.router.navigate(["/home"]);
          })
        } else{
          localStorage.removeItem('facebook_user');
          this.router.navigate(["/home"]);
        }
      } );

    }
  }
}
