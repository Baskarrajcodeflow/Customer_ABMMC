import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from '../../ApiService/api.service';
import { DatasharingService } from '../../../services/datasharing.service';
import { SpinnerService } from '../../spinner.service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-cashout-requests',
  standalone: true,
  imports: [CommonModule, FormsModule,SpinnerComponent],
  templateUrl: './cashout-requests.component.html',
  styleUrl: './cashout-requests.component.scss',
})
export class CashoutRequestsComponent {
  pin: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private spinner: SpinnerService,
    private dialogRef: MatDialogRef<CashoutRequestsComponent>
  ) {
    console.log(data);
  }
  pay() {
    this.spinner.show();
    this.apiService
      .payRequstedBillForAgent(this.data?.id, true, this.pin)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res?.responseCode == 200) {
            this.spinner.hide();
            alert('Request Aprroved Successfully');
            this.dialogRef.close();
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
