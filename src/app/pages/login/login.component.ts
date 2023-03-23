import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { Employee } from 'src/app/shared/models/employee.interface';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: Message[] = [];
  employee: Employee;

  loginForm: FormGroup = this.fb.group({
    empId: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.employee = {} as Employee;
  }

  ngOnInit(): void {}

  login() {
    const empId = this.loginForm.controls['empId'].value

    this.sessionService.findEmployeeById(empId).subscribe({

      next: (res: any) => {
        if (res) {
          this.employee = res;
          this.cookieService.set('session_user', this.employee.empId.toString(), 1);
          this.cookieService.set('session_user_name', '${this.employee.firstName} ${this.employee.lastName}', 1);
          this.router.navigate(['/']);
        } else {
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
        console.log(err);
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: err.message },
        ];
      },
    });
  }
}
