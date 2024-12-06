import { Routes } from '@angular/router';
import { DashboardComponent } from './B2C/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { HomeComponent } from './B2C/home/home.component';
import { CustomerKycComponent } from './components/customer-kyc/customer-kyc.component';
import { MoneyTransferComponent } from './B2C/money-transfer/money-transfer.component';
/* import { BreshnaPaymentsComponent } from './B2C/breshna-payments/breshna-payments.component';
 */import { LoginComponent } from './B2C/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { BreshnaPaymentsComponent } from './B2C/breshna-payments/breshna-payments.component';
import { CashoutRequestRejectComponent } from './B2C/cashout-request-reject/cashout-request-reject.component';
import { PayrollRequestsComponent } from './B2C/payroll-requests/payroll-requests.component';
import { TransactionHistoryComponent } from './B2C/transaction-history/transaction-history.component';
import { CustomerKycComponents } from './B2C/coroporate-kyc/customer-kyc/customer-kyc.component';

// export const routes: Routes = [
//     {
//         path : 'registration', component : RegistrationFormComponent
//     },
//     {
//         path : 'product/:product', component : ProductComponent, canActivate : [AuthGuardService]
//     },
//     {
//         path : 'dashboard', component : DashboardComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'branches', component : BranchAddressComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'ourservices', component : OurServicesComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'transactionHistory', component : TransactionHistoryComponent , canActivate : [AuthGuardService]
//     }, {
//         path : 'createUser', component : CreateUserComponent
//     }
// ];
export const routes: Routes = [
  { path: 'createUser', component: CreateUserComponent },
  { path: 'customerKyc', component: CustomerKycComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'moneyTransfer', component: MoneyTransferComponent },
  { path: 'breshnaPay', component: BreshnaPaymentsComponent },
  { path: 'cashoutRequests', component: CashoutRequestRejectComponent },
  { path: 'payrollRequests', component: PayrollRequestsComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'tranactionHistory', component: TransactionHistoryComponent },
  { path: 'corpKyc', component: CustomerKycComponents },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
 
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
];
