/*
============================================
; Title: home.component.ts
; Author: Ace Baugh
; Date: April 9, 2023
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

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
  doing: Item[];
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
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // variables
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee = {} as Employee;
    this.todo = [];
    this.doing = [];
    this.done = [];
    this.newTaskId = '';
    this.newTaskMessage = '';

    // find all tasks
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        // console.log the employee data
        this.employee = res;
        console.log(res);
        console.log('--Employee Data--');
        console.log(this.employee);
      },
      // error message
      error: (err) => {
        console.error(err.message);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error:',
            detail: err.message,
          },
        ];
      },
      // once complete set the todo, doing, and done data
      complete: () => {
        this.todo = this.employee.todo;
        this.doing = this.employee.doing;
        this.done = this.employee.done;

        // console.log the todo, doing, and done data
        console.log('--ToDo, Doing, and Done Data--');
        console.log(this.todo);
        console.log(this.done);
        console.log(this.doing);
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
            summary: 'Error:',
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
            summary: 'Success:',
            detail: this.newTaskMessage,
          },
        ];
      },
    });
  }

  // Delete a task
  deleteTask(taskId: string) {
    // Delete confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Task Dialog',
        body: 'Are you sure you want to delete this task?',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {
          // delete the task
          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {
              // remove the task from the todo array
              this.todo = this.todo.filter((task) => task._id !== taskId);
              this.doing = this.doing.filter((task) => task._id !== taskId);
              this.done = this.done.filter((task) => task._id !== taskId);
              // Send success message
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success:',
                  detail: 'Task Deleted Successfully',
                },
              ];
              // console.log the response
              console.log(res);
            },
            // error message
            error: (err) => {
              // console.log the error message
              console.error(err.message);
              // Send error message
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error:',
                  detail: err.message,
                },
              ];
            },
          });
        } else {
          // Send cancel message
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info:',
              detail: 'Delete cancelled',
            },
          ];
        }
      },
    });
  }

  // Update the task list
  updateTaskList(empId: number, todo: Item[], doing: Item[], done: Item[]) {
    // update the task list
    this.taskService.updateTask(empId, todo, doing, done).subscribe({
      next: (res) => {
        // console.log the response
        console.log(res);
        // save the todo, doing, and done data
        this.todo = todo;
        this.doing = doing;
        this.done = done;
      },
      // error message
      error: (err) => {
        console.error(err.message);
        // Send error message
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error:',
            detail: err.message,
          },
        ];
      },
    });
  }

  // Drag and drop
  drop(event: CdkDragDrop<any[]>) {
    // If the task is dropped in the same list
    if (event.previousContainer === event.container) {
      // Reorder the tasks in the existing list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // console.log the message
      console.log('Reordered tasks in the existing list');
    } else {
      // Move the task to a new list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // console.log the message
      console.log('Moved task to a new list');
    }
    // Update the task list
    this.updateTaskList(this.empId, this.todo, this.doing, this.done);
  }
}
