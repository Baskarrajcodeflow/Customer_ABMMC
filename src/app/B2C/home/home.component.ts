import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurServicesComponent } from '../Our-Services/our-services.component';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,OurServicesComponent,HeaderComponent,FooterComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private auth:AuthService){}
    @Input() datalog:any

  ngOnChanges(): void {
     console.log(this.datalog,'newchange');
     console.log(this.auth.logged,'loggedin');
     
     // console.log(this.authService.isLoggedIn(),'ngonchange')
   }
  images: string[] = [
    'https://via.placeholder.com/1200x500',
    'https://via.placeholder.com/1200x500',
    'https://via.placeholder.com/1200x500'
  ];

  carouselConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

}
