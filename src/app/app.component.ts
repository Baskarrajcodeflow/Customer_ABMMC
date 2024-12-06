import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CardComponent } from './ui-elements/card/card.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { SignupComponent } from './components/signup/signup.component';
import { BodyComponent } from './body/body/body.component';
import { HomeComponent } from './B2C/home/home.component';
import { LoginComponent } from './B2C/login/login.component';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from "./B2C/sidebar/sidebar.component";
import { OurServicesComponent } from "./B2C/Our-Services/our-services.component";
import { DatasharingService } from './services/datasharing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CommonModule,
    SignupComponent,
    LoginComponent,
    BodyComponent,
    HomeComponent,
    SidebarComponent,
    OurServicesComponent
],
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
    public authService : AuthService,
    public data:DatasharingService
  ) {
    this.translate.setDefaultLang('en');
    // Set the default language
    this.translate.use('en');
  }
  title = 'miPay-b2c';
  showSignup: boolean = false;
  showLogin: boolean = false;
  ngOnInit() {
    
   /*  this.sharedService.showSignupCard$.subscribe((data) => {
      this.showSignup = data;
    });  */
    this.sharedService.showLoginCard$.subscribe((data) => {
      // this.showLogin = data;
    }); 

    this.data.loginSubject.subscribe((res)=>{
      this.showLogin = res
    })
    //this.
  }
}
