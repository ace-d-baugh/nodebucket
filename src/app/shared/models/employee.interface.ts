/*
============================================
; Title: employee.interface.ts
; Author: Ace Baugh
; Date: March 29, 2023
; Description: this is the employee interface
============================================
*/

import { Item } from './item.interface';
export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  done: Item[];
}
