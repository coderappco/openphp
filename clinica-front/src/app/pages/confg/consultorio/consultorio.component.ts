import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';

import { SedesService } from '../../../services/sedes.service';
import { ConsultorioService } from '../../../services/consultorio.service';
import { CodifService } from '../../../services/codif.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;

@Component({
  	selector: 'app-consultorio',
  	templateUrl: './consultorio.component.html',
  	styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent implements OnInit {

  	submitted = false;
  	consultForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	consultorio_id = 0;
  	sedes: any = [];
  	especialidades: any = [];
    empresas: any = [];
    sede_id: any = '';
    empresa_id: any = 0;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private consultorioService: ConsultorioService,
              private sedesService: SedesService, private codifService: CodifService, private empresaService: EmpresaService) { }

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
      			this.globals.getUrl = 'consultorio';
      	},0);

		    $('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

    		let us = JSON.parse(localStorage.getItem('currentUser'));
        let empresa: any = null;
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

        $('#ID_EMPRESA').on( 'change', function () {
            if($(this).val() != '') {
                that.sedesService.getSedes($(this).val())
                    .subscribe(data => {
                        var newOptions = '<option value="">Seleccione...</option>';
                        for(var d in data) {
                            newOptions += '<option value="'+ data[d].ID_SEDE +'">'+ data[d].NOM_SEDE +'</option>';
                        }
                        $('#ID_SEDE').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                        if(that.sede_id != '') {
                            $('#ID_SEDE').val(that.sede_id).trigger('change');
                        }
                });
            }
            else
                $('#ID_SEDE').empty().select2({dropdownAutoWidth:!0,width:"100%"});
        });
        
    		this.codifService.getEspecialidades()
            .subscribe(data => this.especialidades = data);

    		$('#data-table').on( 'click', '.btn-del', function () {
    			that.deleteConsult($(this).attr('date'));
    		});

    		$('#data-table').on( 'click', '.btn-edit', function () {
    			that.fillConsult($(this).attr('date'));
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

    get f() { return this.consultForm.controls; }

    initForm() {
        this.consultForm = this.formBuilder.group({
            ID_EMPRESA: [''],
            ID_SEDE: [''],
            ID_ESPECIALIDAD: [''],
            NOM_CONSULTORIO: ['', [Validators.required]],
            COD_CONSULTORIO: ['', [Validators.required]],
            PISO_CONSUL: ['1'],
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
            ajax: this.globals.apiUrl+'/consultorios?empresa='+that.empresa_id,
          	columns: [
                { title: 'Código', data: 'COD_CONSULTORIO', className: "align-middle", "render": function ( data, type, row, meta ) {
                      return  '<code>'+data+'</code>';
                }},
          			{ title: 'Consultorio', data: 'NOM_CONSULTORIO', className: "align-middle", "render": function ( data, type, row, meta ) {
          				return  data;
      					}},
                { title: 'Empresa', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                      return  '<i class="zmdi zmdi-balance"></i> '+row.sede.empresa.NOM_EMPRESA;
                } },
              			{ title: 'Sede', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
              				return  '<i class="zmdi zmdi-pin"></i> '+row.sede.NOM_SEDE;
      					} },
              			{ title: 'Especialidad', data: 'ID_ESPECIALIDAD', className: "align-middle", "render": function ( data, type, row, meta ) {
              				return  '<i class="zmdi zmdi-pin"></i> '+row.especialidad.ESPECIALIDAD;
      					} }, 
              	{ title: 'Acción', data: 'ID_CONSULTORIO', "render": function ( data, type, row, meta ) {
              				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar consultorio" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
              				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar consultorio" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
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
    		this.consultForm.get('ID_SEDE').setValue('');
    		this.consultForm.get('ID_ESPECIALIDAD').setValue('');
    		this.consultForm.get('NOM_CONSULTORIO').setValue('');
    		this.consultForm.get('COD_CONSULTORIO').setValue('');
    		this.consultForm.get('PISO_CONSUL').setValue('');
    		this.consultorio_id = 0;
        this.sede_id = '';
        let us = JSON.parse(localStorage.getItem('currentUser'));
        if(us.role == "ADMINISTRADOR") {
            $('#ID_EMPRESA').val('').trigger('change');
            this.consultForm.get('ID_EMPRESA').setValue('');
        }
    		$('#ID_SEDE').val('').trigger('change');
    		$('#ID_ESPECIALIDAD').val('').trigger('change');
    		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
    		this.initForm();
    }

  	Registrar() {
  		  this.submitted = true;

        if (this.consultForm.invalid) {
            return;
        }
        if($('#ID_SEDE').val() == '') {
          	alert("Por favor, escoja la Sede");
          	return false;
        }
        else
        if($('#ID_ESPECIALIDAD').val() == '') {
          	alert("Por favor, escoja la Especialidad");
          	return false;
        }

        if(this.consultorio_id == 0) {
          	/*if(!confirm("Esta Seguro que desea Registrar el Consultorio?")) 
  				    return false;*/

          	this.consultForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
            this.consultForm.get('ID_ESPECIALIDAD').setValue($('#ID_ESPECIALIDAD').val());
          	this.consultorioService.crearConsultorio(this.consultForm.value)
        				.subscribe(data => {
          					this.clearAll();
          					this.table = $('#data-table').DataTable(this.fillTable());
          					this.showMessage("Consultorio creado");
          					this.submitted = false;
      				  }
      			);
        }
        else {
          	/*if(!confirm("Esta Seguro que desea Modificar el Consultorio?")) 
        				return false;*/
      			this.consultForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
      			this.consultForm.get('ID_ESPECIALIDAD').setValue($('#ID_ESPECIALIDAD').val());
            this.consultorioService.updateConsultorio(this.consultorio_id, this.consultForm.value)
        				.subscribe(data => {
          					this.clearAll();
          					this.table = $('#data-table').DataTable(this.fillTable());
          					this.showMessage("Consultorio actualizado");
          					this.submitted = false;
        				}
      			);
        }
    }

    fillConsult(p) {
    		var that = this;
    		this.consultorioService.getConsultorio(p)
      			.subscribe(data => {
        				var consultorio: any = data;
        				this.consultorio_id = consultorio.ID_CONSULTORIO;
                this.sede_id = consultorio.ID_SEDE;
        				this.initForm();
        				this.consultForm.get('ID_ESPECIALIDAD').setValue(consultorio.ID_ESPECIALIDAD);
        				this.consultForm.get('NOM_CONSULTORIO').setValue(consultorio.NOM_CONSULTORIO);
        				this.consultForm.get('COD_CONSULTORIO').setValue(consultorio.COD_CONSULTORIO);
        				this.consultForm.get('PISO_CONSUL').setValue(consultorio.PISO_CONSUL);
                let us = JSON.parse(localStorage.getItem('currentUser'));
                if(us.role == "ADMINISTRADOR") {
                    $('#ID_EMPRESA').val(consultorio.sede.ID_EMPRESA).trigger('change');
                    this.consultForm.get('ID_EMPRESA').setValue(consultorio.sede.ID_EMPRESA);
                }
                else {
                    this.consultForm.get('ID_SEDE').setValue(consultorio.ID_SEDE);
                    $('#ID_SEDE').val(consultorio.ID_SEDE).trigger('change');
                }
        				$('#ID_ESPECIALIDAD').val(consultorio.especialidad.ID_ESPECIALIDAD).trigger('change');
        				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#collapseOne').collapse('show');
                $('#COD_CONSULTORIO').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      			}
    		);
  	}

	deleteConsult(id) {
		if(confirm("Esta Seguro que desea eliminar el Consultorio?")) {
			this.consultorioService.delConsultorio(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Consultorio eliminado");
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
