/*
============================================
; Title: session.service.ts
; Author: Ace Baugh
; Date: April 2, 2023
; Description: this is the session service
============================================
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// This is a service for the session
export class SessionService {
  constructor(private http: HttpClient) {}

  findEmployeeById(empId: number): Observable<any> {
    return this.http.get('/api/employees/' + empId);
  }
}
