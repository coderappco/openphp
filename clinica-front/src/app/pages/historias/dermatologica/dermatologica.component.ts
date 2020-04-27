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
  	selector: 'app-dermatologica',
  	templateUrl: './dermatologica.component.html',
  	styleUrls: ['./dermatologica.component.css']
})
export class DermatologicaComponent implements OnInit {

	dermatologicaForm: FormGroup;
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
            if(tipo.currentValue == 16 && pr) {
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
            allowClear: true,
            multiple: true
        });
        $('.select2-search__field').css('width', '100%');
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
        this.dermatologicaForm = this.formBuilder.group({
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
    		if($(this).prop('name') != '')
            	datos.push([$(this).prop('name'), $(this).val()]);
        });
        $('select').each(function() {
    		if($(this).prop('name') != '')
            	pac.push([$(this).prop('name'), $(this).val()]);
        });
        this.dermatologicaForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.dermatologicaForm.get('DATOSHISTORIA').setValue(datos);
    	this.dermatologicaForm.get('DATOSPACIENTE').setValue(pac);
        this.dermatologicaForm.get('DATOS').setValue(datos1);
        this.dermatologicaForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.dermatologicaForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.dermatologicaForm.get('ID_CITA').setValue(this.id_cita);
        if(this.historia_id == 0) {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
            this._loadingBar.stop();
	        this.historiasService.saveHistoriaPaciente(this.dermatologicaForm.value)
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
	    	this.historiasService.updateHistoriaPaciente(this.historia_id, this.dermatologicaForm.value)
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
                html = header + this.Page2(da.campos, da) + this.Prestador(da.usuario);
                $(div1).prop('id', 'print'+2);
                $(div1).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div1).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+2),true);
            }
        );
    }

    Page1(datos, page = null) {
    	let imc = (datos[27]['VALOR'] != 0 && datos[28]['VALOR'] != 0) ? datos[27]['VALOR']/datos[28]['VALOR'] : 0;
        var motivo = datos[44]['VALOR'] != null ? datos[44]['VALOR'] : "NO REFIERE";
        let enfermedad = datos[45]['VALOR'] != null ? datos[45]['VALOR'] : "NO REFIERE";
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">MOTIVO DE CONSULTA:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 40px;">'+motivo+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ENFERMEDAD ACTUAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 60px;">'+enfermedad+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES GENERALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PATOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[4]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">QUIRURGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[5]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TRAUMATICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[6]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TOXICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[7]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALERGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[8]['VALOR']+'</div>' +
				'<div class="col-md-6" style="text-transform: uppercase !important;">GINECOOBSTETRICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[9]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FAMILIARES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[10]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[11]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">REVISION POR SISTEMAS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PIEL Y ANEXOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[12]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CABEZA Y CUELLO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[13]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ORGANOS DE LOS SENTIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[14]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BOCA Y FARINGE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[15]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARATO CARDIORESPIRATORIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[16]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARATO GASTROINTESTINAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[17]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARATO URINARIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[18]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARTO GENITAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[19]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OSTEOMUSCULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[20]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SISTEMA NERVIOSO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[21]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">SIGNOS VITALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA CARDIACA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[22]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA RESPIRATORIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[23]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TENSION ARTERIAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[24]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SATURACION DE OXIGENO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[25]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMEN FISICO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ASPECTO GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[26]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PESO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[27]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TALLA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[28]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">IMC:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+imc.toFixed(2)+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PIEL Y ANEXOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[30]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CABEZA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[31]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CUELLO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[32]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page2(datos, da, page = null) {
        var diag = da.diagnosticos;
    	var imc = (datos[27]['VALOR'] != 0 && datos[28]['VALOR'] != 0) ? datos[28]['VALOR']/datos[27]['VALOR'] : 0;
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OJOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[33]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NARIZ:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[34]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[35]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[36]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FARINGE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[37]['VALOR']+'</div>' +                
                '<div class="col-md-6" style="text-transform: uppercase !important;">TORAX:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[38]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ABDOMEN:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[39]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">EXTREMIDADES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[40]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">NEUROLOGICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[41]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GENITALES EXTERNOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[42]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">DIAGNOSTICO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>';
                for(var i in diag) {
                    html += '<div class="col-md-12" style="text-transform: uppercase !important;">'+diag[i]['diagnostico']['COD_DIAGNOSTICO']+" "+diag[i]['diagnostico']['NOM_DIAGNOSTICO']+'</div>';
                }
                html += '<div class="col-md-6 mt-2" style="text-transform: uppercase !important;">TIPO DE DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[49]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[43]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">PLAN DE TRATAMIENTO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[46]['VALOR'] != null ? datos[46]['VALOR'] : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">AYUDA DIAGNOSTICAS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[47]['VALOR'] != null ? datos[47]['VALOR'] : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">RECOMENDACIONES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[48]['VALOR'] != null ? datos[48]['VALOR'] : "NO REFIERE")+'</div>' +
                '</div>';
        return html;
    }


    Prestador(usuario, page = null) {
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
                '<div class="col-md-12 text-center"><h3>HISTORIA CLINICA DERMATOLOGICA</h3></div>';
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
                pdf.save('HISTORIACLINICADERMATOLOGICA.pdf');*/
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
        this.dermatologicaForm.get('DATOSHISTORIA').setValue('');
        this.dermatologicaForm.get('DATOSPACIENTE').setValue('');
        this.dermatologicaForm.get('DATOS').setValue('');
        this.dermatologicaForm.get('PACIENTE').setValue('');
        this.dermatologicaForm.get('PRESTADOR').setValue('');
        this.dermatologicaForm.get('ID_HISTORIA').setValue(0);
        this.dermatologicaForm.get('ID_CITA').setValue(0);
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