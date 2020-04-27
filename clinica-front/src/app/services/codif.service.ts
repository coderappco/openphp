import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
//import 'rxjs/Rx';
import { Observable } from 'rxjs';

import {Globals} from '../globals';

@Injectable({
  	providedIn: 'root'
})
export class CodifService {

  	constructor(private http: HttpClient, private globals: Globals) { }

    getTipoIdent(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/identificadores`);
    }

    getDptos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/dptos`);
    }

    getMunicipios(dpto: any = null): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/municipios?dpto=`+dpto);
    }

    getEspecialidades(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/especialidades`);
    }

    getEstadoCivil(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/estadocivil`);
    }

    getGrupoSanguineo(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/gruposanguineo`);
    }

    getEscolaridad(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/escolaridad`);
    }

    getEtnia(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/etnia`);
    }

    getOcupacion(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/ocupacion`);
    }

    getDiscapacidad(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/discapacidad`);
    }

    getReligion(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/religion`);
    }

    getAfiliado(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/afiliado`);
    }

    getRegimen(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/regimen`);
    }

    getMotivoC(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/motivoconsulta`);
    }

    getOrden(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/ordenimport`);
    }

    getParentesco(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/parentescos`);
    }

    getDiagnosticoId(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/getdiagnostico?id=`+id);
    }

    getDiagnosticoIds(id){
        return this.http.get(`${this.globals.apiUrl}/getdiagnostico?id=`+id).pipe(
            map((datas: any) => {
                let obj: any = datas.COD_DIAGNOSTICO + ' ' + datas.NOM_DIAGNOSTICO;
                return obj;
            }));
    }

    getDiagnosticoOdon(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/getdiagodon`);
    }

    getTratamientosOdon(): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/gettratodon`);
    }

    getDiagOdontologia(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/getodontdiag/`+id);
    }
    
    getTratOdontologia(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/gettratdiag/`+id);
    }

    getDiagTrat(diag, trat): Observable<any[]> {
        return this.http.get<any[]>(`${this.globals.apiUrl}/getdiagtrat?diag=`+diag+`&trat=`+trat);
    }
}
