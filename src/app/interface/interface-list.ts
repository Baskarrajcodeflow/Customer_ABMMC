import { Validators } from "@angular/forms";

export interface FormControlConfig {
    key: string;
    label: string;
    type: string;
    validators?: Validators[];
    error: string;
    options?: { label: string; value: any }[];
  }

  export interface Component{
    name: string,
    location?: string,
    displayLink: string
  }
  /* export interface UserType {
    value: string;
    label: string;
  } */
  export enum UserDomains{
    Corporate='Corporate',
    Individual='Individual',
    Others='Other'
  }
   export enum contextSwitch{
    login='login',
    passwordReset='passwordReset',
    signup='signup'
  }
  export enum UserType{
    customer='customer',
    agent='agent',
    backoffice='backOffice'
  }
  export enum AgentUserType{
    agent='agent',
    merchant='merchant',
    subagent ='subAgent'
  }
  
 /* const UserTypes: UserType[] = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' }
  ]; */

export interface ModuleMeta{
  name: string,
  location: string,
  icon: string,
  components: Component[]
}

export interface TableColumn{
  field : string,
  header : string,
  sortable ?: boolean;
  type ?: 'text' | 'number' | 'dropdown';
}

export interface TableRow{
  [key : string] : any;
}

export interface Service {
  name: string;
  description: string;
}

export interface Product {
  name: string;
  services: Service[];
}

export interface customerRegistration {
  email: string,
  username: string,
  userType: string,
  password: string,
 userProfile: {
    firstName: string,
    lastName: string,
    phone: number,
    gender: string
 }

}