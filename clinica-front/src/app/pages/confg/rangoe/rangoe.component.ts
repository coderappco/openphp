import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';

import { RangoseService } from '../../../services/rangose.service';

declare var $: any;

@Component({
  	selector: 'app-rangoe',
  	templateUrl: './rangoe.component.html',
  	styleUrls: ['./rangoe.component.css']
})
export class RangoeComponent implements OnInit {
    submitted = false;
  	edadesForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	edades_id = 0;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private rangoseService: RangoseService) { }

  	ngOnInit() {
        this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
        var that = this;
        setTimeout(() => 
      	{
            this.globals.getUrl = 'rangoe';
      	},0);

      	$('#data-table').on( 'click', '.btn-del', function () {
            that.deleteRangoe($(this).attr('date'));
      	});

      	$('#data-table').on( 'click', '.btn-edit', function () {
            that.fillRangoEdad($(this).attr('date'));
      	});
   	}

   	get f() { return this.edadesForm.controls; }

    initForm() {
        this.edadesForm = this.formBuilder.group({
            NOM_RANGO: ['', [Validators.required]],
            EDAD_INICIAL: [0, [Validators.required]],
            EDAD_FINAL: [''],
            EDAD_INICIAL_MESES: [''],
            EDAD_FINAL_MESES: [''],
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
            ajax: this.globals.apiUrl+'/rangosedades',
          	columns: [
              	{ title: 'Rango', data: 'NOM_RANGO', className: "align-middle", "render": function ( data, type, row, meta ) {
              			return  data;
          			}},
                { title: 'Edad Inicial', data: 'EDAD_INICIAL', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data + (row.EDAD_INICIAL_MESES == 1 ? " Meses" : " Años");
                }},
          			{ title: 'Edad final', data: 'EDAD_FINAL', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data != null ? (data + (row.EDAD_FINAL_MESES == 1 ? " Meses" : " Años")) : "";
          			}},
                { title: 'Acción', data: 'ID_RANGO', "render": function ( data, type, row, meta ) {
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar rango" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
              		  let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar rango" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
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

  	Registrar() {
        this.submitted = true;

        if (this.edadesForm.invalid) {
            return;
        }
        let edadim = $('#edadim').prop('checked') == true ? 1 : 0;
        let edadfm = $('#edadfm').prop('checked') == true ? 1 : 0;
        this.edadesForm.get('EDAD_INICIAL_MESES').setValue(edadim);
        this.edadesForm.get('EDAD_FINAL_MESES').setValue(edadfm);

        if(this.edades_id == 0) {
            /*if(!confirm("Esta Seguro que desea Agregar el rango de edad?")) 
				        return false;*/
          	this.rangoseService.crearRangoE(this.edadesForm.value)
            		.subscribe(data => {
              			this.clearAll();
              			this.table = $('#data-table').DataTable(this.fillTable());
              			this.showMessage("Rango de edad asignado");
              			this.submitted = false;
            		}
          	);
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar el rango de edad?")) 
                return false;*/
            this.rangoseService.updateRangoE(this.edades_id, this.edadesForm.value)
            		.subscribe(data => {
              			this.clearAll();
              			this.table = $('#data-table').DataTable(this.fillTable());
              			this.showMessage("Rango de edad actualizado");
              			this.submitted = false;
            		}
            );
        }
    }

    deleteRangoe(id) {
        if(confirm("Esta Seguro que desea eliminar el rango de Edad?")) {
            this.rangoseService.delRangoE(id)
                .subscribe(data => {
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Rango de edad Eliminado");
                    this.clearAll();
                }
            );
        }
    }

    fillRangoEdad(p) {
    		var that = this;
    		this.rangoseService.getRangoE(p)
      			.subscribe(data => {
        				var rango: any = data;
        				this.edades_id = rango.ID_RANGO;
        				this.initForm();
        				this.edadesForm.get('NOM_RANGO').setValue(rango.NOM_RANGO);
        				this.edadesForm.get('EDAD_INICIAL').setValue(rango.EDAD_INICIAL);
        				this.edadesForm.get('EDAD_FINAL').setValue(rango.EDAD_FINAL);
        				$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
        				$('#NOM_RANGO').focus();
            }
        );
  	}

    clearAll() {
      	this.edadesForm.get('NOM_RANGO').setValue('');
      	this.edadesForm.get('EDAD_INICIAL').setValue(0);
      	this.edadesForm.get('EDAD_FINAL').setValue('');
      	this.edades_id = 0;
      	$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
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
