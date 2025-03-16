import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Tarea } from '../../interfaces/tarea.interface';
import { Category } from '../../interfaces/category.interface';

import { AlertService } from '../../services/alert.service';
import { TaskService } from '../../services/crudTodo/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  tarea!: Tarea;
  type: string = 'add';
  subTareaName: string = '';
  categories: Category[] = JSON.parse(
    localStorage.getItem('categories') || '[]'
  );
  notification = inject(AlertService);
  private taskService = inject(TaskService);

  constructor(
    public dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
  
      this.type = this.data.type;//null

      if (this.data.tarea) { //null
        this.tarea = { ...this.data.tarea };
      } else {
        this.tarea = {
          id: crypto.randomUUID(),
          name: '',
          state: 'pendiente',
          category: 'General',
          initDate: new Date(),
          subTareas: [],
        };
      }

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  removeSubTarea(id: string) {
    const index = this.tarea.subTareas?.findIndex(
      (subTarea) => subTarea.id === id
    );
    if (index !== undefined && index !== -1) {
      this.tarea.subTareas?.splice(index, 1);
    }
  }

  addSubTarea() {
    let subtarea = this.subTareaName.trim();

    if (subtarea !== '') {
      this.tarea.subTareas?.push({
        id: crypto.randomUUID(),
        name: subtarea,
        state: 'pendiente',
      });
      this.subTareaName = '';
    }
  }
  onStateChange() {
    if (this.tarea.state === 'completada') {
      this.tarea.endDate = new Date();
    } else {
      this.tarea.endDate = undefined;
    }
  }
  saveTarea() {
    if (!this.validarTarea()) {
      return;
    }

    if (this.type == 'update') {
      this.taskService.updateTask(this.tarea);
    } else {
      this.taskService.addTask(this.tarea);
    }

    this.closeDialog();
  }

  validarTarea(): boolean {
    if (!this.tarea.name || this.tarea.name.trim() === '') {
      this.notification.generarAlerta(
        'Aviso',
        'Nombre de tarea requerido.',
        'warning'
      );
      return false;
    }

    return true;
  }

  toggleComplete(index: number) {
    if (this.tarea.subTareas) {
      this.tarea.subTareas[index].state =
        this.tarea.subTareas[index].state === 'pendiente'
          ? 'completada'
          : 'pendiente';
    }
  }
  enableEditing(sub: any) {
    if (sub.state !== 'completada') {
      sub.editing = true;
    }
  }
}
