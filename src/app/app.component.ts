import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { categories, seed } from './core/services/data/todo-data';
import { responseUser, User, userService } from './core/services/usuario/crear-usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: User[] = [];
  newUser: User = { name: 'Yuliana', email: 'bigotesdelcarmen@gmail.com', password: 'lupita' };
  selectedUser: User | null = null;

  constructor(private userService: userService) {}

  ngOnInit(): void {
    this.dataDeInicioTodo();

  }

  dataDeInicioTodo(): void {
    localStorage.setItem('tasks', JSON.stringify(seed));
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  // Seleccionar usuario para edición
  selectUser(user: User): void {
    this.selectedUser = { ...user };
  }

  // Actualizar usuario
  updateUser(): void {
    if (this.selectedUser) {
      let userActualizado = this.users[0];
      userActualizado.email = 'danielZambrano@gmail.com'
      this.userService.updateUser(this.selectedUser.id!, userActualizado).subscribe({
        next: (user:User) => {
          let index = this.users.findIndex(obj => obj.id === user.id);
          if (index !== -1) {
            this.users.splice(index, 1, user);
          }
          
          this.selectedUser = null;
        },
        error: (err) => console.error('Error actualizando usuario:', err)
      });
    }
  }

  // Crear un usuario
  addUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: (mensaje:string) => {
        
        this.users.push(this.newUser);
      },
      error: (err) => console.error('Error creando usuario:', err)
    });
  }

  // Eliminar usuario
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
      },
      error: (err) => console.error('Error eliminando usuario:', err)
    });
  }

  // Obtener usuario por ID
  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user:User) => {
        this.selectedUser = user;
      },
      error: (err) => console.error('Error obteniendo usuario:', err)
    });
  }

  // Cargar lista de usuarios
 async  getUsers() {

    // this.users =    (await firstValueFrom(this.userService.getUsers())).data

    this.userService.getUsers().subscribe({
      next: (responseUser:responseUser) => {
        
        this.users = responseUser.data || []
      },
      error: (err) => console.error('Error obteniendo lista de usuarios:', err)
    });




    
  }
}
