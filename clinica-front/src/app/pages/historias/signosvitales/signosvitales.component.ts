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

declare var $: any;

@Component({
  	selector: 'app-signosvitales',
  	templateUrl: './signosvitales.component.html',
  	styleUrls: ['./signosvitales.component.css']
})
export class SignosvitalesComponent implements OnInit {

	svForm: FormGroup;
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
            if(tipo.currentValue == 27 && pr) {
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
        if(document.getElementById("PESO") != null) {
            setInputFilter(document.getElementById("PESO"), function(value) {
                return /^-?\d*[.,]?\d*$/.test(value); });
        }
        if(document.getElementById("TALLA") != null) {
            setInputFilter(document.getElementById("TALLA"), function(value) {
                return /^-?\d*[.,]?\d*$/.test(value); });
        }
        $('#PESO').on("change", function (e) {
            if($('#PESO').val() != 0 && $('#PESO').val() != '' && $('#PESO').val() != null && $('#PESO').val() != '0') {
                if($('#TALLA').val() != 0 && $('#TALLA').val() != '' && $('#TALLA').val() != null && $('#TALLA').val() != '0') {
                    $('#IMC').val(($('#PESO').val() / $('#TALLA').val()).toFixed(2));
                }
                else
                    $('#IMC').val(0);
            }
            else
                $('#IMC').val(0);
        });
        $('#TALLA').on("change", function (e) {
            if($('#TALLA').val() != 0 && $('#TALLA').val() != '' && $('#TALLA').val() != null && $('#TALLA').val() != '0') {
                if($('#PESO').val() != 0 && $('#PESO').val() != '' && $('#PESO').val() != null && $('#PESO').val() != '0') {
                    $('#IMC').val(($('#PESO').val() / $('#TALLA').val()).toFixed(2));
                }
                else
                    $('#IMC').val(0);
            }
            else
                $('#IMC').val(0)
        });
	}

  	initForm() {
        this.svForm = this.formBuilder.group({
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
        this.svForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.svForm.get('DATOSHISTORIA').setValue(datos);
    	this.svForm.get('DATOSPACIENTE').setValue(pac);
        this.svForm.get('DATOS').setValue(datos1);
        this.svForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.svForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.svForm.get('ID_CITA').setValue(this.id_cita);
        if(this.historia_id == 0) {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
            this._loadingBar.stop();
	        this.historiasService.saveHistoriaPaciente(this.svForm.value)
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
	    	this.historiasService.updateHistoriaPaciente(this.historia_id, this.svForm.value)
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
        this.historiasService.getHistoriaSignoVitales($('#PACIENTE').val())
            .subscribe(data => {
                let da: any = data;
                var item = 1;
                var page = 1;
                var pdf = new jsPDF('l', 'px', 'letter');
                var div = document.createElement('div');
                var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
	                '<div class="text-center" style="width: 2%; background-color: #f3f3f3;font-weight: bolder;">No</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">FC:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">FR:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">TEMP:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">VIA TEM</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">SAT.con</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">SAT sin</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">P.Sis</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">P.Dias</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">P Med:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Glasgow</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Pulso</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Pvc:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Talla:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Peso:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">IMC:</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Hidrata</div>' +
	                '<div style="width: 5%; background-color: #f3f3f3;font-weight: bolder;">Glucome</div>' +
	                '<div style="width: 13%; background-color: #f3f3f3;font-weight: bolder;">Observaciones:</div>' +
	                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>';
                var cant = 1;
                if(da.length > 0) {
					for(var i = 0; i < da.length; i++) {
						if(item <= 45) {
							html += this.SignosVitales(da[i],cant);
							item++;
							cant++;
							if(i == (da.length - 1)) {
								html += '</div>';
								$(div).prop('id', 'print'+page);
								$(div).addClass('row col-md-12').html(this.Header(da[i].usuario.empresa.empresa, da[i].paciente, id)+this.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST)+html+this.Prestador(page));
								var datos = document.getElementById('print');
								$(div).appendTo($(datos));
								var terminar = true;
								that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
							}
						}
						else {
							html += this.SignosVitales(da[i],cant);
							html += '</div>';
							var div1 = document.createElement('div');
							$(div1).prop('id', 'print'+page);
							$(div1).addClass('row col-md-12').html(this.Header(da[i].usuario.empresa.empresa, da[i].paciente, id)+this.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST)+html+this.Prestador(page));
							var datos = document.getElementById('print');
							$(div1).appendTo($(datos));
							var terminar = false;
							that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
							page++;
							cant++;
							item = 1;
							html = '';
						}
					}
				}
				else {
					$(div).prop('id', 'print'+page);
					$(div).addClass('row col-md-12').html(this.Header(da[i].usuario.empresa.empresa, da[i].paciente, id)+this.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST)+'<div class="col-md-12 text-center">NO EXISTEN DATOS DE SIGNOS VITALES PARA ESTE PACIENTE</div>'+this.Prestador(page));
					var datos = document.getElementById('print');
					$(div).appendTo($(datos));
					var terminar = true;
					that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
				}
            }
        );
    }

    SignosVitales(da, cant) {
    	var campos = da.campos;
    	var imc = (campos[17]['VALOR'] != 0 && campos[16]['VALOR'] != 0) ? campos[16]['VALOR']/campos[17]['VALOR'] : 0;
    	var html = '<div class="text-center" style="width: 2%; text-transform: uppercase !important;">'+cant+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[4]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[5]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[6]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[7]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[8]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[9]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[10]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[11]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[12]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[13]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[14]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[15]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[16]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[17]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+imc.toFixed(2)+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[18]['VALOR']+'</div>' +
                '<div style="width: 5%; text-transform: uppercase !important;">'+campos[19]['VALOR']+'</div>' +
                '<div style="width: 13%;">'+campos[20]['VALOR']+'</div>';
        return html;
    }

    Prestador(page) {
        var html = '';
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
                '<div class="col-md-12 text-center"><h3>HOJA DE SIGNOS VITALES</h3></div>';
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
                pdf.save('SIGNOSVITALES.pdf');*/
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
        this.svForm.get('DATOSHISTORIA').setValue('');
        this.svForm.get('DATOSPACIENTE').setValue('');
        this.svForm.get('DATOS').setValue('');
        this.svForm.get('PACIENTE').setValue('');
        this.svForm.get('PRESTADOR').setValue('');
        this.svForm.get('ID_HISTORIA').setValue(0);
        this.svForm.get('ID_CITA').setValue(0);
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
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}