/*
============================================
; Title: base-layout.component.ts
; Author: Ace Baugh
; Date: April 9, 2023
; Description: this component is the base layout component
============================================
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

// This is the base layout component
@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class BaseLayoutComponent implements OnInit {
  // this will be the session name
  sessionName: string;
  // this will be the current year
  year: number;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // this is the cookie service to get the session name
    this.sessionName = this.cookieService.get('session_name');
    // get the current year
    this.year = Date.now();
  }

  ngOnInit(): void {}

  logout() {
    // popup to confirm logout
    this.confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // if the user confirms logout, delete the cookies and navigate to the login page
        this.cookieService.deleteAll();
        this.router.navigate(['/session/login']);
      },
      reject: (type: any) => {
        // if the user cancels the logout, create a toast message
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'info',
              summary: 'Logout Cancelled',
              detail: 'You have cancelled the logout',
            });
            break;
            // if the user closes the dialog, create a toast message
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'info',
              summary: 'Logout Cancelled',
              detail: 'You have cancelled the logout',
            });
            break;
        }
      },
    });
  }
}
