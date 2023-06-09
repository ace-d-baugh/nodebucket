/*
============================================
; Title: employee.interface.ts
; Author: Ace Baugh
; Date: April 9, 2023
; Description: this is the employee interface
============================================
*/

import { Item } from './item.interface';

// Employee interface
export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  doing: Item[];
  done: Item[];
}
