import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';
import * as swal from 'src/assets/plantilla/vendors/bower_components/sweetalert2/dist/sweetalert2.min.js';

import { CodifService } from '../../../services/codif.service';
import { PacienteService } from '../../../services/paciente.service';
import { ItemsService } from '../../../services/items.service';
import { UserService } from '../../../services/usuario.service';
import { CitaService } from '../../../services/cita.service';
import { AutorizacionService } from '../../../services/autorizacion.service';
import { GruposhService } from '../../../services/gruposh.service';
import { EmpresaService } from '../../../services/empresa.service';
import { SedesService } from '../../../services/sedes.service';
import { ConsultorioService } from '../../../services/consultorio.service';
import { TipocitaService } from '../../../services/tipocita.service';

declare var $: any;

@Component({
	selector: 'app-asignar',
	templateUrl: './asignar.component.html',
	styleUrls: ['./asignar.component.css']
})
export class AsignarComponent implements OnInit {

	submitted = false;
	citaForm: FormGroup;
    pacienteForm: FormGroup;
    prestador: any = false;
    motivoc: any;
    paciente_ident: any = null;
    servicios: any = [];
    change: any = false;
    tiene: any = true;
    prestador_id: any = 0;
    user_id: any = 0;
    updateselect: any = false;
    evento_id: any = 0;
    servi: any = '';
    servi_id: any = 0;
    grupos: any = [];
    empresas: any = [];
    sedes: any = [];
    consultorios: any = [];
    prestadores: any = [];
    sede: any = false;
    dias: any = null;
    agenda_id: any = 0;
    paciente_c: any = false;
    horarios: any = null;
    grupoh: any = false;
    grupo_id: any = 0;
    sede_id: any = 0;
    horarios1: any = [];
    datos: any = [];
    grupo_id1: any = 0;
    businessHours: any = [];
    empresa_id: any = 0;
    notificacion: any = 0;
    duracion: any = 15;
    sede_change: any = false;
    dptos: any = [];
    municipios: any = [];
    muni_id: any = 1127;
    tipoident: any = [];
    concurrencia: any = 1;
    pac: any = [];
    datas: any = [];
    multi: any = false;
    paciente_name: any = '';
    paciente_id: any = 0;
    paciente_t: any = [];
    estado_c: any = 0;
    tipocita: any = [];

	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService,
                private pacienteService: PacienteService, private itemsService: ItemsService, private userService: UserService,
                private citaService: CitaService, private autoService: AutorizacionService, private gruposhService: GruposhService,
                private empresaService: EmpresaService, private consultService: ConsultorioService, private sedesService: SedesService,
                private router: Router, private tipocitaService: TipocitaService) { }

	ngOnInit() {
        this.initForm();
        let us = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = us.user.ID_USUARIO;
        this.empresa_id = us.empresa_id;
	}

	ngAfterViewInit(): void {
        var that = this;
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
		setTimeout(() => 
		{
			this.globals.getUrl = 'acita';
		},1000);
        that.fillCalendar(null);
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

        $('.select2.dpto').on("change", function (e) {
            $('.select2.muni').prop("disabled", true);
            that.getMunicipios($(this).val());
        });

        this.codifService.getMotivoC()
            .subscribe(data => this.motivoc = data);
        this.itemsService.getItems()
            .subscribe(data => this.servicios = data);
        this.gruposhService.getGruposH()
            .subscribe(data => this.grupos = data);
        this.userService.getPrestadores()
            .subscribe(data => this.prestadores = data);
        this.empresaService.getEmpresas()
            .subscribe(data => {
                this.empresas = data;
                let us = JSON.parse(localStorage.getItem('currentUser'));
                if(us.role != 'ADMINISTRADOR') {
                    setTimeout(() => 
                    {
                        $('#ID_EMPRESA').val(this.empresa_id).trigger('change');
                        $('#ID_EMPRESA').attr('disabled', true);
                    },0);
                }
                else {
                    this.sedesService.getSedes()
                        .subscribe(data => this.sedes = data);
                }
            }
        );
        this.tipocitaService.getTiposCitas()
            .subscribe(data => this.tipocita = data);

        $('#ID_EMPRESA').on( 'change', function () {
            that.sedesService.getSedes($(this).val())
                .subscribe(data => {
                    var newOptions = '<option value="">Seleccione...</option>';
                    for(var d in data) {
                        newOptions += '<option value="'+ data[d].ID_SEDE +'">'+ data[d].COD_SEDE + ' - ' + data[d].NOM_SEDE +'</option>';
                    }
                    $('#ID_SEDE').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
            });
            that.userService.getPrestadores($(this).val())
                .subscribe(data => {
                    var newOptions = '<option value="">Seleccione...</option>';
                    for(var d in data) {
                        newOptions += '<option value="'+ data[d].ID_USUARIO +'">'+ data[d].identificacion.COD_TIPO_IDENTIFICACION + " - " + data[d].NO_IDENTIFICACION + " - " + data[d].NOMBRES +" "+ data[d].APELLIDOS +'</option>';
                    }
                    $('#prestador_id').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
            });
            $('.calendar').fullCalendar('destroy');
            that.fillCalendar(null);
        });

        $('#DURACION').on( 'change', function () {
            if($(this).val() == '') {
                alert("Por favor, debe decir la duración de las citas");
                $('#DURACION').focus();
                return false;
            }
            else
            if($(this).val() < 15) {
                alert("Por favor, el tiempo minimo de las citas son 15 minutos");
                $('#DURACION').focus();
                return false;
            }
            else 
            if($('#ID_SEDE').val() != '' && $('#prestador_id').val() != '') {
                that.citaService.updateAgenda(that.agenda_id, $('#DURACION').val())
                    .subscribe(data => {
                        let da: any = data;
                        that.prestador_id = da.id;
                        $('.calendar').fullCalendar('destroy');
                        that.dias = da.dias;
                        that.horarios = da.horarios;
                        that.duracion = da.duracion;
                        that.concurrencia = da.concurrencia;
                        let multiple: any = that.concurrencia == 1 ? false : true;
                        $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                        that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                        $('#ID_PACIENTE').select2({
                            dropdownAutoWidth:!0,
                            width:"100%",
                            ajax: {
                                url: that.globals.apiUrl+'/paciente/search',
                                dataType: 'json',
                                data: function (params) {
                                    return {
                                        q: params.term
                                    };
                                }
                            },
                            language: { 
                                inputTooShort: function () { 
                                    return 'Por favor, entre al menos 1 caracter'; 
                                } 
                            },
                            placeholder: 'Buscar Pacientes',
                            minimumInputLength: 1,
                            maximumSelectionLength: that.concurrencia,
                            multiple: multiple,
                            allowClear: !multiple
                        });
                        that.citaForm.get('ID_GRUPO').setValue(da.grupo);
                        that.citaForm.get('ID_AGENDA').setValue(da.agenda);
                        that.agenda_id = da.agenda;
                        that.grupoh = true;
                        $('#ID_GRUPO').val(da.grupo).trigger('change');
                        that.grupoh = false;
                        that.grupo_id = da.grupo;
                        let arr = [];
                        for(var i in that.horarios) {
                            let existe = false;
                            let pos: any = 0;
                            for(var j in arr) {
                                if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                                    existe = true;
                                    pos = j;
                                }
                            }
                            let dia = that.getNumberDay(that.horarios[i].DIA);
                            if(arr.length == 0)
                                arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                            else
                            if(existe == false)
                                arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                            else
                                arr[pos].dow.push(dia); 
                        }
                        that.businessHours = arr;
                        that.fillCalendar(da.resultado);
                        setTimeout(() => 
                        {
                            $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                        },0);
                    }
                );
            }
        });

        $('#prestador_id').on( 'change', function () {
            if(that.prestador == false) {
                if($('#ID_SEDE').val() != '' && $('#DURACION').val() != '') {
                    that.citaForm.get('ID_PRESTADOR').setValue($(this).val());
                    that.citaForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
                    that.citaForm.get('DURACION').setValue($('#DURACION').val());
                    that.citaService.getCitasp(that.citaForm.value)
                        .subscribe(data => {
                            let da: any = data;
                            that.prestador_id = da.id;
                            $('.calendar').fullCalendar('destroy');
                            that.dias = da.dias;
                            $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                            that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                            that.horarios = da.horarios;
                            that.duracion = da.duracion;
                            that.concurrencia = da.concurrencia;
                            let multiple: any = that.concurrencia == 1 ? false : true;
                            $('#ID_PACIENTE').select2({
                                dropdownAutoWidth:!0,
                                width:"100%",
                                ajax: {
                                    url: that.globals.apiUrl+'/paciente/search',
                                    dataType: 'json',
                                    data: function (params) {
                                        return {
                                            q: params.term
                                        };
                                    }
                                },
                                language: { 
                                    inputTooShort: function () { 
                                        return 'Por favor, entre al menos 1 caracter'; 
                                    } 
                                },
                                placeholder: 'Buscar Pacientes',
                                minimumInputLength: 1,
                                maximumSelectionLength: that.concurrencia,
                                multiple: multiple,
                                allowClear: !multiple
                            });
                            that.citaForm.get('ID_GRUPO').setValue(da.grupo);
                            that.citaForm.get('ID_AGENDA').setValue(da.agenda);
                            that.agenda_id = da.agenda;
                            that.grupoh = true;
                            $('#ID_GRUPO').val(da.grupo).trigger('change');
                            that.grupoh = false;
                            that.grupo_id = da.grupo;
                            let arr = [];
                            for(var i in that.horarios) {
                                let existe = false;
                                let pos: any = 0;
                                for(var j in arr) {
                                    if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                                        existe = true;
                                        pos = j;
                                    }
                                }
                                let dia = that.getNumberDay(that.horarios[i].DIA);
                                if(arr.length == 0)
                                    arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                                else
                                if(existe == false)
                                    arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                                else
                                    arr[pos].dow.push(dia); 
                            }
                            that.businessHours = arr;
                            that.fillCalendar(da.resultado);
                            setTimeout(() => 
                            {
                                $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                            },0);
                        });
                }
                else
                {
                    if($('#DURACION').val() == '' && that.sede == false) {
                        alert("Por favor, debe escribir la duración de las citas");
                        $('#DURACION').focus();
                        that.sede = true;
                        $('#prestador_id').val('').trigger('change');
                        that.sede = false;
                        return false;
                    }
                    if(that.sede == false) {
                        alert("Por favor, debe escoger la sede para generar la Agenda");
                        that.sede = true;
                        $('#prestador_id').val('').trigger('change');
                        that.sede = false;
                        return false;
                    }
                }
            }
            else
                $('.calendar .fc-toolbar').html("Agenda: ");
        });

        $('#ID_GRUPO').on( 'change', function () {
            if(that.grupoh == false) {
                if($('#prestador_id').val() != '' && $('#DURACION').val() != '') {
                    if(!confirm("Esta seguro que desea cambiar el grupo horario?, se eliminaran todas las citas previas con el anterior horario")) {
                        that.grupoh = true;
                        $('#ID_GRUPO').val(that.grupo_id).trigger('change');
                        that.grupoh = false;
                        return false;
                    }
                    else {
                        that.citaForm.get('ID_AGENDA').setValue(that.agenda_id);
                        that.citaForm.get('ID_GRUPO').setValue($(this).val());
                        that.citaForm.get('DURACION').setValue($('#DURACION').val());
                        that.citaService.delAgenda(that.citaForm.value)
                            .subscribe(data => {
                                let da: any = data;
                                that.prestador_id = da.id;
                                $('.calendar').fullCalendar('destroy');
                                that.dias = da.dias;
                                that.horarios = da.horarios;
                                that.duracion = da.duracion;
                                that.concurrencia = da.concurrencia;
                                let multiple: any = that.concurrencia == 1 ? false : true;
                                $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                                that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                                $('#ID_PACIENTE').select2({
                                    dropdownAutoWidth:!0,
                                    width:"100%",
                                    ajax: {
                                        url: that.globals.apiUrl+'/paciente/search',
                                        dataType: 'json',
                                        data: function (params) {
                                            return {
                                                q: params.term
                                            };
                                        }
                                    },
                                    language: { 
                                        inputTooShort: function () { 
                                            return 'Por favor, entre al menos 1 caracter'; 
                                        } 
                                    },
                                    placeholder: 'Buscar Pacientes',
                                    minimumInputLength: 1,
                                    maximumSelectionLength: that.concurrencia,
                                    multiple: multiple,
                                    allowClear: !multiple
                                });
                                let arr = [];
                                for(var i in that.horarios) {
                                    let existe = false;
                                    let pos: any = 0;
                                    for(var j in arr) {
                                        if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                                            existe = true;
                                            pos = j;
                                        }
                                    }
                                    let dia = that.getNumberDay(that.horarios[i].DIA);
                                    if(arr.length == 0)
                                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                                    else
                                    if(existe == false)
                                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                                    else
                                        arr[pos].dow.push(dia); 
                                }
                                that.businessHours = arr;
                                that.fillCalendar(da.resultado);
                                setTimeout(() => 
                                {
                                    $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                                },0);
                            }
                        );
                    }
                }
                else {
                    if($('#DURACION').val() == '' && that.grupoh == false) {
                        alert("Por favor, debe escribir la duración de las citas");
                        $('#DURACION').focus();
                        that.grupoh = true;
                        $('#ID_GRUPO').val(that.grupo_id).trigger('change');
                        that.grupoh = false;
                        return false;
                    }
                }
            }
        });

        $('#SERVICIO').on( 'change', function () {
            if( ($('#ID_PACIENTE').val() == null && that.change == false ) || (Array.isArray($('#ID_PACIENTE').val()) && $('#ID_PACIENTE').val().length == 0 && that.change == false)) {
                alert("Por favor, debe escoger el paciente primero");
                that.change = true;
                $('#SERVICIO').val('').trigger('change');
                that.change = false;
            }
            else
            if($('#SERVICIO option:selected').attr('pos') == 0 && that.updateselect == false) {
                that.pacienteService.getPaciente($('#ID_PACIENTE').val())
                    .subscribe(data => {
                        let da: any = data;
                        that.pac = [];
                        that.datas = [];
                        if(!Array.isArray(da)) {
                            that.multi = false;
                            let auto = da.autorizacion;
                            let permiso = false;
                            let numero = null;
                            let id_auto = null;
                            for(var i in auto) {
                                let servi = auto[i].servicios;
                                for(var j in servi) {
                                    if(servi[j].ID_ITEM == $('#SERVICIO option:selected').val()) {
                                        if(servi[j].NUM_SESIONES_PEND > 0) {
                                            permiso = true;
                                            numero = auto[i].NUM_AUTORIZACION;
                                            id_auto = auto[i].ID_AUTORIZACION;
                                        }
                                    }
                                }
                            }
                            if(permiso == false) {
                                that.showMessage("El paciente seleccionado no tiene autorización para este servicio");
                                that.servi = $('#SERVICIO option:selected').text();
                                that.servi_id = $('#SERVICIO option:selected').val();
                                that.change = true;
                                $('#SERVICIO').val('').trigger('change');
                                that.change = false;
                                $('#AUTORIZACION').val('');
                                that.citaForm.get('AUTORIZACION').setValue('');
                                that.tiene = false;
                                $('.btn-asignar').prop('disabled', true);
                            }
                            else {
                                $('#AUTORIZACION').val(numero);
                                $('#ID_AUTORIZACION').val(id_auto);
                                that.tiene = true;
                                $('.btn-asignar').prop('disabled', false);
                            }
                        }
                        else {
                            that.multi = true;
                            that.paciente_t = da;
                            for(var i in da) {
                                let auto = da[i].autorizacion;
                                let permiso = false;
                                let numero = null;
                                let id_auto = null;
                                for(var j in auto) {
                                    let servi = auto[j].servicios;
                                    for(var n in servi) {
                                        if(servi[n].ID_ITEM == $('#SERVICIO option:selected').val()) {
                                            if(servi[n].NUM_SESIONES_PEND > 0) {
                                                permiso = true;
                                                numero = auto[j].NUM_AUTORIZACION;
                                                id_auto = auto[j].ID_AUTORIZACION;
                                            }
                                        }
                                    }
                                }
                                if(permiso == false) {
                                    that.pac.push(i);
                                }
                                else {
                                    that.datas[i] = [numero,id_auto];
                                }
                            }
                            if(that.pac.length > 0) {
                                let nombre = da[that.pac[0]].PRIMER_NOMBRE + (da[that.pac[0]].SEGUNDO_NOMBRE != null ? " "+da[that.pac[0]].SEGUNDO_NOMBRE : "");
                                let apellido = da[that.pac[0]].PRIMER_APELLIDO + (da[that.pac[0]].SEGUNDO_APELLIDO != null ? " "+da[that.pac[0]].SEGUNDO_APELLIDO : "");
                                that.paciente_name = nombre + " " + apellido;
                                that.paciente_id = da[that.pac[0]].ID_PACIENTE;
                                that.showMessage("El paciente seleccionado "+nombre + " " + apellido+" no tiene autorización para este servicio");
                                that.servi = $('#SERVICIO option:selected').text();
                                that.servi_id = $('#SERVICIO option:selected').val();
                                that.tiene = false;
                                $('.btn-asignar').prop('disabled', true);
                            }
                            else {
                                that.tiene = true;
                                $('.btn-asignar').prop('disabled', false);
                            }
                            let autor: any = '';
                            let autor_id: any = '';
                            for(var i in that.datas) {
                                autor = i == '0' ? that.datas[i][0] : autor+","+that.datas[i][0];
                                autor_id = i == '0' ? that.datas[i][1] : autor_id+","+that.datas[i][1];
                            }
                            $('#AUTORIZACION').val(autor);
                            $('#ID_AUTORIZACION').val(autor_id);
                        }
                    }
                )
            }
            else {
                $('#AUTORIZACION').val('');
                $('#ID_AUTORIZACION').val('');
                that.tiene = true;
            }
        });

        $('#ID_SEDE').on( 'change', function () {
            if(that.sede_change == true)
                return false;
            if($('#prestador_id').val() == '') {
                that.sede_id = $(this).val();
                that.getConsultorios($(this).val());
            }
            else {
                if($('#DURACION').val() == '') {
                    alert("Por favor, debe escribir la duración de las citas");
                    $('#DURACION').focus();
                    var sed = that.sede_id != 0 ? that.sede_id : '';
                    that.sede_change = true;
                    $('#ID_SEDE').val(sed).trigger('change');
                    that.sede_change = false;
                    return false;
                }
                that.citaForm.get('ID_PRESTADOR').setValue($('#prestador_id').val());
                that.citaForm.get('ID_SEDE').setValue($(this).val());
                that.citaForm.get('DURACION').setValue($('#DURACION').val());
                that.citaService.getCitasp(that.citaForm.value)
                    .subscribe(data => {
                        let da: any = data;
                        that.prestador_id = da.id;
                        $('.calendar').fullCalendar('destroy');
                        that.dias = da.dias;
                        that.horarios = da.horarios;
                        that.duracion = da.duracion;
                        that.concurrencia = da.concurrencia;
                        let multiple: any = that.concurrencia == 1 ? false : true;
                        $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                        that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                        $('#ID_PACIENTE').select2({
                            dropdownAutoWidth:!0,
                            width:"100%",
                            ajax: {
                                url: that.globals.apiUrl+'/paciente/search',
                                dataType: 'json',
                                data: function (params) {
                                    return {
                                        q: params.term
                                    };
                                }
                            },
                            language: { 
                                inputTooShort: function () { 
                                    return 'Por favor, entre al menos 1 caracter'; 
                                } 
                            },
                            placeholder: 'Buscar Pacientes',
                            minimumInputLength: 1,
                            maximumSelectionLength: that.concurrencia,
                            multiple: multiple,
                            allowClear: !multiple
                        });
                        that.citaForm.get('ID_GRUPO').setValue(da.grupo);
                        that.citaForm.get('ID_AGENDA').setValue(da.agenda);
                        that.agenda_id = da.agenda;
                        that.grupoh = true;
                        $('#ID_GRUPO').val(da.grupo).trigger('change');
                        that.grupoh = false;
                        that.grupo_id = da.grupo;
                        let arr = [];
                        for(var i in that.horarios) {
                            let existe = false;
                            let pos: any = 0;
                            for(var j in arr) {
                                if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                                    existe = true;
                                    pos = j;
                                }
                            }
                            let dia = that.getNumberDay(that.horarios[i].DIA);
                            if(arr.length == 0)
                                arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                            else
                            if(existe == false)
                                arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                            else
                                arr[pos].dow.push(dia); 
                        }
                        that.businessHours = arr;
                        that.fillCalendar(da.resultado);
                        setTimeout(() => 
                        {
                            $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                        },0);
                    }
                );
            }
        });

        $('#ID_PACIENTE').on( 'change', function () {
            if(that.paciente_c == false) {
                $('#AUTORIZACION').val('');
                $('#ID_AUTORIZACION').val('');
                that.change = true;
                $('#SERVICIO').val('').trigger('change');
                that.change = false;
                that.tiene = true;
            }
            if($(this).val() != null && $(this).val() != '') {
                that.pacienteService.getPNotificacion($(this).val())
                    .subscribe(data => {
                        let da: any = data;
                        if(da != 0 && da != null) {
                            $('input[name=datos1]').each(function() {
                                if($(this).val() == da) {
                                    $(this).attr('checked', true);
                                    $(this).parent('label').addClass('active');
                                }
                                else {
                                    $(this).attr('checked', false);
                                    $(this).parent('label').removeClass('active');
                                }
                            });
                            that.notificacion = da;
                        }
                        else {
                            $('input[name=datos1]').each(function() {
                                $(this).attr('checked', false);
                                $(this).parent('label').removeClass('active');
                            });
                            $('#correo').parent('label').addClass('active');
                            $('#correo').attr('checked', true);
                            that.notificacion = 0;
                        }
                    }
                );
            }
        });

        $('#ID_PACIENTE').on('select2:unselecting', function(event) {
            this.tiene = true;
            $('.btn-asignar').prop('disabled', false);
        });

        $('body').on('click', '[data-calendar-view]', function(e){
            e.preventDefault();

            $('[data-calendar-view]').removeClass('actions__item--active');
            $(this).addClass('actions__item--active');
            var calendarView = $(this).attr('data-calendar-view');
            $('.calendar').fullCalendar('changeView', calendarView);
        });

        $('.actions__calender-next').on('click', function (e) {
            e.preventDefault();
            $('.calendar').fullCalendar('next');
        });

        $('.actions__calender-prev').on('click', function (e) {
            e.preventDefault();
            $('.calendar').fullCalendar('prev');
        });

        $(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'})
        $(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
        $(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});

        $("body").on("click", ".boton_hora", function(a) {
            a.preventDefault();
            let arr = [];
            let pos = 0;
            for(var i in that.horarios1) {
                if(i != $(this).attr('pos')) {
                    arr[pos] = that.horarios1[i];
                    pos++;
                }
            }
            $('#addhora').html('');
            that.horarios1 = arr;
            var html = "";
            for(var i in that.horarios1){
                let html = $('#addhora').html();
                html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i]['dia']+'</span></div>'+
                              '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i]['horai']+'</span></div>'+
                              '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i]['horaf']+'</span></div>'+
                              '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                $('#addhora').html(html);
            }
        });
	}

    initForm() {
        this.citaForm = this.formBuilder.group({
            prestador_id: [''],
            ID_PRESTADOR: [''],
            ID_USUARIO: [''],
            ID_MOTIVO_CONSULTA: ['13'],
            ID_PACIENTE: [''],
            SERVICIO: [''],
            AUTORIZACION: [''],
            ID_AUTORIZACION: [''],
            FEC_CITA: [''],
            ID_EMPRESA: [''],
            ID_SEDE: [''],
            ID_CONSULTORIO: [''],
            ID_GRUPO: [''],
            ID_AGENDA: [''],
            ID_ESTADO_CITA: [''],

            ID_PACIENTES: [''],
            NUM_AUTORIZACION: ['', [Validators.required]],
            FEC_AUTORIZACION: [''],
            CERRADA: [''],
            ID_USUARIO_CREADOR: [''],
            FEC_CREACION: [''],
            FACTURADA: [''],
            NUM_SESION_AUT: [''],
            NUM_SESIONES_PEND: [''],
            NUM_SESIONES_REAL: [''],
            ID_ITEM: [''],
            SERVICIOS: [''],

            NOM_GRUPO: [''],
            GRUPO_HORARIO: [''],
            TIPO_CITA: [''],
            DURACION: [15],
            PACIENTE_C: [''],
            ID_PACIENTE_C: [''],
            OBSERVACION: [''],
            STATUS: [''],
        });

        this.pacienteForm = this.formBuilder.group({
            ID_TIPO_DOC: [''],
            NUM_DOC: ['', [Validators.required]],
            FECHA_NAC: [''],
            GENERO: [''],
            PRIMER_NOMBRE: ['', [Validators.required]],
            SEGUNDO_NOMBRE: [''],
            PRIMER_APELLIDO: ['', [Validators.required]],
            SEGUNDO_APELLIDO: [''],
            dpto: [34],
            ID_MUNICIPIO: [1127],
            ZONA: [1],
            BARRIO: [''],
            TELEF: [''],
            MOVIL: [''],
            CORREO: ['', [Validators.email]],
            DIREC_PACIENTE: [''],
            ACTIVO: [1],
            ID_ESTADO_CIVIL: [6],
            ID_GRP_SANG: [1],
            ID_ESCOLARIDAD: [1],
            ID_ETNIA: [6],
            ID_OCUPACION: [511],
            ID_DISCAPACIDAD: [5],
            ID_RELIGION: [6],
            GESTACION: [''],
            ID_TIPO_AFIL: [7],
            FECHA_AFIL: [''],
            NUM_SISBEN: [''],
            FECHA_SISBEN: [''],
            ID_REGIMEN: [5],
            ID_ADMINISTRADORA: [''],
            CONTRATO: [''],
            DATOS: [''],
            NOTIFICACION: [1],
        });
    }

    getNumberDay(day) {
        if(day == "Lunes")
            return 1;
        else
        if(day == "Martes")
            return 2;
        else
        if(day == "Miércoles")
            return 3;
        else
        if(day == "Jueves")
            return 4;
        else
        if(day == "Viernes")
            return 5;
        else
        if(day == "Sábado")
            return 6;
        else
        if(day == "Domingo")
            return 0;
    }

    TodasCitas() {
        var that = this;
        if($('#ID_SEDE').val() == null || $('#ID_SEDE').val() == '') {
            alert("Por favor, debe escoegr la sede");
            return false;
        }

        if($('#prestador_id').val() == null || $('#prestador_id').val() == '') {
            alert("Por favor, debe escoegr el prestador");
            return false;
        }

        if($('#DURACION').val() == '') {
            alert("Por favor, debe escribir la duración de las citas");
            $('#DURACION').focus();
            return false;
        }

        that.citaForm.get('ID_PRESTADOR').setValue($('#prestador_id').val());
        that.citaForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
        that.citaForm.get('DURACION').setValue($('#DURACION').val());
        that.citaService.getCitasp(that.citaForm.value)
            .subscribe(data => {
                let da: any = data;
                that.prestador_id = da.id;
                $('.calendar').fullCalendar('destroy');
                that.dias = da.dias;
                $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                that.horarios = da.horarios;
                that.duracion = da.duracion;
                that.concurrencia = da.concurrencia;
                let multiple: any = that.concurrencia == 1 ? false : true;
                $('#ID_PACIENTE').select2({
                    dropdownAutoWidth:!0,
                    width:"100%",
                    ajax: {
                        url: that.globals.apiUrl+'/paciente/search',
                        dataType: 'json',
                        data: function (params) {
                            return {
                                q: params.term
                            };
                        }
                    },
                    language: { 
                        inputTooShort: function () { 
                            return 'Por favor, entre al menos 1 caracter'; 
                        } 
                    },
                    placeholder: 'Buscar Pacientes',
                    minimumInputLength: 1,
                    maximumSelectionLength: that.concurrencia,
                    multiple: multiple,
                    allowClear: !multiple
                });
                that.citaForm.get('ID_GRUPO').setValue(da.grupo);
                that.citaForm.get('ID_AGENDA').setValue(da.agenda);
                that.agenda_id = da.agenda;
                that.grupoh = true;
                $('#ID_GRUPO').val(da.grupo).trigger('change');
                that.grupoh = false;
                that.grupo_id = da.grupo;
                let arr = [];
                for(var i in that.horarios) {
                    let existe = false;
                    let pos: any = 0;
                        for(var j in arr) {
                        if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                            existe = true;
                            pos = j;
                        }
                    }
                    let dia = that.getNumberDay(that.horarios[i].DIA);
                    if(arr.length == 0)
                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                    else
                    if(existe == false)
                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                    else
                        arr[pos].dow.push(dia); 
                }
                that.businessHours = arr;
                that.fillCalendar(da.resultado);
                setTimeout(() => 
                {
                    $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                },0);
            }
        );
    }

    filterStatus(status) {
        var that = this;
        if($('#ID_SEDE').val() == null || $('#ID_SEDE').val() == '') {
            alert("Por favor, debe escoegr la sede");
            return false;
        }

        if($('#prestador_id').val() == null || $('#prestador_id').val() == '') {
            alert("Por favor, debe escoegr el prestador");
            return false;
        }

        if($('#DURACION').val() == '') {
            alert("Por favor, debe escribir la duración de las citas");
            $('#DURACION').focus();
            return false;
        }

        this.citaForm.get('ID_PRESTADOR').setValue($('#prestador_id').val());
        this.citaForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
        this.citaForm.get('DURACION').setValue($('#DURACION').val());
        this.citaForm.get('STATUS').setValue(status);
        this.citaService.filterStatus(this.citaForm.value)
            .subscribe(data => {
                let da: any = data;
                that.prestador_id = da.id;
                $('.calendar').fullCalendar('destroy');
                that.dias = da.dias;
                $('#ID_CONSULTORIO').val(da.consult).trigger('change');
                that.citaForm.get('ID_CONSULTORIO').setValue(da.consult);
                that.horarios = da.horarios;
                that.duracion = da.duracion;
                that.concurrencia = da.concurrencia;
                let multiple: any = that.concurrencia == 1 ? false : true;
                $('#ID_PACIENTE').select2({
                    dropdownAutoWidth:!0,
                    width:"100%",
                    ajax: {
                        url: that.globals.apiUrl+'/paciente/search',
                        dataType: 'json',
                        data: function (params) {
                            return {
                                q: params.term
                            };
                        }
                    },
                    language: { 
                        inputTooShort: function () { 
                            return 'Por favor, entre al menos 1 caracter'; 
                        } 
                    },
                    placeholder: 'Buscar Pacientes',
                    minimumInputLength: 1,
                    maximumSelectionLength: that.concurrencia,
                    multiple: multiple,
                    allowClear: !multiple
                });
                that.citaForm.get('ID_GRUPO').setValue(da.grupo);
                that.citaForm.get('ID_AGENDA').setValue(da.agenda);
                that.agenda_id = da.agenda;
                that.grupoh = true;
                $('#ID_GRUPO').val(da.grupo).trigger('change');
                that.grupoh = false;
                that.grupo_id = da.grupo;
                let arr = [];
                for(var i in that.horarios) {
                    let existe = false;
                    let pos: any = 0;
                    for(var j in arr) {
                        if(arr[j].start == that.horarios[i].HORA_INICIO && arr[j].end == that.horarios[i].HORA_FIN) {
                            existe = true;
                            pos = j;
                        }
                    }
                    let dia = that.getNumberDay(that.horarios[i].DIA);
                    if(arr.length == 0)
                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]}); 
                    else
                    if(existe == false)
                        arr.push({'start': that.horarios[i].HORA_INICIO,'end': that.horarios[i].HORA_FIN,'dow': [dia]});
                    else
                        arr[pos].dow.push(dia); 
                }
                that.businessHours = arr;
                that.fillCalendar(da.resultado);
                setTimeout(() => 
                {
                    $('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
                },0);
            }
        );
    }

    CancelarCita() {
        $('#cita').modal('hide');
        if(this.multi == false) {
            this.citaForm.get('PACIENTE_C').setValue($('#ID_PACIENTE option:selected').val());
            $('#PACIENTE_C').val($('#ID_PACIENTE option:selected').text());
        }
        else {
            this.citaForm.get('PACIENTE_C').setValue(this.paciente_id);
            $('#PACIENTE_C').val(this.paciente_name);
        }
        setTimeout(() => 
        {
            $('#cancel_modal').modal('show');
        },500);
    }

    fillGrupo() {
        var that = this;
        var datos = [];
        this.gruposhService.getGrupoH($('#ID_GRUPO').val())
            .subscribe(data => {
                var grupo: any = data;
                this.grupo_id1 = grupo.ID_GRUPO;
                this.citaForm.get('NOM_GRUPO').setValue(grupo.NOM_GRUPO);
                this.citaForm.get('GRUPO_HORARIO').setValue(grupo.dias);
                $('#addhora').html('');
                let arr = grupo.dias;
                this.horarios1 = [];
                for(var i in arr){
                    this.horarios1.push({'dia': arr[i].DIA, 'horai': arr[i].HORA_INICIO, 'horaf': arr[i].HORA_FIN});
                    let html = $('#addhora').html();
                    html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i].DIA+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i].HORA_INICIO+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i].HORA_FIN+'</span></div>'+
                                  '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                    $('#addhora').html(html);
                }
                $('[data-toggle="tooltip"]').tooltip();
                $('.btn-addp1').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#NOM_GRUPO').focus();
            }
        );
    }

    Asignar1() {
        let existe: any = false;
        let datos: any = [];
        let i = 0;
        if($('#horai').val() == null) {
            alert('Por favor, escoja la hora de inicio');
            return false;
        }
        else
        if($('#horaf').val() == null) {
            alert("Por Favor, escoja la hora final");
            return false;
        }
        $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {              
                datos[i] = $(this).val();
                i++;
                existe = true;
            }
            else
            {
                datos[i] = 0;
                i++;
            }
        });
        if(existe == true)
            this.datos = datos;
        else {
            alert("Por favor, debe escoger al menos un día de la semana");
            return false;
        }
        if(this.ValidarH()) {
            for(var j in this.datos) {
                if(this.datos[j] != 0) {
                    this.horarios1.push({'dia': this.datos[j], 'horai': $('#horai').val(), 'horaf': $('#horaf').val()});
                    let html = $('#addhora').html();
                    let pos = this.horarios1.length - 1;
                    html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+this.datos[j]+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+$('#horai').val()+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+$('#horaf').val()+'</span></div>'+
                                  '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+pos+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                    $('#addhora').html(html);
                }
            }
            $('input[name=datos]').each(function() {
                $(this).prop('checked', false);
                $(this).parent('label').removeClass('active');            
            });
            this.datos = [];
            $(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
            $(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});
        }       
    }

    ValidarH() {
        if($('#horai').val() == null || $('#horaf').val() == null) {
            alert("Por favor, debe escoger la hora de inicio y final");
            return false;
        }
        else
        if($('#horai').val() >= $('#horaf').val()) {
            alert("Por favor, la hora final debe ser mayor que la de inicio")
            return false;
        }
        else {
            for(var i in this.datos) {
                if(this.datos[i] != 0) {
                    for(var j in this.horarios1) {
                        if(this.horarios1[j]['dia'] == this.datos[i]) {
                            if(this.horarios1[j]['horai'] <= $('#horai').val() && this.horarios1[j]['horaf'] >= $('#horai').val()) {
                                alert('La hora de inicio se encuentra dentro de un rango de horas asignado para el día ' + this.datos[i]);
                                return false;
                            }
                            else
                            if(this.horarios1[j]['horai'] <= $('#horaf').val() && this.horarios1[j]['horaf'] >= $('#horaf').val()) {
                                alert('La hora final se encuentra dentro de un rango de horas asignado para el día ' + this.datos[i]);
                                return false;
                            }
                            else
                            if( ($('#horai').val() < this.horarios1[j]['horai'] && $('#horaf').val() > this.horarios1[j]['horaf']) ) {
                                alert('Existe un rango de horas asignado dentro  del actual para el día ' + this.datos[i]);
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
    }

    Registrar1() {
        if ($('#NOM_GRUPO').val() == '') {
            alert("Por favor debe escribir el nombre del grupo");
            $('#NOM_GRUPO').focus();
            return;
        }
        if(this.horarios1.length == 0) {
            alert("Por favor, agregue los horarios");
            return false;
        }

        if(this.grupo_id1 == 0) {
            /*if(!confirm("Esta Seguro que desea Registrar el grupo Horario?")) 
                return false;*/
            this.citaForm.get('GRUPO_HORARIO').setValue(this.horarios1);
            this.citaForm.get('NOM_GRUPO').setValue($('#NOM_GRUPO').val());
            this.gruposhService.crearGrupoH(this.citaForm.value)
                .subscribe(data => {
                    let da: any = data;
                    this.clearAll();
                    this.showMessage("Grupo horario registrado");
                    var newOptions = '<option value="'+ da.ID_GRUPO +'">'+ da.NOM_GRUPO +'</option>';
                    var html = $('#ID_GRUPO').html();
                    $('#ID_GRUPO').html(html+newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                    $('#grupo_horario').modal('hide');
                    $('#ID_GRUPO').val(da.ID_GRUPO).trigger('change');
                }
            );
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar el grupo Horario?")) 
                return false;*/
            this.citaForm.get('GRUPO_HORARIO').setValue(this.horarios1);
            this.citaForm.get('NOM_GRUPO').setValue($('#NOM_GRUPO').val());
            this.gruposhService.updateGrupoH(this.grupo_id1, this.citaForm.value)
                .subscribe(data => {
                    let da: any = data;
                    this.clearAll();
                    this.showMessage("Grupo horario actualizado");
                    this.horarios = da;
                    $('#grupo_horario').modal('hide');
                }
            );
        }
    }

    clearAll() {
        this.grupo_id1 = 0;
        this.horarios1 = [];
        this.datos = [];
        this.citaForm.get('NOM_GRUPO').setValue('');
        this.citaForm.get('GRUPO_HORARIO').setValue('');
        $('#NOM_GRUPO').val('');
        $('.btn-addp1').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        $('#addhora').html('');
        $('input[name=datos]').each(function() {
            $(this).prop('checked', false);
            $(this).parent('label').removeClass('active');            
        });
        $(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
        $(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});
    }

	fillCalendar(eventos) {
        let that = this;
        $('.calendar').fullCalendar({
            header: {
                right: '',
                center: '',
                left: ''
            },
            buttonIcons: {
                prev: 'calendar__prev',
                next: 'calendar__next'
            },
            defaultView: 'agendaWeek',
            slotLabelFormat: 'h:mm a',
            minTime: '08:00:00',
            maxTime: '18:00:00',
            color: '#c0c0c0',
            fixedWeekCount: false,
            editable: true,
            droppable: false,
            eventLimit: true,
            selectable: false,
            allDaySlot: false,
            slotEventOverlap: true,
            slotDuration: "00:"+that.duracion+":00",
            slotLabelInterval: '00:'+that.duracion,
            locale: 'es',
            events: eventos,
            businessHours: that.businessHours,
            displayEventTime: false,
            views: {
                agenda: {
                    eventLimit: 1
                }
            },
            eventRender: function(eventObj, $el) {
                if(eventObj.ids != null) {
                    let informacion: any = eventObj.title.split(" - ");
                    let content: any = '';
                    for(var i in informacion) {
                        content += "<div class='col-md-12'>"+informacion[i]+"</div>";
                    }
                    $el.popover({
                        title: "Datos de la cita",
                        content: content,
                        trigger: 'hover',
                        placement: 'top',
                        container: 'body',
                        html: true
                    });
                }
            },
            validRange: function(nowDate) {
                return {
                    start: nowDate.clone().subtract(1, 'days')
                };
            },
            viewRender: function (view) {
                var calendarDate = $('.calendar').fullCalendar('getDate');
                var calendarMonth = calendarDate.month();

                $('.content__title--calendar > h1').html(view.title);
            },
            eventResize: function(event, delta, revertFunc) {
                alert("No puede aumentar la cita del horario asignado");
                revertFunc();
            },

            eventOverlap: function(stillEvent, movingEvent) {
                return false;
            },
            eventDrop: function(event, delta, revertFunc) {
                var dates = moment(event.start).format('YYYY-MM-DD');
                var hora = moment(event.start).format('h:mm a');
                if(confirm('Esta seguro que desea mover la cita para el día '+ dates + ' a las ' + hora)) { 
                    var ev: any = {}; 
                    ev.id = event.ids;
                    ev.start = event.start;
                    that.updateEvento(ev);
                }
                else
                   revertFunc(); 
            },
            eventClick: function (event, element) {
                $('.edit-event__id').val(event._id);
                var dates = moment(event.start).format('YYYY-MM-DD');
                var hora = moment(event.start).format('h:mm a');
                $('.fecha').val(dates);
                $('.hora').val(hora);
                that.citaService.getCita(event.ids)
                    .subscribe(data => {
                        let da: any = data;
                        that.estado_c = da.ID_ESTADO_CITA;
                        that.evento_id = event.ids;
                        let nombre = da.paciente.PRIMER_NOMBRE + (da.paciente.SEGUNDO_NOMBRE != null ? " "+da.paciente.SEGUNDO_NOMBRE : "");
                        let apellido = da.paciente.PRIMER_APELLIDO + (da.paciente.SEGUNDO_APELLIDO != null ? " "+da.paciente.SEGUNDO_APELLIDO : "");
                        var newOptions = '<option value="'+ da.ID_PACIENTE +'">'+ nombre+" "+apellido +'</option>';
                        let multiple: any = that.concurrencia == 1 ? false : true;
                        if(that.concurrencia == 1)
                            $('#ID_PACIENTE').empty().html(newOptions).select2({
                                dropdownAutoWidth:!0,
                                width:"100%",
                                ajax: {
                                    url: that.globals.apiUrl+'/paciente/search',
                                    dataType: 'json',
                                    data: function (params) {
                                        return {
                                            q: params.term
                                        };
                                    }
                                },
                                language: { 
                                    inputTooShort: function () { 
                                        return 'Por favor, entre al menos 1 caracter'; 
                                    } 
                                },
                                placeholder: 'Buscar Pacientes',
                                minimumInputLength: 1,
                                allowClear: true
                            });
                        else
                            $('#ID_PACIENTE').html(newOptions).select2({
                                dropdownAutoWidth:!0,
                                width:"100%",
                                ajax: {
                                    url: that.globals.apiUrl+'/paciente/search',
                                    dataType: 'json',
                                    data: function (params) {
                                        return {
                                            q: params.term
                                        };
                                    }
                                },
                                language: { 
                                    inputTooShort: function () { 
                                        return 'Por favor, entre al menos 1 caracter'; 
                                    } 
                                },
                                placeholder: 'Buscar Pacientes',
                                minimumInputLength: 1,
                                maximumSelectionLength: that.concurrencia,
                                multiple: multiple,
                                allowClear: !multiple
                            });
                        that.paciente_c = true;
                        $('#ID_PACIENTE').val(da.ID_PACIENTE).trigger('change');
                        that.paciente_c = false;
                        that.updateselect = true;
                        that.change = true;
                        $('#SERVICIO').val(da.ID_ITEM).trigger('change');
                        $('#ID_CONSULTORIO').val(da.ID_CONSULTORIO).trigger('change');
                        //$('#SERVICIO').prop("disabled", true);
                        that.change = false;
                        that.updateselect = false;
                        $('#ID_MOTIVO_CONSULTA').val(da.ID_MOTIVO_CONSULTA).trigger('change');
                        if(da.TIPO_CITA != 0)
                            $('#TIPO_CITA').val(da.TIPO_CITA).trigger('change');
                        $('#cita').modal('show');
                        if(da.autorizacion != null) {
                            $('#ID_AUTORIZACION').val(da.autorizacion.ID_AUTORIZACION);
                            $('#AUTORIZACION').val(da.autorizacion.autorizacion.NUM_AUTORIZACION);
                        }
                        else
                        {
                            $('#AUTORIZACION').val('');
                            $('#ID_AUTORIZACION').val('');
                        }
                        $('.btn-asignar').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                    })
            },
            dayClick: function(date, jsEvent, view) {
                let dia = moment(date).format('YYYY-MM-DD');
                if(that.dias != null && that.dias.indexOf(dia) != -1) {
                    alert("Día no laborable");
                    return;
                }
                if($('#prestador_id').val() == '') {
                    alert("Por favor, debe buscar el prestador");
                    return false;
                }
                dia = moment(date).locale('es').format('dddd');
                let h = moment(date).format('HH:mm:ss');
                let existe = false;
                for(var i in that.horarios) {
                    if(that.horarios[i].DIA.toLowerCase() == dia) {
                        if(that.horarios[i].HORA_INICIO <= h && that.horarios[i].HORA_FIN > h) {
                            existe = true;
                        }
                    }
                }
                if(existe == false) {
                    alert("El prestador seleccionado no permite Citas en este horario");
                    return false;
                }
                
                $('#cita').modal('show');
                var dates = moment(date).format('YYYY-MM-DD');
                var hora = moment(date).format('h:mm a');
                $('.fecha').val(dates);
                $('.hora').val(hora);
                var start = moment(date).toISOString();
                var end = moment(date).add(that.duracion,"minutes").toISOString();
                $('.start').val(start);
                $('.end').val(end);
            },
        });
    }

    Cancelcancel() {
        $('#cancel_modal').modal('hide');
        setTimeout(() => 
        {
            $('#cita').modal('show');
        },500);
    }

    updateEvento(ev) {
        this.citaService.updateCita(ev.id, ev.start)
            .subscribe(() => {
                this.showMessage("Cita actualizada");
            })
    }

    Asignar() {
        var that = this;
        var GenRandom =  {
            Stored: [],
            Job: function(){
                var newId = Date.now().toString().substr(6); // or use any method that you want to achieve this string
                if( !this.Check(newId) ){
                    this.Stored.push(newId);
                    return newId;
                }
                return this.Job();
            },
            Check: function(id){
                for( var i = 0; i < this.Stored.length; i++ ){
                    if( this.Stored[i] == id ) return true;
                }
                return false;
            }
        };
        if($('#ID_PACIENTE').val() == null || (Array.isArray($('#ID_PACIENTE').val()) && $('#ID_PACIENTE').val().length == 0)) {
            alert("Por favor, debe buscar el paciente primero");
            return false;
        }
        else
        if($('#SERVICIO').val() == '') {
            alert("Por favor, debe escoger el servicio");
            return false;
        }
        else
        if($('#ID_CONSULTORIO').val() == '') {
            alert("Por favor, debe escoger el consultorio");
            return false;
        }
        if($('#TIPO_CITA').val() == '' || $('#TIPO_CITA').val() == null) {
            alert("Por favor, debe escoger el tipo de cita");
            return false;
        }
        var pac = $('#ID_PACIENTE').val();
        if(that.evento_id == 0) {
            //if(confirm('Esta seguro que desea agregar la cita para el día '+ $('.fecha').val() + ' a las ' + $('.hora').val())) { 
                this.citaForm.get('ID_PACIENTE').setValue($('#ID_PACIENTE').val());
                this.citaForm.get('ID_PRESTADOR').setValue(this.prestador_id);
                this.citaForm.get('ID_USUARIO').setValue(this.user_id);
                this.citaForm.get('SERVICIO').setValue($('#SERVICIO').val());
                this.citaForm.get('ID_MOTIVO_CONSULTA').setValue($('#ID_MOTIVO_CONSULTA').val());
                this.citaForm.get('ID_AUTORIZACION').setValue($('#ID_AUTORIZACION').val());
                this.citaForm.get('FEC_CITA').setValue($('.start').val());
                this.citaForm.get('ID_AGENDA').setValue(that.agenda_id);
                this.citaForm.get('ID_CONSULTORIO').setValue($('#ID_CONSULTORIO').val());
                this.citaForm.get('TIPO_CITA').setValue($('#TIPO_CITA').val());
                this.citaService.crearCita(this.citaForm.value)
                    .subscribe(data => {
                        let da: any = data;
                        if(!Array.isArray(da)) {
                            let nombre = da.PRIMER_NOMBRE + (da.SEGUNDO_NOMBRE != null ? " "+da.SEGUNDO_NOMBRE : "");
                            let apellido = da.PRIMER_APELLIDO + (da.SEGUNDO_APELLIDO != null ? " "+da.SEGUNDO_APELLIDO : "");
                            let administradora = da.contrato != null ? da.contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                            $('.calendar').fullCalendar('renderEvent', {
                                id: GenRandom.Job(),
                                ids: da.id_cita,
                                title: "Identidad: " + da.NUM_DOC + " - Nombre: " + nombre + " " + apellido + " - Servicio: " + $('#SERVICIO option:selected').html() + " - Motivo: " + $('#ID_MOTIVO_CONSULTA option:selected').html() + " - Consultorio: " + $('#ID_CONSULTORIO option:selected').html() + " - Administradora: " + administradora + " - Prestador: " + da.prestador,
                                start: $('.start').val(),
                                end: $('.end').val(),
                                allDay: false,
                                className: 'bg-teal'//colores(bg-light-blue, bg-teal, bg-red, bg-purple, bg-amber, bg-cyan)
                                //prestador = that.prestador_id,
                                //usuario = that.user_id,
                            },
                            true);
                            this.DismissR();
                            this.showMessage("Cita creada");
                            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                        }
                        else
                        {
                            for(var i in da) {
                                let nombre = da[i].PRIMER_NOMBRE + (da[i].SEGUNDO_NOMBRE != null ? " "+da[i].SEGUNDO_NOMBRE : "");
                                let apellido = da[i].PRIMER_APELLIDO + (da[i].SEGUNDO_APELLIDO != null ? " "+da[i].SEGUNDO_APELLIDO : "");
                                let administradora = da[i].contrato != null ? da[i].contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                                $('.calendar').fullCalendar('renderEvent', {
                                    id: GenRandom.Job(),
                                    ids: da[i].id_cita,
                                    title: "Identidad: " + da[i].NUM_DOC + " - Nombre: " + nombre + " " + apellido + " - Servicio: " + $('#SERVICIO option:selected').html() + " - Motivo: " + $('#ID_MOTIVO_CONSULTA option:selected').html() + " - Consultorio: " + $('#ID_CONSULTORIO option:selected').html() + " - Administradora: " + administradora + " - Prestador: " + da[i].prestador,
                                    start: $('.start').val(),
                                    end: $('.end').val(),
                                    allDay: false,
                                    className: 'bg-teal'//colores(bg-light-blue, bg-teal, bg-red, bg-purple, bg-amber, bg-cyan)
                                    //prestador = that.prestador_id,
                                    //usuario = that.user_id,
                                },
                                true);
                            }
                            this.DismissR();
                            this.showMessage("Cita creada");
                            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                        }
                    }
                );
            //}
        }
        else {
            //if(confirm('Esta seguro que desea modificar la cita del día '+ $('.fecha').val() + ' a las ' + $('.hora').val())) { 
                var currentId = $('.edit-event__id').val();
                var currentEvent = $('.calendar').fullCalendar('clientEvents', currentId);
                this.citaForm.get('ID_PACIENTE').setValue($('#ID_PACIENTE').val());
                this.citaForm.get('ID_MOTIVO_CONSULTA').setValue($('#ID_MOTIVO_CONSULTA').val());
                this.citaForm.get('ID_AGENDA').setValue(that.agenda_id);
                this.citaForm.get('ID_CONSULTORIO').setValue($('#ID_CONSULTORIO').val());
                this.citaForm.get('TIPO_CITA').setValue($('#TIPO_CITA').val());
                let estad_c: any = $('#cita_estado').prop('checked') == true ? 2 : this.estado_c > 1 ? this.estado_c : 1;
                this.citaForm.get('ID_ESTADO_CITA').setValue(estad_c);
                this.citaService.updateCitat(that.evento_id, this.citaForm.value)
                    .subscribe(data => {
                        let da: any = data;
                        if(!Array.isArray(da)) {
                            let nombre = da.PRIMER_NOMBRE + (da.SEGUNDO_NOMBRE != null ? " "+da.SEGUNDO_NOMBRE : "");
                            let apellido = da.PRIMER_APELLIDO + (da.SEGUNDO_APELLIDO != null ? " "+da.SEGUNDO_APELLIDO : "");
                            let administradora = da.contrato != null ? da.contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                            currentEvent[0].title = "Identidad: " + da.NUM_DOC + " - Nombre: " + nombre + " " + apellido + " - Servicio: " + $('#SERVICIO option:selected').html() + " - Motivo: " + $('#ID_MOTIVO_CONSULTA option:selected').html() + " - Consultorio: " + $('#ID_CONSULTORIO option:selected').html() + " - Administradora: " + administradora + " - Prestador: " + da.prestador;
                            currentEvent[0].className = estad_c == 1 ? ['bg-teal'] : ['bg-light-blue'];
                            $('.calendar').fullCalendar('updateEvent', currentEvent[0]);
                            this.DismissR();
                            this.showMessage("Cita actualizada");
                            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                        }
                        else {
                            let nombre = da[0].PRIMER_NOMBRE + (da[0].SEGUNDO_NOMBRE != null ? " "+da[0].SEGUNDO_NOMBRE : "");
                            let apellido = da[0].PRIMER_APELLIDO + (da[0].SEGUNDO_APELLIDO != null ? " "+da[0].SEGUNDO_APELLIDO : "");
                            let administradora = da[0].contrato != null ? da[0].contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                            currentEvent[0].title = "Identidad: " + da[0].NUM_DOC + " - Nombre: " + nombre + " " + apellido + " - Servicio: " + $('#SERVICIO option:selected').html() + " - Motivo: " + $('#ID_MOTIVO_CONSULTA option:selected').html() + " - Consultorio: " + $('#ID_CONSULTORIO option:selected').html() + " - Administradora: " + administradora + " - Prestador: " + da[0].prestador;
                            currentEvent[0].className = estad_c == 1 ? ['bg-teal'] : ['bg-light-blue'];
                            $('.calendar').fullCalendar('updateEvent', currentEvent[0]);
                            this.DismissR();
                            this.showMessage("Cita actualizada");
                            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                        }
                    }
                );
            //}
        }
        var noti = 0;
        $('input[name=datos1]').each(function() {
            if($(this).prop('checked') == true) {               
                noti = $(this).val();
            }
        });
        if(this.notificacion != noti) {
            this.pacienteService.updatePNotificacion(pac, noti)
                .subscribe(() => {

                });
        }
    }

    getConsultorios(e) {
        if(e != null) {
            this.consultService.getConsultorios(e)
                .subscribe(data => {
                    var newOptions = '<option value="">Seleccione...</option>';
                    for(var d in data) {
                        newOptions += '<option value="'+ data[d].ID_CONSULTORIO +'">'+ data[d].NOM_CONSULTORIO +'</option>';
                    }
                    $('#ID_CONSULTORIO').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                }
            );
        }
        else
            $('#ID_CONSULTORIO').empty().select2({dropdownAutoWidth:!0,width:"100%"});
    }

    deleteEvent() {
        var currentId = $('.edit-event__id').val();
        var currentEvent = $('.calendar').fullCalendar('clientEvents', currentId);
        var OBSERVACION = $('#OBSERVACION').val();
        if(confirm("Esta seguro de cancelar la CITA?"))
            this.citaService.delCita(this.evento_id, OBSERVACION)
                .subscribe(() => {
                    $('#cancel_modal').modal('hide');
                    this.DismissR();
                    $('.calendar').fullCalendar('removeEvents', currentId);
                    this.showMessage("Cita cancelada");
                    $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                }
            );
    }

    AutoModal() {
        $('#cita').modal('hide');
        if(this.multi == false) {
            this.citaForm.get('ID_PACIENTES').setValue($('#ID_PACIENTE option:selected').val());
            $('#ID_PACIENTES').val($('#ID_PACIENTE option:selected').text());
        }
        else {
            this.citaForm.get('ID_PACIENTES').setValue(this.paciente_id);
            $('#ID_PACIENTES').val(this.paciente_name);
        }
        this.citaForm.get('ID_ITEM').setValue(this.servi_id);
        $('#ID_ITEM').val(this.servi);
        $('#NUM_AUTORIZACION').val('');
        $('#FEC_AUTORIZACION').val('');
        $('#NUM_SESION_AUT').val('');
        setTimeout(() => 
        {
            $('#auto_modal').modal('show');
        },500);
    }

    Registrar() {

        if($('#NUM_AUTORIZACION').val() == '') {
            alert("Por favor, diga el número de autorización");
            return false;
        }
        else
        if($('#NUM_SESION_AUT').val() == '') {
            alert("Por favor, diga la cantidad de secciones");
            return false;
        }
        /*if(!confirm("Esta Seguro que desea Registrar la AUTORIZACION?")) 
            return false;*/

        this.citaForm.get('ID_USUARIO_CREADOR').setValue(this.user_id);
        this.autoService.crearAuto(this.citaForm.value)
            .subscribe(data => {
                this.tiene = false;
                this.change = true;
                $('#SERVICIO').val(this.servi_id).trigger('change');
                this.change = false;
                this.showMessage("Autorización registrada");
                $('#auto_modal').modal('hide');
                setTimeout(() => 
                {
                    $('#cita').modal('show');
                },500);
            }
        );
    }

    CancelAuto() {
        $('#auto_modal').modal('hide');
        setTimeout(() => 
        {
            $('#cita').modal('show');
        },500);
    }

    CancelPaciente() {
        $('#paciente_modal').modal('hide');
        setTimeout(() => 
        {
            $('#cita').modal('show');
        },500);
    }

    PacienteModal() {
        let arr: any = $('#ID_PACIENTE').val();
        if(Array.isArray(arr) && arr.length == this.concurrencia) {
            alert("La cantidad de pacientes escogidos es igual a la concurrencia del prestador");
            return false;
        }
        $('#cita').modal('hide');
        this.codifService.getDptos()
            .subscribe(data => {
                this.dptos = data;
                this.codifService.getMunicipios()
                    .subscribe(data => {
                        this.municipios = data;
                        this.codifService.getTipoIdent()
                            .subscribe(data => this.tipoident = data);
                    }
                );
            }
        );
        setTimeout(() => 
        {
            $('#paciente_modal').modal('show');
        },500);
    }

    get f() { return this.pacienteForm.controls; }

    RegistrarP() {
        var that = this;
        this.submitted = true;

        if (this.pacienteForm.invalid) {
            return;
        }
        if($('#ID_MUNICIPIO').val() == '' || $('#ID_MUNICIPIO').val() == null) {
            alert("Por favor, escoja el municipio");
            return false;
        }

        /*if(!confirm("Esta Seguro que desea Registrar el PACIENTE?")) 
            return false;*/
        this.pacienteForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        this.pacienteForm.get('ID_TIPO_DOC').setValue($('#ID_TIPO_DOC').val());
        this.pacienteService.crearPacienteCita(this.pacienteForm.value)
            .subscribe(data => {
                let da: any = data;
                this.showMessage("Paciente registrado");
                this.submitted = false;
                var nombre = da.PRIMER_NOMBRE + (da.SEGUNDO_NOMBRE != null ? " "+da.SEGUNDO_NOMBRE : "");
                var apellidos = da.PRIMER_APELLIDO + (da.SEGUNDO_APELLIDO != null ? " "+da.SEGUNDO_APELLIDO : "");
                var newOptions = '<option value="'+da.ID_PACIENTE+'">'+nombre + ' ' + apellidos+'</option>';
                let multiple: any = that.concurrencia == 1 ? false : true;
                if(this.concurrencia == 1) {
                    $('#ID_PACIENTE').empty().html(newOptions).select2({
                        dropdownAutoWidth:!0,
                        width:"100%",
                        ajax: {
                            url: that.globals.apiUrl+'/paciente/search',
                            dataType: 'json',
                            data: function (params) {
                                return {
                                    q: params.term
                                };
                            }
                        },
                        language: { 
                            inputTooShort: function () { 
                                return 'Por favor, entre al menos 1 caracter'; 
                            } 
                        },
                        placeholder: 'Buscar Pacientes',
                        minimumInputLength: 1,
                        allowClear: true
                    });
                    $('#ID_PACIENTE').val(da.ID_PACIENTE).trigger('change');
                }
                else {
                    let selectedItems: any = $('#ID_PACIENTE').select2("val");
                    selectedItems.push(da.ID_PACIENTE.toString());
                    var option = new Option(nombre + ' ' + apellidos, da.ID_PACIENTE, true, true);
                    $("#ID_PACIENTE").append(option);
                    $("#ID_PACIENTE").val(selectedItems);
                    $("#ID_PACIENTE").trigger('change');
                    $('#ID_PACIENTE').select2({
                        dropdownAutoWidth:!0,
                        width:"100%",
                        ajax: {
                            url: that.globals.apiUrl+'/paciente/search',
                            dataType: 'json',
                            data: function (params) {
                                return {
                                    q: params.term
                                };
                            }
                        },
                        language: { 
                            inputTooShort: function () { 
                                return 'Por favor, entre al menos 1 caracter'; 
                            } 
                        },
                        placeholder: 'Buscar Pacientes',
                        minimumInputLength: 1,
                        maximumSelectionLength: that.concurrencia,
                        multiple: multiple,
                        allowClear: !multiple
                    });
                }
                this.clearPac();
            }
        );
    }

    RegistroClinico() {
        $('#cita').modal('hide');
        let url: any = '/historias?cita_id='+this.evento_id;
        this.router.navigateByUrl(url);
    }

    clearPac() {
        this.pacienteForm.get('ID_TIPO_DOC').setValue('');
        this.pacienteForm.get('NUM_DOC').setValue('');
        this.pacienteForm.get('FECHA_NAC').setValue('');
        this.pacienteForm.get('GENERO').setValue('');
        this.pacienteForm.get('PRIMER_NOMBRE').setValue('');
        this.pacienteForm.get('SEGUNDO_NOMBRE').setValue('');
        this.pacienteForm.get('PRIMER_APELLIDO').setValue('');
        this.pacienteForm.get('SEGUNDO_APELLIDO').setValue('');
        this.pacienteForm.get('dpto').setValue(34);
        this.pacienteForm.get('ID_MUNICIPIO').setValue(1127);
        this.pacienteForm.get('ZONA').setValue(1);
        this.pacienteForm.get('BARRIO').setValue('');
        this.pacienteForm.get('TELEF').setValue('');
        this.pacienteForm.get('MOVIL').setValue('');
        this.pacienteForm.get('CORREO').setValue('');
        this.pacienteForm.get('DIREC_PACIENTE').setValue('');
        this.pacienteForm.get('ACTIVO').setValue(1);
        this.pacienteForm.get('ID_ESTADO_CIVIL').setValue(6);
        this.pacienteForm.get('ID_GRP_SANG').setValue(1);
        this.pacienteForm.get('ID_ESCOLARIDAD').setValue(1);
        this.pacienteForm.get('ID_ETNIA').setValue(6);
        this.pacienteForm.get('ID_OCUPACION').setValue(511);
        this.pacienteForm.get('ID_DISCAPACIDAD').setValue(5);
        this.pacienteForm.get('ID_RELIGION').setValue(6);
        this.pacienteForm.get('GESTACION').setValue(2);
        this.pacienteForm.get('ID_TIPO_AFIL').setValue(7);
        this.pacienteForm.get('FECHA_AFIL').setValue('');
        this.pacienteForm.get('NUM_SISBEN').setValue('');
        this.pacienteForm.get('FECHA_SISBEN').setValue('');
        this.pacienteForm.get('ID_REGIMEN').setValue(5);
        this.pacienteForm.get('ID_ADMINISTRADORA').setValue('');
        this.pacienteForm.get('CONTRATO').setValue('');
        this.pacienteForm.get('DATOS').setValue('');
        this.muni_id = 1127;
        $('#dpto').val(34).trigger('change');
        $('#ID_TIPO_DOC').val('').trigger('change');
        this.getMunicipios(null);
        setTimeout(() => 
        {
            $('#ID_MUNICIPIO').val(1127).trigger('change');
        },500);
        $('#paciente_modal').modal('hide');
        setTimeout(() => 
        {
            $('#cita').modal('show');
        },500);
    }

    getMunicipios(e) {
        this.codifService.getMunicipios(e)
            .subscribe(data => {
                var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_MUNICIPIO +'">'+ data[d].NOM_MUNICIPIO +'</option>';
                }
                $('.select2.muni').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
                $('#ID_MUNICIPIO').val(this.muni_id).trigger('change');
            }
        );
    }

    CancelGrupo() {
        $('#grupo_horario').modal('hide');
    }

    MostrarM() {
        if($('#ID_GRUPO').val() == '') {
            alert("Por favor, debe escoger el grupo horario a mostrar");
            return false;
        }
        else {
            this.fillGrupo();
            $('#grupo_horario').modal('show');
        }
    }

    CrearGrupo() {
        this.clearAll();
        $('#grupo_horario').modal('show');
    }

    DismissR() {
        $('#cita').modal('hide');
        this.citaForm.get('ID_MOTIVO_CONSULTA').setValue(13);
        this.citaForm.get('ID_PACIENTE').setValue('');
        this.citaForm.get('SERVICIO').setValue('');
        this.citaForm.get('AUTORIZACION').setValue('');
        this.citaForm.get('ID_AUTORIZACION').setValue('');
        this.citaForm.get('ID_PRESTADOR').setValue('');
        this.citaForm.get('ID_USUARIO').setValue('');
        this.citaForm.get('FEC_CITA').setValue('');
        $('#ID_MOTIVO_CONSULTA').val(13).trigger('change');
        $('#ID_PACIENTE').val('').trigger('change');
        $('#AUTORIZACION').val('');
        $('#ID_AUTORIZACION').val('');
        $('#TIPO_CITA').val(1).trigger('change');
        this.change = true;
        $('#SERVICIO').val('').trigger('change');
        this.change = false;
        this.tiene = true;
        this.evento_id = 0;
        $('.btn-asignar').html('<i class="zmdi zmdi-floppy"></i> Asignar');
        $('input[name=datos1]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');
        });
        $('#correo').parent('label').addClass('active');
        $('#correo').attr('checked', true);
        this.notificacion = 0;
        this.multi = false;
        this.estado_c = 0;
        $('.btn-asignar').prop('disabled', false);
    }

    Cancelar() {
        this.citaForm.get('ID_MOTIVO_CONSULTA').setValue(13);
        this.citaForm.get('ID_PACIENTE').setValue('');
        this.citaForm.get('SERVICIO').setValue('');
        this.citaForm.get('AUTORIZACION').setValue('');
        this.citaForm.get('ID_PRESTADOR').setValue('');
        this.citaForm.get('ID_USUARIO').setValue('');
        this.citaForm.get('FEC_CITA').setValue('');
        this.citaForm.get('ID_AUTORIZACION').setValue('');
        $('#ID_MOTIVO_CONSULTA').val(13).trigger('change');
        $('#ID_PACIENTE').val('').trigger('change');
        $('#AUTORIZACION').val('');
        $('#ID_AUTORIZACION').val('');
        this.change = true;
        $('#SERVICIO').val('').trigger('change');
        this.change = false;
        this.tiene = true;
        this.citaForm.get('prestador_id').setValue('');
        this.prestador = true;
        $('#prestador_id').val('').trigger('change');
        this.prestador = false;
        $('.btn-asignar').html('<i class="zmdi zmdi-floppy"></i> Asignar');
        this.tiene = true;
        this.evento_id = 0;
    }

    showMessage(message: string) {
        $.notify({
            icon: 'fa fa-check',
            title: ' Notificación',
            message: message,
            url: ''
        },{
            element: 'body',
            type: 'inverse',
            allow_dismiss: true,
            placement: {
                from: 'top',
                align: 'center'
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 10,
            z_index: 1031,
            delay: 2500,
            timer: 1000,
            url_target: '_blank',
            mouse_over: false,
            animate: {
                enter: 'fadeInDown',
                exit: 'fadeOutUp'
            },
            template:   '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
                            '<span data-notify="icon"></span> ' +
                            '<span data-notify="title">{1}</span> ' +
                            '<span data-notify="message">{2}</span>' +
                            '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                            '</div>' +
                            '<a href="{3}" target="{4}" data-notify="url"></a>' +
                            '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">Close</button>' +
                        '</div>'
        });
    }
}
