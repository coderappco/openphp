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
  	selector: 'app-formulamedicamento',
  	templateUrl: './formulamedicamento.component.html',
  	styleUrls: ['./formulamedicamento.component.css']
})
export class FormulamedicamentoComponent implements OnInit {

	medicamentoForm: FormGroup;
    dtOptions: any = {};
  	table: any = '';
    @Output() basica = new EventEmitter<any>();
    @Input() id_pac: any;
    historias: any = [];
    items: any = [];
    id_medicamento: any = 0;

    constructor(private formBuilder: FormBuilder, private codifService: CodifService, private globals: Globals, private historiasService: HistoriasService,
  				private _loadingBar: SlimLoadingBarService, private router: Router, private pacienteService: PacienteService, private itemsService: ItemsService) { }

  	ngOnInit() {
  		this.initForm();
  	}

  	ngOnChanges(changes: SimpleChanges) {
        const us: SimpleChange = changes.id_pac;
        if(us)
            if(us.currentValue != 0) {
            	this.historiasService.getHistPacientesIdMed(us.currentValue)
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
		this.itemsService.getItemsMed()
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
        				that.table = $('#data-table-medicamento').DataTable(that.fillTable($(this).val()));
        			}
        		);
        	}
        });
        $('#CODIGO').on( 'change', function () {
        	if($(this).val() != null) {
        		that.itemsService.getItem($(this).val())
        			.subscribe(data => {
        				let da: any = data;
        				$('#CONCENTRACION').val(da.CONCENTRACION);
        				$('#PRESENTACION').val(da.PRES_ITEM);
        				$('#ADMINISTRACION').val(da.MOD_ADM);
        			}
        		);
        	}
        });
        $('#data-table-medicamento').on( 'click', '.btn-edit', function () {
            that.fillMedicamento($(this).attr('date'));
        });

        $('#data-table-medicamento').on( 'click', '.btn-delete', function () {
            that.delMedicamento($(this).attr('date'));
        });
	}

  	initForm() {
        this.medicamentoForm = this.formBuilder.group({
            HISTORIAEX: [''],
            ITEM: [''],
            PRESENTACION: [''],
            CONCENTRACION: [''],
            ADMINISTRACION: [''],
            CANTIDAD: [1],
            DOSIS:[''],
            FRECUENCIA: [''],
            DURACION: [''],
            OBS: [''],
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
                "emptyTable": "SIN MEDICAMENTOS"
            },
            ajax: this.globals.apiUrl+'/historias/historiamedicamento?id_hist='+id,
            columns: [
            	{ title: 'Código', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.items.COD_ITEM;
                }},
                { title: 'Medicamento', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.items.NOM_ITEM;
                }},
                { title: 'Cantidad', data: 'CANTIDAD', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Frecuencia', data: 'FRECUENCIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Duración', data: 'DURACION', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Observaciones', data: 'OBSERVACIONES', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  data;
                }},
                { title: 'Acción', data: 'ID_HIST_PAC_MEDICAMENTO', "render": function ( data, type, row, meta ) {
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-delete" title="Eliminar medicamento" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button> ';
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar medicamento" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
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
    		alert("Por favor, escoja el paciente para solicitar el medicamento.");
    		return false;
    	}
    	if($('#HISTORIAEX').val() == null || $('#HISTORIAEX').val() == '') {
    		alert("Por favor, escoja el registro clínico al cual se le asignara el medicamento.");
    		return false;
    	}
    	if($('#CODIGO').val() == null || $('#CODIGO').val() == '') {
    		alert("Por favor, escoja el medicamento a asignar.");
    		return false;
    	}
    	if($('#CANTIDAD').val() == '') {
    		alert("Por favor, diga la cantidad a realizar del medicamento.");
    		return false;
    	}
    	if($('#OBSERVACION').val() == '') {
    		alert("Por favor, diga la observación del medicamento.");
    		return false;
    	}
    	if($('#DOSIS').val() == '') {
    		alert("Por favor, diga la dosis del medicamento.");
    		return false;
    	}
    	if($('#FRECUENCIA').val() == '') {
    		alert("Por favor, diga la frecuencia de cosumo del medicamento.");
    		return false;
    	}
    	if($('#DURACION').val() == '') {
    		alert("Por favor, diga la duración del tratamiento.");
    		return false;
    	}
    	/*if(!confirm("Esta seguro de asignar el medicamento al registro clínico?"))
    		return false;*/

    	this.medicamentoForm.get('HISTORIAEX').setValue($('#HISTORIAEX').val());
    	this.medicamentoForm.get('ITEM').setValue($('#CODIGO').val());
    	this.medicamentoForm.get('CANTIDAD').setValue($('#CANTIDAD').val());
        this.medicamentoForm.get('OBS').setValue($('#OBSERVACION').val());
        this.medicamentoForm.get('FRECUENCIA').setValue($('#FRECUENCIA').val());
        this.medicamentoForm.get('DURACION').setValue($('#DURACION').val());
        this.medicamentoForm.get('PRESENTACION').setValue($('#PRESENTACION').val());
        this.medicamentoForm.get('CONCENTRACION').setValue($('#CONCENTRACION').val());
        this.medicamentoForm.get('ADMINISTRACION').setValue($('#ADMINISTRACION').val());
        this.medicamentoForm.get('DOSIS').setValue($('#DOSIS').val());
        if(this.id_medicamento == 0)
	    	this.historiasService.saveHistoriaMed(this.medicamentoForm.value)
	    		.subscribe(data => {
	    			let da: any = data;
		        	this.clearAll();
		        	this.showMessage("Medicamento guardado");
		        	this.table = $('#data-table-medicamento').DataTable(this.fillTable($('#HISTORIAEX').val()));
	    		}
	    	);
	    else
	    	this.historiasService.updateHistoriaMed(this.id_medicamento, this.medicamentoForm.value)
	    		.subscribe(data => {
	    			let da: any = data;
		        	this.clearAll();
		        	this.showMessage("Medicamento actualizado");
		        	this.table = $('#data-table-medicamento').DataTable(this.fillTable($('#HISTORIAEX').val()));
	    		}
	    	);
    }

    fillMedicamento(id) {
    	this.id_medicamento = id;
    	this.historiasService.getHistMed(id)
    		.subscribe(data => {
    			let da: any = data;
    			$('#CODIGO').val(da.items.ID_ITEM).trigger('change');
		        $('#CANTIDAD').val(da.CANTIDAD);
		        $('#OBSERVACION').val(da.OBSERVACIONES);
		        $('#PRESENTACION').val(da.items.PRES_ITEM);
		        $('#CONCENTRACION').val(da.items.CONCENTRACION);
		        $('#ADMINISTRACION').val(da.items.MOD_ADM);
		        $('#DOSIS').val(da.DOSIS);
		        $('#FRECUENCIA').val(da.FRECUENCIA);
		        $('#DURACION').val(da.DURACION);
		        $('.btn-sol').html('<i class="zmdi zmdi-hospital-alt"></i> Actualizar medicamento');
    		}
    	);
    }

    delMedicamento(id) {
    	if(!confirm('Esta seguro que desea eliminar el medicamento?'))
    		return false;
    	this.historiasService.delHistoriaMed(id)
    		.subscribe(data => {
    			let da: any = data;
		        this.clearAll();
		        this.showMessage("Medicamento eliminado");
		        this.table = $('#data-table-medicamento').DataTable(this.fillTable($('#HISTORIAEX').val()));
    		}
    	);
    }

    clearAll() {
    	this.medicamentoForm.get('ITEM').setValue('');
    	this.medicamentoForm.get('CANTIDAD').setValue(1);
        this.medicamentoForm.get('OBS').setValue('');
        this.medicamentoForm.get('FRECUENCIA').setValue('');
        this.medicamentoForm.get('DURACION').setValue('');
        this.medicamentoForm.get('PRESENTACION').setValue('');
        this.medicamentoForm.get('CONCENTRACION').setValue('');
        this.medicamentoForm.get('ADMINISTRACION').setValue('');
        this.medicamentoForm.get('DOSIS').setValue('');
        $('#CODIGO').val('').trigger('change');
        $('#CANTIDAD').val(1);
        $('#OBSERVACION').val('');
        $('#FRECUENCIA').val('');
        $('#DURACION').val('');
        $('#PRESENTACION').val('');
        $('#CONCENTRACION').val('');
        $('#ADMINISTRACION').val('');
        $('#DOSIS').val('');
        this.id_medicamento = 0;
        $('.btn-sol').html('<i class="zmdi zmdi-hospital-alt"></i> Solicitar medicamento');
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
