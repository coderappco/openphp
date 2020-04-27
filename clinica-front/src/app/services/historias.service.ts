import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class HistoriasService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	getHistorias(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias`);
    }

  	updateHistoria(id, historia) {
        return this.http.put(`${this.globals.apiUrl}/historia/update/` + id, historia);
    }

    listHistorias(): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/listhistorias`);
    }

    listHistoriasCitaid(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/listhistoriascita?cita_id=`+id);
    }

    getHistoria(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historia/` + id);
    }

    saveHistoriaPaciente(historia) {
        return this.http.post(`${this.globals.apiUrl}/historia/create/paciente`, historia);
    }

    updateHistoriaPaciente(id, historia) {
        return this.http.put(`${this.globals.apiUrl}/historia/paciente/update/` + id, historia);
    }

    getHistoriaPacientes(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/paciente/` + id);
    }

    getHistPacientesIdLab(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/pacidlab?id=`+id);
    }

    saveHistoriaLab(historia) {
        return this.http.post(`${this.globals.apiUrl}/historia/create/lab`, historia);
    }

    updateHistoriaLab(id, historia) {
        return this.http.put(`${this.globals.apiUrl}/historia/update/lab/` + id, historia);
    }

    delHistoriaLab(id) {
        return this.http.delete(`${this.globals.apiUrl}/historia/delete/lab/` + id);
    }

    getHistLab(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/lab/`+ id);
    }

    getHistPacientesIdMed(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/pacidmed?id=`+id);
    }

    saveHistoriaMed(historia) {
        return this.http.post(`${this.globals.apiUrl}/historia/create/med`, historia);
    }

    updateHistoriaMed(id, historia) {
        return this.http.put(`${this.globals.apiUrl}/historia/update/med/` + id, historia);
    }

    delHistoriaMed(id) {
        return this.http.delete(`${this.globals.apiUrl}/historia/delete/med/` + id);
    }

    getHistMed(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/med/`+ id);
    }

    getHistoriaSignoVitales(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historia/signov/` + id);
    }

    getHistoriasPacientes(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/historiapacepi?id_pac=` + id);
    }

    getHistoriasIds(ids, usuario, paciente): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/ids?ids=` + ids+ `&user=`+usuario+`&pac=`+paciente);
    }

    getDatosDiente(id, diente): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/getdiente?hist_id=` + id+ `&diente=`+diente);
    }

    getHistoriaOdTra(id, diente, superficie, diag): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/deldiagt?hist_id=` + id+ `&diente=`+diente+ `&super=`+superficie+ `&diag=`+diag);
    }

    getEvolucionar(id, diente, superficie): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/evolucionar?hist_id=` + id+ `&diente=`+diente+ `&super=`+superficie);
    }

    updateEvolucionar(id, diente, superficie, obs, fin, trat_id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/historias/updateevolucionar?hist_id=` + id+ `&diente=`+diente+ `&super=`+superficie+ `&obs=`+obs+ `&fin=`+fin+ `&trat_id=`+trat_id);
    }
}
