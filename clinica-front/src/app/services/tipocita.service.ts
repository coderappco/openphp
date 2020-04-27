import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class TipocitaService {

	constructor(private http: HttpClient, private globals: Globals) { }

  	getTipoCita(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/tipocita/` + id);
    }

  	crearTipoCita(tipo) {
        return this.http.post(`${this.globals.apiUrl}/tipocita/create`, tipo);
    }

    updateTipoCita(id, tipo) {
        return this.http.put(`${this.globals.apiUrl}/tipocita/update/` + id, tipo);
    }

    delTipoCita(id) {
        return this.http.delete(`${this.globals.apiUrl}/tipocita/delete/` + id);
    }

    getTiposCitas(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/gettiposcitas`);
    }
}
