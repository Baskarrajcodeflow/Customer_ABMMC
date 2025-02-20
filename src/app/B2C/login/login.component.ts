import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { loginReq } from '../../interfaces/interfaces';
import { LoginService } from '../../services/login.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthServices } from '../../core/authservice.service';
import { OurServicesComponent } from "../../components/Our-Services/our-services.component";
import { ApiService } from '../ApiService/api.service';
import { SignupComponent } from '../../components/signup/signup.component';
import { DatasharingService } from '../../services/datasharing.service';
import { KycService } from '../customer-kyc/kyc.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { RegistrationFormComponent } from "../registration-form/registration-form.component";
import { RegisterCorporateComponent } from '../coroporate-kyc/register-corporate/register-corporate.component';
import { SessionService } from '../../services/session-service/session.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, OurServicesComponent, SignupComponent, SpinnerComponent, RegisterCorporateComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  //login data
  loginForm: FormGroup = new FormGroup({});
  loginReq!: loginReq;
  phone: string = '';
  password: string = '';

  //forget password
  email: string = '';
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  currentView: 'login' | 'signUp' | 'forgotPassword' | 'otpVerification' | 'newPassword'  | 'OTPNew' =
    'login';
  result: any;
  key: any;
  salt: any;
  response: any;
  decryptResult: any;
  decryptedText: any;
  tokenData: any;
  timer!: number;
  customerId: any;
  loginId: any;
  openModal :boolean = true;
  otpVerify: any;
  otpForm!: FormGroup;
newPassword: any;
loginPage: any = true

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private authService: AuthServices,
    private loginService: LoginService,
    private router: Router,
    private auth : AuthService,
    private apiService:ApiService,
    private dataSharing:DatasharingService,
    private apiServic:KycService,
    private cdr: ChangeDetectorRef,
    private sessionService:SessionService
  ) {
    this.dataSharing.setCondition$.subscribe((res) => {
      if(res){
        this.value = res;
      }
      console.log('Login Component - Value:', this.value);
    });
    this.dataSharing.corpKyc$.subscribe((res) => {
      this.viewCorporateRegister = res;
    });
    
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      OTP: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.key = 'DAdHr3nBFT@hR3QdRK!XwAgA*M!mBB7Qso2J^4dHAN0tAIZg7A';
    this.salt = 'f9Nj*7ZjK!5qJiV@*bIC%5b$7305EDAeZRYy8PYa95!9&ur50';
  }

  closeModal(){
    this.openModal = false;

  }

  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.key;
    if (isNaN(Number(charCode))) {
      event.preventDefault();
    }
  }

  // Function to encrypt a message using PKCS#7 padding and IV
  encryptMessage(message: string): { encryptedText: string; iv: string } {
    const iv = CryptoJS.lib.WordArray.random(16);

    const derivedKey = CryptoJS.PBKDF2(this.key, this.salt, {
      keySize: 256 / 32, // Derive 256-bit key
      iterations: 65536, // Increase iterations for stronger derivation
    });

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(message),
      derivedKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return {
      encryptedText: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Base64),
    };
  }

  decrypt(encryptedData: string, iv: string) {
    const ivString = CryptoJS.enc.Base64.parse(iv).toString();

    // Derive the key using the salt
    var derivedKey = CryptoJS.PBKDF2(this.key, this.salt, {
      keySize: 256 / 32,
      iterations: 65536,
    });

    // Decrypting the data with the derived key and IV
    var decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(ivString),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      decrptedText: decryptedBytes.toString(CryptoJS.enc.Utf8),
    };
  }
  credentials = {
    username: '',
    password: '',
  };
  username: any = null;
  passwords: any = null;
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpError: string = '';
  
  moveToNext(index: number, event: any) {
    if (event.target.value.length === 1 && index < 5) {
      event.target.nextElementSibling?.focus();
    }
  }
  otp:any
  login(event:any) {
    sessionStorage.clear()
    this.credentials.username = this.username;
    this.credentials.password = this.passwords;

    let body = {
      emailOrPhone:this.username,
      password:this.password,
      userType:'CUSTOMER'
    }
    this.apiService.generate(body).subscribe({
      next:(res)=>{
        console.log(res);
        if(res?.responseCode == 200){
          if(event == 0){
            alert('OTP has been sent to your email / Phone. Please verify.');
          }else if(event == 1){
          this.otpDigits = ['', '', '', '', '', ''];      
            alert('OTP has been resent to your email / Phone. Please verify.');
          }
        this.currentView = 'OTPNew'
        }else{
          this.otpDigits = ['', '', '', '', '', ''];      
          alert(res?.error)
        }
      },error:()=>{
        alert('Something Went Wrong')
      }
    })

   
  }
  loginNew() {
    const otp = this.otpDigits.join('');
       this.authService.login(this.username, this.password,otp).subscribe({
      next: (v: any) => {
        console.log(v);
        if(v?.responseCode == 200 || v?.responseCode == 2){
          alert(v?.message);
          this.sessionService.startTimer();
          this.openModal = false;
          this.auth.logged = true;
          this.getProfileData();
          this.router.navigateByUrl('/dashboard');
        }else{
          alert(v?.message)
        }
        let token = v?.token;
        const helper = new JwtHelperService();
        let decodedToken = helper.decodeToken(JSON.stringify(token));
      },
    });
  }

  getProfileData() {
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      this.sharedService.liginDeatilsData(res?.data)
      sessionStorage.setItem('SenderUserId', res?.data?.id);
      sessionStorage.setItem(
        'profileWalletNo',
        res?.data?.walletAccount?.walletNo
      );
      this.dataSharing.setwalletNoData(res?.data?.walletAccount?.walletNo)
      sessionStorage.setItem(
        'walletId',
        res?.data?.walletAccount?.id
      );
      sessionStorage.setItem('Kyclevel', res?.data?.accountKycLevel);
      sessionStorage.setItem('profileimg', res?.data?.profilePic);
      this.dataSharing.setprofilepicData(res?.data?.profilePic)
      this.dataSharing.setkyclevelData(res?.data?.accountKycLevel);
      this.apiService
        .getPayFromAccountDetails(res?.data?.walletAccount?.walletNo)
        .subscribe((res) => {
          console.log(res);
          this.dataSharing.setcurrencyData(res?.data)
          sessionStorage.setItem('WalletAmount', res?.data);
          // this.dataSharing.currentBalanceData(res?.data)
        });
    });
  }

  
  pwdReset() {
    let body = {
      email: this.email,
      password: this.newPassword,
      userType:'CUSTOMER'
    };
    console.log(body);
    
    this.dataSharing.show()
    this.apiServic.forgotPwd(body).subscribe({
      next:(res)=>{
          if(res?.responseCode == 200){
            alert('Password Reset Successful')
            this.dataSharing.hide()
            // this.otpVerify = false
            this.resetPwdData = false;
            // this.resetPwd = false;
            setTimeout(() => {
              this.value = true
              this.currentView = 'login';
              console.log("Current View after password reset:", this.currentView);
              this.cdr.detectChanges();
            }, 0); 
          }else{
            this.dataSharing.hide()
            alert(res?.error)
          }
      },error:()=>{
        this.dataSharing.hide()
        alert('Error Try Again')
      }
    })
  }
  navigate() {
    this.router.navigateByUrl('signUp')
  }

  value:any = true
  viewCorporateRegister: boolean = false;

  gotoRegister(event: any) {
    this.viewCorporateRegister = event;
  }


  switchView(
    view: 'login' | 'signUp' | 'forgotPassword' | 'otpVerification' | 'newPassword'
  ) {
    this.currentView = view;
  }
  data:any = true
  resetPwdData:any= false
  resetPwd: boolean = true;
  loginformData:boolean = true
  sendOtp() {
    let body = {
      email: this.email,
      userType: "CUSTOMER"
    };
    this.dataSharing.show();
    this.apiServic.forgotOtp(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            this.dataSharing.hide();
            this.otpVerify = false;
            this.resetPwd = false;
            this.loginformData = false
            this.otpVerify = true
            this.value = false
            alert('OTP has sent to your mail');
          } else {
            this.dataSharing.hide();
            alert(res?.error);
          }
      },error:()=>{
        this.dataSharing.hide()
        alert('Error Try Again')
      }
    })
  }
  onSaveOtp() {
    let email = this.email;

    let body = {
      email: email,
      otp: this.otp,
    };
    this.apiServic.verifyOtp(body).subscribe({
      next:(res)=>{
          if (res?.responseCode == 200) {
            this.resetPwdData = true;
            this.otpVerify = false
            this.resetPwdData = true
            this.dataSharing.hide()
            alert('OTP Verified Successfully');
          } else {
            alert(res?.error);
          }
      },error:()=>{
        this.dataSharing.hide()
        alert('Error Try Again')
      }
    })
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${paddedMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    /*  this.authService.loggedIn.next(false);
    this.authService.logged = false; */
    this.openModal = false;
  }
}
