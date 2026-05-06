/*
W12: Create a basic to-do list where users can add, edit, and delete tasks. Use Angular's two-way data binding to update tasks dynamically.
*/

// This is a conceptual example of an Angular component.
// This code would live in a file like `todo-list.component.ts`.
// The HTML would be in `todo-list.component.html`.

import { Component } from '@angular/core';

// NOTE: For [(ngModel)] to work, you must import `FormsModule` in your app's
// main module (e.g., `app.module.ts`) and add it to the `imports` array.
// import { FormsModule } from '@angular/forms';
// @NgModule({ imports: [ FormsModule, ... ] })

interface Task {
  id: number;
  text: string;
  isEditing: boolean;
}

@Component({
  selector: 'app-todo-list',
  // The template would be in a separate HTML file.
  // [(ngModel)] is the key to two-way data binding.
  template: `
    <div>
      <h2>To-Do List</h2>
      <input type="text" [(ngModel)]="newTaskText" placeholder="Add a new task">
      <button (click)="addTask()">Add Task</button>
      
      <ul>
        <li *ngFor="let task of tasks">
          <span *ngIf="!task.isEditing">{{ task.text }}</span>
          <input *ngIf="task.isEditing" type="text" [(ngModel)]="task.text">
          
          <button (click)="toggleEdit(task)">{{ task.isEditing ? 'Save' : 'Edit' }}</button>
          <button (click)="deleteTask(task.id)">Delete</button>
        </li>
      </ul>
    </div>
  `
})
export class TodoListComponent {
  tasks: Task[] = [
    { id: 1, text: 'Learn Angular', isEditing: false },
    { id: 2, text: 'Build a to-do app', isEditing: false },
  ];
  newTaskText: string = '';
  private nextId: number = 3;

  addTask() {
    if (this.newTaskText.trim()) {
      this.tasks.push({
        id: this.nextId++,
        text: this.newTaskText,
        isEditing: false
      });
      this.newTaskText = ''; // Clear the input field
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  toggleEdit(task: Task) {
    task.isEditing = !task.isEditing;
  }
}


