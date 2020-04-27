import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';

import { ItemsService } from '../../../services/items.service';
import { AutorizacionService } from '../../../services/autorizacion.service';
import { PacienteService } from '../../../services/paciente.service';

declare var $: any;

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.css']
})
export class AutorizacionComponent implements OnInit {

	submitted = false;
  	autoForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	auto_id = 0;
  	servicios: any = [];
  	user_id = 0;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private itemsService: ItemsService, private autoService: AutorizacionService,
  				private pacienteService: PacienteService) { }

  	ngOnInit() {
        this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
        let us = JSON.parse(localStorage.getItem('currentUser'));
		this.user_id = us.user.ID_USUARIO;
  	}

  	ngAfterViewInit(): void {
    	var that = this;

    	$('[data-toggle="tooltip"]').tooltip();
    	setTimeout(() => 
      	{
      		this.globals.getUrl = 'autorizacion';
      	},0);

    	$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

        $('#data-table').on( 'click', '.btn-del', function () {
            that.deleteAuto($(this).attr('date'));
        });

        $('#data-table').on( 'click', '.btn-edit', function () {
            that.fillAuto($(this).attr('date'));
        });

        $(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'})

    	$("body").on("click", "[data-table-action]", function(a) {
            a.preventDefault();
            var b = $(this).data("table-action");
            if ("excel" === b && $(this).closest(".dataTables_wrapper").find(".buttons-excel").trigger("click"),
            "csv" === b && $(this).closest(".dataTables_wrapper").find(".buttons-csv").trigger("click"),
            "print" === b && $(this).closest(".dataTables_wrapper").find(".buttons-print").trigger("click"),
            "fullscreen" === b) {
                var c = $(this).closest(".card");
                c.hasClass("card--fullscreen") ? (c.removeClass("card--fullscreen"),
                $("body").removeClass("data-table-toggled")) : (c.addClass("card--fullscreen"),
                $("body").addClass("data-table-toggled"))
            }
        });

        $("body").on("click", ".boton_servi", function(a) {
            a.preventDefault();
            let arr = [];
            let pos = 0;
            for(var i in that.servicios) {
                if(i != $(this).attr('pos')) {
                    arr[pos] = that.servicios[i];
                    pos++;
                }
            }
            $('#addserv').html('');
            that.servicios = arr;
            var html = "";
            for(var i in that.servicios){
                let html = $('#addserv').html();
                html = html + '<div class="col-md-7 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i][2]+'</span></div>'+
                        '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i][1]+'</span></div>'+
                        '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar servicio" data-toggle="tooltip" class="boton_servi"><i class="zmdi zmdi-delete"></i></a></div>';
                $('#addserv').html(html);
            }
        });

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
            placeholder: 'Buscar Pacientes',
            minimumInputLength: 1,
        });

        $('#ID_ITEM').select2({
            dropdownAutoWidth:!0,
            width:"100%",
            ajax: {
                url: that.globals.apiUrl+'/items/search',
                dataType: 'json',
                data: function (params) {
                    return {
                        q: params.term
                    };
                }
            },
            placeholder: 'Buscar Servicios',
            minimumInputLength: 1,
        });

        $('#data-table').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = that.table.row( tr );
	 
	        if ( row.child.isShown() ) {
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            row.child( that.format(row.data()) ).show();
	            tr.addClass('shown');
	        }
	    });
  	}

  	get f() { return this.autoForm.controls; }

  	initForm() {
        this.autoForm = this.formBuilder.group({
            ID_PACIENTE: [''],
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
  	    });
  	}

  	format ( d ) {
		let tabla = '';
		let arr = d.servicios;
		for(var i in arr){
		    tabla = tabla + '<tr>' +
	            	'<td class="text-right col-md-2">' + arr[i].item.NOM_ITEM + '</td>' +
	            	'<td>' + arr[i].NUM_SESION_AUT + '</td>' +
	            	'<td>' + arr[i].NUM_SESIONES_PEND + '</td>' +
	            	'<td>' + arr[i].NUM_SESIONES_REAL + '</td>' +
	        		'</tr>';
		}
	    return '<table cellpadding="5" cellspacing="0" border="0" width="100%">'+
	        '<tr>'+
	            '<td class="text-right">Servicios vinculados:</td>'+
	            '<td>Cantidad permitida</td>'+
	            '<td>Cantidad pendiente</td>'+
	            '<td>Cantidad real</td>'+
	        '</tr>'+
	        tabla +
	    '</table>';
	}

    fillTable() {
        return this.dtOptions = {
            pageLength: 10,
            autoWidth: !1,
            responsive: !0,
            "destroy": true,
            "order": [[1, 'asc']],
            language: {
                "url": "src/assets/Spanish.json",
                 searchPlaceholder: "Escriba parametro a filtrar..."
            },
            ajax: this.globals.apiUrl+'/autorizaciones',
            columns: [
            	{
                	"className":      'details-control',
                	"orderable":      false,
                	"data":           null,
                	"defaultContent": ''
            	},
                { title: 'Número', data: 'NUM_AUTORIZACION', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return '<code>'+data+'</code>';
                }},
                { title: 'Identificación', data: 'ID_PACIENTE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<code><i class="zmdi zmdi-badge-check"></i> '+row.paciente.identificacion.COD_TIPO_IDENTIFICACION+row.paciente.NUM_DOC+'</code>';
                }},
                { title: 'Paciente', data: 'ID_PACIENTE', className: "align-middle", "render": function ( data, type, row, meta ) {
                	var nombre = row.paciente.PRIMER_NOMBRE + (row.paciente.SEGUNDO_NOMBRE != null ? " "+row.paciente.SEGUNDO_NOMBRE : "");
                    var apellidos = row.paciente.PRIMER_APELLIDO + (row.paciente.SEGUNDO_APELLIDO != null ? " "+row.paciente.SEGUNDO_APELLIDO : "");
                    return '<i class="zmdi zmdi-account"></i> '+nombre+" "+apellidos;
                }},
                { title: 'Fecha autorización', data: 'FEC_AUTORIZACION', className: "align-middle", "render": function ( data, type, row, meta ) {
                    var fecha = data != null ? moment(data).format('DD/MM/YYYY') : '-'
                    return '<i class="zmdi zmdi-calendar"></i> ' + fecha;
                } },
                { title: 'Fecha creada', data: 'FEC_CREACION', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<i class="zmdi zmdi-calendar"></i> ' + moment(data).format('DD/MM/YYYY');
                } },
                { title: 'Acción', data: 'ID_AUTORIZACION', "render": function ( data, type, row, meta ) {
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar autorización" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar autorización" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
                    return editar + eliminar;
                }}
            ],
            "columnDefs": [
                { "width": "50px", "targets": 0 },
                { "width": "120px", "targets": 1 },
                { "width": "160px", "targets": 2 },
                { "width": "300px", "targets": 3 },
                { "width": "120px", "targets": 4 },
                { "width": "120px", "targets": 5 },
                { "width": "150px", "targets": 6 }
            ],
            dom: '<"dataTables__top"lfB>rt<"dataTables__bottom"ip><"clear">',
            buttons: [{
                  extend: "excelHtml5",
                  title: "Export Data"
            }, {
                  extend: "csvHtml5",
                  title: "Export Data"
            }, {
                  extend: "print",
                  title: "Material Admin"
            }],
                "initComplete": function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    $(this).closest(".dataTables_wrapper").find(".dataTables__top").prepend('<div class="dataTables_buttons hidden-sm-down actions"><span class="actions__item zmdi zmdi-print" data-table-action="print" /><span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" /><div class="dropdown actions__item"><i data-toggle="dropdown" class="zmdi zmdi-download" /><ul class="dropdown-menu dropdown-menu-right"><a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a><a href="" class="dropdown-item" data-table-action="csv">CSV (.csv)</a></ul></div></div>')
            },
        };
    }

    clearAll() {
        this.autoForm.get('ID_PACIENTE').setValue('');
        this.autoForm.get('NUM_AUTORIZACION').setValue('');
        this.autoForm.get('FEC_AUTORIZACION').setValue('');
        this.autoForm.get('CERRADA').setValue('');
        this.autoForm.get('ID_USUARIO_CREADOR').setValue('');
        this.autoForm.get('FEC_CREACION').setValue('');
        this.autoForm.get('FACTURADA').setValue('');
        this.autoForm.get('NUM_SESION_AUT').setValue('');
        this.autoForm.get('NUM_SESIONES_PEND').setValue('');
        this.autoForm.get('NUM_SESIONES_REAL').setValue('');
        this.autoForm.get('ID_ITEM').setValue('');
        this.autoForm.get('SERVICIOS').setValue('');
        this.auto_id = 0;
        $('#addserv').html('');
        $('#ID_PACIENTE').val('').trigger('change');
        $('#ID_ITEM').val('').trigger('change');
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        this.initForm();
        this.servicios = [];
    }

    Asignar() {
    	if($('#ID_ITEM').val() == null || $('#NUM_SESION_AUT').val() == '') {
    		alert("Por favor, debe escoger el servicio y la cantidad");
    		return false;
    	}
    	else
    	{
    		this.servicios.push([$('#ID_ITEM option:selected').val(), $('#NUM_SESION_AUT').val(), $('#ID_ITEM option:selected').html()]);
    		let html = $('#addserv').html();
            let pos = this.servicios.length - 1;
    		html = html + '<div class="col-md-7 mb-1 mt-1"><span class="badge badge-secondary">'+$('#ID_ITEM option:selected').html()+'</span></div>'+
    					'<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+$('#NUM_SESION_AUT').val()+'</span></div>'+
                        '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+pos+'" title="Eliminar servicio" data-toggle="tooltip" class="boton_servi"><i class="zmdi zmdi-delete"></i></a></div>';
    		$('#addserv').html(html);
    		$('#ID_ITEM').val('').trigger('change');
    		$('#NUM_SESION_AUT').val('');
    	}
    }

    Registrar() {
        this.submitted = true;

        if (this.autoForm.invalid) {
            return;
        }

        if($('#ID_PACIENTE').val() == null) {
            alert("Por favor, escoja el paciente");
            return false;
        }
        else
        if(this.servicios.length == 0) {
            alert("Por favor, agregue los servicios");
            return false;
        }

        if(this.auto_id == 0) {
            /*if(!confirm("Esta Seguro que desea Registrar la AUTORIZACION?")) 
                return false;*/

            this.autoForm.get('ID_PACIENTE').setValue($('#ID_PACIENTE').val());
            this.autoForm.get('ID_ITEM').setValue($('#ID_ITEM').val());
            this.autoForm.get('SERVICIOS').setValue(this.servicios);
            this.autoForm.get('ID_USUARIO_CREADOR').setValue(this.user_id);
            this.autoService.crearAutorizacion(this.autoForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Autorización registrada");
                    this.submitted = false;
                }
            );
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar la Autorización?")) 
                return false;*/
            this.autoForm.get('ID_PACIENTE').setValue($('#ID_PACIENTE').val());
            this.autoForm.get('ID_ITEM').setValue($('#ID_ITEM').val());
            this.autoForm.get('SERVICIOS').setValue(this.servicios);
            this.autoForm.get('ID_USUARIO_CREADOR').setValue(this.user_id);
            this.autoService.updateAutorizacion(this.auto_id, this.autoForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Autorización actualizada");
                    this.submitted = false;
                }
            );
        }
    }

    fillAuto(p) {
        var that = this;
        var datos = [];
        this.autoService.getAutorizacion(p)
            .subscribe(data => {
                var auto: any = data;
                this.auto_id = auto.ID_AUTORIZACION;
                this.initForm();
                this.autoForm.get('ID_PACIENTE').setValue(auto.ID_PACIENTE);
		        this.autoForm.get('NUM_AUTORIZACION').setValue(auto.NUM_AUTORIZACION);
		        this.autoForm.get('FEC_AUTORIZACION').setValue(auto.FEC_AUTORIZACION != null ? moment(auto.FEC_AUTORIZACION).format('DD/MM/YYYY') : '');
		        this.autoForm.get('CERRADA').setValue(auto.CERRADA);
		        this.autoForm.get('ID_USUARIO_CREADOR').setValue(auto.ID_USUARIO_CREADOR);
		        this.autoForm.get('FEC_CREACION').setValue(moment(auto.FEC_CREACION).format('DD/MM/YYYY'));
		        this.autoForm.get('FACTURADA').setValue(auto.FACTURADA);
		        this.autoForm.get('NUM_SESION_AUT').setValue(auto.NUM_SESION_AUT);
		        this.autoForm.get('NUM_SESIONES_PEND').setValue(auto.NUM_SESIONES_PEND);
		        this.autoForm.get('NUM_SESIONES_REAL').setValue(auto.NUM_SESIONES_REAL);
		        $('#addserv').html('');
		        let arr = auto.servicios;
		        this.servicios = [];
				for(var i in arr){
			        this.servicios.push([arr[i].ID_ITEM, arr[i].NUM_SESION_AUT, arr[i].item.NOM_ITEM]);
    				let html = $('#addserv').html();
    				html = html + '<div class="col-md-7 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i].item.NOM_ITEM+'</span></div>'+
    					'<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i].NUM_SESION_AUT+'</span></div>'+
                        '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar servicio" data-toggle="tooltip" class="boton_servi"><i class="zmdi zmdi-delete"></i></a></div>';
    				$('#addserv').html(html);
				}
                $('[data-toggle="tooltip"]').tooltip();
		        this.autoForm.get('ID_ITEM').setValue('');
		        this.autoForm.get('SERVICIOS').setValue(this.servicios);
                $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                var nombre = auto.paciente.PRIMER_NOMBRE + (auto.paciente.SEGUNDO_NOMBRE != null ? " "+auto.paciente.SEGUNDO_NOMBRE : "");
                var apellidos = auto.paciente.PRIMER_APELLIDO + (auto.paciente.SEGUNDO_APELLIDO != null ? " "+auto.paciente.SEGUNDO_APELLIDO : "");
                var newOptions = '<option value="'+ auto.ID_PACIENTE +'">'+ nombre+" "+apellidos +'</option>';
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
		            placeholder: 'Buscar Pacientes',
		            minimumInputLength: 1,
		        });
		        setTimeout(() => 
		      	{
		      		$('#ID_PACIENTE').val(auto.ID_PACIENTE).trigger('change');
		      	},0);
                $('#collapseOne').collapse('show');
                $('#NUM_AUTORIZACION').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
            }
        );
    }

    deleteAuto(id) {
        if(confirm("Esta Seguro que desea eliminar la Autorización?")) {
            this.autoService.delAutorizacion(id)
                .subscribe(data => {
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Autorización eliminada");
                    this.clearAll();
                }
            );
        }
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
