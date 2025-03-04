import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { DatasharingService } from '../../services/datasharing.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  userName: any;
  kyclevel:any
  imageUrl = environment.apiUrl;
img:any
ngOnInit(): void {
  this.img = sessionStorage.getItem('profileimg')

  this.dataSharing.profilepic$.subscribe((res)=>{
    if(res){
      this.img = res
      sessionStorage.setItem('profileimg',res)
    }
  })
  this.dataSharing.kyclevel$.subscribe((res)=>{
    this.kyclevel = res
    console.log(this.kyclevel);
    
  })
  this.sharedService.loginDeatails$.subscribe((res:any)=>{
    if(res)
    this.userName = `${res?.firstName} ${res?.lastName}`
  })
}

  constructor(private route:Router,
    private sharedService: SharedService,
    private dataSharing:DatasharingService

  ){}
  isSubMenuOpenUserkyc = false
  navigate(nav:any){
    this.route.navigateByUrl(nav)
  }

  toggleKyc() {
    this.isSubMenuOpenUserkyc = !this.isSubMenuOpenUserkyc;
  }
}
