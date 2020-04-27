import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';

import { ItemsService } from '../../../services/items.service';

declare var $: any;

@Component({
  	selector: 'app-items',
  	templateUrl: './items.component.html',
  	styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  	submitted = false;
  	itemsForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	items_id = 0;
  	datos: any = [];

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private itemsService: ItemsService) { }

  	ngOnInit() {
        this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
    	var that = this;
    	setTimeout(() => 
      	{
      		this.globals.getUrl = 'item';
      	},0);

    	$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

        $('#data-table').on( 'click', '.btn-del', function () {
            that.deleteItems($(this).attr('date'));
        });

        $('#data-table').on( 'click', '.btn-edit', function () {
            that.fillItems($(this).attr('date'));
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

  	get f() { return this.itemsForm.controls; }

  	initForm() {
        this.itemsForm = this.formBuilder.group({
            COD_ITEM: ['', [Validators.required]],
            COT_NTFS: [''],
            COD_CUP: [''],
            COD_ISS: [''],
            COD_CUM: [''],
            NOM_ITEM: ['', [Validators.required]],
            NOM_GENERICO: [''],
            NOM_COMERCIAL: [''],
            PRES_ITEM: [''],
            POS: [''],
            CONCENTRACION: [''],
            CONTROL_MED: [''],
            MOD_ADM: [''],
            FAC_SOAT: [''],
            VALOR_SOAT: [''],
            FAC_ISS: [''],
            VALOR_ISS: [''],
            VALOR_PARTICULAR: [''],
            ANIO: [''],
            MEDICAMENTO: [''],
            SERVICIO: [''],
            EXAM_LAB: [''],
            INSUMO: [''],
            EDAD_INICIAL: [''],
            UNID_EDAD_INICIAL: [''],
            EDAD_FINAL: [''],
            UNID_EDAD_FINAL: [''],
            VALOR_IVA: [''],
            VALOR_CREE: [''],
            GENERO: ['']
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
            ajax: this.globals.apiUrl+'/items',
            columns: [
                { title: 'Código', data: 'COD_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data;
                }},
                { title: 'Servicio', data: 'NOM_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<code><i class="zmdi zmdi-badge-check"></i> '+data+'</code>';
                }},
                { title: 'Tipo', data: 'ID_ITEM', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  row.MEDICAMENTO == 1 ? "<code>MEDICAMENTO</code>" : row.SERVICIO == 1 ? "<code>SERVICIO</code>" : row.EXAM_LAB == 1 ? "<code>LABORATORIO</code>" : "<code>INSUMO</code>";
                } },
                { title: 'Genérico', data: 'NOM_GENERICO', className: "align-middle", "render": function ( data, type, row, meta ) {
                    var generico = data != null ? data : '-';
                    return generico;
                } }, 
                { title: 'Comercial', data: 'NOM_COMERCIAL', className: "align-middle", "render": function ( data, type, row, meta ) {
                    var comercial = data != null ? data : '-';
                    return  comercial;
                } },
                { title: 'Acción', data: 'ID_ITEM', "render": function ( data, type, row, meta ) {
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar item" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar item" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
                    return editar + eliminar;
                }}
            ],
            "columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "350px", "targets": 1 },
                { "width": "120px", "targets": 2 },
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
        this.itemsForm.get('GENERO').setValue('');
        this.itemsForm.get('VALOR_CREE').setValue('');
        this.itemsForm.get('VALOR_IVA').setValue('');
        this.itemsForm.get('UNID_EDAD_FINAL').setValue('');
        this.itemsForm.get('EDAD_FINAL').setValue('');
        this.itemsForm.get('UNID_EDAD_INICIAL').setValue('');
        this.itemsForm.get('EDAD_INICIAL').setValue('');
        this.itemsForm.get('EXAM_LAB').setValue('');
        this.itemsForm.get('SERVICIO').setValue('');
        this.itemsForm.get('MEDICAMENTO').setValue('');
        this.itemsForm.get('INSUMO').setValue('');
        this.itemsForm.get('ANIO').setValue('');
        this.itemsForm.get('VALOR_PARTICULAR').setValue('');
        this.itemsForm.get('VALOR_ISS').setValue('');
        this.itemsForm.get('FAC_ISS').setValue('');
        this.itemsForm.get('VALOR_SOAT').setValue('');
        this.itemsForm.get('FAC_SOAT').setValue('');
        this.itemsForm.get('MOD_ADM').setValue('');
        this.itemsForm.get('CONTROL_MED').setValue('');
        this.itemsForm.get('CONCENTRACION').setValue('');
        this.itemsForm.get('POS').setValue('');
        this.itemsForm.get('PRES_ITEM').setValue('');
        this.itemsForm.get('NOM_COMERCIAL').setValue('');
        this.itemsForm.get('NOM_GENERICO').setValue('');
        this.itemsForm.get('NOM_ITEM').setValue('');
        this.itemsForm.get('COD_CUM').setValue('');
        this.itemsForm.get('COD_ISS').setValue('');
        this.itemsForm.get('COD_CUP').setValue('');
        this.itemsForm.get('COT_NTFS').setValue('');
        this.itemsForm.get('COD_ITEM').setValue('');
        this.items_id = 0;
        $('#POS').prop('checked', true);
        $('#GENERO').val('').trigger('change');
        $('input[name=datos]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');
            
        });
        $('#servi').parent('label').addClass('active');
        $('#servi').attr('checked', true);
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        this.initForm();
    }

    Registrar() {
        this.submitted = true;

        if (this.itemsForm.invalid) {
            return;
        }

        if(!this.validateForm()){
            return false;
        }

        if(this.items_id == 0) {
            /*if(!confirm("Esta Seguro que desea Registrar el SERVICIO?")) 
                return false;*/

            this.itemsForm.get('GENERO').setValue($('#GENERO').val());
            var pos = $('#POS').prop('checked') == true ? 1 : 0;
        	this.itemsForm.get('EXAM_LAB').setValue(this.datos[2]);
        	this.itemsForm.get('SERVICIO').setValue(this.datos[1]);
        	this.itemsForm.get('MEDICAMENTO').setValue(this.datos[0]);
            this.itemsForm.get('INSUMO').setValue(this.datos[3]);
        	this.itemsForm.get('POS').setValue(pos);
            this.itemsService.crearItems(this.itemsForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Servicio registrado");
                    this.submitted = false;
                }
            );
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar el SERVICIO?")) 
                return false;*/
            this.itemsForm.get('GENERO').setValue($('#GENERO').val());
            var pos = $('#POS').prop('checked') == true ? 1 : 0;
        	this.itemsForm.get('EXAM_LAB').setValue(this.datos[2]);
        	this.itemsForm.get('SERVICIO').setValue(this.datos[1]);
        	this.itemsForm.get('MEDICAMENTO').setValue(this.datos[0]);
            this.itemsForm.get('INSUMO').setValue(this.datos[3]);
        	this.itemsForm.get('POS').setValue(pos);
            this.itemsService.updateItem(this.items_id, this.itemsForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Servicio actualizado");
                    this.submitted = false;
                }
            );
        }
    }

    fillItems(p) {
        var that = this;
        var datos = [];
        this.itemsService.getItem(p)
            .subscribe(data => {
                var item: any = data;
                this.items_id = item.ID_ITEM;
                this.initForm();
                this.itemsForm.get('GENERO').setValue(item.GENERO);
		        this.itemsForm.get('VALOR_CREE').setValue(item.VALOR_CREE);
		        this.itemsForm.get('VALOR_IVA').setValue(item.VALOR_IVA);
		        this.itemsForm.get('UNID_EDAD_FINAL').setValue(item.UNID_EDAD_FINAL);
		        this.itemsForm.get('EDAD_FINAL').setValue(item.EDAD_FINAL);
		        this.itemsForm.get('UNID_EDAD_INICIAL').setValue(item.UNID_EDAD_INICIAL);
		        this.itemsForm.get('EDAD_INICIAL').setValue(item.EDAD_INICIAL);
		        this.itemsForm.get('EXAM_LAB').setValue(item.EXAM_LAB);
		        this.itemsForm.get('SERVICIO').setValue(item.SERVICIO);
		        this.itemsForm.get('MEDICAMENTO').setValue(item.MEDICAMENTO);
                this.itemsForm.get('INSUMO').setValue(item.INSUMO);
		        this.itemsForm.get('ANIO').setValue(item.ANIO);
		        this.itemsForm.get('VALOR_PARTICULAR').setValue(item.VALOR_PARTICULAR);
		        this.itemsForm.get('VALOR_ISS').setValue(item.VALOR_ISS);
		        this.itemsForm.get('FAC_ISS').setValue(item.FAC_ISS);
		        this.itemsForm.get('VALOR_SOAT').setValue(item.VALOR_SOAT);
		        this.itemsForm.get('FAC_SOAT').setValue(item.FAC_SOAT);
		        this.itemsForm.get('MOD_ADM').setValue(item.MOD_ADM);
		        this.itemsForm.get('CONTROL_MED').setValue(item.CONTROL_MED);
		        this.itemsForm.get('CONCENTRACION').setValue(item.CONCENTRACION);
		        this.itemsForm.get('POS').setValue(item.POS);
		        this.itemsForm.get('PRES_ITEM').setValue(item.PRES_ITEM);
		        this.itemsForm.get('NOM_COMERCIAL').setValue(item.NOM_COMERCIAL);
		        this.itemsForm.get('NOM_GENERICO').setValue(item.NOM_GENERICO);
		        this.itemsForm.get('NOM_ITEM').setValue(item.NOM_ITEM);
		        this.itemsForm.get('COD_CUM').setValue(item.COD_CUM);
		        this.itemsForm.get('COD_ISS').setValue(item.COD_ISS);
		        this.itemsForm.get('COD_CUP').setValue(item.COD_CUP);
		        this.itemsForm.get('COT_NTFS').setValue(item.COT_NTFS);
		        this.itemsForm.get('COD_ITEM').setValue(item.COD_ITEM);
		        $('input[name=datos]').each(function() {
		            $(this).attr('checked', false);
		            $(this).parent('label').removeClass('active');
		            
		        });
                if(item.MEDICAMENTO == 1) {
                    $('#medi').parent('label').addClass('active');
                    $('#medi').attr('checked', true);
                }
                else
                if(item.SERVICIO == 1) {
                    $('#servi').parent('label').addClass('active');
                    $('#servi').attr('checked', true);
                }
                else
                if(item.EXAM_LAB == 1) {
                    $('#exam').parent('label').addClass('active');
                    $('#exam').attr('checked', true);
                }
                else
                if(item.INSUMO == 1) {
                    $('#insu').parent('label').addClass('active');
                    $('#insu').attr('checked', true);
                }
                $('#GENERO').val(item.GENERO).trigger('change');
                $('#POS').prop('checked', item.POS);
                $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#collapseOne').collapse('show');
                $('#COD_ITEM').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
            }
        );
    }

    deleteItems(id) {
        if(confirm("Esta Seguro que desea eliminar el Servicio?")) {
            this.itemsService.delItem(id)
                .subscribe(data => {
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Servicio eliminado");
                    this.clearAll();
                }
            );
        }
    }

    validateForm() {
        var datos = [], i = 0;        
        $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                datos[i] = 1;
                i++;
            }
            else
            {
                datos[i] = 0;
                i++;
            }
        });

        this.datos = datos;

        return true;
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
