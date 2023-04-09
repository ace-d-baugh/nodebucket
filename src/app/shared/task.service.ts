/*
============================================
; Title: task.service.ts
; Author: Ace Baugh
; Date: April 9, 2023
; Description: Task service
============================================
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './models/item.interface';

// Task service
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  // Get all tasks for an employee
  findAllTasks(empId: number): Observable<any> {
    return this.http.get(`/api/employees/${empId}/tasks`);
  }

  // Create a new task for an employee
  createTask(empId: number, task: string): Observable<any> {
    return this.http.post(`/api/employees/${empId}/tasks`, {
      text: task,
    });
  }

  // update an employee's tasks
  updateTask(
    empId: number,
    todo: Item[],
    doing: Item[],
    done: Item[]
  ): Observable<any> {
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      doing,
      done,
    });
  }

  // Delete an employee's task
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`);
  }
}
