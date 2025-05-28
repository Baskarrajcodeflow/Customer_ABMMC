import { Routes } from '@angular/router';
import { DashboardComponent } from './B2C/dashboard/dashboard.component';
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
import { AuthGuard } from './services/auth-guard.service';
import { BundleTopupDashboardComponent } from './B2C/Bundle-Topup/bundle-topup-dashboard/bundle-topup-dashboard.component';

export const routes: Routes = [
  { path: 'createUser', component: CreateUserComponent , canActivate: [AuthGuard]},
  { path: 'customerKyc', component: CustomerKycComponent, canActivate: [AuthGuard] }, 
  { path: 'home', component: HomeComponent, },
  { path: 'login', component: LoginComponent },
  { path: 'moneyTransfer', component: MoneyTransferComponent , canActivate: [AuthGuard]},
  { path: 'breshnaPay', component: BreshnaPaymentsComponent, canActivate: [AuthGuard] },
  { path: 'cashoutRequests', component: CashoutRequestRejectComponent, canActivate: [AuthGuard] },
  { path: 'payrollRequests', component: PayrollRequestsComponent, canActivate: [AuthGuard] },
  { path: 'signUp', component: SignupComponent, },
  { path: 'tranactionHistory', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'corpKyc', component: CustomerKycComponents, canActivate: [AuthGuard] },
  { path: 'bundleTopup', component: BundleTopupDashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
 
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
];
