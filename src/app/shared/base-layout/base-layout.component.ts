/*
============================================
; Title: base-layout.component.ts
; Author: Ace Baugh
; Date: April 2, 2023
; Description: this component is the base layout component
============================================
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// This is the base layout component
@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
})
export class BaseLayoutComponent implements OnInit {
  // this will be the session name
  sessionName: string;
  // this will be the current year
  year: number;

  constructor(private cookieService: CookieService, private router: Router) {
    // this is the cookie service to get the session name
    this.sessionName = this.cookieService.get('session_name');
    // get the current year
    this.year = Date.now();
  }

  ngOnInit(): void {}

  logout() {
    // delete the cookies and navigate to the login page
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }
}
