/*
============================================
; Title: employee.interface.ts
; Author: Ace Baugh
; Date: April 2, 2023
; Description: this is the employee interface
============================================
*/

import { Item } from './item.interface';
export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  // doing: Item[];
  done: Item[];
}
