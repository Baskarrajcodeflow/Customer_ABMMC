import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../ApiService/api.service';
import { CashoutRequestsComponent } from '../cashout-request-reject/cashout-requests/cashout-requests.component';
import { SpinnerService } from '../spinner.service';
import { AuthorisePayrollComponent } from './authorise-payroll/authorise-payroll.component';

@Component({
  selector: 'app-payroll-requests',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './payroll-requests.component.html',
  styleUrl: './payroll-requests.component.scss'
})
export class PayrollRequestsComponent {
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
    this.apiService.payrollRequests(customerId).subscribe({
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
      .open(AuthorisePayrollComponent, {
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
    this.apiService.payRequstedPayrollBillForAgent(item?.id, false, '').subscribe({
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
