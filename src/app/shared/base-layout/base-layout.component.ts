/*
============================================
; Title: base-layout.component.ts
; Author: Ace Baugh
; Date: March 15, 2023
; Description: this component is the base layout component
============================================
*/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();

  constructor() {}

  ngOnInit(): void {}
}
