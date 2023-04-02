/*
============================================
; Title: home.component.ts
; Author: Ace Baugh
; Date: April 2, 2023
; Description: this component is the home component
============================================
*/

import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/shared/task.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api/message';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';

// Home component
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
// Home component class
export class HomeComponent implements OnInit {
  serverMessages: Message[] = [];
  employee: Employee;
  todo: Item[];
  //doing: Item[];
  done: Item[];
  empId: number;
  newTaskId: string;
  newTaskMessage: string;

  // Form group for the task form
  taskForm: FormGroup = this.fb.group({
    task: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(35),
      ]),
    ],
  });

  // Constructor for the home component
  constructor(
    private taskService: TaskService,
    private cookieService: CookieService,
    private fb: FormBuilder
  ) {
    // variables
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee = {} as Employee;
    this.todo = [];
    //this.doing = [];
    this.done = [];
    this.newTaskId = '';
    this.newTaskMessage = '';

    // fina all tasks
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        // console.log the employee data
        this.employee = res;
        console.log('--Employee Data--');
        console.log(this.employee);
      },
      // error message
      error: (err) => {
        console.error(err.message);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          },
        ];
      },
      // once complete set the todo, doing, and done data
      complete: () => {
        this.todo = this.employee.todo;
        //this.doing = this.employee.doing;
        this.done = this.employee.done;

        // console.log the todo, doing, and done data
        console.log('--ToDo, Doing, and Done Data--');
        console.log(this.todo);
        console.log(this.done);
        //console.log(this.doing);
      },
    });
  }

  ngOnInit(): void {}

  // Create a new task
  createTask() {
    // save the task form value
    const newTask = this.taskForm.controls['task'].value;

    // create the task
    this.taskService.createTask(this.empId, newTask).subscribe({
      next: (res) => {
        this.newTaskId = res.data.id;
        this.newTaskMessage = res.message;
        console.log('--New Task ID--');
        console.log(this.newTaskId);
      },
      error: (err) => {
        console.error(err.message);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          },
        ];
      },
      // once complete push the new task to the todo array
      complete: () => {
        let task = {
          _id: this.newTaskId,
          text: newTask,
        } as Item;
        this.todo.push(task);
        this.newTaskId = '';
        this.taskForm.controls['task'].setErrors({ incorrect: false });

        // console.log the todo array
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: this.newTaskMessage,
          },
        ];
      },
    });
  }
}
