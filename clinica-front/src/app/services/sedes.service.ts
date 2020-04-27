import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class SedesService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    crearSede(sede) {
        return this.http.post(`${this.globals.apiUrl}/sede/create`, sede);
    }

    updateSede(id, sede) {
        return this.http.put(`${this.globals.apiUrl}/sede/update/` + id, sede);
    }

    delSede(id) {
        return this.http.delete(`${this.globals.apiUrl}/sede/delete/` + id);
    }

    getSede(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/sede/` + id);
    }

    getSedes(empresa = null): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getsedes?empresa=`+empresa);
    }
}
