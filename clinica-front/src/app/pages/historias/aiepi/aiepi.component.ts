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
  	selector: 'app-aiepi',
  	templateUrl: './aiepi.component.html',
  	styleUrls: ['./aiepi.component.css']
})
export class AiepiComponent implements OnInit {
	aiepiForm: FormGroup;
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
            if(tipo.currentValue == 3 && pr) {
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
        $('#DIAGNOSTICO').select2({
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
        $('#DIAGNOSTICOD').select2({
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
        $('#DIAGNOSTICOF').select2({
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
        $('#DIAGNOSTICOO').select2({
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
        $('#DIAGNOSTICOG').select2({
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
        $('#DIAGNOSTICOSB').select2({
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
        $('#DIAGNOSTICODI').select2({
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
        $('#DIAGNOSTICOAN').select2({
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
        $('#DIAGNOSTICOMA').select2({
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
        $('#DIAGNOSTICOEV').select2({
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
        $('#DIAGNOSTICOFI').select2({
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

        $('.wysiwyg-editor').trumbowyg({
			svgPath: 'assets/plantilla/vendors/bower_components/trumbowyg/dist/ui/icons.svg'
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
        this.aiepiForm = this.formBuilder.group({
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
        this.aiepiForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.aiepiForm.get('DATOSHISTORIA').setValue(datos);
    	this.aiepiForm.get('DATOSPACIENTE').setValue(pac);
        this.aiepiForm.get('DATOS').setValue(datos1);
        this.aiepiForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.aiepiForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.aiepiForm.get('ID_CITA').setValue(this.id_cita);
        if(this.historia_id == 0) {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
            this._loadingBar.stop();
	        this.historiasService.saveHistoriaPaciente(this.aiepiForm.value)
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
	    	this.historiasService.updateHistoriaPaciente(this.historia_id, this.aiepiForm.value)
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
                header = html;
                html += this.OtrosDatos(da);
                html += this.Page1(da.campos);
                $(div).prop('id', 'print'+1);
                $(div).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+1),false);

                var div1 = document.createElement('div');
                html = header + this.Page2(da.campos);
                $(div1).prop('id', 'print'+2);
                $(div1).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div1).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+2),false);

                var div2 = document.createElement('div');
                html = header + this.Page3(da.campos, da);
                $(div2).prop('id', 'print'+3);
                $(div2).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div2).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+3),false);

                var div3 = document.createElement('div');
                html = header + this.Page4(da.campos, da);
                $(div3).prop('id', 'print'+4);
                $(div3).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div3).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+4),false);

                var div4 = document.createElement('div');
                html = header + this.Page5(da.campos, da) + this.Prestador(da.usuario);
                $(div4).prop('id', 'print'+5);
                $(div4).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div4).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+5),true);
            }
        );
    }

    Page1(datos,page=null) {
    	let motivo = datos[192]['VALOR'] != null ? datos[192]['VALOR'] : "NO REFIERE";
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">MOTIVO DE CONSULTA y ENFERMEDAD ACTUAL::</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 90px;">'+motivo+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES PATOLOGICO IMPORTANTES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">COMO FUE EL EMBARAZO/DURAC:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[4]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">COMO FUE EL PARTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[5]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUANTO PESO AL NACER:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[6]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUANTO MISION AL NACER:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[7]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PROBLEMAS DESPUES DEL NAC:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[8]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">QUE ENFERMEDADES HA TENIDO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[9]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TRAUMATICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[10]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">QUIRURGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[11]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INMUNOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[12]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALERGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[13]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FARMACOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[14]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TOXICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[15]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS ANTECEDENTES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[16]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES FAMILIARES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GENERALES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[17]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PATOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[18]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TOXICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[19]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FARMACOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[20]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALERGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[21]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSTETRICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[22]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GINECOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[23]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES PERINATALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PARTO INSTITUCIONAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[24]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MODALIDAD DEL PARTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[25]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PRESENTACION CEFALICA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[26]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PRODUCTO UNICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[27]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ESTUVO EN ENCUBADORA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[28]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBIO FOTOTERAPIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[29]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LAC. MATERNA 1A HORA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[30]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PESO AL NACER: GRAMOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[31]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TALLA AL NACER:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[32]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">REVISION POR SISTEMAS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[33]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CABEZA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[34]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OJOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[35]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NARIZ:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[36]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[37]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OROFAFINGE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[38]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUELLO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[39]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RESPIRATORIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[40]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NEUROLOGICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[41]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ENDOCRINO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[42]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MUSCULO(ESQUELETICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[43]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">HEMATOPOYETICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[44]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LINFORRETICULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[45]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page2(datos,page=null) {
    	var imc = (datos[60]['VALOR'] != 0 && datos[61]['VALOR'] != 0) ? datos[60]['VALOR']/datos[61]['VALOR'] : 0;
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PSIQUIATRICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[46]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PIEL Y FANERAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[47]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ARTICULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[48]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CARDIOVASCULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[49]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GASTRO - INTESTINAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[50]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GINECOLOGICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[51]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">UROLOGICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[52]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[53]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">SIGNOS VITALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA CARDIACA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[54]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA RESPIRATORIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[55]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TEMPERATURA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[56]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PULSO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[57]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SATURACION DE OXIGENO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[58]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMEN FISICO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ASPECTO GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[59]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PESO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[60]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TALLA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[61]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">IMC:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+imc.toFixed(2)+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATICO DE PIEL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[63]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATICO RESPIRATORIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[64]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINDROME FEBRIL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[65]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATICO NERVIOSO PERIFERICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[66]['VALOR']+'</div>' +
				'<div class="col-md-6" style="text-transform: uppercase !important;">CABEZA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[67]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OJOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[68]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[69]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NARIZ:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[70]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[71]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GENITOURINARIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[72]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUELLO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[73]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TORAX:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[74]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PULMONAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[75]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CARDIOVASCULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[76]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ABDOMEN:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[77]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">EXTREMIDADES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[78]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">COLUMNA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[79]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SISTEMA MUSCULOESQUELETICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[80]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PIEL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[81]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">FACTORES DE RIESGO SALUD MENTAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SOSPECHA DE MALTRATO FISICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[82]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SOSPECHA DE VIOLENCIA SEXUAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[83]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SOSPECHA DE VIOLENCIA INTRAFAMILIAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[84]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CONDUCTA AGRESIVA O VIOLENTA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[85]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATOLOGIA DEPRESIVA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[86]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATOLOGIA DE ANSIEDAD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[87]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">IDEAS O INTENTO DE SUICIDA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[88]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CONSUMO DE ALCOHOL SUSTANCIAS PSICOACTIVAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[89]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PENSAMIENTOS O IDEAS INCOHERENTES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[90]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">VICTIMA DE DESPLAZAMIENTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[91]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page3(datos, da,page=null) {
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMEN MENTAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARIENCIA GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[92]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ACTITUD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[93]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ATENCION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[94]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CONCIENCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[95]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ORIENTACION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[96]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LENGUAJE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[97]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">AFECTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[98]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MEMORIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[99]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PENSAMIENTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[100]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">HABITO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[101]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SUEÑO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[102]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALIMENTACION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[103]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INTELIGENCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[104]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RETARDO MENTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[105]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INTROSPECCION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[106]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PROSPECCION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[107]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SOMATIZACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[108]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[109]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">VERIFICA SI EXISTEN SIGNOS DE PELIGRO EN GENERAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">Puede beber o tomar de pecho:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[110]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">Letargico o Inconsciente:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[111]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">Vomita Todo:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[112]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">Convulciones:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[113]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TIENE TOS O DIFICULTAD PARA RESPIRAR?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICO+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PRIMER EPISODIO SIBILANCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[114]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SIBILANCIAS RECURRENTES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[115]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUADRO GRIPAL PREVIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[116]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ANTECEDENTES PREMATUREZ:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[117]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIRAJE SUBCOSTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[118]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ESTRIDOR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[119]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APNEA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[120]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RESPIRACCION RAPIDA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[121]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SA02<92%(90% ALTURA >2500MSNM):</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[122]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SIBILANCIAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[123]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TIENE DIARREA?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOD+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">HAY SANGRE EN LAS HECES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[124]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE VOMITO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[125]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LETARGICO O COMATOSO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[126]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OJOS HUNDIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[127]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BEBE MAL O NO PUEDE BEBER:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[128]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PLIEGUE CUTÀNEO MUY LENTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[120]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INTRANQUILO IRRITABLE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[130]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LENTO (2 SEG. O MENOR):</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[131]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TIENE FIEBRE?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOF+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FIEBRE +5 DIAS TODOS LOS DIAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[132]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FIEBRE MAS DE 39 C:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[133]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">VIVE/VISITO LOS ULT 15 DIAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[134]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RIGIDEZ DE NUCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[135]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARIENCIA ENFERMO GRAVE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[136]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RESPUESTA SOCIAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[137]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ERUPCION CUTANEA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[138]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">POSTRACION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[139]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ASPECTO TOXICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[140]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MANIFESTACION CON SANGRADO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[141]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page4(datos, da,page=null) {
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TIENE PROBLEMA DE OIDO?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO?:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOO+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE DOLOR DE OIDO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[142]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE SUPURACION DESDE HACE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[143]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NUMERO DE EPISODIOS PREVIOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[144]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SUPURACION DE OIDO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[145]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TUMEFACCION DOLOROSA AL TACTO, DETRAS DE LA OREJA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[146]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TIENE UN PROBLEMA DE GARGANTA?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOG+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Tiene dolor de Garganta:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[147]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Ganglios del cuerpo crecidos y dolorosos:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[148]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Exudado Blanco - Eritema:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[149]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EN SEGUIDA, VERIFICAR LA SALUD BUCAL?:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOSB+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE DOLOR EN ALGUN DIENTE?:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[150]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE DOLOR EN LA BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[151]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TRAUMA EN LA CARA O BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[152]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE PADRES O HERMANOS CON CARIES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[153]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">UTILIZA SEDA DENTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[154]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INFLAMACION DOLOROSA DEL LABIO EXUDADO PURULENTO EN ENCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[155]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ENROJESIMIENTO INFLAMACION LOCALIZADA/DEFORMIDAD EN ENCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[156]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CARIES CAVITACIONALES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[157]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">VESICULAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[158]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ULCERAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[159]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MANCHAS BLANCAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[160]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MANCHAS CAFES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[161]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TRAUMA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[162]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRACTURA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[163]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CONTUSION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[164]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SUBLUXACION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[165]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LUXACION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[166]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">EDEMA Y ERITEMA ENCIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[167]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">AVULSON DIENTE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[168]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TEMPORAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[169]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">USA BIBERON:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[170]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">VERIFICAR SI TIENE DESTUTRCION:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICODI+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SIGNOS DE EMACIACION VISIBLE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[171]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">EDEMA EN AMBOS PIES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[172]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">VERIFICAR SI TIENE ANEMIA:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOAN+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">A RECIBIDO HIERRO EN LOS ULITMOS SEIS MESES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[173]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">CUANDO:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[174]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">CUANTO TIEMPO:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[175]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">PALIDEZ PARLMAR:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[176]['VALOR']+'</div>' +
                '<div class="col-md-4" style="text-transform: uppercase !important;">PALIDEZ CONJUNTIVAL:</div>' +
                '<div class="col-md-2" style="text-transform: uppercase !important;">'+datos[177]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EN SEGUIDA, VERIFICAR SI TIENES MALTRATO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOMA+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">VIVE EN SITUACION DE CALLE ?:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[178]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page5(datos, da,page=null) {
        var lab = da.laboratorio;
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EN SEGUIDA, EVALUAR EL DESSARROLLO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+da.DIAGNOSTICOEV+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE ALGUN ANTECEDENTE IMPORTANTE PARA EL DESARROLLO?:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[179]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">AUSENCIA DE 1 2 3 4 CONDICIONES PARA LA EDAD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[180]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PERIMETRO CEFALICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[181]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIENE ALGUN FACTOR DE RIESGO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[182]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EVALUAR ALIMENTACION DE TODOS LOS NIÑOS MENORES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PROBLEMA DE ALIMENTACION DETECTADO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[183]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBE LECHE MATERNA?:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[184]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBE PECHO EN LA NOCHE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[185]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EVALUAR EPILEPSIA INFANTIL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+datos[186]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EVALUAR TUBERCULOSIS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+datos[187]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EVALUAR CANCER INTANTIL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+datos[188]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ESCRIBIR LAS RECOMENDACIONES Y ORIENTACION:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBIO VITAMINA EN LOS ULTIMOS 6 MESES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[189]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBIO ALBENDAZOL EN LOS ULTIMOS 6 MESES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[190]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RECIBIO HIERRO EN LOS ULTIMOS 6 MESES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[191]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMENES DE LABORATORIO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>';
                if(lab.length > 0) {
                    for(var i in lab) {
                        html += '<div class="col-md-4" style="text-transform: uppercase !important;">'+lab[i]['items']['NOM_ITEM']+':</div>' +
                            '<div class="col-md-8" style="text-transform: uppercase !important;">'+(lab[i]['RESULTADO'] != null ? lab[i]['RESULTADO'] : '')+'</div>';       
                    } 
                }
                else {
                    '<div class="col-md-12" style="text-transform: uppercase !important;">NO REFIERE</div>' ;
                }        
                html += '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">INTERVENCION DE MEDICINA FAMILIAR:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[193]['VALOR'] != null ? datos[193]['VALOR'] : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">DIAGNOSTICO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOFI != '' ? da.DIAGNOSTICOFI : "NO REFIERE")+'</div>' +
                '</div>';
        return html;
    }

    Prestador(usuario,page=null) {
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
                '<div class="col-md-12 text-center"><h3>HISTORIA CLINICA AIEPI 2 - 5 AÑOS</h3></div>';
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
                pdf.save('AIEPININO2MESESA5ANOS.pdf');*/
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
        this.aiepiForm.get('DATOSHISTORIA').setValue('');
        this.aiepiForm.get('DATOSPACIENTE').setValue('');
        this.aiepiForm.get('DATOS').setValue('');
        this.aiepiForm.get('PACIENTE').setValue('');
        this.aiepiForm.get('PRESTADOR').setValue('');
        this.aiepiForm.get('ID_HISTORIA').setValue(0);
        this.aiepiForm.get('ID_CITA').setValue(0);
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