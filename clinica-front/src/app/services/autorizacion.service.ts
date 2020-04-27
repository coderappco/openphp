import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class AutorizacionService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	getAutorizacion(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/autorizacion/` + id);
    }

  	crearAutorizacion(autorizacion) {
        return this.http.post(`${this.globals.apiUrl}/autorizacion/create`, autorizacion);
    }

    updateAutorizacion(id, autorizacion) {
        return this.http.put(`${this.globals.apiUrl}/autorizacion/update/` + id, autorizacion);
    }

    delAutorizacion(id) {
        return this.http.delete(`${this.globals.apiUrl}/autorizacion/delete/` + id);
    }

    crearAuto(autorizacion) {
        return this.http.post(`${this.globals.apiUrl}/autorizacion/creates`, autorizacion);
    }
}
