/*
============================================
; Title: app-routing.module.ts
; Author: Ace Baugh
; Date: March 26, 2023
; Description: this module is the app routing module
============================================
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { AuthGuard } from './auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  // a route for the home page
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // a route for the login page
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  // a route for the about page
  {
    path: 'about',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: AboutComponent,
      },
    ],
  },
  // a route for the contact page
  {
    path: 'contact',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: ContactComponent,
      },
    ],
  },
  // a 404 page for everything not found
  {
    path: '**',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
