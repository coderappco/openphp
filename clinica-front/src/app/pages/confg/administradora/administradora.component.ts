import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';

import { CodifService } from '../../../services/codif.service';
import { AdministradoraService } from '../../../services/administradora.service';

declare var $: any;

@Component({
	selector: 'app-administradora',
	templateUrl: './administradora.component.html',
	styleUrls: ['./administradora.component.css']
})
export class AdministradoraComponent implements OnInit {

	submitted = false;
	administradoraForm: FormGroup;
	dtOptions: any = {};
	table: any = '';
	administradora_id = 0;
	dptos: any = [];
	municipios: any = [];
	tipoident: any = [];

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService, private administradoraService: AdministradoraService) { }

  	ngOnInit() {
  		this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
			{
				this.globals.getUrl = 'administradora';
			}
		,0);

		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

		$('.select2.dpto').on("change", function (e) {
			$('.select2.muni').prop("disabled", true);
    		that.getMunicipios($(this).val());
		});

		this.codifService.getDptos()
			.subscribe(data => this.dptos = data);
		this.codifService.getMunicipios()
			.subscribe(data => this.municipios = data);
		this.codifService.getTipoIdent()
			.subscribe(data => this.tipoident = data);

		$('#data-table').on( 'click', '.btn-del', function () {
			that.deleteAdministradora($(this).attr('date'));
		});

		$('#data-table').on( 'click', '.btn-edit', function () {
			that.fillAdministradora($(this).attr('date'));
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

	get f() { return this.administradoraForm.controls; }

	initForm() {
        this.administradoraForm = this.formBuilder.group({
            COD_ADMINISTRADORA: [''],
            NOM_ADMINISTRADORA: ['', [Validators.required]],
            ID_TIPO_DOCUMENTO: [''],
            NUM_TRIB: [''],
            ID_MUNICIPIO: [''],
            NUM_IDEN_REP_LEGAL: [''],
            NOM_REP_LEGAL: [''],
            DIREC_ADMINISTRADORA: [''],
            TELEF: [''],
            CORREO: ['', [Validators.email]],                
			WEBSITE: [''],
			TIPO_ADMINISTRADORA: [''],
			dpto: [''],
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
        	ajax: this.globals.apiUrl+'/administradoras',
        	columns: [
                    { title: 'Tipo de Identificación', data: 'ID_EMPRESA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  row.identificacion.COD_TIPO_IDENTIFICACION;
                    }},
                    { title: 'Código', data: 'COD_ADMINISTRADORA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var code = data != null ? data : '-';
                        return  '<code><i class="zmdi zmdi-badge-check"></i> '+code+'</code>';
                    }},
        			{ title: 'Administradora', data: 'NOM_ADMINISTRADORA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  data;
					}},
        			{ title: 'NIT', data: 'NUM_TRIB', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var nit = data != null ? data : '-';
        				return  '<code>'+nit+'</code>';
					} },
        			{ title: 'Gerente', data: 'NOM_REP_LEGAL', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var gerente = data != null ? data : '-';
        				return  '<i class="zmdi zmdi-account"></i> '+gerente;
					} }, 
					{ title: 'Tipo', data: 'TIPO_ADMINISTRADORA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  data == "EPS" ? "EPS" : (data == "ARP" ? "ARP" : (data == "CDC" ? "CAJA DE COMPENSACION" : "OTRO"));
					} },
        			{ title: 'Acción', data: 'ID_ADMINISTRADORA', "render": function ( data, type, row, meta ) {
        				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar administradora" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
        				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar administradora" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
        				return editar + eliminar;
			}}],
            "columnDefs": [
                { "width": "200px", "targets": 0 },
                { "width": "130px", "targets": 1 },
                { "width": "250px", "targets": 2 },
                { "width": "120px", "targets": 3 },
                { "width": "250px", "targets": 4 },
                { "width": "100px", "targets": 5 },
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
		this.administradoraForm.get('COD_ADMINISTRADORA').setValue('');
		this.administradoraForm.get('NOM_ADMINISTRADORA').setValue('');
		this.administradoraForm.get('ID_TIPO_DOCUMENTO').setValue(10);
		this.administradoraForm.get('NUM_TRIB').setValue('');
		this.administradoraForm.get('ID_MUNICIPIO').setValue('');
		this.administradoraForm.get('NUM_IDEN_REP_LEGAL').setValue('');
		this.administradoraForm.get('NOM_REP_LEGAL').setValue('');
		this.administradoraForm.get('DIREC_ADMINISTRADORA').setValue('');
        this.administradoraForm.get('TELEF').setValue('');
        this.administradoraForm.get('CORREO').setValue('');
        this.administradoraForm.get('WEBSITE').setValue('');
        this.administradoraForm.get('TIPO_ADMINISTRADORA').setValue('EPS');
		this.administradora_id = 0;
		$('#dpto').val(34).trigger('change');
		$('#ID_TIPO_DOCUMENTO').val(10).trigger('change');
		$('#TIPO_ADMINISTRADORA').val('EPS').trigger('change');
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
		this.getMunicipios(null);
        setTimeout(() => 
        {
            $('#ID_MUNICIPIO').val(1127).trigger('change');
        },500);
	}

	Registrar() {
		this.submitted = true;

        if (this.administradoraForm.invalid) {
            return;
        }
        if(this.administradora_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar la ADMINISTRADORA?")) 
				return false;*/

        	this.administradoraForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        	this.administradoraForm.get('TIPO_ADMINISTRADORA').setValue($('#TIPO_ADMINISTRADORA').val());
        	this.administradoraForm.get('ID_TIPO_DOCUMENTO').setValue($('#ID_TIPO_DOCUMENTO').val());
        	this.administradoraService.crearAdministradora(this.administradoraForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Administradora creada");
					this.submitted = false;
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar la ADMINISTRADORA?")) 
				return false;*/
			this.administradoraForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        	this.administradoraForm.get('TIPO_ADMINISTRADORA').setValue($('#TIPO_ADMINISTRADORA').val());
        	this.administradoraForm.get('ID_TIPO_DOCUMENTO').setValue($('#ID_TIPO_DOCUMENTO').val());
        	this.administradoraService.updateAdministradora(this.administradora_id, this.administradoraForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Administradora actualizada");
					this.submitted = false;
				}
			);
        }
	}

	fillAdministradora(p) {
		var that = this;
		this.administradoraService.getAdministradora(p)
			.subscribe(data => {
				var administradora: any = data;
				this.administradora_id = administradora.ID_ADMINISTRADORA;
				this.initForm();
		        this.administradoraForm.get('COD_ADMINISTRADORA').setValue(administradora.COD_ADMINISTRADORA);
				this.administradoraForm.get('NOM_ADMINISTRADORA').setValue(administradora.NOM_ADMINISTRADORA);
				this.administradoraForm.get('ID_TIPO_DOCUMENTO').setValue(administradora.ID_TIPO_DOCUMENTO);
				this.administradoraForm.get('NUM_TRIB').setValue(administradora.NUM_TRIB);
				this.administradoraForm.get('ID_MUNICIPIO').setValue(administradora.ID_MUNICIPIO);
				this.administradoraForm.get('NUM_IDEN_REP_LEGAL').setValue(administradora.NUM_IDEN_REP_LEGAL);
				this.administradoraForm.get('NOM_REP_LEGAL').setValue(administradora.NOM_REP_LEGAL);
				this.administradoraForm.get('DIREC_ADMINISTRADORA').setValue(administradora.DIREC_ADMINISTRADORA);
		        this.administradoraForm.get('TELEF').setValue(administradora.TELEF);
		        this.administradoraForm.get('CORREO').setValue(administradora.CORREO);
		        this.administradoraForm.get('WEBSITE').setValue(administradora.WEBSITE);
		        this.administradoraForm.get('TIPO_ADMINISTRADORA').setValue(administradora.TIPO_ADMINISTRADORA);
				$('#dpto').val(administradora.municipio.dpto.ID_DPTO).trigger('change');
				$('#TIPO_ADMINISTRADORA').val(administradora.TIPO_ADMINISTRADORA).trigger('change');
				$('#ID_TIPO_DOCUMENTO').val(administradora.ID_TIPO_DOCUMENTO).trigger('change');
				setTimeout(() => 
				{
					$('#ID_MUNICIPIO').val(administradora.municipio.ID_MUNICIPIO).trigger('change');
				}, 500);
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#collapseOne').collapse('show');
                $('#NUM_TRIB').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteAdministradora(id) {
		if(confirm("Esta Seguro que desea eliminar la ADMINISTRADORA?")) {
			this.administradoraService.delAdministradora(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Administradora eliminada");
					this.clearAll();
				}
			);
		}
	}

  	getMunicipios(e) {
		this.codifService.getMunicipios(e)
			.subscribe(data => {
				var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_MUNICIPIO +'">'+ data[d].NOM_MUNICIPIO +'</option>';
                }
				$('.select2.muni').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
			}
		);
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
