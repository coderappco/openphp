import { AfterViewInit, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, SimpleChange, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

import { CodifService } from '../../../services/codif.service';
import { HistoriasService } from '../../../services/historias.service';
import { PacienteService } from '../../../services/paciente.service';
import { ItemsService } from '../../../services/items.service';

declare var $: any;

@Component({
  	selector: 'app-pedidoexamen',
  	templateUrl: './pedidoexamen.component.html',
  	styleUrls: ['./pedidoexamen.component.css']
})
export class PedidoexamenComponent implements OnInit {

	examenForm: FormGroup;
    dtOptions: any = {};
  	table: any = '';
    @Output() basica = new EventEmitter<any>();
    @Input() id_pac: any;
    historias: any = [];
    items: any = [];
    id_examen: any = 0;

  	constructor(private formBuilder: FormBuilder, private codifService: CodifService, private globals: Globals, private historiasService: HistoriasService,
  				private _loadingBar: SlimLoadingBarService, private router: Router, private pacienteService: PacienteService, private itemsService: ItemsService) { }

  	ngOnInit() {
  		this.initForm();
  	}

  	ngOnChanges(changes: SimpleChanges) {
        const us: SimpleChange = changes.id_pac;
        if(us)
            if(us.currentValue != 0) {
            	this.historiasService.getHistPacientesIdLab(us.currentValue)
            		.subscribe(data => {
                        this.historias = data;
                        let da: any = data;
                        $('#FECHA').val('');
                        $('#PRESTADOR').val('');
                        if(da.length > 0) {
                            setTimeout(() => 
                            {
                                $('#HISTORIAEX').val(da[0].ID_HISTORIA_PACIENTE).trigger('change');
                            },0);
                        }
                    });
            }
            else {
                us.previousValue = 0;
            }
	}

	ngAfterViewInit(): void {
  		var that = this;
  		$('[data-toggle="tooltip"]').tooltip();
        $('body').on("keyup", 'input[type=text]', function () {
            $('#muestra').html($(this).val());
            var el = this;
            var dato = $(this).val();
            $(el).popover('hide');
            $(el).popover({
                content: 'No refiere',
                placement: 'bottom',
                container: 'body',
                html: true
            });
            var popover = $(el).attr('data-content',dato).data('bs.popover');
            popover.setContent();
            $(el).popover('show');
        });
        $('body').on("mouseenter", 'input[type=text]', function () {
            $('#muestra').html($(this).val());
            let el = this;
            var dato = $(this).val();
            $(el).popover('hide');
            $(el).popover({
                content: 'No refiere',
                placement: 'bottom',
                container: 'body',
                trriger: 'over',
                html: true
            });
            var popover = $(el).attr('data-content',dato).data('bs.popover');
            popover.setContent();
            $(el).popover('show');
        });
        $('body').on("mouseleave", 'input[type=text]', function () {
            let el = this;
            $(el).popover('hide');
        });
        $('body').on("mouseout", 'input[type=text]', function () {
            let el = this;
            $(el).popover('hide');
        });
        $('body').on('focusout', 'input[type=text]', function() {
            let el = this;
            $(el).popover('hide');
        });
		this.itemsService.getItemsLab()
            .subscribe(data => this.items = data);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
		$('#PACIENTE').select2({
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
            language: { 
            	inputTooShort: function () { 
            		return 'Por favor, entre al menos 1 caracter'; 
            	} 
            },
            placeholder: 'Buscar Pacientes',
            minimumInputLength: 1,
            allowClear: true
        });
        $('#ID_USUARIO').select2({
            dropdownAutoWidth:!0,
            width:"100%",
            ajax: {
                url: that.globals.apiUrl+'/users/prestadores',
                dataType: 'json',
                data: function (params) {
                    return {
                        q: params.term
                    };
                }
            },
            language: { 
            	inputTooShort: function () { 
            		return 'Por favor, entre al menos 1 caracter'; 
            	} 
            },
            placeholder: 'Buscar Prestadores',
            minimumInputLength: 1,
            allowClear: true
        });
        $('#HISTORIAEX').on( 'change', function () {
        	if($(this).val() != null) {
        		that.historiasService.getHistoriaPacientes($(this).val())
        			.subscribe(data => {
        				let da: any = data;
        				$('#FECHA').val(moment(da.FEC_DILIGENCIADA).format('DD/MM/YYYY H:mm'));
        				$('#PRESTADOR').val(da.usuario.NOMBRES + " " + da.usuario.APELLIDOS);
        				that.table = $('#data-table-examen').DataTable(that.fillTable($(this).val()));
        			}
        		);
        	}
        });
        $('#DIAGNOSTICOHIST').select2({
            dropdownAutoWidth:!0,
            width:"100%",
            ajax: {
                url: that.globals.apiUrl+'/diagnosticos',
                dataType: 'json',
                data: function (params) {
                    return {
                        q: params.term
                    };
                }
            },
            language: { 
                inputTooShort: function () { 
                    return 'Por favor, entre al menos 1 caracter'; 
                } 
            },
            placeholder: 'Buscar Diagnóstico',
            minimumInputLength: 1,
            allowClear: true
        });
        $('#data-table-examen').on( 'click', '.btn-edit', function () {
            that.fillExamen($(this).attr('date'));
        });

        $('#data-table-examen').on( 'click', '.btn-delete', function () {
            that.delExamen($(this).attr('date'));
        });
	}

  	initForm() {
        this.examenForm = this.formBuilder.group({
            HISTORIAEX: [''],
            ITEM: [''],
            CANTIDAD: [1],
            OBS: [''],
            RESULTADO: [''],
        });
    }

    fillTable(id) {
        var that = this;
        return this.dtOptions = {
            pageLength: 5,
            autoWidth: !1,
            responsive: !0,
            "destroy": true,
            "order": [[0, 'desc']],
            language: {
                "url": "assets/Spanish.json",
                searchPlaceholder: "Escriba parametro a filtrar...",
                "emptyTable": "SIN EXAMENES"
            },
            ajax: this.globals.apiUrl+'/historias/historialaboratorio?id_hist='+id,
            columns: [
            	{ title: 'Código', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.items.COD_ITEM;
                }},
                { title: 'Examen', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.items.NOM_ITEM;
                }},
                { title: 'Cantidad', data: 'CANTIDAD', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Resultado', data: 'RESULTADO', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Observaciones', data: 'OBSERVACIONES', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Acción', data: 'ID_HIST_PAC_EXAMENL', "render": function ( data, type, row, meta ) {
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-delete" title="Eliminar examen" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button> ';
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar examen" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
                    return eliminar + editar;
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

    Cancelar() {
    	this.basica.emit(0);
    	this.clearAll();
    }

    Solicitar() {
    	if($('#PACIENTE').val() == null || $('#PACIENTE').val() == '') {
    		alert("Por favor, escoja el paciente para solicitar el examen.");
    		return false;
    	}
    	if($('#HISTORIAEX').val() == null || $('#HISTORIAEX').val() == '') {
    		alert("Por favor, escoja el registro clínico al cual se le asignara el examen.");
    		return false;
    	}
    	if($('#CODIGO').val() == null || $('#CODIGO').val() == '') {
    		alert("Por favor, escoja el examen a asignar.");
    		return false;
    	}
    	if($('#CANTIDAD').val() == '') {
    		alert("Por favor, diga la cantidad a realizar del examen.");
    		return false;
    	}
    	if($('#OBSERVACION').val() == '') {
    		alert("Por favor, diga la observación del examen.");
    		return false;
    	}
    	if(!confirm("Esta seguro de asignar el examen al registro clínico?"))
    		return false;

    	this.examenForm.get('HISTORIAEX').setValue($('#HISTORIAEX').val());
    	this.examenForm.get('ITEM').setValue($('#CODIGO').val());
    	this.examenForm.get('CANTIDAD').setValue($('#CANTIDAD').val());
        this.examenForm.get('OBS').setValue($('#OBSERVACION').val());
        this.examenForm.get('RESULTADO').setValue($('#RESULTADO').val());
        if(this.id_examen == 0)
	    	this.historiasService.saveHistoriaLab(this.examenForm.value)
	    		.subscribe(data => {
	    			let da: any = data;
		        	this.clearAll();
		        	this.showMessage("Examen guardado");
		        	this.table = $('#data-table-examen').DataTable(this.fillTable($('#HISTORIAEX').val()));
	    		}
	    	);
	    else
	    	this.historiasService.updateHistoriaLab(this.id_examen, this.examenForm.value)
	    		.subscribe(data => {
	    			let da: any = data;
		        	this.clearAll();
		        	this.showMessage("Examen actualizado");
		        	this.table = $('#data-table-examen').DataTable(this.fillTable($('#HISTORIAEX').val()));
	    		}
	    	);
    }

    fillExamen(id) {
    	this.id_examen = id;
    	this.historiasService.getHistLab(id)
    		.subscribe(data => {
    			let da: any = data;
    			$('#CODIGO').val(da.items.ID_ITEM).trigger('change');
		        $('#CANTIDAD').val(da.CANTIDAD);
		        $('#OBSERVACION').val(da.OBSERVACIONES);
		        $('#RESULTADO').val(da.RESULTADO);
		        $('.btn-sol').html('<i class="zmdi zmdi-hospital-alt"></i> Actualizar examen');
    		}
    	);
    }

    delExamen(id) {
    	if(!confirm('Esta seguro que desea eliminar el examen de laboratorio?'))
    		return false;
    	this.historiasService.delHistoriaLab(id)
    		.subscribe(data => {
    			let da: any = data;
		        this.clearAll();
		        this.showMessage("Examen eliminado");
		        this.table = $('#data-table-examen').DataTable(this.fillTable($('#HISTORIAEX').val()));
    		}
    	);
    }

    clearAll() {
    	this.examenForm.get('ITEM').setValue('');
    	this.examenForm.get('CANTIDAD').setValue(1);
        this.examenForm.get('OBS').setValue('');
        this.examenForm.get('RESULTADO').setValue('');
        $('#CODIGO').val('').trigger('change');
        $('#CANTIDAD').val(1);
        $('#OBSERVACION').val('');
        $('#RESULTADO').val('');
        this.id_examen = 0;
        $('.btn-sol').html('<i class="zmdi zmdi-hospital-alt"></i> Solicitar examen');
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
                                '<div class="progress-bar-ar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                            '</div>' +
                            '<a href="{3}" target="{4}" data-notify="url"></a>' +
                            '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">Close</button>' +
                        '</div>'
        });
    }
}
