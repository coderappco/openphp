import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class ReportesService {

	constructor(private http: HttpClient, private globals: Globals) { }

	getReporteCitas(datos): Observable<any> {
        return this.http.get<any>(`${this.globals.apiUrl}/reportes/citas?pres=`+datos.ID_PRESTADOR+`&admin=`+datos.ID_ADMINISTRADORA+
        					`&fecha=`+datos.FECHA+`&motivo=`+datos.ID_MOTIVO_CONSULTA+`&estado=`+datos.ESTADO_CITA+`&paciente=`+datos.ESTADO_PACIENTE+
        					`&empresa=`+datos.ID_EMPRESA);
    }
}
