import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = 'http://localhost:4040'

  constructor(private http:HttpClient) { }

  login(credentials:{email:string;password:string}):Observable<any>{
    console.log('ahiidd  login servicicllll ann')
    return this.http.post(`${this.api}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/logout`, {}, { withCredentials: true });
  }
  

  register(userData: { username: string; email: string; phone?: string; password?: string }): Observable<any> {
    return this.http.post(`${this.api}/register`, userData);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/profile`,{withCredentials:true});
  }

  requestAccessToken():Observable<any>{
    console.log('serviceil call undd')
    return this.http.get(`${this.api}/refresh-token`, {withCredentials: true})
  }


}
