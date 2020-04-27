import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';

import { CodifService } from '../../../services/codif.service';
import { EmpresaService } from '../../../services/empresa.service';
import { SedesService } from '../../../services/sedes.service';

declare var $: any;

@Component({
  	selector: 'app-sede',
  	templateUrl: './sede.component.html',
  	styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {

  	submitted = false;
  	sedeForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	sede_id = 0;
  	dptos: any = [];
  	municipios: any = [];
  	empresas: any = [];
    empresa_id: any = 0;
    muni_id: any = '';

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService, private empresaService: EmpresaService, private sedesService: SedesService) { }

  	ngOnInit() {
  		  this.initForm();
        let us = JSON.parse(localStorage.getItem('currentUser'));
        if(us.role != "ADMINISTRADOR") {
            this.empresa_id = us.empresa_id;
        }
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
    		var that = this;
  		  setTimeout(() => 
  			{
  				  this.globals.getUrl = 'sede';
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
        let us = JSON.parse(localStorage.getItem('currentUser'));
    		this.empresaService.getEmpresas()
            .subscribe(data => {
                this.empresas = data;
                if(us.role != "ADMINISTRADOR") {
                    setTimeout(() => 
                    {
                        $('#ID_EMPRESA').val(us.empresa_id).trigger('change');
                        $('#ID_EMPRESA').prop('disabled', true);
                    }
                    ,0);
                }
            }
        );

    		$('#data-table').on( 'click', '.btn-del', function () {
            that.deleteSede($(this).attr('date'));
    		});

    		$('#data-table').on( 'click', '.btn-edit', function () { 
            that.fillSede($(this).attr('date'));
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

    get f() { return this.sedeForm.controls; }

    initForm() {
        this.sedeForm = this.formBuilder.group({
            ID_MUNICIPIO: [''],
            NOM_SEDE: ['', [Validators.required]],
            COD_SEDE: ['', [Validators.required]],
            DIREC_SEDE: [''],
            TELEF: [''],
            ID_EMPRESA: [''],
            dpto: [''],
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
          	ajax: this.globals.apiUrl+'/sedes?empresa='+that.empresa_id,
          	columns: [
                { title: 'Código', data: 'COD_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<code>'+data+'</code>';
                }},
                { title: 'Sede', data: 'NOM_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data;
                }},
                { title: 'Empresa', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<code>'+row.empresa.NOM_EMPRESA+'</code>';
                }},
          			{ title: 'Departamento', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.dpto.NOM_DEPARTAMENTO;
                }},
          			{ title: 'Municipio', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
          				return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.NOM_MUNICIPIO;
                }}, 
          			{ title: 'Acción', data: 'ID_SEDE', "render": function ( data, type, row, meta ) {
          				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar sede" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
          				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar sede" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
          				return editar + eliminar;
  			       }}],
              "columnDefs": [
                { "width": "120px", "targets": 0 },
                { "width": "200px", "targets": 1 },
                { "width": "200px", "targets": 2 },
                { "width": "200px", "targets": 3 },
                { "width": "200px", "targets": 4 },
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
		this.sedeForm.get('ID_MUNICIPIO').setValue('');
		this.sedeForm.get('NOM_SEDE').setValue('');
		this.sedeForm.get('COD_SEDE').setValue('');
		this.sedeForm.get('DIREC_SEDE').setValue('');
		this.sedeForm.get('TELEF').setValue('');
		this.sede_id = 0;
    this.muni_id = '';
		$('#dpto').val('').trigger('change');
		$('#ID_MUNICIPIO').val('').trigger('change');
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
		this.getMunicipios(null);
    let us = JSON.parse(localStorage.getItem('currentUser'));
    if(us.role == "ADMINISTRADOR") {
		    this.getEmpresas();
        this.sedeForm.get('ID_EMPRESA').setValue('');
    }
	}

	Registrar() {
		  this.submitted = true;

      if (this.sedeForm.invalid) {
          return;
      }
      if($('#ID_MUNICIPIO').val() == '') {
        	alert("Por favor, escoja el Municipio");
        	return false;
      }
      else
      if($('#ID_EMPRESA').val() == '') {
        	alert("Por favor, escoja la Empresa");
        	return false;
      }

      if(this.sede_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar la SEDE?")) 
				      return false;*/

        	this.sedeForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        	this.sedeForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
        	this.sedesService.crearSede(this.sedeForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Sede creada");
					this.submitted = false;
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar la SEDE?")) 
				return false;*/
			this.sedeForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
			this.sedeForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
        	this.sedesService.updateSede(this.sede_id, this.sedeForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Sede actualizada");
					this.submitted = false;
				}
			);
        }
	}

	fillSede(p) {
		var that = this;
		this.sedesService.getSede(p)
			.subscribe(data => {
				var sede: any = data;
				this.sede_id = sede.ID_SEDE;
        this.muni_id = sede.municipio.ID_MUNICIPIO;
				this.initForm();
		        this.sedeForm.get('ID_MUNICIPIO').setValue(sede.ID_MUNICIPIO);
				this.sedeForm.get('NOM_SEDE').setValue(sede.NOM_SEDE);
				this.sedeForm.get('COD_SEDE').setValue(sede.COD_SEDE);
				this.sedeForm.get('DIREC_SEDE').setValue(sede.DIREC_SEDE);
				this.sedeForm.get('ID_EMPRESA').setValue(sede.ID_EMPRESA);
				this.sedeForm.get('TELEF').setValue(sede.TELEF);
				this.sedeForm.get('dpto').setValue(sede.municipio.dpto.ID_DPTO);
				$('#dpto').val(sede.municipio.dpto.ID_DPTO).trigger('change');
				$('#ID_EMPRESA').val(sede.empresa.ID_EMPRESA).trigger('change');
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
        $('#collapseOne').collapse('show');
        $('#COD_SEDE').focus();
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteSede(id) {
		if(confirm("Esta Seguro que desea eliminar la SEDE?")) {
			this.sedesService.delSede(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Sede eliminada");
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
        setTimeout(() => 
        {
          $('#ID_MUNICIPIO').val(this.muni_id).trigger('change');
        }, 0);
			}
		);
	}

	getEmpresas() {
		this.empresaService.getEmpresas()
			.subscribe(data => {
				var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_EMPRESA +'">'+ data[d].NOM_EMPRESA +'</option>';
                }
				$('.select2.empresa').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
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
