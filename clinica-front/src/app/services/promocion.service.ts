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

  /* Servicios */
  getAllServices(): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/serviciosprevencion/list`);
  }

  createNewServices(promotion): Observable<any> {
    return this.http.post(`${this.globals.apiUrl}/serviciosprevencion/create`, promotion);
  }

  updateServices(id, promotion): Observable<any>  {
    return this.http.put(`${this.globals.apiUrl}/serviciosprevencion/update/` + id, promotion);
  }

  deleteServices(id) {
    return this.http.delete<any>(`${this.globals.apiUrl}/serviciosprevencion/delete/` + id);
  }

  getSingleServices(id): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/serviciosprevencion/`+ id);
  }

  /* Medicamentos */
  getAllMedicines(): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/medicamentosprevencion/list`);
  }

  createNewMedicine(promotion): Observable<any> {
    return this.http.post(`${this.globals.apiUrl}/medicamentosprevencion/create`, promotion);
  }

  updateMedicine(id, promotion): Observable<any>  {
    return this.http.put(`${this.globals.apiUrl}/medicamentosprevencion/update/` + id, promotion);
  }

  deleteMedicine(id) {
    return this.http.delete<any>(`${this.globals.apiUrl}/medicamentosprevencion/delete/` + id);
  }

  getSingleMedicine(id): Observable<any> {
    return this.http.get<any>(`${this.globals.apiUrl}/medicamentosprevencion/`+ id);
  }
}