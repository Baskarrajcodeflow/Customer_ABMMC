import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl;
  private getHeaders(): HttpHeaders {
    let token;
    if (sessionStorage) {
      token = sessionStorage.getItem(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTkyOTQ4NzgsImV4cCI6MTc1MDgzMDg3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.8FGhnd3Lgjg7Im46PjQS4WrMlreH2MGu2O-f_gxfCCk"
      );
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  // public getCountries() {
  //   let url = environment.apiUrl+ "kyc/locations/countries";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //     return this.httpClient.get<any>(url,{headers:h})
  // }
  public addCustomerSign(file1: File, fieldname: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + fieldname;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public getCountries() {
    let url =`${environment.apiUrl}/kyc/locations/countries`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    
    return this.httpClient.get<any>(url, { headers: h });
  }
  public resetPassword(req: any) {
    let url = `${environment.apiUrl}/um/api/pwd/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getprovinces() {
    let url =`${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getdistricts(provinceId: any) {
    let url =`${environment.apiUrl}/kyc/locations/provinces/`+ provinceId +`/districts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h })
  }
}
