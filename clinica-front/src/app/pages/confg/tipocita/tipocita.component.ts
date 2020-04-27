import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../../globals';
import { HistoriasService } from '../../../services/historias.service';
import { ItemsService } from '../../../services/items.service';
import { TipocitaService } from '../../../services/tipocita.service';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';

declare var $: any;

@Component({
  	selector: 'app-tipocita',
  	templateUrl: './tipocita.component.html',
  	styleUrls: ['./tipocita.component.css']
})
export class TipocitaComponent implements OnInit {

	tipoForm: FormGroup;
	tipo_id: any = 0;
	servicios: any = [];
	historias: any = [];
	dtOptions: any = {};
	table: any = '';
	submitted: any = false;

	constructor(private formBuilder: FormBuilder, private globals: Globals, private historiasService: HistoriasService,
				private route: ActivatedRoute, private router: Router, private itemsService: ItemsService, private tipocitaService: TipocitaService) { }

  	ngOnInit() {
  		var that = this;
  		this.initForm();
  		this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
		{
			this.globals.getUrl = 'tipocita';
		},0);
		this.itemsService.getItems()
            .subscribe(data => this.servicios = data);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%",allowClear: true});
        this.historiasService.listHistorias()
			.subscribe(data => {
				let hi: any = data;
				this.historias = hi;
			}
		);

		$('#data-table').on( 'click', '.btn-del', function () {
			that.deleteTipoCita($(this).attr('date'));
		});

		$('#data-table').on( 'click', '.btn-edit', function () {
			that.fillTipoCita($(this).attr('date'));
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
        });
	}

	initForm() {
        this.tipoForm = this.formBuilder.group({
            NOM_TIPO_CITA: ['', [Validators.required]],
            ID_ITEM: [''],
            ID_HISTORIA: [''],
            ACTIVO: ['']
        });
    }

    get f() { return this.tipoForm.controls; }

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
        	ajax: this.globals.apiUrl+'/tiposcitas',
        	columns: [
                { title: 'Tipo de Cita', data: 'NOM_TIPO_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data;
                }},
                { title: 'Servicio', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.item.NOM_ITEM;
                }},
        		{ title: 'Fecha creado', data: 'FEC_CREACION', className: "align-middle", "render": function ( data, type, row, meta ) {
        			return  moment(data).format('YYYY/MM/DD');
				}},
        		{ title: 'Registros clínicos', data: 'ID_TIPO_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    var html = '';
        			for(var i in row.registros) {
        				html += '<span class="badge badge-pill badge-info" style="margin-bottom: -5px;">'+row.registros[i].historia.NOM_HISTORIA+'</span></p>';
        			}
        			return  html;
				} },
        		{ title: 'Acción', data: 'ID_TIPO_CITA', "render": function ( data, type, row, meta ) {
        			let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar tipo de cita" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
        			let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar tipo de cita" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
        			return editar + eliminar;
				}}
			],
            "columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "300px", "targets": 1 },
                { "width": "150px", "targets": 2 },
                { "width": "300px", "targets": 3 },
                { "width": "150px", "targets": 4 }
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
		this.tipoForm.get('NOM_TIPO_CITA').setValue('');
		this.tipoForm.get('ID_ITEM').setValue('');
		this.tipoForm.get('ID_HISTORIA').setValue('');
		this.tipoForm.get('ACTIVO').setValue('');
		this.tipo_id = 0;
		$('#ID_ITEM').val('').trigger('change');
		$('#ID_HISTORIA').val('').trigger('change');
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
		$('#activo').prop('checked', true);
	}

	Registrar() {
		this.submitted = true;

        if (this.tipoForm.invalid) {
            return;
        }
        if($('#ID_ITEM').val() == '' || $('#ID_ITEM').val() == null) {
        	alert("Por favor, escoja el servicio");
        	return false;
        }
        if($('#ID_HISTORIA').val().length == 0) {
        	alert("Por favor, escoja los registros clínicos");
        	return false;
        }
        if(this.tipo_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar el tipo de cita?")) 
				return false;*/
        	this.tipoForm.get('NOM_TIPO_CITA').setValue($('#NOM_TIPO_CITA').val());
			this.tipoForm.get('ID_ITEM').setValue($('#ID_ITEM').val());
			this.tipoForm.get('ID_HISTORIA').setValue($('#ID_HISTORIA').val());
			var activo = $('#activo').prop('checked') == true ? 1 : 0;
			this.tipoForm.get('ACTIVO').setValue(activo);
        	this.tipocitaService.crearTipoCita(this.tipoForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Tipo de cita creado");
					this.submitted = false;
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar el tipo de cita?")) 
				return false;*/
			this.tipoForm.get('NOM_TIPO_CITA').setValue($('#NOM_TIPO_CITA').val());
			this.tipoForm.get('ID_ITEM').setValue($('#ID_ITEM').val());
			this.tipoForm.get('ID_HISTORIA').setValue($('#ID_HISTORIA').val());
			var activo = $('#activo').prop('checked') == true ? 1 : 0;
			this.tipoForm.get('ACTIVO').setValue(activo);
        	this.tipocitaService.updateTipoCita(this.tipo_id, this.tipoForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Tipod e cita actualizado");
					this.submitted = false;
				}
			);
        }
	}

	fillTipoCita(p) {
		var that = this;
		this.tipocitaService.getTipoCita(p)
			.subscribe(data => {
				var tipo: any = data;
				this.tipo_id = tipo.ID_TIPO_CITA;
				this.initForm();
		        this.tipoForm.get('NOM_TIPO_CITA').setValue(tipo.NOM_TIPO_CITA);
				this.tipoForm.get('ID_ITEM').setValue(tipo.ID_ITEM);
				var his = [];
				var hi = [];
				for(var i in tipo.registros) {
					his.push(tipo.registros[i].ID_HISTORIA+": "+tipo.registros[i].ID_HISTORIA);
					hi.push(tipo.registros[i].ID_HISTORIA);
				}
				this.tipoForm.get('ID_HISTORIA').setValue(hi);
				var activo = tipo.ACTIVO == true ? 1 : 0;
				this.tipoForm.get('ACTIVO').setValue(tipo.ACTIVO);
				$('#activo').prop('checked', activo);
				$('#ID_ITEM').val(tipo.ID_ITEM).trigger('change');
				$('#ID_HISTORIA').val(his).trigger('change');
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#NOM_TIPO_CITA').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteTipoCita(id) {
		if(confirm("Esta Seguro que desea eliminar el tipo de cita?")) {
			this.tipocitaService.delTipoCita(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Tipo de Cita eliminado");
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
