import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { Employee } from 'src/app/shared/models/employee.interface';
import { SessionService } from 'src/app/shared/session.service';

// This is a component for the login page
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // An array of error messages
  errorMessage: Message[] = [];
  // An employee object
  employee: Employee;

  // A form group for the login form
  loginForm: FormGroup = this.fb.group({
    empId: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')]),
    ],
  });

  // Constructor for the login component
  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private sessionService: SessionService
  ) {
    // Initialize the employee object
    this.employee = {} as Employee;
  }

  ngOnInit(): void {}

  // A function to handle the login process
  login() {
    // Get the employee id from the login form
    const empId = this.loginForm.controls['empId'].value;

    // Call the session service to find the employee by id
    this.sessionService.findEmployeeById(empId).subscribe({
      next: (res: any) => {
        if (res) {
          // If the employee is found, set the session cookies and navigate to the home page
          this.employee = res;
          // Set the session cookies
          this.cookieService.set(
            'session_user',
            this.employee.empId.toString(),
            1
          );
          // Set the session cookies
          this.cookieService.set(
            'session_name',
            `${this.employee.firstName} ${this.employee.lastName}`,
            1
          );
          // Navigate to the home page
          this.router.navigate(['/']);
        } else {
          // If the employee is not found, display an error message
          this.errorMessage = [
            {
              severity: 'error',
              summary: 'Error',
              detail: 'Please enter a valid employee ID to continue.',
            },
          ];
        }
      },
      error: (err: any) => {
        // If there is an error, display an error message
        console.log(err);
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: err.message },
        ];
      },
    });
  }
}
