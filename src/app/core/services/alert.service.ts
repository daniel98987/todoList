import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  public generarAlerta(title: string, message: string, icon: SweetAlertIcon  = 'success', timeout :number = 1500) {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      timer: timeout,
      showConfirmButton: true,
    });
  }


}
