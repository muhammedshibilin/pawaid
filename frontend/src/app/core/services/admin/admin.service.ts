import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private api = 'http://localhost:4040/admin'
  
    constructor(private http:HttpClient) { }
  
    login(credentials:{email:string;password:string}):Observable<any>{
      console.log('ahiidd  adminlogin servicicllll ann')
      return this.http.post(`${this.api}/login`,credentials,{withCredentials:true})
    }
}
