import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class CamaService {

	constructor(private http: HttpClient, private globals: Globals) { }

    crearCama(cama) {
        return this.http.post(`${this.globals.apiUrl}/cama/create`, cama);
    }

    updateCama(id, cama) {
        return this.http.put(`${this.globals.apiUrl}/cama/update/` + id, cama);
    }

    delCama(id) {
        return this.http.delete(`${this.globals.apiUrl}/cama/delete/` + id);
    }

    getCama(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/cama/` + id);
    }

    getCamas(sede = null): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getcamas?sede=`+sede);
    }
}
