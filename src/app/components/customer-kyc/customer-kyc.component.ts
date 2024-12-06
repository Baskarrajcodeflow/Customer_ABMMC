import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { KycService } from './kyc.service';
import { SpinnerService } from '../../B2C/spinner.service';
import { ApiService } from '../../B2C/ApiService/api.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { DatasharingService } from '../../services/datasharing.service';

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SpinnerComponent],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.scss',
})
export class CustomerKycComponent implements OnInit {
  agentForm: FormGroup;
  agentForm1!: FormGroup;
  kycForm: FormGroup;
  // userTypes = Object.values(MiPayAgent.UserTypeEnum);
  userTypeConst: any;
  typeAgent: any;
  isEnableParent: boolean = false;
  currentPage: number = 1;
  formValues: any;
  nationalities: any;
  provinces: any;
  districts: any;
  provinceId: any;
  selectedProvinceName: any;
  custPhoto_img_0: any;
  undertakenSign_img_0: any;
  minDate!: string;
  constructor(private fb: FormBuilder, private userService: KycService,
    private spinner: DatasharingService,private apiService:ApiService,
    private router:Router
  ) {
    this.agentForm = this.fb.group({
      id: [''],
      email: ['', Validators.email],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userType: ['AGENT'],
      role: [null],
      gender: [''],
      agentType: [''],
      accountType: ['AGENT'],
      password: [],
    });

    this.kycForm = this.fb.group({
      custInfoFirstName: ['', Validators.required],
      custInfoSurname: ['', Validators.required],
      custInfoFatherName: ['', Validators.required],
      custInfoDob: ['', Validators.required],
      custInfoMale: ['1'],
      custInfoCountry: [''],
      custInfoAltPhone: ['', Validators.required],
      custInfoEmail: ['', Validators.required],
      custInfoTazkira: ['', Validators.required],
      currHouseNo: [''],
      currLocation: [''],
      currProvince: [''],
      currStreet: [''],
      currDistrict: [''],
      currCountry: [''],
      occupation: [''],
      salary: [''],
      // empName: [''],
      nokName: [''],
      nokMobile: [''],
      nokEmail: [''],
      nokHouseNo: [''],
      nokLocation: [''],
      nokProvince: [''],
      nokStreet: [''],
      nokDistrict: [''],
      nokCountry: [''],
      // username:[''],
      // orgName: [''],
      // orgTypeOfActivity: ['', Validators.required],
      // orgSourceOfIncome: ['', Validators.required],
      // orgMonthlyIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // orgTurnover: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // orgHouseNo: ['', Validators.required],
      // orgLocation: ['', Validators.required],
      // orgProvince: ['', Validators.required],
      // orgStreet: ['', Validators.required],
      // orgDistrict: ['', Validators.required],
      // orgCountry: ['', Validators.required],
      // orgPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      // orgEmail: ['', [Validators.required, Validators.email]],
      // agentType:'AGENT'
    });
    // this.agentForm1 = new FormGroup({
    //   agentType: new FormControl(''),
    //   parent: new FormControl('')
    // });
  }

  ngOnInit(): void {
    this.getCountries();
    this.getProvinces();
    this.setMinDate()
  }

  getCountries() {
    this.userService.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      },
    });
  }

  getProvinces() {
    this.userService.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      },
    });
  }

  getDistricts(provinceId: number) {
    this.userService.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      },
    });
  }
  setMinDate() {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
    this.minDate = minDate.toISOString().split('T')[0];
  }
  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage--;
    }
  }
  onSelectProvince($event: any) {
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinces.filter(
      (province: any) => province.name === this.provinceId
    );
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
    }
    console.log(this.selectedProvinceName, 'this.provinceId');
    this.getDistricts(this.selectedProvinceName);
  }


  fileToUpload!: File;
  imageUrl: any;
  
  handleFileInput(file: any) {
    this.fileToUpload = file.files.item(0);
  
    // Show image preview
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

   
  signaturefileToUpload!: File;
  signatureimageUrl: any;
  signatureHandleFileInput(file: any) {
    this.signaturefileToUpload = file.files.item(0);

  let reader = new FileReader();
  reader.onload = (e: any) => {
    this.signatureimageUrl = e.target.result;
  };
  reader.readAsDataURL(this.signaturefileToUpload);
   
  }

  onSave() {
    let body = {
      kycInputs:this.kycForm.value,
      kycType: 'CUSTOMER',
    };
 
    this.spinner.show()
    this.userService.postKycDetails(body).subscribe({
      next:(res)=>{
          console.log(res);
          if (res?.responseCode == 200) {
            this.spinner.hide()
            let userId = sessionStorage.getItem('SenderUserId')
            if (this.fileToUpload) {
              this.custPhoto_img_0 = new FormData();
              this.custPhoto_img_0.append('file', this.fileToUpload, this.fileToUpload.name);
              this.spinner.show()
              this.apiService.CustomerkycProofUpload(this.custPhoto_img_0, 'custPhoto_img_0', userId).subscribe((res)=>{
                if(res?.responseCode == 200){
                  if (this.signaturefileToUpload) {
                    this.undertakenSign_img_0 = new FormData();
                    this.undertakenSign_img_0.append('file', this.signaturefileToUpload, this.signaturefileToUpload.name);
                    this.apiService.CustomerkycProofUpload(this.undertakenSign_img_0, 'undertakenSign_img_0', userId).subscribe((res)=>{
                     if(res?.responseCode == 200){
                     this.spinner.hide()
                     alert('Customer KYC Details Submitted Sccessfully')
                      this.router.navigateByUrl('/dashboard')
                     }
                    })
                  }
                }
              })
            }
          } else {
            alert(res?.error);
          }
      },error:()=>{
        this.spinner.hide()
       alert('Error Try Again!!!')
      }
    })
  }
}
