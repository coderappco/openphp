import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';

import { SedesService } from '../../../services/sedes.service';
import { CamaService } from '../../../services/cama.service';
import { CodifService } from '../../../services/codif.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;

@Component({
  	selector: 'app-camas',
  	templateUrl: './camas.component.html',
  	styleUrls: ['./camas.component.css']
})
export class CamasComponent implements OnInit {

	submitted = false;
  	camasForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	cama_id = 0;
  	sedes: any = [];
    empresas: any = [];
    sede_id: any = '';
    empresa_id: any = 0;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private camaService: CamaService,
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

    	$('#data-table').on( 'click', '.btn-del', function () {
    		that.deleteCama($(this).attr('date'));
    	});

    	$('#data-table').on( 'click', '.btn-edit', function () {
    		that.fillCama($(this).attr('date'));
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

    get f() { return this.camasForm.controls; }

    initForm() {
        this.camasForm = this.formBuilder.group({
            ID_EMPRESA: [''],
            ID_SEDE: [''],
            NUMERO: ['', [Validators.required]],
            OBSERVACION: ['', [Validators.required]],
            PISO: ['1', [Validators.required]],
            URGENCIAS: [''],
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
            ajax: this.globals.apiUrl+'/camas?empresa='+that.empresa_id,
          	columns: [
          		{ title: 'Empresa', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
					return  '<i class="zmdi zmdi-balance"></i> '+row.sede.empresa.NOM_EMPRESA;
                } },
				{ title: 'Sede', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
					return  '<i class="zmdi zmdi-pin"></i> '+row.sede.NOM_SEDE;
				} },
                { title: 'Número', data: 'NUMERO', className: "align-middle", "render": function ( data, type, row, meta ) {
                      return  '<code>'+data+'</code>';
                }},
				{ title: 'Piso', data: 'PISO', className: "align-middle", "render": function ( data, type, row, meta ) {
					return  data;
				}},
              	{ title: 'Urgencias', data: 'URGENCIAS', className: "align-middle", "render": function ( data, type, row, meta ) {
              		return  data == 1 ? '<i class="zmdi zmdi-check-square"></i>' : '<i class="zmdi zmdi-close-circle"></i>';
      			} }, 
              	{ title: 'Acción', data: 'ID_SEDE_CAMA', "render": function ( data, type, row, meta ) {
              				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar cama" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
              				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar cama" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
              				return editar + eliminar;
            }}],
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
    	this.camasForm.get('ID_SEDE').setValue('');
    	this.camasForm.get('NUMERO').setValue('');
    	this.camasForm.get('PISO').setValue('');
    	this.camasForm.get('OBSERVACION').setValue('');
    	this.camasForm.get('URGENCIAS').setValue('');
    	this.cama_id = 0;
        this.sede_id = '';
        let us = JSON.parse(localStorage.getItem('currentUser'));
        if(us.role == "ADMINISTRADOR") {
            $('#ID_EMPRESA').val('').trigger('change');
            this.camasForm.get('ID_EMPRESA').setValue('');
        }
    	$('#ID_SEDE').val('').trigger('change');
    	$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
    	$('#urgencias').prop('checked', false);
    	this.initForm();
    }

  	Registrar() {
		this.submitted = true;

        if (this.camasForm.invalid) {
            return;
        }
        if($('#ID_SEDE').val() == '') {
          	alert("Por favor, escoja la Sede");
          	return false;
        }

        if(this.cama_id == 0) {
          	/*if(!confirm("Esta Seguro que desea Registrar la CAMA?")) 
				return false;*/

          	this.camasForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
          	let urg: any = $('#urgencias').prop('checked') == true ? 1 : 0;
          	this.camasForm.get('URGENCIAS').setValue(urg);
          	this.camaService.crearCama(this.camasForm.value)
        		.subscribe(data => {
          			this.clearAll();
          			this.table = $('#data-table').DataTable(this.fillTable());
          			this.showMessage("Cama registrada");
          			this.submitted = false;
				}
			);
        }
        else {
          	/*if(!confirm("Esta Seguro que desea Modificar la CAMA?")) 
				return false;*/
      		this.camasForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
      		let urg: any = $('#urgencias').prop('checked') == true ? 1 : 0;
          	this.camasForm.get('URGENCIAS').setValue(urg);
            this.camaService.updateCama(this.cama_id, this.camasForm.value)
        		.subscribe(data => {
          			this.clearAll();
          			this.table = $('#data-table').DataTable(this.fillTable());
          			this.showMessage("Cama actualizada");
          			this.submitted = false;
        		}
      		);
        }
    }

    fillCama(p) {
    	var that = this;
    	this.camaService.getCama(p)
      		.subscribe(data => {
        		var cama: any = data;
        		this.cama_id = cama.ID_SEDE_CAMA;
                this.sede_id = cama.ID_SEDE;
        		this.initForm();
		    	this.camasForm.get('NUMERO').setValue(cama.NUMERO);
		    	this.camasForm.get('PISO').setValue(cama.PISO);
		    	this.camasForm.get('OBSERVACION').setValue(cama.OBSERVACION);
		    	this.camasForm.get('URGENCIAS').setValue(cama.URGENCIAS);
		    	let urg: any = cama.URGENCIAS == 1 ? true : false;
		    	$('#urgencias').prop('checked', urg);
                let us = JSON.parse(localStorage.getItem('currentUser'));
                if(us.role == "ADMINISTRADOR") {
                    $('#ID_EMPRESA').val(cama.sede.ID_EMPRESA).trigger('change');
                    this.camasForm.get('ID_EMPRESA').setValue(cama.sede.ID_EMPRESA);
                }
                else {
                    this.camasForm.get('ID_SEDE').setValue(cama.ID_SEDE);
                    $('#ID_SEDE').val(cama.ID_SEDE).trigger('change');
                }
        		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#collapseOne').collapse('show');
                $('#COD_CONSULTORIO').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      			}
    		);
  	}

	deleteCama(id) {
		if(confirm("Esta Seguro que desea eliminar la cama?")) {
			this.camaService.delCama(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Cama eliminada");
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
