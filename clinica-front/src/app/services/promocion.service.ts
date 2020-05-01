import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
/* Globals */
import {Globals} from '../globals';

@Injectable({ providedIn: 'root' })
export class PromocionService {
  constructor(private http: HttpClient, private globals: Globals) { }

  getAllPromotion(): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/promocionprevencion/list`);
  }

  createNewPromotion(promotion): Observable<any> {
    return this.http.post(`${this.globals.apiUrl}/promocionprevencion/create`, promotion);
  }

  updatePromotion(id, promotion): Observable<any>  {
    return this.http.put(`${this.globals.apiUrl}/promocionprevencion/update/` + id, promotion);
  }

  deletePromotion(id) {
    return this.http.delete<any>(`${this.globals.apiUrl}/promocionprevencion/delete/` + id);
  }

  getSinglePromotion(id): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/promocionprevencion/`+ id);
  }
}