import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../ApiService/api.service';
import { SpinnerService } from '../spinner.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.css',
})
export class MoneyTransferComponent implements OnInit {
  totalAmount: any;
  profileId!: number;
  receiverId!: number;
  service: any;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService
  ) {}
  ngOnInit(): void {
    let data:any = sessionStorage.getItem('WalletAmount');
    let data2:any = Math.round(data)
    this.Walletform.controls['payFrom'].setValue(data2);
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      this.profileId = res?.data?.id;
      if (res) {
      }
    });
  }
  payToArray: any;
  serchBill() {
    this.spinner.show();
    this.apiService
      .searchUserToPay(this.Walletform.controls['walletNo'].value)
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.spinner.hide();
            this.payToArray = res?.data;
            this.receiverId = res?.data[0]?.id;
            console.log(this.payToArray, 'aaa');
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
  nextPage: any = 0;
  Walletform = new FormGroup({
    walletNo: new FormControl('', Validators.required),
    payFrom: new FormControl('', Validators.required),
    payTo: new FormControl('', Validators.required),
    PIN: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    info: new FormControl('', Validators.required),
  });
  CheckAFC() {
    let selfWallet = sessionStorage.getItem('profileWalletNo')
    this.spinner.show();
    this.apiService
      .checkFeesAndCommission(
        selfWallet,
        this.Walletform.controls['amount'].value
      )
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.spinner.hide();
            this.totalAmount = res?.data;
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

  sendMoney() {

    let SERVICE_NAME: any;
    if (this.service == 'CUSTOMER') {
      SERVICE_NAME = 'CUSTOMER_TO_CUSTOMER';
    }else if(this.service == 'CORPORATE'){
      SERVICE_NAME = 'CUSTOMER_TO_CORPORATE';
    }else if(this.service == 'AGENT'){
      SERVICE_NAME = 'CUSTOMER_TO_AGENT';
    }else if(this.service == 'MERCHAN'){
      SERVICE_NAME = 'CUSTOMER_TO_MERCHANT';
    }

    let body: any = {
      serviceReceiver: {
        id: this.receiverId,
      },
      initiator: {
        id: this.profileId,
      },
      serviceProvider: {
        id: this.profileId,
      },
      context: {
        TRANSACTION_DESCRIPTION: this.Walletform.controls['info'].value,
        PIN: this.Walletform.controls['PIN'].value,
        AMOUNT: String(this.totalAmount),
        MEDIUM: 'web',
        SERVICE_NAME: SERVICE_NAME,
        CHANNEL: 'WALLET',
      },
    };
    this.spinner.show();
    this.apiService.transferMoney(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            this.nextPage=0
            this.Walletform.reset()
            this.spinner.hide();
            this.totalAmount = null
            alert('Money Transfer Success');
          } else {
            this.spinner.hide();
            alert(res?.error);
          }
      },error:()=>{
        this.spinner.hide();
        alert('Error Try Again');
      }
    })
  }
  next() {
    this.nextPage++;
  }
}
