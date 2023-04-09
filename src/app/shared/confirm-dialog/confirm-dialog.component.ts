/*
============================================
; Title: confirm-dialog.component.ts
; Author: Ace Baugh
; Date: April 9, 2023
; Description: Confirm dialog component
============================================
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../models/dialog-data.interface.';

// Confirm dialog component
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {
  dialogData: DialogData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
  }

  ngOnInit(): void {}
}