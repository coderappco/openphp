import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class PacienteService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	removePhoto(id: number, photo) {
        return this.http.get(`${this.globals.apiUrl}/paciente/removephoto?photo=`+photo+`&id=`+id);
    }

    removeArchivo(name) {
        return this.http.get(`${this.globals.apiUrl}/pacientes/removearchivo?name=`+name);
    }

    crearPaciente(paciente) {
        return this.http.post(`${this.globals.apiUrl}/paciente/create`, paciente);
    }

    crearPacienteCita(paciente) {
        return this.http.post(`${this.globals.apiUrl}/paciente/createc`, paciente);
    }

    updatePaciente(id, paciente) {
        return this.http.put(`${this.globals.apiUrl}/paciente/update/` + id, paciente);
    }

    delPaciente(id) {
        return this.http.delete(`${this.globals.apiUrl}/paciente/delete/` + id);
    }

    getPaciente(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/paciente/` + id);
    }

    getPacientes(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getpacientes`);
    }

    getPNotificacion(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/pnotificacion/` + id);
    }

    updatePNotificacion(id, notificacion) {
        return this.http.put(`${this.globals.apiUrl}/pnotificacion/update/` + id, {noti: notificacion});
    }

    importarArchivo(datos) {
        return this.http.post<any>(`${this.globals.apiUrl}/pacientes/importararchivo`, datos);
    }

    updatePacienteFecha(id, paciente) {
        return this.http.put(`${this.globals.apiUrl}/paciente/update/fecha/` + id, paciente);
    }
}
