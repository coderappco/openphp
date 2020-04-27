import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../globals';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';

import { UserService } from '../../services/usuario.service';
import { CitaService } from '../../services/cita.service';

declare var $: any;

@Component({
  	selector: 'app-agenda',
  	templateUrl: './agenda.component.html',
  	styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

	citaForm: FormGroup;
	duracion: any = 15;
	businessHours: any = [];
	disabled: any = true;
	sedes: any = [];
	empresa_id: any = 0;
	user_id: any = 0;
	nombre: any = '';
	apellido: any = '';
	identificacion: any = 0;
	genero: any = 'indefinido';
	celular: any = '';
	direccion: any = '';
	estado_civil: any = '';
	administradora: any = '';
	contrato: any = '';
    edad: any = '';
    ensala: any = false;
    registro: any = false;
    id_paciente: any = 0;
    evento_id: any = 0;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private userService: UserService, private citaService: CitaService, private router: Router) { }

  	ngOnInit() {
  		this.initForm();
  		let us = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = us.user.ID_USUARIO;
        this.empresa_id = us.empresa_id;
  	}

  	ngAfterViewInit(): void {
        var that = this;
       	setTimeout(() => 
		{
			this.globals.getUrl = 'agenda';
		},0);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
        $('[data-toggle="tooltip"]').tooltip();
        this.citaService.getCitasPrestador(this.user_id)
        	.subscribe(data => {
        		let da: any = data;
        		if(da.presta.agenda == null) {
        			alert("Aun no tiene ninguna agenda creada");
        			return false;
        		}
				$('.calendar').fullCalendar('destroy');
				that.fillCalendar(da.resultado);
				setTimeout(() => 
				{
					$('.calendar .fc-toolbar').html("Agenda: " + da.prestador + " " + "Especialidad - " + da.especialidad);
				},0);
        	}
        );

        this.userService.getPrestadores(this.empresa_id)
            .subscribe(data => {
                var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    if(this.user_id != data[d].ID_USUARIO)
                        newOptions += '<option value="'+ data[d].ID_USUARIO +'">'+ data[d].NOMBRES +" "+ data[d].APELLIDOS +'</option>';
                }
                $('#prestador').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
        });

        $('.actions__calender-next').on('click', function (e) {
            e.preventDefault();
            $('.calendar').fullCalendar('next');
        });

        $('.actions__calender-prev').on('click', function (e) {
            e.preventDefault();
            $('.calendar').fullCalendar('prev');
        });

        $('body').on('click', '[data-calendar-view]', function(e){
            e.preventDefault();

            $('[data-calendar-view]').removeClass('actions__item--active');
            $(this).addClass('actions__item--active');
            var calendarView = $(this).attr('data-calendar-view');
            $('.calendar').fullCalendar('changeView', calendarView);
        });

        $(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'})

        $('#fecha').on( 'change', function () {
            that.citaService.getCitasPrestadorFecha(that.user_id,$(this).val())
                .subscribe(data => {
                    let da: any = data;
                    var newOptions = '';
                    for(var d in data) {
                        let nombre = da[d].paciente.PRIMER_NOMBRE + (da[d].paciente.SEGUNDO_NOMBRE != null ? " "+da[d].paciente.SEGUNDO_NOMBRE : "");
                        let apellido = da[d].paciente.PRIMER_APELLIDO + (da[d].paciente.SEGUNDO_APELLIDO != null ? " "+da[d].paciente.SEGUNDO_APELLIDO : "");
                        let horas = moment(da[d].FEC_CITA).format('HH:mm');
                        newOptions += '<option value="'+ da[d].ID_CITA +'">'+ nombre +" "+ apellido + " Hora: " + horas +'</option>';
                    }
                    $('#pacientes').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%",placeholder: 'Escoja los pacientes',multiple: true});
                    $('#pacientes').val('').trigger('change');
                }
            );
        });
    }

    initForm() {
        this.citaForm = this.formBuilder.group({
            ID_TIPO_IDEN: [''],
            PACIENTE: [''],
            EDAD: [''],
            GENERO: [''],
            DIRECCION: [''],
            CELULAR: [''],
            ESTADO_CIVIL: [''],
            ADMINISTRADORA: [''],
            CONTRATO: [''],
            AUTORIZACION: [''],
            MOTIVO_CONSULTA: [''],
            TIPO_CITA: [''],
            SOLICITUD: [''],
            OBSERVACION: [''],
            PYP: [''],
            SEDE: [''],
            CONSULTORIO: [''],
            ID_SEDE: [''],
            ID_ESTADO_CITA: [''],
            ID_PACIENTE: [''],
            TODOS: [0],
            CITAS: [''],
            PRESTADOR: [''],
            DIA: [''],
            USUARIO: ['']
        });
    }

    fillCalendar(eventos) {
        let that = this;
        $('.calendar').fullCalendar({
            header: {
                right: '',
                center: '',
                left: ''
            },
            buttonIcons: {
                prev: 'calendar__prev',
                next: 'calendar__next'
            },
            defaultView: 'agendaWeek',
            slotLabelFormat: 'h:mm a',
            minTime: '08:00:00',
            maxTime: '18:00:00',
            color: '#dddddd',
            //fixedWeekCount: false,
            editable: false,
            droppable: false,
            eventLimit: true,
            selectable: false,
            allDaySlot: false,
            //nowIndicator: true,
            slotDuration: "00:"+that.duracion+":00",
            slotLabelInterval: '00:'+that.duracion,
            locale: 'es',
            events: eventos,
            businessHours: that.businessHours,
            displayEventTime: false,
            views: {
                agenda: {
                    eventLimit: 1
                }
            },
            eventRender: function(eventObj, $el) {
                if(eventObj.ids != null) {
                    let informacion: any = eventObj.title.split(" - ");
                    let content: any = '';
                    for(var i in informacion) {
                        content += "<div class='col-md-12'>"+informacion[i]+"</div>";
                    }
                    $el.popover({
                        title: "Datos de la cita",
                        content: content,
                        trigger: 'hover',
                        placement: 'top',
                        container: 'body',
                        html: true
                    });
                }
            },
            viewRender: function (view) {
                var calendarDate = $('.calendar').fullCalendar('getDate');
                var calendarMonth = calendarDate.month();

                $('.content__title--calendar > h1').html(view.title);
            },
            eventClick: function (event, element) {
                $('.edit-event__id').val(event._id);
                var dates = moment(event.start).format('YYYY-MM-DD');
                var hora = moment(event.start).format('h:mm a');
                $('.fecha').val(dates);
                $('.hora').val(hora);
            	$('#collapseOne').collapse('show');
                that.evento_id = event.ids;
                that.citaService.getCita(event.ids)
                    .subscribe(data => {
                        let da: any = data;
                        that.nombre = da.paciente.PRIMER_NOMBRE + (da.paciente.SEGUNDO_NOMBRE != null ? " "+da.paciente.SEGUNDO_NOMBRE : "");
                        that.apellido = da.paciente.PRIMER_APELLIDO + (da.paciente.SEGUNDO_APELLIDO != null ? " "+da.paciente.SEGUNDO_APELLIDO : "");
                        that.identificacion = da.paciente.NUM_DOC;
                        that.genero = da.paciente.GENERO == 1 ? "Masculino" : da.paciente.GENERO == 2 ? "Femenino" : "Indefinido";
                        that.celular = da.paciente.MOVIL != null ? da.paciente.MOVIL : "-";
                        that.direccion = da.paciente.DIREC_PACIENTE != null ? da.paciente.DIREC_PACIENTE : "-";
                        that.estado_civil = da.paciente.estadocivil.NOM_ESTADO_CIVIL;
                        that.administradora = da.paciente.contrato != null ? da.paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                        that.contrato = da.paciente.contrato != null ? da.paciente.contrato.contrato.COD_CONTRATO : "No Contrato";
                        that.ensala = da.ID_ESTADO_CITA == 1 ? true : false;
                        that.registro = da.ID_ESTADO_CITA == 2 ? true : false;
                        that.id_paciente = da.paciente.ID_PACIENTE;
                        let yDiff: any = "-";
                        let mDiff: any = "-";
                        if(da.paciente.FECHA_NAC != null) {
                            let m1: any = moment(da.paciente.FECHA_NAC);
                            let m2: any = moment().format('YYYY-MM-DD');
                            yDiff = moment().year() - moment(da.paciente.FECHA_NAC).year();
                            mDiff = moment().month() - moment(da.paciente.FECHA_NAC).month();
                            if (mDiff < 0) {
                                mDiff = 12 + mDiff;
                                yDiff--;
                            }
                        }
                        that.edad = yDiff + " años " + mDiff + " meses";
                        $('#CONSULTORIO').val(da.ID_CONSULTORIO);
                        $('#MOTIVO_CONSULTA').val(da.motivoc.NOM_MOTIVO_CONSULTA);
                        $('#SEDE').val(da.consultorio.sede.NOM_SEDE);
                        let auto = da.autorizacion != null ? da.autorizacion.autorizacion.NUM_AUTORIZACION : '';
                        $('#AUTORIZACION').val(auto);
                        if(da.TIPO_CITA != 0) {
                        	let tipo = '';
                        	if(da.TIPO_CITA == 1) tipo = "ADULTO MAYOR";
		                	if(da.TIPO_CITA == 2) tipo = "AGUDEZA VISUAL";
		                	if(da.TIPO_CITA == 3) tipo = "CITOLOGIA";
		                	if(da.TIPO_CITA == 4) tipo = "CITOLOGIA GESTANTE";
		                	if(da.TIPO_CITA == 5) tipo = "CONSULTA 1 VEZ";
		                	if(da.TIPO_CITA == 6) tipo = "CONSULTA EXTERNA";
		                	if(da.TIPO_CITA == 7) tipo = "CONTROL ECNT";
		                	if(da.TIPO_CITA == 8) tipo = "CP 1 VEZ";
                            $('#TIPO_CITA').val(tipo);
                        }
                        $('#SOLICITUD').val("Telefónica");
                        $('#OBSERVACION').val(da.OBS_CITA);
                        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                    })
            },
            dayClick: function(date, jsEvent, view) {
                return;
            },
        });
    }

    Ensala() {
        //if(confirm('Esta seguro que desea modificar el estado de la cita del día '+ $('.fecha').val() + ' a las ' + $('.hora').val())) { 
            var currentId = $('.edit-event__id').val();
            var currentEvent = $('.calendar').fullCalendar('clientEvents', currentId);
            this.citaForm.get('ID_ESTADO_CITA').setValue(2);
            this.citaForm.get('ID_PACIENTE').setValue(this.id_paciente);
            this.citaService.updateCitaEstado(this.evento_id, this.citaForm.value)
                .subscribe(data => {
                    let da: any = data;
                    let nombre = da.PRIMER_NOMBRE + (da.SEGUNDO_NOMBRE != null ? " "+da.SEGUNDO_NOMBRE : "");
                    let apellido = da.PRIMER_APELLIDO + (da.SEGUNDO_APELLIDO != null ? " "+da.SEGUNDO_APELLIDO : "");
                    let administradora = da.contrato != null ? da.contrato.contrato.administradora.NOM_ADMINISTRADORA : "Particular";
                    currentEvent[0].title = "Identidad: " + da.NUM_DOC + " - Nombre: " + nombre + " " + apellido + " - Servicio: " + da.servicio + " - Motivo: " + da.motivo + " - Consultorio: " + da.consultorio + " - Administradora: " + administradora + " - Prestador: " + da.prestador;
                    currentEvent[0].className = ['bg-light-blue'];
                    $('.calendar').fullCalendar('updateEvent', currentEvent[0]);
                    this.ensala = false;
                    this.registro = true;
                    this.showMessage("Cita actualizada");
                    $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
                }
            );
        //}
    }

    CrearRegistro() {
        let url: any = '/historias?cita_id='+this.evento_id;
        this.router.navigateByUrl(url);
    }

    ShowCitas() {
        $('#citas_modal').modal('show');
    }

    Trasladar() {
        if(($('#pacientes').val() == null || $('#pacientes').val() == '') && $('#todos').prop('checked') == false) {
            alert('Por favor; escoja los pacientes a trasladar');
            return false;
        }
        else
        if($('#prestador').val() == null || $('#prestador').val() == '') {
            alert("Por favor, escoja el prestador al cual trasladara las citas");
            return false;
        }
        else {
            //if(confirm('Esta seguro que desea trasladar las citas')) {
                let eventos = $('#pacientes').val();
                this.citaForm.get('CITAS').setValue($('#pacientes').val());
                this.citaForm.get('PRESTADOR').setValue($('#prestador').val());
                this.citaForm.get('DIA').setValue($('#fecha').val());
                this.citaForm.get('USUARIO').setValue(this.user_id);
                let todos = $('#todos').prop('checked') == true ? 1 : 0;
                this.citaForm.get('TODOS').setValue(todos);
                this.citaService.trasladarCitas(this.citaForm.value)
                    .subscribe(data => {
                        let da: any = data;
                        this.citaService.getCitasPrestador(this.user_id)
                            .subscribe(datas => {
                                let das: any = datas;
                                $('.calendar').fullCalendar('destroy');
                                this.fillCalendar(das.resultado);
                            }
                        );
                        if(Array.isArray(da) && da.length > 0) {
                            for(var i in da) {
                                var dates = moment(da[i].FEC_CITA).format('YYYY-MM-DD');
                                var hora = moment(da[i].FEC_CITA).format('h:mm a');
                                alert("La cita con fecha "+ dates + " y hora " + hora + " no puedo ser trasladada, el prestador tiene ese dia completamente agendado");
                            }
                        }
                        $('#citas_modal').modal('hide');
                        $('#fecha').val('');
                        $('#pacientes').empty().select2({dropdownAutoWidth:!0,width:"100%",placeholder: 'Escoja los pacientes',multiple: true});
                        $('#prestador').val('').trigger('change');
                        $('#todos').prop('checked', false);
                    }
                );
            //}
        }
    }

    Cancel() {
        $('#citas_modal').modal('hide');
        $('#fecha').val('');
        $('#pacientes').empty().select2({dropdownAutoWidth:!0,width:"100%",placeholder: 'Escoja los pacientes',multiple: true});
        $('#prestador').val('').trigger('change');
        $('#todos').prop('checked', false);
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
