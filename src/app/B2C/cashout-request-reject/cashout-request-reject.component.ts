import { Component, OnInit } from '@angular/core';
import { ApiService } from '../ApiService/api.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CashoutRequestsComponent } from './cashout-requests/cashout-requests.component';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-cashout-request-reject',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './cashout-request-reject.component.html',
  styleUrl: './cashout-request-reject.component.scss',
})
export class CashoutRequestRejectComponent implements OnInit {
  reqData: any;
  customerId: any;
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private spinner: SpinnerService
  ) {}
  ngOnInit(): void {
    this.customerId = sessionStorage.getItem('SenderUserId');

    this.getRequestsData(this.customerId);
  }

  getRequestsData(customerId: any) {
    this.spinner.show();
    this.apiService.findWithdrawal(customerId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.spinner.hide();
          this.reqData = res?.data;
        } else {
          this.spinner.hide();
          alert(res?.error);
        }
      },
      error: () => {
        this.spinner.hide();
        alert('Error Try Again');
      },
    });
  }

  onClickView(row: any) {
    let dialogRef = this.dialog
      .open(CashoutRequestsComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container',
        data: row,
        // disableClose:true
      })
      .afterClosed()
      .subscribe((res) => {
        this.getRequestsData(this.customerId);
      });
  }

  rejectData(item: any) {
    this.spinner.show();
    this.apiService.payRequstedBillForAgent(item?.id, false, '').subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.spinner.hide();
          alert('Request Rejected Successfully');
        } else {
          this.spinner.hide();
          alert(res?.error);
        }
      },
      error: () => {
        this.spinner.hide();
        alert('Error Try Again!!!');
      },
    });
  }
}
