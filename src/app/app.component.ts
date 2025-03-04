import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
import { BackButtonService } from './services/back-button.service';
import { AuthServices } from './core/authservice.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
providers:[BackButtonService]
})
export class AppComponent implements OnInit {
newData: boolean = true
  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
    public authService : AuthService,
    public data:DatasharingService,
    private router:Router,
    private back:BackButtonService
  ) {
    console.log(this.back,'backservice');
    
    this.translate.setDefaultLang('en');
    // Set the default language
    this.translate.use('en');
    console.log(authService.logged,'logged?');
    
    
  }

  // @HostListener('window:popstate', ['$event'])
  // handleBackButton(event: Event) {
  //   console.log('Back button clicked!', event);
    
  //   sessionStorage.clear(); // Clear session storage
  
  //   // Navigate to login page to prevent unauthorized access
  //   this.router.navigate(['/home']).then(() => {
  //     location.reload(); // Force full reload
  //   });
  // }
  title = 'miPay-b2c';
  showSignup: boolean = false;
  showLogin: boolean = false;
  showLoginPage: boolean = true;

ngDoCheck(): void {
  //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
  //Add 'implements DoCheck' to the class.
  console.log('docheck');
  
}

  ngOnInit() {
    console.log('testing');


    // history.pushState(null, '', location.href);
    // window.onpopstate = () => {
    //   history.pushState(null, '', location.href);
    // };
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
// -------------------------------------------------------------------------//
    this.showLoginPage = !this.data.loginNew.getValue();
    this.data.login$.subscribe((res) => {
      console.log(res,'app-compon');
      
      this.showLoginPage = !res;
    });
// -------------------------------------------------------------------------//

    // window.onpopstate = () => {
    //   const token = sessionStorage.getItem('JWT_TOKEN');
    //   if (!token) {
    //     console.log('In');
    //    window.location.reload()
    //   }
    // };
  }
}
