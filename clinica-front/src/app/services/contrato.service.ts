import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

	constructor(private http: HttpClient, private globals: Globals) { }

    crearContrato(contrato) {
        return this.http.post(`${this.globals.apiUrl}/contrato/create`, contrato);
    }

    updateContrato(id, contrato) {
        return this.http.put(`${this.globals.apiUrl}/contrato/update/` + id, contrato);
    }

    delContrato(id) {
        return this.http.delete(`${this.globals.apiUrl}/contrato/delete/` + id);
    }

    getContrato(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/contrato/` + id);
    }

    getContratos(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getcontratos`);
    }

    getAdminContratos(admin): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getadmincontratos?admin=`+admin);
    }
}
