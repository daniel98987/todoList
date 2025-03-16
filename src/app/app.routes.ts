import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/components/todo.routes').then(m => m.routes),
      }
];
