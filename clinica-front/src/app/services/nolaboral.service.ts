import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class NolaboralService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    crearNolaboral(nolaboral) {
        return this.http.post(`${this.globals.apiUrl}/nolaboral/create`, nolaboral);
    }

    updateNolaboral(id, nolaboral) {
        return this.http.put(`${this.globals.apiUrl}/nolaboral/update/` + id, nolaboral);
    }

    getNolaboral(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/nolaboral/` + id);
    }

    delNolaboral(id) {
        return this.http.delete(`${this.globals.apiUrl}/nolaboral/delete/` + id);
    }
}
