import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';

import { GruposhService } from '../../../services/gruposh.service';

declare var $: any;

@Component({
    selector: 'app-gruposh',
    templateUrl: './gruposh.component.html',
    styleUrls: ['./gruposh.component.css']
})
export class GruposhComponent implements OnInit {

    submitted = false;
  	grupoForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	grupo_id = 0;
  	horarios: any = [];
    datos: any = null;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private gruposhService: GruposhService) { }

  	ngOnInit() {
    	this.initForm();
    	this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
      	var that = this;
      	setTimeout(() => 
      	{
      		this.globals.getUrl = 'grupoh';
      	}
      	,0);
      	$(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
      	$(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});
        $('[data-toggle="tooltip"]').tooltip();
        $("body").on("click", ".boton_hora", function(a) {
            a.preventDefault();
            let arr = [];
            let pos = 0;
            for(var i in that.horarios) {
                if(i != $(this).attr('pos')) {
                    arr[pos] = that.horarios[i];
                    pos++;
                }
            }
            $('#addhora').html('');
            that.horarios = arr;
            var html = "";
            for(var i in that.horarios){
                let html = $('#addhora').html();
                html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i]['dia']+'</span></div>'+
                              '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i]['horai']+'</span></div>'+
                              '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i]['horaf']+'</span></div>'+
                              '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                $('#addhora').html(html);
            }
        });
        
        $('#data-table').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = that.table.row( tr );
     
            if ( row.child.isShown() ) {
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                row.child( that.format(row.data()) ).show();
                tr.addClass('shown');
            }
        });

        $('#data-table').on( 'click', '.btn-del', function () {
            that.deleteGrupo($(this).attr('date'));
        });

        $('#data-table').on( 'click', '.btn-edit', function () {
            that.fillGrupo($(this).attr('date'));
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

    get f() { return this.grupoForm.controls; }

    initForm() {
        this.grupoForm = this.formBuilder.group({
            NOM_GRUPO: ['', [Validators.required]],
            GRUPO_HORARIO: [''],
  	    });
  	}

    format ( d ) {
        let tabla = '';
        let arr = d.dias;
        for(var i in arr){
            tabla = tabla + '<tr>' +
                  '<td class="text-right col-md-2">' + arr[i].DIA + '</td>' +
                  '<td>' + arr[i].HORA_INICIO + '</td>' +
                  '<td>' + arr[i].HORA_FIN + '</td>' +
                '</tr>';
        }
        return '<table cellpadding="5" cellspacing="0" border="0" width="50%">'+
            '<tr>'+
                '<td class="text-right" style="width: 20%;">Día:</td>'+
                '<td>Hora inicio</td>'+
                '<td>Hora fin</td>'+
            '</tr>'+
            tabla +
        '</table>';
    }

    fillTable() {
        return this.dtOptions = {
            pageLength: 10,
            autoWidth: !1,
            responsive: !0,
            "destroy": true,
            "order": [[1, 'asc']],
            language: {
                "url": "src/assets/Spanish.json",
                 searchPlaceholder: "Escriba parametro a filtrar..."
            },
            ajax: this.globals.apiUrl+'/gruposh',
            columns: [
                {
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                },
                { title: 'Grupo', data: 'NOM_GRUPO', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return data;
                }},
                { title: 'Acción', data: 'ID_GRUPO', "render": function ( data, type, row, meta ) {
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar grupo" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar grupo" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
                    return editar + eliminar;
                }}
            ],
            "columnDefs": [
                { "width": "5%", "targets": 0 },
                { "width": "80%", "targets": 1 },
                { "width": "15%", "targets": 2 }
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

  	Asignar() {
        let existe: any = false;
        let datos: any = [];
        let i = 0;
    	if($('#horai').val() == null) {
      		alert('Por favor, escoja la hora de inicio');
      		return false;
    	}
    	else
    	if($('#horaf').val() == null) {
      		alert("Por Favor, escoja la hora final");
      		return false;
    	}
        $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {              
                datos[i] = $(this).val();
                i++;
                existe = true;
            }
            else
            {
                datos[i] = 0;
                i++;
            }
        });
        if(existe == true)
            this.datos = datos;
        else {
            alert("Por favor, debe escoger al menos un día de la semana");
            return false;
        }
        if(this.ValidarH()) {
            for(var j in this.datos) {
                if(this.datos[j] != 0) {
                    this.horarios.push({'dia': this.datos[j], 'horai': $('#horai').val(), 'horaf': $('#horaf').val()});
                    let html = $('#addhora').html();
                    let pos = this.horarios.length - 1;
                    html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+this.datos[j]+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+$('#horai').val()+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+$('#horaf').val()+'</span></div>'+
                                  '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+pos+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                    $('#addhora').html(html);
                }
            }
            $('input[name=datos]').each(function() {
                $(this).prop('checked', false);
                $(this).parent('label').removeClass('active');            
            });
            this.datos = [];
            $(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
            $(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});
        }      	
    }

    ValidarH() {
        if($('#horai').val() == null || $('#horaf').val() == null) {
            alert("Por favor, debe escoger la hora de inicio y final");
            return false;
        }
        else
        if($('#horai').val() >= $('#horaf').val()) {
            alert("Por favor, la hora final debe ser mayor que la de inicio")
            return false;
        }
        else {
            for(var i in this.datos) {
                if(this.datos[i] != 0) {
                    for(var j in this.horarios) {
                        if(this.horarios[j]['dia'] == this.datos[i]) {
                            if(this.horarios[j]['horai'] <= $('#horai').val() && this.horarios[j]['horaf'] >= $('#horai').val()) {
                                alert('La hora de inicio se encuentra dentro de un rango de horas asignado para el día ' + this.datos[i]);
                                return false;
                            }
                            else
                            if(this.horarios[j]['horai'] <= $('#horaf').val() && this.horarios[j]['horaf'] >= $('#horaf').val()) {
                                alert('La hora final se encuentra dentro de un rango de horas asignado para el día ' + this.datos[i]);
                                return false;
                            }
                            else
                            if( ($('#horai').val() < this.horarios[j]['horai'] && $('#horaf').val() > this.horarios[j]['horaf']) ) {
                                alert('Existe un rango de horas asignado dentro  del actual para el día ' + this.datos[i]);
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
    }

    Registrar() {
        this.submitted = true;

        if (this.grupoForm.invalid) {
            return;
        }
        if(this.horarios.length == 0) {
            alert("Por favor, agregue los horarios");
            return false;
        }

        if(this.grupo_id == 0) {
            /*if(!confirm("Esta Seguro que desea Registrar el grupo Horario?")) 
                return false;*/
            this.grupoForm.get('GRUPO_HORARIO').setValue(this.horarios);
            this.gruposhService.crearGrupoH(this.grupoForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Grupo horario registrado");
                    this.submitted = false;
                }
            );
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar el grupo Horario?")) 
                return false;*/
            this.grupoForm.get('GRUPO_HORARIO').setValue(this.horarios);
            this.gruposhService.updateGrupoH(this.grupo_id, this.grupoForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Grupo horario actualizado");
                    this.submitted = false;
                }
            );
        }
    }

    clearAll() {
        this.submitted = false;
        this.grupo_id = 0;
        this.horarios = [];
        this.datos = [];
        this.grupoForm.get('NOM_GRUPO').setValue('');
        this.grupoForm.get('GRUPO_HORARIO').setValue('');
        $('#NOM_GRUPO').val('');
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        $('#addhora').html('');
        $('input[name=datos]').each(function() {
            $(this).prop('checked', false);
            $(this).parent('label').removeClass('active');            
        });
        $(".time-picker.horai").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "08:00"});
        $(".time-picker.horaf").flatpickr({enableTime: true,noCalendar: true,dateFormat: "H:i", defaultDate: "12:00"});
    }

    fillGrupo(p) {
        var that = this;
        var datos = [];
        this.gruposhService.getGrupoH(p)
            .subscribe(data => {
                var grupo: any = data;
                this.grupo_id = grupo.ID_GRUPO;
                this.initForm();
                this.grupoForm.get('NOM_GRUPO').setValue(grupo.NOM_GRUPO);
                this.grupoForm.get('GRUPO_HORARIO').setValue(grupo.dias);
                $('#addhora').html('');
                let arr = grupo.dias;
                this.horarios = [];
                for(var i in arr){
                    this.horarios.push({'dia': arr[i].DIA, 'horai': arr[i].HORA_INICIO, 'horaf': arr[i].HORA_FIN});
                    let html = $('#addhora').html();
                    html = html + '<div class="col-md-4 mb-1 mt-1"><span class="badge badge-secondary">'+arr[i].DIA+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i].HORA_INICIO+'</span></div>'+
                                  '<div class="col-md-3 mb-1 mt-1 text-center"><span class="badge badge-pill badge-info">'+arr[i].HORA_FIN+'</span></div>'+
                                  '<div class="col-md-2 mb-1 mt-2"><a href="#" pos="'+i+'" title="Eliminar horario" data-toggle="tooltip" class="boton_hora"><i class="zmdi zmdi-delete"></i></a></div>';
                    $('#addhora').html(html);
                }
                $('[data-toggle="tooltip"]').tooltip();
                $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                $('#collapseOne').collapse('show');
                $('#NOM_GRUPO').focus();
                $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
            }
        );
    }

    deleteGrupo(id) {
        if(confirm("Esta Seguro que desea eliminar el grupo Horario?")) {
            this.gruposhService.delGrupoH(id)
                .subscribe(data => {
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Grupo horario eliminado");
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
