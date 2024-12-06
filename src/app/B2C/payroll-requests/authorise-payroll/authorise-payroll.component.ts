import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../ApiService/api.service';
import { SpinnerService } from '../../spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-authorise-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule,SpinnerComponent],
  templateUrl: './authorise-payroll.component.html',
  styleUrl: './authorise-payroll.component.scss'
})
export class AuthorisePayrollComponent {
  pin: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private spinner: SpinnerService,
    private dialogRef: MatDialogRef<AuthorisePayrollComponent>
  ) {
    console.log(data);
  }
  pay() {
    this.spinner.show();
    this.apiService
      .payRequstedPayrollBillForAgent(this.data?.id, true, this.pin)
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