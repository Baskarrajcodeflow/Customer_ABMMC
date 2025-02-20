import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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
  dataAmount: any;
  walletNoLength: any;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService
  ) {}
  ngOnInit(): void {
     this.dataAmount = sessionStorage.getItem('WalletAmount');
    let data2:any = Math.round(this.dataAmount)
    this.Walletform.controls['payFrom'].setValue(data2);
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      this.profileId = res?.data?.id;
      if (res) {
      }
    });
    this.Walletform.get('amount')?.setValidators([
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
      this.maxAmountValidatorFactory()
    ]);
    this.Walletform.get('amount')?.updateValueAndValidity(); // Refresh validation
  }
  payToArray: any;
  suspend: any;

  serchBill() {
    let walletAccountNo:any = this.Walletform.controls['walletNo'].value
    if (walletAccountNo.length >= 9 && walletAccountNo.slice(-9).startsWith("7")) {
      // Call the findPhone API
        this.findUser("PHONE", walletAccountNo.slice(-9));
    } else if (walletAccountNo.length === 13) {
      // Call the findWallet API
        this.findUser("WALLET", walletAccountNo);
    }
  }
  findUser(value:any,wallet:any){
    this.spinner.show();
    this.apiService
    .searchUserToPay(value,wallet)
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.spinner.hide();
            this.suspend = res?.data[0]?.accountState;
            if(this.suspend != 'ACTIVE'){
              alert('Receiver Account Suspended')
            }
            if(res?.data[0]?.walletNo.length != 13){
              alert('Receiver Account Is Not Verified')
            }
            this.payToArray = res?.data;
            this.service = res?.data[0]?.walletType
            console.log(this.service);
          this.walletNoLength = res?.data[0]?.walletNo
            
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
    walletNo: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$') 
    ]),
    payFrom: new FormControl('', Validators.required),
    payTo: new FormControl('', Validators.required),
    PIN: new FormControl('', Validators.required),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/) ,
      this.maxAmountValidatorFactory() // Ensures only numbers, no leading zero, no 0 itself
    ]), 
        info: new FormControl('', Validators.required),
  });
  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
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
console.log(this.service);

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

  maxAmountValidatorFactory() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      return value > this.dataAmount ? { maxAmount: true } : null;
    };
  }
  validateAmount(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Allow only numbers (48-57 are ASCII codes for 0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
