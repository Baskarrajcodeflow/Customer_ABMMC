import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OurServicesComponent } from '../Our-Services/our-services.component';
import { DatasharingService } from '../../services/datasharing.service';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { ApiService } from '../ApiService/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [OurServicesComponent, CommonModule, TransactionHistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  totalAFN: any;
  profileData: any;
  constructor(
    private router: Router,
    private data: DatasharingService,
    private sharedService: SharedService,
    private apiservice: ApiService
  ) {}

  ngOnInit() {
    let phoneOrWalletNo = sessionStorage.getItem('profileWalletNo');

    this.data.currency$.subscribe({
      next: (res) => {
        this.totalAFN = Math.round(res);
      },
      error: () => {
        this.totalAFN = null;
      },
    });
    this.sharedService.loginDeatails$.subscribe((res) => {
      console.log(res, 'profile');

      this.profileData = res;
    });

    this.apiservice
      .getPayFromAccountDetails(phoneOrWalletNo)
      .subscribe((res) => {
        console.log(res);
        this.totalAFN = Math.round(res?.data);
      });
  }

  gotoProductPage(product: string) {
    this.router.navigate(['/product', product]);
  }

  gotoBranchAddress() {
    this.router.navigate(['/branches']);
  }

  ngOnDestroy() {}
}
