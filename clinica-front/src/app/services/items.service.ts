import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class ItemsService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	getItem(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/item/` + id);
    }

  	crearItems(item) {
        return this.http.post(`${this.globals.apiUrl}/item/create`, item);
    }

    updateItem(id, item) {
        return this.http.put(`${this.globals.apiUrl}/item/update/` + id, item);
    }

    delItem(id) {
        return this.http.delete(`${this.globals.apiUrl}/item/delete/` + id);
    }

    getItems(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/getitems`);
    }

    getItemsLab(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/items/examenes`);
    }

    getItemsMed(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/items/medicamentos`);
    }

    getItemsServ(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/items/servicios`);
    }
}
