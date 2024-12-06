import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { of, concatMap, map, catchError, toArray } from 'rxjs';
import { IndividualKYCService } from '../../../services/kyc.service';
import { ApiService } from '../../ApiService/api.service';
import { AmlService } from '../../../services/aml.service';
import { UserService } from '../../../services/user.service';
import { CurrencyFormatPipe } from '../../../pipe/currency-format.pipe';
interface imageUpload {
  type: any;
  file: any;
}

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.scss',
})
export class CustomerKycComponents {
  public kycForm: FormGroup = new FormGroup({});
  public addKycForm: FormGroup = new FormGroup({});
  public firstName: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z]+$'),
    Validators.minLength(3),
  ]);
  public middleName: FormControl = new FormControl('', [
    Validators.pattern('^[a-zA-Z]+$'),
  ]);
  public surName: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z]+$'),
    Validators.minLength(3),
  ]);
  public fathername: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z]+'),
    Validators.minLength(3),
  ]);
  public dob: FormControl = new FormControl('', [
    Validators.required,
    this.ageValidator,
  ]);
  public birthPlace: FormControl = new FormControl('');
  public nationality: FormControl = new FormControl('', [Validators.required]);
  public idType: FormControl = new FormControl('', [Validators.required]);
  public tazkira: FormControl = new FormControl('', [Validators.required]);
  public issueDate: FormControl = new FormControl('');
  public custInfoPageNo: FormControl = new FormControl('');
  public custInfoBookNo: FormControl = new FormControl('');
  public custInfoRegistrationNo: FormControl = new FormControl('');
  public DateofExpiry: FormControl = new FormControl('');
  public accountOpening: FormControl = new FormControl('');
  public purpose: FormControl = new FormControl('');
  public gender: FormControl = new FormControl('', [Validators.required]);
  public maritalStatus: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public contactNo: FormControl = new FormControl('', [
    Validators.pattern('^7[0-9]{8}$'),
    Validators.required,
  ]);
  public email: FormControl = new FormControl('', [Validators.email]);
  public mmwalletNo: FormControl = new FormControl('', Validators.required);
  public employmentType: FormControl = new FormControl('', Validators.required);

  public MonthlyTurnover: FormControl = new FormControl('AFN  ');

  public houseNo: FormControl = new FormControl('');
  public location: FormControl = new FormControl('', [Validators.required]);
  public province: FormControl = new FormControl('', [Validators.required]);
  public street: FormControl = new FormControl('');
  public district: FormControl = new FormControl('', [Validators.required]);
  public country: FormControl = new FormControl('', [Validators.required]);

  public permanentHouseNo: FormControl = new FormControl('');
  public permanentLocation: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public permanentProvince: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public permanentStreet: FormControl = new FormControl('');
  public permanentDistrict: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public permanentCountry: FormControl = new FormControl('', [
    Validators.required,
  ]);

  public employerName: FormControl = new FormControl('', [Validators.required]);
  public occupation: FormControl = new FormControl('', [Validators.required]);
  public businessnature: FormControl = new FormControl('');

  public position: FormControl = new FormControl('', [Validators.required]);
  public service: FormControl = new FormControl('');
  public monthlyIncome: FormControl = new FormControl('AFN  ', [
    Validators.required,
    Validators.pattern('^[0-9]*\\.?[0-9]+$'),
    Validators.min(1),
  ]);
  public professionTurnover: FormControl = new FormControl('AFN  ', [
    Validators.required,
    Validators.pattern('^[0-9]*\\.?[0-9]+$'),
    Validators.min(1),
  ]);
  public professionTin: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public accCreationPurpose: FormControl = new FormControl('', [
    Validators.required,
  ]);

  public KINname: FormControl = new FormControl('', [Validators.required]);
  public KINfatherName: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public relationship: FormControl = new FormControl('', [Validators.required]);
  public KINmobile: FormControl = new FormControl('', [
    Validators.pattern('^7[0-9]{8}$'),
  ]);
  public KINlocation: FormControl = new FormControl('', [Validators.required]);
  public KINprovince: FormControl = new FormControl('', [Validators.required]);
  public KINdistrict: FormControl = new FormControl('', [Validators.required]);
  public KINcountry: FormControl = new FormControl('', [Validators.required]);

  public applicantName: FormControl = new FormControl('');
  public applicantDate: FormControl = new FormControl('');

  public KINmobileCountryCode: FormControl = new FormControl('');
  public password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  public cnfpwd: FormControl = new FormControl('', [Validators.required]);
  public custPhoto_img_0: FormControl = new FormControl('', [
    Validators.required,
  ]);
  public undertakenSign_img_0: FormControl = new FormControl('', [
    Validators.required,
  ]);

  isSubmitted: boolean = true;
  showBasic: boolean = true;
  showAddress: boolean = true;
  showProfession: boolean = true;
  watchListValue!: boolean;
  form: any;
  showKIN: boolean = true;
  countryList: any;
  countryValue: any;
  provinceList: any;
  provinceValue: any;
  showProvinceDrop: boolean = true;
  showProvinceText!: boolean;
  districtValue!: string;
  showDistrictDrop: boolean = true;
  showDistrictText!: boolean;
  districtList: any;
  countryId: any;
  provinceID: any;
  showProvinceDrop1: boolean = true;
  showProvinceText1!: boolean;
  showDistrictDrop1: boolean = true;
  showDistrictText1!: boolean;
  countryValue1: any;
  provinceReq: any;
  districtValue1: any;
  provinceValue1: any;
  districtReq: any;
  provinceReq1: any;
  districtReq1: any;
  uploadedImage: any;
  uploadedImageFileName: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData!: string | ArrayBuffer | null;
  imageValue: imageUpload[] = [];
  uploadedImage1: any;
  imageUrl: any;
  photoId: any;
  type!: string;
  uploadedImageFileType: any;
  uploadedImageFileType1: any;
  type1!: string;
  countryReq: any;
  countryReq1: any;
  file: any;
  file1: any;
  target: any;
  showIssue: boolean = false;
  showExpiry: boolean = false;
  count_name: any;
  country_name: any;
  country_id: any;
  country_id1: any;
  watchListReq!: boolean;
  riskReq: any;
  uploadedImageCustSign: any;
  uploadedImageUndertaken: any;
  uploadedImageAgent1: any;
  uploadedImageAgent2: any;
  uploadedImageABMMC1: any;
  uploadedImageABMMC2!: File;
  typeUndertaken!: string;
  typeAgent!: string;
  typeSP!: string;
  typeOperation!: string;
  typeCompl!: string;
  showAttachmentList!: boolean;
  attachementList: any[] = [];
  attachments: File[] = [];

  showAgentVerification: boolean = false;
  showABMMC: boolean = false;
  showUndertaken: boolean = false;
  showPermanentAddress: boolean = false;
  default: string = 'Afhganistan';
  countryVal: any;
  islamicDate!: string;
  selectedGregorianDate: any;
  isFormValid: boolean = false;
  dateOfBirth!: string | number | Date;
  maxDate: string;
  isAgeValid!: boolean;
  islamicDOB: any;
  gregorianDate: any;
  islamicYear: any;
  formattedIslamicDate: any;
  monthName!: string;
  dobReq: any;
  isAgeInvalid!: boolean;
  islamicMonthValue: any;
  islamicYearValue: any;
  formattedDate: any;
  monthValue!: string;
  dayValue!: string;
  formGroup!: FormGroup;
  currentDate!: string;
  priv1: any;
  showAgentverify!: boolean;
  showABMMCverify!: boolean;
  islamicDayValue!: string;
  day!: number;
  fullName!: string;
  firstNameVal: any;
  surNameVal: any;
  firstNameControl!: AbstractControl<any, any> | null;
  @Output() save = new EventEmitter<any>();
  @Output() saveBasicDetails = new EventEmitter<any>();
  showSdnModal = false;
  sdnName = '';
  sdnResponse: any;
  surnameControl!: AbstractControl<any, any> | null;
  genderValue: any;
  request: any;
  customerData: any;
  customerId: any;
  req: any;
  employeementStatus: any;
  showProffessional: boolean = false;
  showBusiness: boolean = false;
  showadditionalDetails: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  isLoading: boolean = false;
  signatureUploaded: boolean = false;
  photoUploaded: boolean = false;
  searchResult: any;
  showModal = false;
  sdnDetails: any;

  //Latest changes
  formTabs: string[] = [];
  tab!: string;
  identityDetailsForm!: FormGroup<{
    customerFirstName: FormControl<string | null>;
    customerLastName: FormControl<string | null>;
    customerFatherName: FormControl<string | null>;
    customerDOB: FormControl<string | null>;
    customerGender: FormControl<string | null>;
    customerMaritialStatus: FormControl<string | null>;
    customerEmail: FormControl<string | null>;
    customerAlternatePhone: FormControl<string | null>;
    customerNationality: FormControl<string | null>;
    customerBirthCountry: FormControl<string | null>;
    customerBirthProvince: FormControl<string | null>;
    employmentType: FormControl<string | null>;
    idType: FormControl<string | null>;
    phone: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  addressDetailsForm!: FormGroup<{
    currentLocation: FormControl<string | null>;
    currentDistrict: FormControl<string | null>;
    currentProvince: FormControl<string | null>;
    currentCountry: FormControl<string | null>;
    permanantDistrict: FormControl<string | null>;
    permanantProvince: FormControl<string | null>;
    permanantCountry: FormControl<string | null>;
  }>;
  occupationDetailsForm: any;
  currentTab: number = 0;
  nationalities: any;
  provinces: any;
  districts: any;
  proofsDetailsForm!: any;
  nextOfKinDetailsForm!: FormGroup<{
    fullName: FormControl<string | null>;
    fatherName: FormControl<string | null>;
    relationship: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    location: FormControl<string | null>;
  }>;
  natureofBusinesses: any;
  attachedFiles: { [key: string]: File } = {};
  fileName!: string;
  isPasswordVisible: boolean = false;

  constructor(
    private corporate: ApiService,
    private addKyc: IndividualKYCService,
    private amlService: AmlService,
    private userService: UserService,
    private currencyFormatPipe: CurrencyFormatPipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split('T')[0];
  }

  ngOnInit(): void {
    this.customerId = sessionStorage.getItem('SenderUserId')
    this.formTabs = [
      'Basic Info',
      'Address Details',
      'Occupation Details',
      'Next of Kin Details',
      'Proofs',
      'Final Submission',
    ];
    this.tab = 'Basic Info';
    this.initForm();
    this.getCountries();
    this.getDistricts;
    this.getProvinces();
    this.getNatureofBusiness();

    this.identityDetailsForm
      .get('employmentType')
      ?.valueChanges.subscribe((type) => {
        this.setOccupationDetails(type);
      });
    this.identityDetailsForm.get('idType')?.valueChanges.subscribe((type) => {
      this.setProofTypeDetails(type);
    });

    //old changes
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.getProvinceList();
    let defaultId = 'MARRIED';
    this.addKycForm.controls['maritalStatus'].setValue(defaultId);
    let defaultId1 = 'SINGLE';
    this.addKycForm.controls['maritalStatus'].setValue(defaultId1);
    let defaultId2 = 'FEMALE';
    this.addKycForm.controls['gender'].setValue(defaultId2);
    let defaultId3 = 'MALE';
    this.addKycForm.controls['gender'].setValue(defaultId3);
    this.priv1 = sessionStorage.getItem('setPrivileges');
    let privileges = JSON.parse(this.priv1);
    if (privileges?.agentVerificationForCustomerKyc) {
      this.showAgentverify = true;
    } else {
      this.showAgentverify = false;
    }
    if (privileges?.abmmcVerificationForCustomerKyc) {
      this.showABMMCverify = true;
    } else {
      this.showABMMCverify = false;
    }
    const firstNameControl = this.addKycForm.get('firstName');
    if (firstNameControl) {
      firstNameControl.valueChanges.subscribe(() => {
        this.updateApplicantName();
      });
    }
    const surNameControl = this.addKycForm.get('surName');
    if (surNameControl) {
      surNameControl.valueChanges.subscribe(() => {
        this.updateApplicantName();
      });
    }
  }

  ageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);

      return isUnderage ? { underage: { value: control.value } } : null;
    };
  }

  initForm() {
    (this.identityDetailsForm = this.fb.group({
      customerFirstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ],
      customerLastName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ],
      customerFatherName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ],
      //customerMMWallet : ['', Validators.required],
      customerDOB: ['', [Validators.required, this.ageValidator()]],
      customerGender: ['', Validators.required],
      customerMaritialStatus: ['', Validators.required],

      customerEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
      ],
      customerAlternatePhone: [
        '',
        [Validators.required, Validators.pattern(/.*(7\d{8})$/)],
      ],
      customerNationality: ['', Validators.required],
      customerBirthCountry: ['', Validators.required],
      customerBirthProvince: ['', Validators.required],
      employmentType: ['', Validators.required],
      idType: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      password: ['', Validators.required],
    })),
      (this.addressDetailsForm = this.fb.group({
        currentLocation: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
        ], // Alphanumeric
        currentProvince: ['', [Validators.required]],
        currentDistrict: ['', [Validators.required]],
        currentCountry: ['', [Validators.required]],
        permanantDistrict: ['', [Validators.required]],
        permanantProvince: ['', [Validators.required]],
        permanantCountry: ['', [Validators.required]],
        //addressProof: ['', [Validators.required]],
      })),
      (this.occupationDetailsForm = this.fb.group({})),
      (this.nextOfKinDetailsForm = this.fb.group({
        fullName: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
        fatherName: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
        relationship: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/.*(7\d{8})$/)],
        ],
        location: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
      })),
      (this.proofsDetailsForm = this.fb.group({}));
  }

  // Method to adjust fields based on employment type using formBuilder.group()
  setOccupationDetails(type: string | null): void {
    this.occupationDetailsForm.reset();
    this.occupationDetailsForm.clearValidators();
    this.occupationDetailsForm.updateValueAndValidity();

    // Replace 'occupationDetails' control with new configuration based on the type
    switch (type) {
      case 'EMPLOYED':
        this.occupationDetailsForm = this.fb.group({
          sourceOfIncome: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          employerName: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          positionHeld: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          monthlyIncome: ['', Validators.required],
          monthlyTurnover: ['', Validators.required],
          tinNumber: ['', Validators.pattern(/^[0-9]+$/)],
        });

        break;

      case 'SELF_EMPLOYED':
        this.getNatureofBusiness();
        this.occupationDetailsForm = this.fb.group({
          sourceOfIncome: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          natureofBusiness: ['', Validators.required],
          monthlyIncome: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
          monthlyTurnover: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
        });

        break;

      case 'GOVT_EMPLOYED':
        this.occupationDetailsForm = this.fb.group({
          sourceOfIncome: [
            'Salary',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ], // Default value "Salary"
          govtOrganizationName: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          govtPositionHeld: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          monthlyIncome: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
          monthlyTurnover: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
          tinNumber: ['', Validators.pattern(/^[0-9]*$/)],
        });

        break;

      case 'UNEMPLOYED':
        this.occupationDetailsForm = this.fb.group({
          sourceOfFund: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          monthlyTurnover: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
        });

        break;

      default:
        // Clear 'occupationDetails' control if no occupation type is selected
        break;
    }
  }

  setProofTypeDetails(type: string | null): void {
    // const proofsDetailsGroup = this.proofsDetailsForm as FormGroup;

    // Clear existing fields
    this.proofsDetailsForm.reset();
    this.proofsDetailsForm.clearValidators();
    this.proofsDetailsForm.updateValueAndValidity();

    // Set the appropriate fields for each id type
    switch (type) {
      case 'E_TAZKIRA':
        this.proofsDetailsForm = this.fb.group({
          purposeofAcoount: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
          dateofIsuue: ['', Validators.required],
          dateofExpiry: ['', Validators.required],
        });

        break;

      case 'PAPER_TAZKIRA':
        this.proofsDetailsForm = this.fb.group({
          purposeofAcoount: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
          pageNumber: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
          bookNumber: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
          regNumber: [
            '',
            [Validators.required, Validators.pattern(/^[0-9]*$/)],
          ],
        });

        break;

      case 'PASSPORT':
        this.proofsDetailsForm = this.fb.group({
          purposeofAcoount: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
          ],
          idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
          dateofIsuue: ['', Validators.required],
          dateofExpiry: ['', Validators.required],
        });

        break;

      default:
        // Clear all controls if no specific type is selected
        this.proofsDetailsForm = this.fb.group({});
        break;
    }
  }
  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = i;

    //tabDisabled = true;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
  }

  showFilename(formControlName: string) {
    if (this.attachedFiles[formControlName]) {
      return true;
    } else {
      return false;
    }
  }

  onFileSelected(event: any, formControlName: string, tab: string) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      console.log(this.attachedFiles);
      const file = event.target.files[0];
      this.attachedFiles[formControlName] = file;
      this.file1 = file;
      this.fileName = formControlName;
      console.log('this.attachedFiles', this.attachedFiles);
    }
  }

  formCompleted(section: string) {
    if (section === 'Basic Info') {
      return this.identityDetailsForm.valid;
    } else if (section === 'Address Details') {
      return this.addressDetailsForm.valid;
    } else if (
      section === 'Occupation Details' &&
      this.identityDetailsForm.get('employmentType')?.value
    ) {
      return this.occupationDetailsForm.valid;
    } else if (section === 'Next of Kin Details') {
      return this.nextOfKinDetailsForm.valid;
    } else if (
      section === 'Proofs' &&
      this.identityDetailsForm.get('idType')?.value
    ) {
      return this.proofsDetailsForm.valid;
    } else {
      return false;
    }
  }

  previousTab(tab: string) {
    let index = this.formTabs.indexOf(tab);
    console.log();

    this.selectedTab(this.formTabs[--index], --index);
  }
  nextTab(tab: string) {
    let index = this.formTabs.indexOf(tab);
    if (tab == 'Basic Info') {
      this.registerCustomer();
    } else {
      this.updateCustomer(tab);
    }

    this.selectedTab(this.formTabs[++index], ++index);
  }
  //old(fathima)
  // UploadPhoto() {
  //   const fileMappings = [
  //     { key: 'photo', mapping: 'custPhoto', file: this.attachedFiles['photo'] },
  //     { key: 'digitalSign', mapping: 'custSignaturePhoto', file: this.attachedFiles['digitalSign'] },
  //     { key: 'docFront', mapping: 'custProofFrontPhoto', file: this.attachedFiles['docFront'] },
  //     { key: 'docBack', mapping: 'custProofBackPhoto', file: this.attachedFiles['docBack'] }
  //   ].filter(({ file }) => file);  // Filter out any undefined files

  //   console.log(fileMappings);

  //   return of(...fileMappings).pipe(
  //     concatMap(({ mapping, file }) => {
  //       return this.corporate.addCustomerProof(this.customerId, mapping, file).pipe(
  //         map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
  //         catchError(error => {
  //           console.error("Error submitting file", error);
  //           return of(false); // Return `false` instead of `null` to indicate failure
  //         })
  //       );
  //     }),
  //     toArray(),
  //     map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
  //   );

  // }
  //2
  // UploadPhoto() {
  //   const fileMappings = [
  //     { key: 'photo', mapping: 'custPhoto', file: this.attachedFiles['photo'] },
  //     // { key: 'profilePhoto', mapping: 'custPhoto', file: this.attachedFiles['profilePhoto'] },
  //     { key: 'digitalSign', mapping: 'custSignaturePhoto', file: this.attachedFiles['digitalSign'] },
  //     { key: 'docFront', mapping: 'custProofFrontPhoto', file: this.attachedFiles['docFront'] },
  //     { key: 'docBack', mapping: 'custProofBackPhoto', file: this.attachedFiles['docBack'] }
  //   ].filter(({ file }) => file); // Filter out any undefined files

  //   console.log(fileMappings);

  //   const profilePhotoFile = this.attachedFiles['profilePhoto'];

  //   const uploadTasks = [
  //     profilePhotoFile
  //       ? this.corporate.addCustomerProfilePhoto(profilePhotoFile).pipe(
  //         map((response: any) => response?.responseCode === 200), // Check success for profile photo
  //         catchError(error => {
  //           console.error("Error uploading profile photo", error);
  //           return of(false); // Return `false` if upload fails
  //         })
  //       )
  //       : of(true), // If no profile photo, mark as success

  //     ...fileMappings.map(({ mapping, file }) =>
  //       this.corporate.addCustomerProof(file, mapping, this.customerId).pipe(
  //         map((response: any) => response?.responseCode === 200), // Map to `true` if successful
  //         catchError(error => {
  //           console.error("Error submitting file", error);
  //           return of(false); // Return `false` for errors
  //         })
  //       )
  //     )
  //   ];

  //   return forkJoin(uploadTasks).pipe(
  //     map((results: boolean[]) => results.every(success => success)) // Return `true` only if all uploads succeed
  //   );
  // }
  UploadPhoto() {
    const profilePhotoFile = this.attachedFiles['profilePhoto'];
    const custPhoto = this.attachedFiles['photo'];
    const digitalSignFile = this.attachedFiles['digitalSign'];
    const docFrontFile = this.attachedFiles['docFront'];
    const docBackFile = this.attachedFiles['docBack'];

    if (!profilePhotoFile) {
      console.error('Profile photo file is required');
      return of(false); // Return early if no profile photo is provided
    }

    return this.corporate.addCustomerProfilePhoto(profilePhotoFile).pipe(
      concatMap((digitalSignResponse: any) => {
        if (digitalSignResponse?.responseCode !== 200) {
          throw new Error('Digital signature upload failed');
        }
        console.log('Digital signature uploaded successfully');
        return this.corporate.addCustomerProof(
          docFrontFile,
          'custPhoto',
          this.customerId
        );
      }),
      concatMap((profileResponse: any) => {
        if (profileResponse?.responseCode !== 200) {
          throw new Error('Profile photo upload failed');
        }
        console.log('Profile photo uploaded successfully');
        return this.corporate.addCustomerProof(
          digitalSignFile,
          'custSignaturePhoto',
          this.customerId
        );
      }),
      concatMap((digitalSignResponse: any) => {
        if (digitalSignResponse?.responseCode !== 200) {
          throw new Error('Digital signature upload failed');
        }
        console.log('Digital signature uploaded successfully');
        return this.corporate.addCustomerProof(
          docFrontFile,
          'custProofFrontPhoto',
          this.customerId
        );
      }),
      concatMap((docFrontResponse: any) => {
        if (docFrontResponse?.responseCode !== 200) {
          throw new Error('Document front upload failed');
        }
        console.log('Document front uploaded successfully');
        return this.corporate.addCustomerProof(
          docBackFile,
          'custProofBackPhoto',
          this.customerId
        );
      }),
      map((docBackResponse: any) => {
        if (docBackResponse?.responseCode !== 200) {
          throw new Error('Document back upload failed');
        }
        console.log('Document back uploaded successfully');
        return true; // All uploads succeeded
      }),
      catchError((error) => {
        console.error('Error during upload sequence:', error);
        return of(false); // Return `false` on any failure
      })
    );
  }
  updateCustomer(tab: string) {
    this.isLoading = true;
    let request = {};
    if (tab == 'Address Details') {
      console.log('Address', this.addressDetailsForm);
      request = {
        kycType: 'CUSTOMER',
        submittedFor: this.customerId,
        kycInputs: {
          currLocation: this.addressDetailsForm.value.currentLocation,
          currCountry: this.addressDetailsForm.value.currentCountry,
          currProvince: this.addressDetailsForm.value.currentProvince,
          currProvinceId: 0,
          currDistrict: this.addressDetailsForm.value.currentDistrict,
          currDistrictId: 0,
          permCountry: this.addressDetailsForm.value.permanantCountry,
          permProvince: this.addressDetailsForm.value.permanantProvince,
          permProvinceId: 0,
          permDistrict: this.addressDetailsForm.value.permanantDistrict,
          permDistrictId: 0,
        },
      };
    } else if (tab == 'Occupation Details') {
      console.log('Occupation', this.occupationDetailsForm);
      request = {
        kycType: 'CUSTOMER',
        submittedFor: this.customerId,
        kycInputs: {
          employmentType: this.identityDetailsForm.value.employmentType,
          employerName: this.occupationDetailsForm.value?.employerName,
          sourceOfIncome: this.occupationDetailsForm.value?.sourceOfIncome,
          positionHeld: this.occupationDetailsForm.value?.positionHeld,
          periodOfService: 0,
          monthlyTurnover:
            (this.occupationDetailsForm.controls['monthlyTurnover'] as any)[
              'rawValue'
            ] ?? this.occupationDetailsForm.controls['monthlyTurnover'].value,
          monthlyIncome:
            (this.occupationDetailsForm.controls['monthlyIncome'] as any)[
              'rawValue'
            ] ?? this.occupationDetailsForm.controls['monthlyIncome'].value,
          tinNumber: this.occupationDetailsForm.value?.tinNumber,
          bizNature: this.occupationDetailsForm.value?.natureofBusiness,
          govtOrgName: this.occupationDetailsForm.value?.govtOrganizationName,
          govtPositionHeld: this.occupationDetailsForm.value?.govtPositionHeld,
        },
      };
      console.log('Occupation', this.occupationDetailsForm);
    } else if (tab == 'Next of Kin Details') {
      console.log('next of kin', this.nextOfKinDetailsForm);

      request = {
        kycType: 'CUSTOMER',
        submittedFor: this.customerId,
        kycInputs: {
          nokName: this.nextOfKinDetailsForm.value.fullName,
          nokFatherName: this.nextOfKinDetailsForm.value.fatherName,
          nokRelationship: this.nextOfKinDetailsForm.value.relationship,
          nokPhone: this.nextOfKinDetailsForm.value.phoneNumber,
          nokLocation: this.nextOfKinDetailsForm.value.location,
        },
      };
    }
    // else if (tab == 'Proofs') {
    //   console.log("proofs", this.proofsDetailsForm);

    //   request = {
    //     "kycType": "CUSTOMER",
    //     "submittedFor": this.customerId,
    //     "kycInputs": {
    //       "purposeOfAcc": this.proofsDetailsForm.value?.purposeofAcoount,
    //       "custProofType": this.identityDetailsForm.value.idType,
    //       "custProofNumber": this.proofsDetailsForm.value?.idNumber,
    //       "custProofDateOfIssue": this.proofsDetailsForm.value?.dateofIsuue,
    //       "custProofDateOfExpiry": this.proofsDetailsForm.value?.dateofExpiry,
    //       "tazkiraPageNo": this.proofsDetailsForm.value?.pageNumber,
    //       "tazkiraRegNo": this.proofsDetailsForm.value?.regNumber,
    //       "tazkiraBookNo": this.proofsDetailsForm.value?.bookNumber
    //     }
    //   }
    //   this.UploadPhoto();
    // }
    else if (tab === 'Proofs') {
      console.log('proofs', this.proofsDetailsForm);

      // Build the KYC update request object
      const request = {
        kycType: 'CUSTOMER',
        submittedFor: this.customerId,
        kycInputs: {
          purposeOfAcc: this.proofsDetailsForm.value?.purposeofAcoount,
          custProofType: this.identityDetailsForm.value?.idType,
          custProofNumber: this.proofsDetailsForm.value?.idNumber,
          custProofDateOfIssue: this.proofsDetailsForm.value?.dateofIsuue,
          custProofDateOfExpiry: this.proofsDetailsForm.value?.dateofExpiry,
          tazkiraPageNo: this.proofsDetailsForm.value?.pageNumber,
          tazkiraRegNo: this.proofsDetailsForm.value?.regNumber,
          tazkiraBookNo: this.proofsDetailsForm.value?.bookNumber,
        },
      };

      // Step 1: Upload Photos
      this.UploadPhoto().subscribe((uploadSuccess: boolean) => {
        if (uploadSuccess) {
          // Step 2: Call the customerKYCUpdate API
          this.corporate.customerKYCUpdate(request).subscribe(
            (response: any) => {
              if (response?.responseCode === 200) {
                console.log('KYC Update successful');
                // Notify success or update UI as needed
              } else {
                console.error('KYC Update failed', response);
                // Notify user about failure
              }
            },
            (error) => {
              console.error('Error calling customerKYCUpdate API', error);
              // Handle API error
            }
          );
        } else {
          console.error('File uploads failed');
          // Notify user about the upload failure
        }
      });
    }

    this.corporate.customerKYCUpdate(request).subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something went wrong');
      },
    });
  }
  completeCustomerKYC() {
    this.isLoading = true;

    this.corporate.completeRegisterKYC(this.customerId).subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoading = false;
          alert('KYC Submitted Successfully');
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something went wrong');
      },
    });
  }
  registerCustomer() {
    this.isLoading = true;
   
    this.customerKYCBasic();
  }
  customerKYCBasic() {
    let request = {
      kycType: 'CUSTOMER',
      submittedFor: this.customerId,
      kycInputs: {
        custInfoFirstName: this.identityDetailsForm.value.customerFirstName,
        custInfoLastName: this.identityDetailsForm.value.customerLastName,
        custInfoFatherName: this.identityDetailsForm.value.customerFatherName,
        custInfoDob: this.identityDetailsForm.value.customerDOB,
        custInfoGender: this.identityDetailsForm.value.customerGender,
        custInfoMaritalStatus:
          this.identityDetailsForm.value.customerMaritialStatus,
        custInfoAltPhone: this.identityDetailsForm.value.customerAlternatePhone,
        custInfoEmail: this.identityDetailsForm.value.customerEmail,
        custInfoNationality: this.identityDetailsForm.value.customerNationality,
        custInfoBirthCountry:
          this.identityDetailsForm.value.customerBirthCountry,
        custInfoBirthProvince:
          this.identityDetailsForm.value.customerBirthProvince,
        currLocation: this.addressDetailsForm.value.currentLocation,
        currCountry: this.addressDetailsForm.value.currentCountry,
        currProvince: this.addressDetailsForm.value.currentProvince,
        currProvinceId: this.addressDetailsForm.value.currentProvince,
        currDistrict: this.addressDetailsForm.value.currentDistrict,
        currDistrictId: this.addressDetailsForm.value.currentDistrict,
        permCountry: this.addressDetailsForm.value.permanantCountry,
        permProvince: this.addressDetailsForm.value.permanantProvince,
        permProvinceId: this.addressDetailsForm.value.permanantProvince,
        permDistrict: this.addressDetailsForm.value.permanantDistrict,
        permDistrictId: this.addressDetailsForm.value.permanantDistrict,
        employmentType: this.identityDetailsForm.value.employmentType,
        employerName: this.occupationDetailsForm.value?.employerName,
        sourceOfIncome: this.occupationDetailsForm.value?.sourceOfIncome,
        positionHeld: this.occupationDetailsForm.value?.positionHeld,
        periodOfService: 0,
        monthlyTurnover: this.occupationDetailsForm.value?.monthlyTurnover,
        monthlyIncome: this.occupationDetailsForm.value?.monthlyIncome,
        tinNumber: this.occupationDetailsForm.value?.tinNumber,
        bizNature: this.occupationDetailsForm.value?.natureofBusiness,
        govtOrgName: this.occupationDetailsForm.value?.govtOrganizationName,
        govtPositionHeld: this.occupationDetailsForm.value?.govtPositionHeld,
        nokName: this.nextOfKinDetailsForm.value.fullName,
        nokFatherName: this.nextOfKinDetailsForm.value.fatherName,
        nokRelationship: this.nextOfKinDetailsForm.value.relationship,
        nokPhone: this.nextOfKinDetailsForm.value.phoneNumber,
        nokLocation: this.nextOfKinDetailsForm.value.location,
        purposeOfAcc: this.proofsDetailsForm.value?.purposeofAcoount,
        custProofType: this.identityDetailsForm.value.idType,
        custProofNumber: this.proofsDetailsForm.value?.idNumber,
        custProofDateOfIssue: this.proofsDetailsForm.value?.dateofIsuue,
        custProofDateOfExpiry: this.proofsDetailsForm.value?.dateofExpiry,
        tazkiraPageNo: this.proofsDetailsForm.value?.pageNumber,
        tazkiraRegNo: this.proofsDetailsForm.value?.regNumber,
        tazkiraBookNo: this.proofsDetailsForm.value?.bookNumber,
      },
    };
    this.corporate.customerKYCSubmit(request).subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something went wrong');
      },
    });
  }

  resetForm(section: string) {
    if (section === 'Basic Info') {
      this.identityDetailsForm.reset();
    } else if (section === 'Address Details') {
      this.addressDetailsForm.reset();
    } else if (section === 'Occupation Details') {
      this.occupationDetailsForm.reset();
    } else if (section === 'Next of Kin Details') {
      this.nextOfKinDetailsForm.reset();
    } else if (section === 'Proofs') {
      this.proofsDetailsForm.reset();
    }
  }
  restrictInput(event: KeyboardEvent) {
    const key = event.key;

    // Allow letters, backspace, and space
    const allowedKeys = /^[a-zA-Z\s]$/;

    const navigationKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Delete',
      'Enter',
    ];

    // If the key is not a letter or a navigation key, prevent the default behavior
    if (!allowedKeys.test(key) && !navigationKeys.includes(key)) {
      event.preventDefault();
    }
  }
  formatCurrency(form: FormGroup, formControlName: string): string | null {
    const formCurrency = form.get(formControlName);
    if (formCurrency) {
      const value = formCurrency.value;
      if (value) {
        (formCurrency as any)['rawValue'] = value;
        const formattedValue = this.currencyFormatPipe.transform(value);
        console.log('formatted AFN', formattedValue);
        formCurrency.setValue(formattedValue);
      }
      return (formCurrency as any)['rawValue'] ?? formCurrency.value;
    }
    return null;
  }

  restrictToNumbers(event: KeyboardEvent) {
    const key = event.key;

    // Allow numbers (0-9)
    const isNumber = /^[0-9]$/.test(key);

    // Allow necessary navigation keys like backspace, delete, arrows, etc.
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Delete',
      'Enter',
    ];

    // Prevent any key that is not a number or a navigation key
    if (!isNumber && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }
  onKeyPressNoAlphabet(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      // Prevent input if the pressed key is an alphabet character (ASCII range: 65-90, 97-122)
      event.preventDefault();
    }
  }
  getFirstName($event: any) {
    this.firstNameVal = $event.target.value;
  }

  getSurName($event: any) {
    this.surNameVal = $event.target.value;
    console.log('surNameVal', this.surNameVal);
  }

  updateApplicantName(): void {
    const firstNameControl = this.addKycForm.get('firstName');
    const surNameControl = this.addKycForm.get('surName');
    // Check if the controls exist before accessing their values
    if (firstNameControl && surNameControl) {
      const firstName = firstNameControl.value;
      const surName = surNameControl.value;
      // Concatenate first name and surname
      const fullName = firstName + ' ' + surName;
      // Set the value of the applicantName field
      const applicantNameControl = this.addKycForm.get('applicantName');
      if (applicantNameControl) {
        applicantNameControl.setValue(fullName);
      }
    }
  }

  onDateChange() {
    if (this.dob.value) {
      const birthDate = new Date(this.dob.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        this.isAgeInvalid = true;
      } else {
        this.isAgeInvalid = false;
      }
    }
  }

  //age18
  validateAge() {
    const today = new Date();
    const dob = new Date(this.dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      this.isAgeValid = age >= 18; // Update isAgeValid flag based on age validation
    } else {
      this.isAgeValid = age > 18; // Update isAgeValid flag based on age validation
    }
  }

  fileTypeValidator(allowedTypes: string[]) {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const fileType = file.name.split('.').pop().toLowerCase();
        if (allowedTypes.indexOf(fileType) === -1) {
          return {
            invalidFileType: true,
          };
        }
      }
      return null;
    };
  }

  onCheckedRisk($event: any) {
    if ($event.target.value == 'low') {
      this.riskReq = 'LOW';
    }
    if ($event.target.value == 'medium') {
      this.riskReq = 'MEDIUM';
    }
    if ($event.target.value == 'high') {
      this.riskReq = 'HIGH';
    }
  }

  public onCheckedWatchlist($event: any) {
    if ($event.target.value == 'true') {
      this.watchListReq = true;
    } else {
      this.watchListReq = false;
    }
  }

  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      },
    });
  }

  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      },
    });
  }
  getNatureofBusiness() {
    this.corporate.getAllFirmType().subscribe({
      next: (data: any) => {
        this.natureofBusinesses = data?.data;
      },
    });
  }

  onSelectProvince($event: any) {
    let provinceId = $event.target.value;
    let selectedProvinceName;
    const filteredProvinces = this.provinces.filter(
      (province: any) => province.name === provinceId
    );
    if (filteredProvinces && filteredProvinces.length > 0) {
      selectedProvinceName = filteredProvinces[0].id;
    }
    this.getDistricts(selectedProvinceName);
  }
  getDistricts(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      },
    });
  }

  onChangeCountry($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.countryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
    if (this.country_id == 1) {
      this.showProvinceDrop = true;
      this.showProvinceText = false;
    } else {
      this.showProvinceText = true;
      this.showProvinceDrop = false;
      this.showDistrictText = true;
      this.showDistrictDrop = false;
      this.provinceReq = this.province.value;
      this.districtReq = this.district.value;
    }
  }

  getProvinceList() {
    this.countryId = 1;
    this.userService.getprovinces().subscribe((data: any) => {
      this.provinceList = data?.data;
    });
  }

  onChangeProvince($event: any) {
    this.provinceValue = $event.target.value;
    console.log('provinceValue', this.provinceValue);
    for (let item of this.provinceList) {
      if (this.provinceValue == item?.name) {
        this.provinceReq = item?.id;
        console.log('provinceReq', this.provinceReq);
      }
    }
    if (this.provinceReq) {
      this.showDistrictDrop = true;
      this.showDistrictText = false;
    } else {
      this.showDistrictText = true;
      this.showDistrictDrop = false;
    }
    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    });
  }

  onChangeDistrict($event: any) {
    this.districtValue = $event.target.value;
    for (let item of this.districtList) {
      if (this.districtValue == item?.id) {
        this.districtReq = item?.name;
      }
    }
  }

  onChangeCountry1($event: any) {
    this.countryValue1 = $event.target.value;
    console.log('countryValue1', this.countryValue1);
    for (let item of this.countryList) {
      if (this.countryValue1 == item?.name) {
        this.country_id1 = item?.id;
      }
    }
    if (this.country_id1 == 1) {
      this.showProvinceDrop1 = true;
      this.showProvinceText1 = false;
    } else {
      this.showProvinceText1 = true;
      this.showProvinceDrop1 = false;
      this.showDistrictText1 = true;
      this.showDistrictDrop1 = false;
      this.provinceReq1 = this.permanentProvince.value;
      this.districtReq1 = this.permanentDistrict.value;
    }
  }

  onChangeProvince1($event: any) {
    this.provinceValue1 = $event.target.value;
    for (let item of this.provinceList) {
      if (this.provinceValue1 == item?.name) {
        this.provinceReq1 = item?.id;
      }
    }
    if (this.provinceReq1) {
      this.showDistrictDrop1 = true;
      this.showDistrictText1 = false;
    } else {
      this.showDistrictText1 = true;
      this.showDistrictDrop1 = false;
    }
    this.addKyc
      .getDistrictListPeraddress(this.provinceReq1)
      .subscribe((data: any) => {
        this.districtList = data?.response;
      });
  }

  onChangeDistrict1($event: any) {
    this.districtValue1 = $event.target.value;
  }

  onChangeSelectPass($event: any) {
    this.target = $event.target.value;
    if (this.target == 'taskira') {
      this.showIssue = false;
      this.showExpiry = false;
    } else if (this.target == 'passport') {
      this.showIssue = true;
      this.showExpiry = true;
    }
  }

  //cust photo
  detectFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImage = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType = event.target.files[0].type;
      this.uploadedImageFileNameExtension = event.target.files[0].name
        .split('.')
        .pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: 'PHOTO',
        file: this.uploadedImage,
      };
      this.imageValue.push(Req);
    }, 1800);
  }

  //cust sign
  detectFiles1(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageCustSign = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type;
      this.uploadedImageFileNameExtension = event.target.files[0].name
        .split('.')
        .pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
  }

  detectFilesUndertaken(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageUndertaken = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type;
      this.uploadedImageFileNameExtension = event.target.files[0].name
        .split('.')
        .pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: 'SIGNATURE',
        file: this.uploadedImage1,
      };
      this.imageValue.push(Req);
    }, 1800);
  }

  detectFilesAgent1(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageAgent1 = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type;
      this.uploadedImageFileNameExtension = event.target.files[0].name
        .split('.')
        .pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: 'SIGNATURE',
        file: this.uploadedImage1,
      };
      this.imageValue.push(Req);
    }, 1800);
  }

  detectFilesAgent2(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageAgent2 = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type;
      this.uploadedImageFileNameExtension = event.target.files[0].name
        .split('.')
        .pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: 'SIGNATURE',
        file: this.uploadedImage1,
      };
      this.imageValue.push(Req);
    }, 1800);
  }

  onChangeUpload(event: any) {
    let file: File = event.target.files[0];
    if (file) {
      // Check if the selected file type is allowed
      if (this.isFileAllowed(file)) {
        // File type is allowed
        this.file1 = event.target.files[0];
        if (!this.attachementList.includes(this.file1)) {
          this.attachementList.push(this.file1);
          // console.log("File List", this.file1.name);
        } else {
          alert('File already selected');
        }
        this.showAttachmentList = true;
      } else {
        // File type is not allowed
        alert('File type not allowed');
      }
    }
  }

  isFileAllowed(file: File): boolean {
    let allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(file.type);
  }

  removeFile(index: any) {
    this.attachementList.splice(index, 1);
  }

  onGenderChange($event: any) {
    this.genderValue = $event.target.value;
    if (this.genderValue === '1') {
      this.addKycForm.removeControl('custInfoFemale');
      this.addKycForm.addControl('custInfoMale', this.formBuilder.control('1'));
    } else if (this.genderValue === '2') {
      this.addKycForm.removeControl('custInfoMale');
      this.addKycForm.addControl(
        'custInfoFemale',
        this.formBuilder.control('1')
      );
    } else {
      this.addKycForm.removeControl('custInfoMale');
      this.addKycForm.removeControl('custInfoFemale');
    }
    // this.addKycForm.removeControl('gender');
  }

  onChangeStatus($event: any) {
    this.employeementStatus = $event.target.value;
    if (this.employeementStatus == 'employed') {
      this.showProffessional = true;
    } else if (this.employeementStatus == 'self-employed') {
      this.showProffessional = this.showBusiness = true;
      //this.showPr
    } else {
      this.showProffessional = this.showBusiness = false;
    }
  }
  onChangetypeID($event: any) {
    this.employeementStatus = $event.target.value;
    if ($event.target.value == 'tazkira') {
      this.showadditionalDetails = true;
    }
  }

  retryUploadSignature() {
    this.type1 = 'undertakenSign_img_0';
    this.addKyc
      .uploadImage(this.uploadedImageUndertaken, this.type1, this.customerId)
      .subscribe({
        next: (data: any) => {
          if (data?.responseCode == 200) {
            this.signatureUploaded = true;
            this.isLoading = false;
            alert('Customer created successfully');
            this.addKycForm.reset();
          } else {
            this.isLoading = false;
            alert('Undertaken signature upload failed, please try again.');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Undertaken signature upload failed, please try again.');
        },
      });
  }

  checkSdn() {
    this.isLoading = true;
    const req = {
      name: this.firstName.value,
      percentage: 60,
    };
    this.amlService.searchSdn(req).subscribe((data: any) => {
      if (data) {
        this.isLoading = false;
        if (data.length > 0) {
          this.sdnDetails = data;
          this.showModal = true;
        } else {
          this.sdnDetails = [];
          this.showModal = true;
        }
      }
      error: () => {
        this.isLoading = false;
        alert('Something went wrong');
      };
    });
  }

  closeModal() {
    this.showModal = false;
  }
  finalizeSuccess() {
    this.isLoading = false;
    alert('Customer created successfully');
    this.addKycForm.reset();
  }
  openSdnModal() {
    this.showSdnModal = true;
  }

  closeSdnModal() {
    this.showSdnModal = false;
    this.sdnResponse = null;
  }

  formatTazkira(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, ''); // Remove all spaces

    if (value.length > 16) {
      value = value.slice(0, 16); // Limit to 16 digits
    }

    let formattedValue = '';
    for (let i = 0; i < value.length; i += 4) {
      if (i > 0) {
        formattedValue += ' ';
      }
      formattedValue += value.substring(i, i + 4);
    }
    input.value = formattedValue;
    this.form.get('tazkira')?.setValue(formattedValue, { emitEvent: false });
  }

  onCheckboxChange(): void {
    this.updateReq();
  }

  private updateReq(): void {
    const formValues = this.addKycForm.value;
    if (formValues.riskHigh) {
      this.req.riskHigh = 1;
    } else {
      delete this.req.riskHigh;
    }

    if (formValues.riskMedium) {
      this.req.riskMedium = 1;
    } else {
      delete this.req.riskMedium;
    }

    if (formValues.riskLow) {
      this.req.riskLow = 1;
    } else {
      delete this.req.riskLow;
    }

    if (formValues.watchlistNo) {
      this.req.watchlistNo = 1;
    } else {
      delete this.req.watchlistYes;
    }

    if (formValues.watchlistYes) {
      this.req.watchlistYes = 1;
    } else {
      delete this.req.watchlistNo;
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  checkPasswords() {
    if (
      this.addKycForm.controls['cnfpwd'].value ==
      this.addKycForm.controls['password'].value
    ) {
      return '';
    } else {
      return 'Passwords did not match';
    }
  }
}
