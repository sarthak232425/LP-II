/*
W13: Create an Angular application which will do following actions: User Registration, Login User, Show User Data on Profile Component.
*/

// This is a conceptual example showing the structure of an Angular authentication system.
// It includes a service for logic and component templates. A real app would also have routing.

import { Injectable } from '@angular/core';
import { Component } from '@angular/core';

// --- 1. Authentication Service (auth.service.ts) ---
// This service would handle the logic for registration, login, and user data.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: any[] = [];
  private currentUser: any = null;

  register(user: any) {
    // In a real app, this would be an HTTP request to a backend.
    if (this.users.find(u => u.email === user.email)) {
      return { success: false, message: 'User already exists.' };
    }
    this.users.push(user);
    return { success: true, message: 'Registration successful.' };
  }

  login(credentials: any) {
    const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      this.currentUser = user;
      return { success: true, message: 'Login successful.' };
    }
    return { success: false, message: 'Invalid credentials.' };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}


// --- 2. Registration Component (register.component.ts) ---
@Component({
  selector: 'app-register',
  template: `
    <h3>Register</h3>
    <input [(ngModel)]="email" placeholder="Email">
    <input [(ngModel)]="password" type="password" placeholder="Password">
    <button (click)="onRegister()">Register</button>
    <p>{{ message }}</p>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    const result = this.authService.register({ email: this.email, password: this.password });
    this.message = result.message;
  }
}


// --- 3. Login Component (login.component.ts) ---
@Component({
  selector: 'app-login',
  template: `
    <h3>Login</h3>
    <input [(ngModel)]="email" placeholder="Email">
    <input [(ngModel)]="password" type="password" placeholder="Password">
    <button (click)="onLogin()">Login</button>
    <p>{{ message }}</p>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    const result = this.authService.login({ email: this.email, password: this.password });
    this.message = result.message;
    if (result.success) {
      // In a real app, you would navigate to the profile page.
      console.log('Navigate to profile...');
    }
  }
}


// --- 4. Profile Component (profile.component.ts) ---
@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="user">
      <h3>Profile</h3>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button (click)="onLogout()">Logout</button>
    </div>
    <div *ngIf="!user">
      <p>You are not logged in.</p>
    </div>
  `
})
export class ProfileComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }

  onLogout() {
    this.authService.logout();
    this.user = null;
    // In a real app, you would navigate to the login page.
  }
}


