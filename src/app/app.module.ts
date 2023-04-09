/*
============================================
; Title: app.module.ts
; Author: Ace Baugh
; Date: April 9, 2023
; Description: this module is the app module
============================================
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './pages/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

// PrimeNG
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthLayoutComponent,
    BaseLayoutComponent,
    LoginComponent,
    AboutComponent,
    ContactComponent,
    NotFoundComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MessagesModule,
    MessageModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    ToastModule,
    ConfirmDialogModule,
    MatDialogModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
