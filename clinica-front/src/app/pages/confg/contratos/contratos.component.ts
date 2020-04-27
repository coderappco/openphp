import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';

import { CodifService } from '../../../services/codif.service';
import { ContratoService } from '../../../services/contrato.service';
import { AdministradoraService } from '../../../services/administradora.service';

declare var $: any;

@Component({
  	selector: 'app-contratos',
  	templateUrl: './contratos.component.html',
  	styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {

  	submitted = false;
	contratoForm: FormGroup;
	dtOptions: any = {};
	table: any = '';
	contrato_id = 0;
	administradoras: any = [];
	regimen: any = [];

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService, private adminService: AdministradoraService, private contratoService: ContratoService) { }

  	ngOnInit() {
  		this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
			{
				this.globals.getUrl = 'contrato';
			}
		,0);

		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
		$(".date-picker.fecha").flatpickr({mode: "range", dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'});
		$('.wysiwyg-editor').trumbowyg({
			svgPath: '/src/assets/plantilla/vendors/bower_components/trumbowyg/dist/ui/icons.svg'
		});

		this.codifService.getRegimen()
			.subscribe(data => this.regimen = data);
		this.adminService.getAdministradoras()
            .subscribe(data => this.administradoras = data);

		$('#data-table').on( 'click', '.btn-del', function () {
			that.deleteContrato($(this).attr('date'));
		});

		$('#data-table').on( 'click', '.btn-edit', function () {
			that.fillContrato($(this).attr('date'));
		});

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
        })
	}

	get f() { return this.contratoForm.controls; }

	initForm() {
        this.contratoForm = this.formBuilder.group({
            COD_CONTRATO: ['', [Validators.required]],
            NOM_CONTRATO: ['', [Validators.required]],
            ID_ADMINISTRADORA: [''],
            FEC_INICIO: ['', [Validators.required]],
            FEC_FINAL: [''],
            ID_REGIMEN: [''],
            TIPO_PAGO: [''],
            TIPO_FACTURA: [''],
            NUM_AFILIADO: [''],
            VALOR_TOTAL: [''],
            VALOR_ALERTA: [''],                
			VALOR_MENSUAL: [''],
			VALOR_MENSUAL_VAL: [''],
			OBS_CONTRATO: [''],
  	    });
  	}

	fillTable() {
    	return this.dtOptions = {
  	      	pageLength: 10,
  	      	autoWidth: !1,
            responsive: !0,
            "destroy": true,
        	language: {
          		"url": "src/assets/Spanish.json",
          		 searchPlaceholder: "Escriba parametro a filtrar..."
      		},
        	ajax: this.globals.apiUrl+'/contratos',
        	columns: [
                    { title: 'Código', data: 'COD_CONTRATO', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  '<code><i class="zmdi zmdi-badge-check"></i> '+data+'</code>';
                    }},
        			{ title: 'Contrato', data: 'NOM_CONTRATO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  data;
					}},
					{ title: 'Fecha Inicio', data: 'FEC_INICIO', className: "align-middle", "render": function ( data, type, row, meta ) {
	              		return  '<i class="zmdi zmdi-calendar"></i> '+moment(data).format('DD/MM/YYYY');
	      			}},
	      			{ title: 'Fecha Final', data: 'FEC_FINAL', className: "align-middle", "render": function ( data, type, row, meta ) {
	              		return  '<i class="zmdi zmdi-calendar"></i> '+moment(data).format('DD/MM/YYYY');
	      			}},
					{ title: 'Administradora', data: 'ID_ADMINISTRADORA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-shield-security"></i> '+row.administradora.NOM_ADMINISTRADORA;
					} },
        			{ title: 'Acción', data: 'ID_CONTRATO', "render": function ( data, type, row, meta ) {
        				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar contrato" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
        				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar contrato" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
        				return editar + eliminar;
			}}],
            "columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "150px", "targets": 1 },
                { "width": "150px", "targets": 2 },
                { "width": "150px", "targets": 3 },
                { "width": "250px", "targets": 4 },
                { "width": "150px", "targets": 5 }
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
		this.contratoForm.get('COD_CONTRATO').setValue('');
		this.contratoForm.get('NOM_CONTRATO').setValue('');
		this.contratoForm.get('ID_ADMINISTRADORA').setValue('');
		this.contratoForm.get('FEC_INICIO').setValue('');
		this.contratoForm.get('FEC_FINAL').setValue('');
		this.contratoForm.get('ID_REGIMEN').setValue('');
		this.contratoForm.get('TIPO_PAGO').setValue(1);
		this.contratoForm.get('TIPO_FACTURA').setValue(6);
        this.contratoForm.get('NUM_AFILIADO').setValue('');
        this.contratoForm.get('VALOR_TOTAL').setValue('');
        this.contratoForm.get('VALOR_ALERTA').setValue('');
        this.contratoForm.get('VALOR_MENSUAL').setValue('');
        this.contratoForm.get('VALOR_MENSUAL_VAL').setValue('');
        this.contratoForm.get('OBS_CONTRATO').setValue('');
		this.contrato_id = 0;
        $('.wysiwyg-editor').html('');
		$('#ID_ADMINISTRADORA').val('').trigger('change');
		$('#ID_REGIMEN').val('').trigger('change');
		$('#TIPO_PAGO').val(1).trigger('change');
		$('#TIPO_FACTURA').val(6).trigger('change');
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
        $(".date-picker.fecha").flatpickr({
            mode: "range",
            dateFormat: 'd/m/Y',
            "locale": "es",
            enableTime:!1,
            nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',
            prevArrow:'<i class="zmdi zmdi-long-arrow-left" />',
            defaultDate: null,
        });
	}

	Registrar() {
		this.submitted = true;

        if (this.contratoForm.invalid) {
            return;
        }
        if($('#ID_ADMINISTRADORA').val() == '') {
        	alert("Por favor, escoja la Administradora");
        	return false;
        }
        else
        if($('#ID_REGIMEN').val() == '') {
        	alert("Por favor, escoja el Régimen");
        	return false;
        }
        else
        if($('#TIPO_PAGO').val() == '') {
        	alert("Por favor, escoja el Tipo de Pago");
        	return false;
        }
        else
        if($('#TIPO_FACTURA').val() == '') {
        	alert("Por favor, escoja el Tipo de Factura");
        	return false;
        }
        /*else
        if ($('.wysiwyg-editor').trumbowyg('html') == '') {
            alert("Por favor, diga la observación");
            return false;
        };*/

        if(this.contrato_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar el CONTRATO?")) 
				return false;*/

        	this.contratoForm.get('ID_REGIMEN').setValue($('#ID_REGIMEN').val());
        	this.contratoForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
        	this.contratoForm.get('TIPO_PAGO').setValue($('#TIPO_PAGO').val());
        	this.contratoForm.get('TIPO_FACTURA').setValue($('#TIPO_FACTURA').val());
            this.contratoForm.get('OBS_CONTRATO').setValue($('.wysiwyg-editor').trumbowyg('html'));
        	this.contratoService.crearContrato(this.contratoForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Contrato creado");
					this.submitted = false;
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar el CONTRATO?")) 
				return false;*/
			this.contratoForm.get('ID_REGIMEN').setValue($('#ID_REGIMEN').val());
        	this.contratoForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
        	this.contratoForm.get('TIPO_PAGO').setValue($('#TIPO_PAGO').val());
        	this.contratoForm.get('TIPO_FACTURA').setValue($('#TIPO_FACTURA').val());
            this.contratoForm.get('OBS_CONTRATO').setValue($('.wysiwyg-editor').trumbowyg('html'));
        	this.contratoService.updateContrato(this.contrato_id, this.contratoForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Contrato actualizado");
					this.submitted = false;
				}
			);
        }
	}

	fillContrato(p) {
		var that = this;
		this.contratoService.getContrato(p)
			.subscribe(data => {
				var contrato: any = data;
				this.contrato_id = contrato.ID_CONTRATO;
				this.initForm();
		        this.contratoForm.get('COD_CONTRATO').setValue(contrato.COD_CONTRATO);
				this.contratoForm.get('NOM_CONTRATO').setValue(contrato.NOM_CONTRATO);
				this.contratoForm.get('ID_ADMINISTRADORA').setValue(contrato.ID_ADMINISTRADORA);
				this.contratoForm.get('FEC_INICIO').setValue(moment(contrato.FEC_INICIO).format('DD/MM/YYYY')+" a "+moment(contrato.FEC_FINAL).format('DD/MM/YYYY'));
				this.contratoForm.get('FEC_FINAL').setValue(contrato.FEC_FINAL);
				this.contratoForm.get('ID_REGIMEN').setValue(contrato.ID_REGIMEN);
				this.contratoForm.get('TIPO_PAGO').setValue(contrato.TIPO_PAGO);
				this.contratoForm.get('TIPO_FACTURA').setValue(contrato.TIPO_FACTURA);
		        this.contratoForm.get('NUM_AFILIADO').setValue(contrato.NUM_AFILIADO);
		        this.contratoForm.get('VALOR_TOTAL').setValue(contrato.VALOR_TOTAL);
		        this.contratoForm.get('VALOR_ALERTA').setValue(contrato.VALOR_ALERTA);
		        this.contratoForm.get('VALOR_MENSUAL').setValue(contrato.VALOR_MENSUAL);
		        this.contratoForm.get('VALOR_MENSUAL_VAL').setValue(contrato.VALOR_MENSUAL_VAL);
		        this.contratoForm.get('OBS_CONTRATO').setValue(contrato.OBS_CONTRATO);
				$('#ID_ADMINISTRADORA').val(contrato.ID_ADMINISTRADORA).trigger('change');
				$('#ID_REGIMEN').val(contrato.ID_REGIMEN).trigger('change');
				$('#TIPO_PAGO').val(contrato.TIPO_PAGO).trigger('change');
				$('#TIPO_FACTURA').val(contrato.TIPO_FACTURA).trigger('change');
                $('.wysiwyg-editor').html(contrato.OBS_CONTRATO);
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $(".date-picker.fecha").flatpickr({
                    mode: "range",
                    dateFormat: 'd/m/Y',
                    "locale": "es",
                    enableTime:!1,
                    nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',
                    prevArrow:'<i class="zmdi zmdi-long-arrow-left" />',
                    defaultDate: [moment(contrato.FEC_INICIO).format('DD/MM/YYYY'), moment(contrato.FEC_FINAL).format('DD/MM/YYYY')]
                });
                $('#collapseOne').collapse('show');
                $('#COD_CONTRATO').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteContrato(id) {
		if(confirm("Esta Seguro que desea eliminar el CONTRATO?")) {
			this.contratoService.delContrato(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Contrato eliminado");
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
