import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class EmpresaService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    removePhoto(id: number, logo) {
        return this.http.get(`${this.globals.apiUrl}/empresa/removelogo?logo=`+logo+`&id=`+id);
    }

    crearEmpresa(empresa) {
        return this.http.post(`${this.globals.apiUrl}/empresa/create`, empresa);
    }

    updateEmpresa(id, empresa) {
        return this.http.put(`${this.globals.apiUrl}/empresa/update/` + id, empresa);
    }

    delEmpresa(id) {
        return this.http.delete(`${this.globals.apiUrl}/empresa/delete/` + id);
    }

    getEmpresa(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/empresa/` + id);
    }

    getEmpresas(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getempresas`);
    }
}
