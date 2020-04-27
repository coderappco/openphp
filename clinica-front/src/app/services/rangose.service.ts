import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class RangoseService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	crearRangoE(rangoe) {
        return this.http.post(`${this.globals.apiUrl}/rangoe/create`, rangoe);
    }

    updateRangoE(id, rangoe) {
        return this.http.put(`${this.globals.apiUrl}/rangoe/update/` + id, rangoe);
    }

    getRangoE(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/rangoe/` + id);
    }

    delRangoE(id) {
        return this.http.delete(`${this.globals.apiUrl}/rangoe/delete/` + id);
    }

    getRangosE(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/rangose`);
    }
}
