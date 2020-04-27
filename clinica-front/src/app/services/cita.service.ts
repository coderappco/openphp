import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class CitaService {

  	constructor(private http: HttpClient, private globals: Globals) { }

  	crearCita(cita) {
        return this.http.post(`${this.globals.apiUrl}/cita/create`, cita);
    }

    getCitasp(prestador) {
    	return this.http.get<any>(`${this.globals.apiUrl}/citas?prestador=`+prestador.ID_PRESTADOR+`&sede=`+prestador.ID_SEDE+`&duracion=`+prestador.DURACION);
    }

    filterStatus(prestador) {
        return this.http.get<any>(`${this.globals.apiUrl}/citasstatus?prestador=`+prestador.ID_PRESTADOR+`&sede=`+prestador.ID_SEDE+`&duracion=`+prestador.DURACION+`&status=`+prestador.STATUS);
    }

    updateCita(id, hora) {
        return this.http.put(`${this.globals.apiUrl}/cita/update/` + id, {start: hora});
    }

    updateCitat(id, cita) {
        return this.http.put(`${this.globals.apiUrl}/cita/updatet/` + id, cita);
    }

    getCita(id): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/cita/` + id);
    }

    delCita(id, observacion) {
        return this.http.put(`${this.globals.apiUrl}/cita/delete/` + id, {observ: observacion});
    }

    delAgenda(agenda) {
        return this.http.get<any>(`${this.globals.apiUrl}/delagenda?agenda=`+agenda.ID_AGENDA+`&grupo=`+agenda.ID_GRUPO+`&duracion=`+agenda.DURACION);
    }

    updateAgenda(id, duracion) {
        return this.http.put(`${this.globals.apiUrl}/cita/update/agenda/` + id, {dur: duracion});
    }

    getCitasPrestador(prestador) {
        return this.http.get<any>(`${this.globals.apiUrl}/citasprestador?prestador=`+prestador);
    }

    getCitasPrestadorFecha(prestador, fecha) {
        return this.http.get<any>(`${this.globals.apiUrl}/citasprestadorfecha?prestador=`+prestador+`&fecha=`+fecha);
    }

    updateCitaEstado(id, cita) {
        return this.http.put(`${this.globals.apiUrl}/cita/updateensala/` + id, cita);
    }

    trasladarCitas(citas) {
        return this.http.post(`${this.globals.apiUrl}/cita/trasladar`, citas);
    }
}
