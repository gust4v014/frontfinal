import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; 
import { Signo } from '../_model/signo';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignoService {

  url: string = `${environment.HOST}/signos`;
  signoCambio = new Subject<Signo[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Signo[]>(this.url);
  }

  listarPorId(idSigno: number) {
    return this.http.get<Signo>(`${this.url}/${idSigno}`);
  }

  registrar(signo: Signo) {
    return this.http.post(this.url, signo);
  }

  modificar(paciente: Signo) {
    return this.http.put(this.url, paciente);
  }

  eliminar(idPaciente: number) {
    return this.http.delete(`${this.url}/${idPaciente}`);
  }



}
