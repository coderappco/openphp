import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';

import { UserService } from '../../../services/usuario.service';
import { CitaService } from '../../../services/cita.service';

declare var $: any;

@Component({
  	selector: 'app-search',
  	templateUrl: './search.component.html',
  	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	searchForm: FormGroup;
	empresa_id: any = 0;
	user_id: any = 0;
	nombre: any = '';
	apellido: any = '';
	identificacion: any = 0;
	genero: any = 'indefinido';
	celular: any = '';
	direccion: any = '';
	estado_civil: any = '';
	administradora: any = '';
	contrato: any = '';
    edad: any = '';
    ensala: any = false;
    registro: any = false;
    id_paciente: any = 0;
    evento_id: any = 0;
    dtOptions: any = {};
	table: any = '';
	prestador: any = '';

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private userService: UserService, private citaService: CitaService, private router: Router) { }

  	ngOnInit() {
  		this.initForm();
  		let us = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = us.user.ID_USUARIO;
        this.empresa_id = us.empresa_id != null ? us.empresa_id : 0;
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
        var that = this;
       	setTimeout(() => 
		{
			this.globals.getUrl = 'search';
		},0);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
        $('[data-toggle="tooltip"]').tooltip();
        $('#data-table').on( 'click', '.btn-edit', function () {
			that.fillCita($(this).attr('date'));
		});
    }

    initForm() {
        this.searchForm = this.formBuilder.group({
            ID_TIPO_IDEN: [''],
            PACIENTE: [''],
            EDAD: [''],
            GENERO: [''],
            DIRECCION: [''],
            CELULAR: [''],
            ESTADO_CIVIL: [''],
            ADMINISTRADORA: [''],
            CONTRATO: [''],
            AUTORIZACION: [''],
            MOTIVO_CONSULTA: [''],
            TIPO_CITA: [''],
            SOLICITUD: [''],
            OBSERVACION: [''],
            PYP: [''],
            SEDE: [''],
            CONSULTORIO: [''],
            ID_SEDE: [''],
            ID_ESTADO_CITA: [''],
            ID_PACIENTE: [''],
            TODOS: [0],
            CITAS: [''],
            PRESTADOR: [''],
            DIA: [''],
            USUARIO: ['']
        });
    }

    fillTable() {
    	var that = this;
    	return this.dtOptions = {
  	      	pageLength: 10,
  	      	autoWidth: !1,
            responsive: !0,
            "destroy": true,
        	language: {
          		"url": "src/assets/Spanish.json",
          		 searchPlaceholder: "Escriba parametro a filtrar..."
      		},
        	ajax: this.globals.apiUrl+'/citas/search?id_empresa='+that.empresa_id,
        	columns: [
				{ title: 'Identificación', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
					return  row.paciente.identificacion.COD_TIPO_IDENTIFICACION+row.paciente.NUM_DOC;
				}},
				{ title: 'Paciente', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
					var nombre = row.paciente.PRIMER_NOMBRE + (row.paciente.SEGUNDO_NOMBRE != null ? " "+row.paciente.SEGUNDO_NOMBRE : "");
					var apellidos = row.paciente.PRIMER_APELLIDO + (row.paciente.SEGUNDO_APELLIDO != null ? " "+row.paciente.SEGUNDO_APELLIDO : "");
					return  nombre+" "+apellidos;
				}},
				{ title: 'Fecha de la Cita', data: 'FEC_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
					return  '<i class="zmdi zmdi-calendar"></i> '+moment(data).format('YYYY/MM/DD H:mm');
				}},
				{ title: 'Acción', data: 'ID_CITA', "render": function ( data, type, row, meta ) {
					let view = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Detalle de la cita" data-toggle="tooltip"><i class="actions__item zmdi zmdi-eye"></i></button> ';
					return view;
				}}
			],
            "columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "300px", "targets": 1 },
                { "width": "150px", "targets": 2 },
                { "width": "80px", "targets": 3 }
            ],
            dom: '<"dataTables__top"lfB>rt<"dataTables__bottom"ip><"clear">',
            /*buttons: [{
                  extend: "excelHtml5",
                  title: "Export Data"
            }, {
                  extend: "csvHtml5",
                  title: "Export Data"
            }, {
                  extend: "print",
                  title: "Material Admin"
            }],*/
      		"initComplete": function () {
				$('[data-toggle="tooltip"]').tooltip();
				//$(this).closest(".dataTables_wrapper").find(".dataTables__top").prepend('<div class="dataTables_buttons hidden-sm-down actions"><span class="actions__item zmdi zmdi-print" data-table-action="print" /><span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" /><div class="dropdown actions__item"><i data-toggle="dropdown" class="zmdi zmdi-download" /><ul class="dropdown-menu dropdown-menu-right"><a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a><a href="" class="dropdown-item" data-table-action="csv">CSV (.csv)</a></ul></div></div>')
            },
        };
  	}

  	fillCita(id) {
  		var that = this;
  		this.citaService.getCita(id)
			.subscribe(data => {
				$('#collapseOne').collapse('show');
				let da: any = data;
				that.nombre = da.paciente.PRIMER_NOMBRE + (da.paciente.SEGUNDO_NOMBRE != null ? " "+da.paciente.SEGUNDO_NOMBRE : "");
				that.apellido = da.paciente.PRIMER_APELLIDO + (da.paciente.SEGUNDO_APELLIDO != null ? " "+da.paciente.SEGUNDO_APELLIDO : "");
				that.identificacion = da.paciente.NUM_DOC;
				that.genero = da.paciente.GENERO == 1 ? "Masculino" : da.paciente.GENERO == 2 ? "Femenino" : "Indefinido";
				that.celular = da.paciente.MOVIL != null ? da.paciente.MOVIL : "-";
				that.direccion = da.paciente.DIREC_PACIENTE != null ? da.paciente.DIREC_PACIENTE : "-";
				that.estado_civil = da.paciente.estadocivil.NOM_ESTADO_CIVIL;
				that.administradora = da.paciente.contrato != null ? da.paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
				that.contrato = da.paciente.contrato != null ? da.paciente.contrato.contrato.COD_CONTRATO : "No Contrato";
				that.prestador = da.prestador.usuario.NOMBRES + " " + da.prestador.usuario.APELLIDOS;
				let yDiff: any = "-";
				let mDiff: any = "-";
				if(da.paciente.FECHA_NAC != null) {
					let m1: any = moment(da.paciente.FECHA_NAC);
					let m2: any = moment().format('YYYY-MM-DD');
					yDiff = moment().year() - moment(da.paciente.FECHA_NAC).year();
					mDiff = moment().month() - moment(da.paciente.FECHA_NAC).month();
					if (mDiff < 0) {
						mDiff = 12 + mDiff;
						yDiff--;
					}
				}
				that.edad = yDiff + " años " + mDiff + " meses";
				$('#CONSULTORIO').val(da.ID_CONSULTORIO);
				$('#MOTIVO_CONSULTA').val(da.motivoc.NOM_MOTIVO_CONSULTA);
				$('#SEDE').val(da.consultorio.sede.NOM_SEDE);
				let auto = da.autorizacion != null ? da.autorizacion.autorizacion.NUM_AUTORIZACION : '';
				$('#AUTORIZACION').val(auto);
				if(da.TIPO_CITA != 0) {
					let tipo = '';
					if(da.TIPO_CITA == 1) tipo = "ADULTO MAYOR";
					if(da.TIPO_CITA == 2) tipo = "AGUDEZA VISUAL";
					if(da.TIPO_CITA == 3) tipo = "CITOLOGIA";
					if(da.TIPO_CITA == 4) tipo = "CITOLOGIA GESTANTE";
					if(da.TIPO_CITA == 5) tipo = "CONSULTA 1 VEZ";
					if(da.TIPO_CITA == 6) tipo = "CONSULTA EXTERNA";
					if(da.TIPO_CITA == 7) tipo = "CONTROL ECNT";
					if(da.TIPO_CITA == 8) tipo = "CP 1 VEZ";
					$('#TIPO_CITA').val(tipo);
				}
				$('#SOLICITUD').val("Telefónica");
				$('#OBSERVACION').val(da.OBS_CITA);
				$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			})
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
