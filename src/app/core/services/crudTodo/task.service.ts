import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tarea } from '../../interfaces/tarea.interface';
import { AlertService } from '../alert.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Tarea[]>(this.loadTasks()); // Estado inicial desde localStorage
  public tasks$ = this.tasksSubject.asObservable(); // Observable para escuchar cambios
  private alert = inject(AlertService);
  constructor() {}

  
  private loadTasks(): Tarea[] {
    return JSON.parse(localStorage.getItem('tasks') ?? '[]');
  }


  getTasks(): Tarea[] {
    return this.tasksSubject.getValue();
  }


  private saveTasks(tasks: Tarea[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks); // Emitir cambios
  }


  addTask(task: Tarea) {
    const tasks = this.getTasks();
    this.alert.generarAlerta('Éxito', 'Tarea guardada correctamente.', 'success');
    this.saveTasks([task,...tasks]);
  }


  removeTask(index: number) {
    const tasks = this.getTasks();
    tasks.splice(index, 1);
    this.saveTasks(tasks);
  }


  updateTask( tarea: Tarea) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === tarea.id);
    
    if (index !== -1) { // Verificamos que la tarea existe
      tasks[index] = tarea;
      this.saveTasks(tasks);
    }
  }

  toggleComplete(index: number) {
    const tasks = this.getTasks();
    tasks[index].state = tasks[index].state === 'completada' ? 'pendiente' : 'completada';
    this.saveTasks(tasks);
  }
}
