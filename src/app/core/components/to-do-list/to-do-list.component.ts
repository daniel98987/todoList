import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { Tarea } from '../../interfaces/tarea.interface';
import { CategoriesComponent } from '../categories/categories.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/crudTodo/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    CategoriesComponent,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  tareasList: Tarea[] = [];
  category: string = 'General';
  private taskService = inject(TaskService);
  private tasksSubscription!: Subscription;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tareasList = this.filterTasksByCategory(tasks);
    });
    this.onCategorySelected(this.category);
  }

  onCategorySelected(category: string) {
    this.category = category;
    const allTasks: Tarea[] = JSON.parse(localStorage.getItem('tasks') ?? '[]');
    this.tareasList = this.filterTasksByCategory(allTasks);
  }

  private filterTasksByCategory(tasks: Tarea[]): Tarea[] {
    return this.category === 'General' ? tasks : tasks.filter((t) => t.category === this.category);
  }

  toggleComplete(index: number) {
    const tarea = this.tareasList[index];
    tarea.state = tarea.state === 'completada' ? 'pendiente' : 'completada';
    tarea.endDate = tarea.state === 'completada' ? new Date() : undefined;
    this.updateLocalStorage();
  }

  toggleSubTarea(taskIndex: number, subIndex: number) {
    const subTarea = this.tareasList[taskIndex].subTareas?.[subIndex];
    if (subTarea) {
      subTarea.state = subTarea.state === 'completada' ? 'pendiente' : 'completada';
      this.updateLocalStorage();
    }
  }

  editTarea(index: number) {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      data: { tarea: { ...this.tareasList[index] }, type: 'update' },
      width: window.innerWidth < 576 ? '90vw' : '50vw',
      maxWidth: 'none',
      height: 'auto',
      maxHeight: '80vh',
    });

    dialogRef.afterClosed().subscribe((updatedTask) => {
      if (updatedTask) {
        this.tareasList[index] = updatedTask;
        this.updateLocalStorage();
      }
    });
  }

  onStateChange(tarea: Tarea) {
    tarea.endDate = tarea.state === 'completada' ? new Date() : undefined;
  }

  removeTarea(index: number) {
    if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
      this.tareasList.splice(index, 1);
      this.updateLocalStorage();
    }
  }

  removeSubTarea(taskIndex: number, subIndex: number) {
    this.tareasList[taskIndex].subTareas?.splice(subIndex, 1);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tareasList));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      data: {},
      width: window.innerWidth < 576 ? '90vw' : '50vw',
      maxWidth: 'none',
      height: 'auto',
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe((newTask) => {
      if (newTask) {
        this.tareasList.push(newTask);
        this.updateLocalStorage();
      }
    });
  }
}
