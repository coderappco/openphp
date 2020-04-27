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

declare var $: any

@Component({
  	selector: 'app-escalaab',
  	templateUrl: './escalaab.component.html',
  	styleUrls: ['./escalaab.component.css']
})
export class EscalaabComponent implements OnInit {

	escalaForm: FormGroup;
	escolaridad: any = [];
    etnia: any = [];
    ocupacion: any = [];
    discapacidad: any = [];
    religion: any = [];
    parentesco: any = [];
    role: any = '';
    id_user: any = 0;
    dtOptions: any = {};
  	table: any = '';
  	print:any = false;
  	historia_id: any = 0;
    @Output() basica = new EventEmitter<any>();
    @Output() updatecita = new EventEmitter<any>();
    @Output() tipo_id = new EventEmitter<any>();
    @Input() id_pac: any;
    @Input() citaid: any;
    @Input() id_hist: any;
    @Input() tipo_historia: any;
    @Input() prin: any;
    id_cita: any = 0;

  	constructor(private formBuilder: FormBuilder, private codifService: CodifService, private globals: Globals, private historiasService: HistoriasService,
  				private _loadingBar: SlimLoadingBarService, private router: Router, private pacienteService: PacienteService) { }

  	ngOnInit() {
  		this.initForm();
  	}

  	ngOnChanges(changes: SimpleChanges) {
    	const cit: SimpleChange = changes.citaid;
        const us: SimpleChange = changes.id_pac;
        const his: SimpleChange = changes.id_hist;
        const tipo: SimpleChange = changes.tipo_historia;
        const pr: SimpleChange = changes.prin;

        if(cit)
            if(cit.currentValue != 0)
                this.id_cita = cit.currentValue;
            else {
                cit.previousValue = 0;
                this.id_cita = 0;
            }
        if(his)
            if(his.currentValue != 0)
                this.historia_id = his.currentValue;
            else {
                his.previousValue = 0;
                this.historia_id = 0;
            }
        if(tipo)
            if((tipo.currentValue == 11 || tipo.currentValue == 38) && pr) {
                if(pr.currentValue == true)
                    this.GenerarPdf(this.historia_id);
            }
	}

	ngAfterViewInit(): void {
  		var that = this;
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
		this.codifService.getOcupacion()
            .subscribe(data => {
            	this.ocupacion = data;
				this.codifService.getDiscapacidad()
					.subscribe(data => {
						this.discapacidad = data;
						this.codifService.getEscolaridad()
                            .subscribe(data => this.escolaridad = data);
                        this.codifService.getEtnia()
                            .subscribe(data => this.etnia = data);
                        this.codifService.getReligion()
                            .subscribe(data => this.religion = data);
                        this.codifService.getParentesco()
                        	.subscribe(data => this.parentesco = data);
					}
				);
			}
		);
        let us = JSON.parse(localStorage.getItem('currentUser'));
		this.role = us.role;
		this.id_user = us.user.ID_USUARIO;
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
            placeholder: 'Buscar Prestadores',
            minimumInputLength: 1,
            allowClear: true
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
	}

  	initForm() {
        this.escalaForm = this.formBuilder.group({
            DATOSHISTORIA: [''],
            DATOSPACIENTE: [''],
            ID_HISTORIA: [''],
            DATOS: [''],
            PACIENTE: [''],
            PRESTADOR: [''],
            ID_CITA: [0]
        });
    }

    Cancelar() {
    	this.basica.emit(0);
    	this.clearAll();
    }

    Guardar() {
        $('input[type=text]').popover('hide');
        $("[data-toggle='popover']").popover('hide');
        $("[data-toggle=popover]").popover('hide');
        $("*").each(function () {
            var popover = $.data(this, "bs.popover");
            if (popover)
                $(this).popover('hide');
        });
    	if(this.role == 'ADMINISTRADOR' && ($('#ID_USUARIO').val() == null || $('#ID_USUARIO').val() == '')) {
    		alert("Por favor, escoja el Prestador");
    		return false;
    	}
    	if($('#PACIENTE').val() == null || $('#PACIENTE').val() == '') {
    		alert("Por favor, escoja el paciente a generar el registro clínico.");
    		return false;
    	}
    	/*if(!confirm("Esta seguro de guardar el registro clínico?"))
    		return false;*/
    	var datos1 = [];
    	var i = 0;
    	var datos = [];
    	var pac = [];
    	$('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                datos1[i] = 1;
                i++;
            }
            else
            {
                datos1[i] = 0;
                i++;
            }
        });
    	$('input[type=text]').each(function() {
    		if($(this).prop('name') != '')
            	datos.push([$(this).prop('name'), $(this).val()]);
        });
        $('textarea').each(function() {
    		if($(this).prop('name') != '') {
    			if($(this).prop('class') == "wysiwyg-editor trumbowyg-editor" || $(this).prop('class') == "trumbowyg-textarea") {
    				if($(this).val() == '')
    					datos.push([$(this).prop('name'), $('#editor').val()]);
    				else
    					datos.push([$(this).prop('name'), $(this).val()]);
    			}
    			else
            		datos.push([$(this).prop('name'), $(this).val()]);
            }
        });
        $('select').each(function() {
    		if($(this).prop('name') != '')
            	pac.push([$(this).prop('name'), $(this).val()]);
        });
        this.escalaForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.escalaForm.get('DATOSHISTORIA').setValue(datos);
    	this.escalaForm.get('DATOSPACIENTE').setValue(pac);
        this.escalaForm.get('DATOS').setValue(datos1);
        this.escalaForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.escalaForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.escalaForm.get('ID_CITA').setValue(this.id_cita);
        if(this.historia_id == 0) {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
            this._loadingBar.stop();
	        this.historiasService.saveHistoriaPaciente(this.escalaForm.value)
	        	.subscribe(data => {
	        		let da: any = data;
	        		this.clearAll();
	        		this.showMessage("Registro clínico guardado");
	        		if(this.id_cita != 0) {
		        		let url: any = '/historias';
	        			this.router.navigateByUrl(url);
	        			this.id_cita = 0;
	        			this.updatecita.emit(0);
	        		}
                    this.basica.emit(0);
                    this._loadingBar.complete();
                    $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
	        	}
	        );
	    }
	    else {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
	    	this.historiasService.updateHistoriaPaciente(this.historia_id, this.escalaForm.value)
	        	.subscribe(data => {
	        		let da: any = data;
	        		this.clearAll();
	        		this.showMessage("Registro clínico actualizado");
	        		this.basica.emit(0);
                    this._loadingBar.complete();
                    $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
	        	}
	        );
        }
    }

    GenerarPdf(id) {
        var that = this;
        this.print = true;
        var estadoc = 0;
        this._loadingBar.progress = 50;
        this._loadingBar.start(() => {
            this._loadingBar.progress++;
        });
        this._loadingBar.stop();
        this.historiasService.getHistoriaPacientes(id)
            .subscribe(data => {
                let da: any = data;
                var pdf = new jsPDF('p', 'px', 'letter');
                var div = document.createElement('div');
                var html = '';
                var header = '';
                html = this.Header(da.usuario.empresa.empresa, da.paciente, id);
                html += this.Paciente(da.paciente,da.FEC_DILIGENCIADA,da.DIAGNOSTICOHIST);
                /*header = html;
                html += this.OtrosDatos(da);*/
                html += this.Page1(da.campos) + this.Prestador(da.usuario);
                $(div).prop('id', 'print'+1);
                $(div).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+1),true);
            }
        );
    }

    Page1(datos) {
        var html = '<div class="row col-md-12"><div class="text-right" style="width: 10%;"></div>' +
        		'<div class="text-right" style="width: 12%;"></div>' +
        		'<div class="text-right" style="width: 30%; background-color: #ffcccc;padding-right: 5px;">TOTAL GENERAL: 124 Alto</div>' +
        		'<div class="text-right" style="width: 12%; background-color: #dad4d4;padding-right: 5px;">36 Alto</div>' +
        		'<div class="text-right" style="width: 12%; background-color: #dad4d4;padding-right: 5px;">28 Medio Alto</div>' +
        		'<div class="text-right" style="width: 12%; background-color: #dad4d4;padding-right: 5px;">30 Alto</div>' +
        		'<div class="text-right" style="width: 12%; background-color: #dad4d4;padding-right: 5px;">30 Alto</div></div>' +
        		'<div class="row col-md-12 mb-5"><div style="width: 10%; background-color: #f4eded;padding-left: 5px;">ITEM.</div>' +
        		'<div style="width: 12%; background-color: #f4eded;padding-left: 5px;">EDAD.</div>' +
        		'<div style="width: 30%; background-color: #f4eded;padding-left: 5px;">DESCRIPCION</div>' +
        		'<div class="text-center" style="width: 12%; background-color: #f4eded;padding-left: 5px;">MOT.GRU.</div>' +
        		'<div class="text-center" style="width: 12%; background-color: #f4eded;padding-left: 5px;">MOT.F.ADAP.</div>' +
        		'<div class="text-center" style="width: 12%; background-color: #f4eded;padding-left: 5px;">AUD.LEN.</div>' +
        		'<div class="text-center" style="width: 12%; background-color: #f4eded;padding-left: 5px;">PER.SOC.</div>' +
        		'<div style="width: 10%; padding-left: 5px;">0</div>' +
        		'<div style="width: 12%; padding-left: 5px;">< 1</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Patea(vigorosamente)</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[4]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[5]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[6]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[7]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">1</div>' +
        		'<div style="width: 12%; padding-left: 5px;">1 a 3</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Levanta la cabeza en prona</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[8]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[9]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[10]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[11]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">2</div>' +
        		'<div style="width: 12%; padding-left: 5px;">1 a 3</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Levanta cabeza y pecho en prona</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[12]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[13]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[14]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[15]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">3</div>' +
        		'<div style="width: 12%; padding-left: 5px;">1 a 3</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Sostiene cabeza al levantarlo de los brazos</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[16]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[17]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[18]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[19]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">4</div>' +
        		'<div style="width: 12%; padding-left: 5px;">4 a 6</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Control de cabeza sentado</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[20]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[21]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[22]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[23]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">5</div>' +
        		'<div style="width: 12%; padding-left: 5px;">4 a 6</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se voltea de un lado a otro</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[24]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[25]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[26]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[27]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">6</div>' +
        		'<div style="width: 12%; padding-left: 5px;">4 a 6</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Intenta sentarse solo</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[28]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[29]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[30]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[31]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">7</div>' +
        		'<div style="width: 12%; padding-left: 5px;">7 a 9</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se sostiene sentado con ayuda</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[32]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[33]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[34]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[35]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">8</div>' +
        		'<div style="width: 12%; padding-left: 5px;">7 a 9</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se arrastra en posición prona</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[36]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[37]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[38]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[39]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">9</div>' +
        		'<div style="width: 12%; padding-left: 5px;">7 a 9</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se sienta por si solo</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[40]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[41]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[42]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[43]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">10</div>' +
        		'<div style="width: 12%; padding-left: 5px;">10 a 12</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Gatea(bien)</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[44]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[45]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[46]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[47]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">11</div>' +
        		'<div style="width: 12%; padding-left: 5px;">10 a 12</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se agarra y se sostiene de pie</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[48]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[49]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[50]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[51]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">12</div>' +
        		'<div style="width: 12%; padding-left: 5px;">10 a 12</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se para solo</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[52]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[53]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[54]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[55]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">13</div>' +
        		'<div style="width: 12%; padding-left: 5px;">13 a 18</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Da pasitos solo</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[56]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[57]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[58]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[59]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">14</div>' +
        		'<div style="width: 12%; padding-left: 5px;">13 a 18</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Camina solo bien</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[60]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[61]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[62]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[63]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">15</div>' +
        		'<div style="width: 12%; padding-left: 5px;">13 a 18</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Corre</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[64]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[65]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[65]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[67]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">16</div>' +
        		'<div style="width: 12%; padding-left: 5px;">19 a 24</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Patea la pelota</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[68]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[69]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[70]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[71]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">17</div>' +
        		'<div style="width: 12%; padding-left: 5px;">19 a 24</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Lanza la pelota con las manos</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[72]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[73]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[74]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[75]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">18</div>' +
        		'<div style="width: 12%; padding-left: 5px;">19 a 24</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Salta en los dos pies</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[76]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[77]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[78]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[79]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">19</div>' +
        		'<div style="width: 12%; padding-left: 5px;">25 a 36</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se empina en ambos pies</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[80]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[81]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[82]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[83]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">20</div>' +
        		'<div style="width: 12%; padding-left: 5px;">25 a 36</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se levanta sin usar las manos</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[84]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[85]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[86]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[87]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">21</div>' +
        		'<div style="width: 12%; padding-left: 5px;">25 a 36</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Camina hacia atrás</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[88]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[89]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[90]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[91]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">22</div>' +
        		'<div style="width: 12%; padding-left: 5px;">37 a 48</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Camina en Punta de Pies</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[92]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[93]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[94]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[95]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">23</div>' +
        		'<div style="width: 12%; padding-left: 5px;">37 a 48</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Se para en un solo pie</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[96]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[97]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[98]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[99]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">24</div>' +
        		'<div style="width: 12%; padding-left: 5px;">37 a 48</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Lanza y agarra la pelota</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[100]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[101]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[102]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[103]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">25</div>' +
        		'<div style="width: 12%; padding-left: 5px;">49 a 60</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Camina en línea recta</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[104]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[105]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[106]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[107]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">26</div>' +
        		'<div style="width: 12%; padding-left: 5px;">49 a 60</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Tres o más pasos en pie</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[108]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[109]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[110]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[111]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">27</div>' +
        		'<div style="width: 12%; padding-left: 5px;">49 a 60</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Hace rebotar y agarra la pelota</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[112]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[113]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[114]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[115]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">28</div>' +
        		'<div style="width: 12%; padding-left: 5px;">61 a 72</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Salta a pie juntillas cuerda a 25cm.</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[116]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[117]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[118]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[119]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">29</div>' +
        		'<div style="width: 12%; padding-left: 5px;">61 a 72</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Hace caballitos alternando los pies</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[120]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[121]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[122]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[123]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">30</div>' +
        		'<div style="width: 12%; padding-left: 5px;">61 a 72</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Salta desde 80cm. De altura</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[124]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[125]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[126]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[127]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">31</div>' +
        		'<div style="width: 12%; padding-left: 5px;">73 a 64</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Juega mula golosa</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[128]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[129]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[130]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[131]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">32</div>' +
        		'<div style="width: 12%; padding-left: 5px;">73 a 64</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Hace contruccion rudimentaria</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[132]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[133]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[134]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[135]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">33</div>' +
        		'<div style="width: 12%; padding-left: 5px;">73 a 64</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Salta alternando pies</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[136]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[137]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[138]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[139]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">34</div>' +
        		'<div style="width: 12%; padding-left: 5px;">85 a 93</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Abre y ciera las manos alternadamente</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[140]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[141]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[142]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[143]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">35</div>' +
        		'<div style="width: 12%; padding-left: 5px;">85 a 93</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Marcha sin peder el ritmo</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[144]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[145]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[146]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[147]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div style="width: 10%; padding-left: 5px;">36</div>' +
        		'<div style="width: 12%; padding-left: 5px;">85 a 93</div>' +
        		'<div style="width: 30%; padding-left: 5px;">Salta Cuerda</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[148]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[149]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[150]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div>' +
        		'<div class="text-center" style="width: 12%; padding-left: 5px;">'+(datos[151]['VALOR'] != 'No' ? '<i class="zmdi zmdi-close"></i>' : '')+'</div></div>';
        return html;
    }

    Prestador(usuario) {
        let firma: any = usuario.prestador.FIRMA != null ? '<img src="'+usuario.prestador.FIRMA_TEXT+'" alt="" width="150" height="150">' : '';
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;padding-right: 15px;padding-left: 15px;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div style="margin: 15px !important;width:99%"><div class="col-md-2"></div><div style="width:35%;">'+firma+'</div></div>' +
                '<div style="width:45%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #e9ecef;"></div>'+
                '<div style="width:10%;"></div>'+
                '<div style="width:45%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #e9ecef;"></div>'+
                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">médico:</div>' +
                '<div class="text-left" style="width:31%; margin: 0;padding: 0;text-transform: uppercase !important;">'+usuario.NOMBRES + " " +usuario.APELLIDOS+'</div>' +
                '<div style="width:10%;"></div>'+
                '<div class="text-center" style="width:45%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">firma paciente</div>' +
                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">reg médico:</div>' +
                '<div class="text-left" style="width:85%; margin: 0;padding: 0;">'+usuario.TARJETA+'</div>' +
                '</div>';
        return html;
    }

    OtrosDatos(da) {
        let nombre = da.campos[0]['VALOR'] != null ? da.campos[0]['VALOR'] : "-";
        let dire = da.campos[1]['VALOR'] != null ? da.campos[1]['VALOR'] : "-";
        let telef = da.campos[2]['VALOR'] != null ? da.campos[2]['VALOR'] : "-";
        let conf = da.paciente.VIC_CONF_ARMADO == 1 ? "Si" : "No";
        let lgbti = da.paciente.LGBTI == 1 ? "Si" : "No";
        let gestacion = da.paciente.GESTACION == 1 ? "Si" : "No Aplica";
        let desplazado = da.paciente.DESPLAZADO == 1 ? "Si" : "No";
        let maltrato = da.paciente.VIC_MALTRATO == 1 ? "Si" : "No";
        let acompanante = da.campos[3]['VALOR'] != null ? da.campos[3]['VALOR'] : "-";
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;padding-right: 15px;padding-left: 15px;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="text-left" style="width:100%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">datos del acudiente</div>' +
                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">nombre:</div>' +
                '<div class="text-left" style="width:54%; margin: 0;padding: 0;text-transform: uppercase !important;">'+nombre+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">parentesco:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+da.parentesco.NOM_PARENTESCO+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Dirección:</div>' +
                '<div class="text-left" style="width:54%; margin: 0;padding: 0;text-transform: uppercase !important;">'+dire+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Teléfono:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+telef+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">acompañante:</div>' +
                '<div class="text-left" style="width:86%; margin: 0;padding: 0;text-transform: uppercase !important;">'+acompanante+'</div>' +

                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #e9ecef;"></div>'+
                '<div class="text-left" style="width:100%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">enfoque diferencial</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">nivel educativo:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+da.paciente.escolaridad.NOM_ESCOLARIDAD+'</div>' +
                '<div class="text-left" style="width:20%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">vic. conflicto armado:</div>' +
                '<div class="text-left" style="width:4%; margin: 0;padding: 0;text-transform: uppercase !important;">'+conf+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">etnia:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+da.paciente.etnia.NOM_ETNIA+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">discapacidad:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+da.paciente.discapacidad.NOM_DISCAPACIDAD+'</div>' +
                '<div class="text-left" style="width:20%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">población lgbti:</div>' +
                '<div class="text-left" style="width:4%; margin: 0;padding: 0;text-transform: uppercase !important;">'+lgbti+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Religión:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;">'+da.paciente.religion.NOM_RELIGION+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">gestacion:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+gestacion+'</div>' +
                '<div class="text-left" style="width:20%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">desplazado:</div>' +
                '<div class="text-left" style="width:4%; margin: 0;padding: 0;text-transform: uppercase !important;">'+desplazado+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">vic. maltrato:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+maltrato+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">ocupación:</div>' +
                '<div class="text-left" style="width:86%; margin: 0;padding: 0;text-transform: uppercase !important;">'+da.paciente.ocupacion.NOM_OCUPACION+'</div>' +
                '</div>';
        return html;
    }

    Paciente(paciente,fecha,diagnos) {
        var nombre = paciente.PRIMER_NOMBRE + (paciente.SEGUNDO_NOMBRE != null ? " "+paciente.SEGUNDO_NOMBRE : "");
        var apellidos = paciente.PRIMER_APELLIDO + (paciente.SEGUNDO_APELLIDO != null ? " "+paciente.SEGUNDO_APELLIDO : "");
        let yDiff: any = "0";
        let mDiff: any = "0";
        if(paciente.FECHA_NAC != null) {
            let m1: any = moment(paciente.FECHA_NAC);
            let m2: any = moment().format('YYYY-MM-DD');
            yDiff = moment().year() - moment(paciente.FECHA_NAC).year();
            mDiff = moment().month() - moment(paciente.FECHA_NAC).month();
            if (mDiff < 0) {
                mDiff = 12 + mDiff;
                yDiff--;
            }
        }
        let edad: any = yDiff + " años " + mDiff + " meses";
        var genero = paciente.GENERO == 1 ? "Masculino" : paciente.GENERO == 2 ? "Femenino" : "Indeterminado";
        var fec_nac = paciente.FECHA_NAC != null ? moment(paciente.FECHA_NAC).format('DD/MM/YYYY') : "No asignada";
        var telef = paciente.MOVIL != null ? paciente.MOVIL : "-";
        var dire = paciente.DIREC_PACIENTE != null ? paciente.DIREC_PACIENTE : "-";
        var admin = paciente.contrato != null ? paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR";
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;padding-right: 15px;padding-left: 15px;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Paciente:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+nombre+" "+apellidos+'</div>' +
                '<div class="text-left" style="width:8%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">E.civil:</div>' +
                '<div class="text-left" style="width:16%; margin: 0;padding: 0;text-transform: uppercase !important;">'+paciente.estadocivil.NOM_ESTADO_CIVIL+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">fecha ingreso:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+moment(fecha).format('DD/MM/YYYY H:mm')+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">identificación:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+paciente.identificacion.COD_TIPO_IDENTIFICACION+paciente.NUM_DOC+'</div>' +
                '<div class="text-left" style="width:8%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Edad:</div>' +
                '<div class="text-left" style="width:16%; margin: 0;padding: 0;text-transform: uppercase !important;">'+edad+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">fecha egreso:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+moment(fecha).format('DD/MM/YYYY H:mm')+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">no historia:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+paciente.NUM_DOC+'</div>' +
                '<div class="text-left" style="width:8%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">sexo:</div>' +
                '<div class="text-left" style="width:16%; margin: 0;padding: 0;text-transform: uppercase !important;">'+genero+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">télefono:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+telef+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">empresa:</div>' +
                '<div class="text-left" style="width:30%; margin: 0;padding: 0;text-transform: uppercase !important;">'+admin+'</div>' +
                '<div class="text-left" style="width:8%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">fec. nac:</div>' +
                '<div class="text-left" style="width:16%; margin: 0;padding: 0;text-transform: uppercase !important;">'+fec_nac+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">municipio:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+paciente.municipio.NOM_MUNICIPIO+'</div>' +

                '<div class="text-left" style="width:14%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">diagnóstico:</div>' +
                '<div class="text-left" style="width:54%; margin: 0;padding: 0;text-transform: uppercase !important;">'+(diagnos != '' ? diagnos : "NO REFIERE")+'</div>' +
                '<div class="text-left" style="width:15%; margin: 0;padding: 0;font-weight: bolder;text-transform: uppercase !important;">Dirección:</div>' +
                '<div class="text-left" style="width:17%; margin: 0;padding: 0;text-transform: uppercase !important;">'+dire+'</div>' +
                '</div>';
        return html;
    }

    Header(empresa, paciente, id) {
        let dire: any = empresa.DIREC_EMP != null ? empresa.DIREC_EMP : "-";
        let tele: any = empresa.TELEF != null ? empresa.TELEF : "-";
        let fechai = moment().format('DD/MM/YYYY');
        var html = '<div class="col-md-3 text-left" style="margin: 0;padding: 0;font-size: 12px;">Fecha Impresión: '+fechai+'</div>' +
                '<div class="col-md-6 text-center" style="margin: 0;padding: 0;text-transform: uppercase !important;"><h3>'+empresa.NOM_EMPRESA+'</h3></div>' +
                '<div class="col-md-3 text-right" style="margin: 0;padding: 0;font-size: 12px;">Folio No: '+paciente.NUM_DOC+'-'+id+'</div>' +
                '<div class="col-md-12 text-center" style="margin: 0;padding: 0;font-size: 12px;">Dirección: '+dire+' Teléfono: '+tele+'</div>' +
                '<div class="col-md-12 text-center"><h3>HISTORIA CLINICA ESCALA ABREVIADA DE DESARROLLO</h3></div>';
        return html;
    }

    CrearImagen(pdf, div, terminar) {
        var that = this;
        var divHeight = $(div).height();
        var divWidth = $(div).width();
        var ratio = divHeight / divWidth;
        html2canvas(div).then(canvas => {
            var width = pdf.internal.pageSize.getWidth();
            var height1 = pdf.internal.pageSize.getHeight();
            var contentDataURL = canvas.toDataURL('image/png');
            var height = ratio * width;
            height = (height-30 > 560) ? 560 : height-30;
            pdf.addPage();
            pdf.setTextColor(0,0,0);
            pdf.addImage(contentDataURL, 'PNG', 20, 20, width-30, height);
            pdf.setFontSize(7);
            let pagen: any = 'Página No: '+ (pdf.internal.getNumberOfPages() - 1);
            pdf.setLineWidth(0.1); 
            pdf.line(20, 580, width-20, 580);
            pdf.text(pagen, 20, 585);
            if(terminar == true) {
                pdf.deletePage(1)
                that.print = false;
                $('#print').empty();
                that.tipo_id.emit(0);
                /*pdf.autoPrint();
                pdf.save('ESCALAABREVIADA.pdf');*/
                var blob = pdf.output('blob');
                window.open(URL.createObjectURL(blob));
                that._loadingBar.complete();
            }
        })
    }

    Siguiente(id) {
        $('.nav-fill a[href="#'+id+'"]').tab('show');
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
    }

    clearAll() {
        this.escalaForm.get('DATOSHISTORIA').setValue('');
        this.escalaForm.get('DATOSPACIENTE').setValue('');
        this.escalaForm.get('DATOS').setValue('');
        this.escalaForm.get('PACIENTE').setValue('');
        this.escalaForm.get('PRESTADOR').setValue('');
        this.escalaForm.get('ID_HISTORIA').setValue(0);
        this.escalaForm.get('ID_CITA').setValue(0);
        $('#ID_ESCOLARIDAD').val(1).trigger('change');
        $('#ID_ETNIA').val(6).trigger('change');
        $('#ID_OCUPACION').val(511).trigger('change');
        $('#ID_DISCAPACIDAD').val(5).trigger('change');
        $('#ID_RELIGION').val(6).trigger('change');
        $('#GESTACION').val(2).trigger('change');
        $('#PARENTESCO').val(23).trigger('change');
        $('input[name=datos]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');
        });
        this.historia_id = 0;
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Guardar Registro');
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
