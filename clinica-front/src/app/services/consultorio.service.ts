import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class ConsultorioService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    crearConsultorio(consultorio) {
        return this.http.post(`${this.globals.apiUrl}/consultorio/create`, consultorio);
    }

    updateConsultorio(id, consultorio) {
        return this.http.put(`${this.globals.apiUrl}/consultorio/update/` + id, consultorio);
    }

    delConsultorio(id) {
        return this.http.delete(`${this.globals.apiUrl}/consultorio/delete/` + id);
    }

    getConsultorio(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/consultorio/` + id);
    }

    getConsultorios(sede = null): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getconsultorios?sede=`+sede);
    }
}
