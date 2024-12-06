import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { contextSwitch } from '../../interface/interface-list';
import { KycService } from '../../B2C/customer-kyc/kyc.service';
import { Router } from '@angular/router';
import { DatasharingService } from '../../services/datasharing.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { LoginComponent } from "../../B2C/login/login.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, SpinnerComponent, LoginComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @Output() switchToContext = new EventEmitter<string>();
  contextS = contextSwitch;
  contexts = Object.values(contextSwitch);
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  backOfficeForm!: FormGroup;
  otpForm!: FormGroup;

  signupForm: FormGroup;
  isUsernameAvailable: boolean = false;
  isLoading: boolean = false;
  show2FA: boolean = false;
  username: any;
  password: any;
  otpVerify: any;
  email: any;

  constructor(
    private fb: FormBuilder,
    private apiServic: KycService,
    private route: Router,
    private spinner:DatasharingService,
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );

    this.backOfficeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
      gender: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      userType: ['CUSTOMER'],
    });

    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      OTP: ['', [Validators.required]],
    });
  }

  onSave() {
    
    let body = {
      email: this.backOfficeForm.controls['email'].value,
      userType: "CUSTOMER"
    };
    this.apiServic.generateOtp(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            alert('OTP has sent to your email!!!')
            this.otpVerify = true;
          }else{
            alert(res?.error)
          }
      },error:()=>{
        alert('Error Try Again!!!')
      }
    })
  }

  loginData:boolean = true
  onSaveOtp() {
    let email = this.backOfficeForm.controls['email'].value;

    let body = {
      email: email,
      otp: this.otpForm.controls['OTP'].value,
    };
    this.apiServic.verifyOtp(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            this.spinner.show()
            this.apiServic.apiUrlSignIp(this.backOfficeForm.value).subscribe({
              next:(res)=>{
                  console.log(res)
                  if (res?.responseCode == 200) {
                    this.spinner.hide()
                    alert('User Created Successfully');
                    this.loginData = false
                    this.spinner.setConditionSignUp(true);
                    this.otpVerify = res;
                    this.email = res?.email;
                  } else {
                    alert('Error While Creating User Try Again');
                  }
              },error:()=>{
                this.spinner.hide()
                alert('Error Try Again!!!')
              }
            })
            alert('OTP Verified Successfully');
          } else {
            alert(res?.error);
          }
      },error:()=>{
        this.spinner.hide()
        alert('Error Try Again!!!')
      }
    })
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onSignup() {
    this.isLoading = true;
    setTimeout(() => {
      this.isUsernameAvailable = true; 
      this.isLoading = false;
      this.show2FA = true;
    }, 2000);
  }

  invokeSwitchTo(context: contextSwitch) {
    console.log('(((((((((((((');
    this.switchToContext.emit(context);
  }
  navigate() {
    this.spinner.setConditionSignUp(true)
    this.route.navigateByUrl('/login');
  }
}
