import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}
export interface responseUser{
  data:User[]
}
@Injectable({
  providedIn: 'root'
})
export class userService {
  private apiGetUsers =   'https://run.mocky.io/v3/ec785eff-78d8-4bdb-8fde-6e49d0139a8e'; // Cambia por tu backend

  private apiGetUserById = 'https://run.mocky.io/v3/5a72130b-32fc-4150-8dd4-fcaf834c001c'; // Cambia por tu backend
  private apiPostCreateUser = 'https://run.mocky.io/v3/5a72130b-32fc-4150-8dd4-fcaf834c001c'; // Cambia por tu backend
  private apiUpdateCreateUser = 'https://run.mocky.io/v3/5cbf28ee-e2f5-48b3-a0d2-ee7b767dd2c60'; // Cambia por tu backend
  private apiDeleteUser = 'https://run.mocky.io/v3/d9a532fa-0717-4bcb-80be-e824a15e20b0'; // Cambia por tu backend
  private apiUrl = 'https://tu-api.com/api/users'; // Cambia por tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<responseUser> {
    return this.http.get<responseUser>(this.apiGetUsers);
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiGetUserById}/${id}`);
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<string> {
    return this.http.post<string>(this.apiPostCreateUser, user);
  }

  // Actualizar un usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUpdateCreateUser}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiDeleteUser}/${id}`);
  }
}
