import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import { RangoseService } from '../../../services/rangose.service';
import { HistoriasService } from '../../../services/historias.service';

declare var $: any;

@Component({
  selector: 'app-historia',
  templateUrl: './historias.component.html',
  styleUrls: ['./historias.component.css']
})
export class HistoriaComponent implements OnInit {

	submitted = false;
	historiaForm: FormGroup;
	rangos: any = [];
	historias: any = [];
	edadesForm: FormGroup;
	dtOptions: any = {};
  	table: any = '';

	constructor(private globals: Globals, private formBuilder: FormBuilder, private historiasService: HistoriasService, private rangoseService: RangoseService) {}

	ngOnInit() {
		this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
	}

	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
		{
			this.globals.getUrl = 'historia';
		},0);
		$('.historia').on("change", function (e) {console.log($(this).val());
        	if($(this).val() != null && $(this).val() != '')
	        	that.historiasService.getHistoria($(this).val())
	        		.subscribe(data => {
	        			let da: any = data;
	        			let rango = (da.ID_RANGO != null && da.ID_RANGO != '') ? da.ID_RANGO : '';
	        			let genero = (da.GENERO != null && da.GENERO != '') ? da.GENERO : '';
	        			$('.edad').val(rango).trigger('change');
						$('.genero').val(genero).trigger('change');
	        		}
	        	);
        });
        $('[data-toggle="tooltip"]').tooltip();
		this.rangoseService.getRangosE()
			.subscribe(data => {
				let da: any = data;
				this.rangos = da;
				this.historiasService.listHistorias()
					.subscribe(data => {
						let hi: any = data;
						this.historias = hi;
					})
			}
		);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
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
        $('#data-table').on( 'click', '.btn-edit', function () {
			that.fillHistoria($(this).attr('date'));
		});
	}

	get f() { return this.edadesForm.controls; }

	initForm() {
        this.historiaForm = this.formBuilder.group({
            ID_HISTORIA: [0],
            ID_RANGO: [''],
            GENERO: [''],
        });
        this.edadesForm = this.formBuilder.group({
            NOM_RANGO: ['', [Validators.required]],
            EDAD_INICIAL: [0, [Validators.required]],
            EDAD_FINAL: [''],
            EDAD_INICIAL_MESES: [''],
            EDAD_FINAL_MESES: [''],
  	    });
    }

    fillHistoria(id) {
    	this.historiasService.getHistoria(id)
	        .subscribe(data => {
	        	let da: any = data;
	        	let rango = (da.ID_RANGO != null && da.ID_RANGO != '') ? da.ID_RANGO : '';
	        	let genero = (da.GENERO != null && da.GENERO != '') ? da.GENERO : '';
	        	$('.edad').val(rango).trigger('change');
				$('.genero').val(genero).trigger('change');
				$('.historia').val(id).trigger('change');
				$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
	        }
	    );
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
        	ajax: this.globals.apiUrl+'/historias',
        	columns: [
                    { title: 'Registro clínico', data: 'NOM_HISTORIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                    }},
                    { title: 'Rango de edad', data: 'ID_HISTORIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var rango = row.rango != null ? row.rango.NOM_RANGO : '-';
                        return  rango;
                    }},
        			{ title: 'Edad inicial', data: 'ID_HISTORIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var edadi = row.rango != null ? row.rango.EDAD_INICIAL + (row.rango.EDAD_INICIAL_MESES == 1 ? " Meses" : " Años") : '-';
                        return  edadi;
                    }},
                    { title: 'Edad final', data: 'ID_HISTORIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        var edadf = row.rango != null ? (row.rango.EDAD_FINAL != null ? row.rango.EDAD_FINAL + (row.rango.EDAD_FINAL_MESES == 1 ? " Meses" : " Años") : '-') : '-';
                        return  edadf;
                    }},
                    { title: 'Género', data: 'GENERO', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  (data == 1 ? "Masculino" : (data == 2 ? "Femenino" : "Indeterminado"));
                    }},
        			{ title: 'Acción', data: 'ID_HISTORIA', "render": function ( data, type, row, meta ) {
        				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar administradora" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';        				
        				return editar;
			}}],
            "columnDefs": [
                { "width": "350px", "targets": 0 },
                { "width": "150px", "targets": 1 },
                { "width": "100px", "targets": 2 },
                { "width": "100px", "targets": 3 },
                { "width": "150px", "targets": 4 },
                { "width": "100px", "targets": 5 }
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

  	CrearRango() {
		$('#rango_modal').modal('show');
	}

	CancelRango() {
		$('#rango_modal').modal('hide');
	}

	UpdateHistoria() {
        if($('#GENERO').val() == '' || $('#GENERO').val() == null) {
        	alert("Por favor, debe escoger el GENERO");
        	return false;
        }
        if($('#ID_RANGO').val() == '' || $('#ID_RANGO').val() == null) {
        	alert("Por favor, debe escoger el rango de EDAD");
        	return false;
        }
        if($('#ID_HISTORIA').val() == '' || $('#ID_HISTORIA').val() == null) {
        	alert("Por favor, debe escoger la HISTORIA a modificar");
        	return false;
        }
        /*if(!confirm("Esta Seguro que desea Modificar la validación de la historia?")) 
			return false;*/
		this.historiaForm.get('ID_HISTORIA').setValue($('#ID_HISTORIA').val());
		this.historiaForm.get('ID_RANGO').setValue($('#ID_RANGO').val());
		this.historiaForm.get('GENERO').setValue($('#GENERO').val());
		this.historiasService.updateHistoria($('#ID_HISTORIA').val(),this.historiaForm.value)
			.subscribe(data => {
				this.historiaForm.get('ID_HISTORIA').setValue('');
				this.historiaForm.get('ID_RANGO').setValue('');
				this.historiaForm.get('GENERO').setValue('');
				$('#ID_RANGO').val('').trigger('change');
				$('#ID_HISTORIA').val(0).trigger('change');
				$('#GENERO').val('').trigger('change');
				this.table = $('#data-table').DataTable(this.fillTable());
				this.showMessage("Historia actulizada");
			}
		);
	}

	RegistrarRango() {
		this.submitted = true;

        if (this.edadesForm.invalid) {
            return;
        }

        let edadim = $('#edadim').prop('checked') == true ? 1 : 0;
        let edadfm = $('#edadfm').prop('checked') == true ? 1 : 0;
        this.edadesForm.get('EDAD_INICIAL_MESES').setValue(edadim);
        this.edadesForm.get('EDAD_FINAL_MESES').setValue(edadfm);
        /*if(!confirm("Esta Seguro que desea Agregar el rango de edad?")) 
			return false;*/
        this.rangoseService.crearRangoE(this.edadesForm.value)
            .subscribe(data => {
            	let da: any = data;
                var newOptions = '<option value="'+ da.ID_RANGO +'">'+ da.NOM_RANGO +'</option>';
                var html = $('#ID_RANGO').html();
                $('#ID_RANGO').html(html+newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                $('#ID_RANGO').val(da.ID_RANGO).trigger('change');
              	this.showMessage("Rango de edad asignado");
              	this.submitted = false;
              	this.edadesForm.get('NOM_RANGO').setValue('');
		      	this.edadesForm.get('EDAD_INICIAL').setValue(0);
		      	this.edadesForm.get('EDAD_FINAL').setValue('');
		      	$('#rango_modal').modal('hide');
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
