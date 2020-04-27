import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';

import { SedesService } from '../../../services/sedes.service';
import { NolaboralService } from '../../../services/nolaboral.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;

@Component({
  	selector: 'app-nolaboral',
  	templateUrl: './nolaboral.component.html',
  	styleUrls: ['./nolaboral.component.css']
})
export class NolaboralComponent implements OnInit {

    submitted = false;
  	nolaboralForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	nolaboral_id = 0;
  	sedes: any = [];
    empresas: any = [];
    change: any = false;
    empresa_id: any = 0;
    sede_id: any = '';

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private nolaboralService: NolaboralService, private sedesService: SedesService,
                private empresaService: EmpresaService) { }

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
      		this.globals.getUrl = 'nolaboral';
      	},0);
    		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
    		$(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'})

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
                else {
                  this.sedesService.getSedes()
                      .subscribe(data => this.sedes = data);
                }
            }
        );

        $('#ID_EMPRESA').on( 'change', function () {
            if($(this).val() != '') {
                that.sedesService.getSedes($(this).val())
                    .subscribe(data => {                        
                        var newOptions = '<option value="todas" selected>Todas las Sedes</option>';
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
            that.deleteNolaboral($(this).attr('date'));
      	});

      	$('#data-table').on( 'click', '.btn-edit', function () {
            that.fillNolaboral($(this).attr('date'));
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

    get f() { return this.nolaboralForm.controls; }

    initForm() {
        this.nolaboralForm = this.formBuilder.group({
            ID_SEDE: ['todas'],
            FEC_NO_LABORAL: [''],
            ID_EMPRESA: [''],
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
            ajax: this.globals.apiUrl+'/nolaborales?empresa='+that.empresa_id,
          	columns: [
          		{ title: 'Sedes', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
          			return  row.sede.NOM_SEDE;
      			}},
              { title: 'Empresa', data: 'ID_SEDE', className: "align-middle", "render": function ( data, type, row, meta ) {
                return  row.sede.empresa.NOM_EMPRESA;
            }},
      			{ title: 'Día no laboral', data: 'FEC_NO_LABORAL', className: "align-middle", "render": function ( data, type, row, meta ) {
              		return  '<i class="zmdi zmdi-calendar"></i> '+moment(data).format('DD/MM/YYYY');
      			}},
              	{ title: 'Acción', data: 'ID_DIA_NO_LABORAL', "render": function ( data, type, row, meta ) {
              		let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar día no laboral" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
              		let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar día no laboral" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
              		return editar + eliminar;
              	}}
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
      	this.nolaboralForm.get('ID_SEDE').setValue('todas');
      	this.nolaboralForm.get('FEC_NO_LABORAL').setValue('');
      	this.nolaboral_id = 0;
        this.sede_id = '';
        this.change = true;
        let us = JSON.parse(localStorage.getItem('currentUser'));
        if(us.role == "ADMINISTRADOR") {
            $('#ID_EMPRESA').val('').trigger('change');
            this.nolaboralForm.get('ID_EMPRESA').setValue('');
            this.sedesService.getSedes()
                .subscribe(data => {                        
                    var newOptions = '<option value="todas" selected>Todas las Sedes</option>';
                    for(var d in data) {
                        newOptions += '<option value="'+ data[d].ID_SEDE +'">'+ data[d].NOM_SEDE +'</option>';
                    }
                    $('#ID_SEDE').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                    $('#ID_SEDE').val('todas').trigger('change');
            });
        }
        $('#ID_SEDE').val('todas').trigger('change');
      	$('#FEC_NO_LABORAL').val('');
      	$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
      	//this.initForm();
    }

  	Registrar() {
        this.submitted = true;

        if (this.nolaboralForm.invalid) {
            return;
        }
        if($('#ID_SEDE').val() == '') {
          	alert("Por favor, escoja la Sede");
          	return false;
        }
        else
        if($('#FEC_NO_LABORAL').val() == '') {
          	alert("Por favor, escoja el día");
          	return false;
        }

        if(this.nolaboral_id == 0) {
            /*if(!confirm("Esta Seguro que desea Agregar el día como NO LABORABLE?")) 
				    return false;*/

          	this.nolaboralForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
          	this.nolaboralForm.get('FEC_NO_LABORAL').setValue($('#FEC_NO_LABORAL').val());
            this.nolaboralForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
          	this.nolaboralService.crearNolaboral(this.nolaboralForm.value)
        				.subscribe(data => {
          					this.clearAll();
          					this.table = $('#data-table').DataTable(this.fillTable());
          					this.showMessage("Día asignado como no laborable");
          					this.submitted = false;
        				}
        		);
        }
        else {
          	/*if(!confirm("Esta Seguro que desea Modificar el Consultorio?")) 
  				      return false;*/
      			this.nolaboralForm.get('ID_SEDE').setValue($('#ID_SEDE').val());
      			this.nolaboralForm.get('FEC_NO_LABORAL').setValue($('#FEC_NO_LABORAL').val());
            this.nolaboralForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
            this.nolaboralService.updateNolaboral(this.nolaboral_id, this.nolaboralForm.value)
        				.subscribe(data => {
          					this.clearAll();
          					this.table = $('#data-table').DataTable(this.fillTable());
          					this.showMessage("Día no laborable actualizado");
          					this.submitted = false;
        				}
        		);
        }
    }

    fillNolaboral(p) {
    		var that = this;
    		this.nolaboralService.getNolaboral(p)
      			.subscribe(data => {
        				var nolaboral: any = data;
        				this.nolaboral_id = nolaboral.ID_DIA_NO_LABORAL;
                this.sede_id = nolaboral.ID_SEDE;
        				this.initForm();
        				this.nolaboralForm.get('ID_SEDE').setValue(nolaboral.ID_SEDE);
        				this.nolaboralForm.get('FEC_NO_LABORAL').setValue(nolaboral.FEC_NO_LABORAL);
                let us = JSON.parse(localStorage.getItem('currentUser'));
                if(us.role == "ADMINISTRADOR") {
                    $('#ID_EMPRESA').val(nolaboral.sede.ID_EMPRESA).trigger('change');
                    this.nolaboralForm.get('ID_EMPRESA').setValue(nolaboral.sede.ID_EMPRESA);
                }
                else {
                    this.nolaboralForm.get('ID_SEDE').setValue(nolaboral.ID_SEDE);
                    $('#ID_SEDE').val(nolaboral.ID_SEDE).trigger('change');
                }
        				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $("#FEC_NO_LABORAL").flatpickr({
                    dateFormat: 'd/m/Y',
                    "locale": "es",
                    enableTime:!1,
                    nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',
                    prevArrow:'<i class="zmdi zmdi-long-arrow-left" />',
                    defaultDate: moment(nolaboral.FEC_NO_LABORAL).format('DD/MM/YYYY')
                });
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                $('#collapseOne').collapse('show');
                $('#FEC_NO_LABORAL').focus();
      			}
    		);
  	}

    deleteNolaboral(id) {
    		if(confirm("Esta Seguro que desea eliminar el día como no LABORABLE?")) {
      			this.nolaboralService.delNolaboral(id)
        				.subscribe(data => {
          					this.table = $('#data-table').DataTable(this.fillTable());
          					this.showMessage("Día eliminado como no laborable");
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
