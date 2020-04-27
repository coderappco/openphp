import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class GruposhService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    crearGrupoH(grupoh) {
        return this.http.post(`${this.globals.apiUrl}/grupoh/create`, grupoh);
    }

    updateGrupoH(id, grupoh) {
        return this.http.put(`${this.globals.apiUrl}/grupoh/update/` + id, grupoh);
    }

    getGrupoH(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/grupoh/` + id);
    }

    delGrupoH(id) {
        return this.http.delete(`${this.globals.apiUrl}/grupoh/delete/` + id);
    }

    getGruposH(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getgruposh`);
    }
}
