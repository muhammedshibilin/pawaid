import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  constructor(private http:HttpClient) { }

  private api = 'http://localhost:4040/recruiter'

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.api}/register`, formData, {
      withCredentials: true
    });
  } 

}
