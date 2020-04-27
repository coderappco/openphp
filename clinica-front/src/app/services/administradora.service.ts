import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
	providedIn: 'root'
})
export class AdministradoraService {

	constructor(private http: HttpClient, private globals: Globals) { }

    crearAdministradora(administradora) {
        return this.http.post(`${this.globals.apiUrl}/administradora/create`, administradora);
    }

    updateAdministradora(id, administradora) {
        return this.http.put(`${this.globals.apiUrl}/administradora/update/` + id, administradora);
    }

    delAdministradora(id) {
        return this.http.delete(`${this.globals.apiUrl}/administradora/delete/` + id);
    }

    getAdministradora(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/administradora/` + id);
    }

    getAdministradoras(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getadministradoras`);
    }

    getOrderI(adminid): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/administradoras/orderimport?admin=`+adminid);
    }
}
