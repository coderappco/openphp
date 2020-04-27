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
  	selector: 'app-odontologia',
  	templateUrl: './odontologia.component.html',
  	styleUrls: ['./odontologia.component.css']
})
export class OdontologiaComponent implements OnInit {

	odontologiaForm: FormGroup;
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
    convension: any = '2';
    imagen: any = 'assets/img/check.png';
    placab: any = 0;
    encias: any = 0;

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
            if(tipo.currentValue == 20 && pr) {
                if(pr.currentValue == true)
                    this.GenerarPdf(this.historia_id);
            }
	}

	ngAfterViewInit(): void {
  		var that = this;
  		$("input").prop('required',true);
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
            allowClear: true,
            multiple: true
        });
        $('.color').dialog({
            autoOpen: false,
        });
        $('.click').hover(function (event) {
            $(".color").dialog({
                position: {
                    my: "left+15 bottom-15",
                    of: event,
                    //collision: "flipfit"
                },
                maxWidth: "520",
                maxHeight: "220",
                height: "300",
                overflow: "auto",
                width: "37%"
            });
            $('.color').dialog('open');
        });
        $("span.ui-dialog-title").text('CONVENCIONES');

        $('.convencion').on("click", function (event) {
            that.convension = $(this).attr("pos");
            that.imagen = $(this).children().find('img')[0].attributes.src.nodeValue;
        });

        $('.click').on("click", function (event) {
        	let parent: any = $(this).parent();
        	let cuadro: any = $(this)[0].classList[0];
        	if(cuadro == 'cuadro') {
        		let img: any = $(this).children("img");
        		if($(img)[0].attributes.src.nodeValue == that.imagen)
        			$(img).prop('src','assets/img/white.png');
        		else
        			$(img).prop('src',that.imagen);
        	}
        	else {
	        	let center: any = $(parent).children(".centro.click");
	        	let img: any = $(center).children("img");
	        	if($(img)[0].attributes.src.nodeValue == that.imagen)
        			$(img).prop('src','assets/img/white.png');
                else
                    $(img).prop('src',that.imagen);
	        }

            switch (that.convension) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '10':
                case '12':
                case '13':
                case '14':
				case '15':
                case '19':
                    $(this).parent().children().each(function(index, el) {
                        if($(el).hasClass("click")) {
                            let cuadro: any = $(el)[0].classList[0];
				        	if(cuadro == 'cuadro') {
				        		let img: any = $(el).children("img");
                                $(img).prop('src','assets/img/white.png');
				        	}
				        	else {
					        	let img: any = $(el).children("img");
				        		$(img).prop('src',that.imagen);
					        }
                        }
                    });
                    break;
                default:
                    break;
			}
        });

        $('.clicks').on("click", function (event) {
            if($(this).hasClass("indiceorealy")) {
                $(this).removeClass("indiceorealy");
                var cant = 0;
                $('.clicks').each(function(index, el) {
                    if($(el).hasClass("indiceorealy"))
                        cant++;
                });
                that.placab = (cant*100/260).toFixed(1);
                that.encias = (cant*100/260).toFixed(1);
            }
            else {
                $(this).addClass("indiceorealy");
                var cant = 0;
                $('.clicks').each(function(index, el) {
                    if($(el).hasClass("indiceorealy"))
                        cant++;
                });
                that.placab = (cant*100/260).toFixed(1);
                that.encias = (cant*100/260).toFixed(1);
            }
        });
	}

  	initForm() {
        this.odontologiaForm = this.formBuilder.group({
            DATOSHISTORIA: [''],
            DATOSPACIENTE: [''],
            ID_HISTORIA: [''],
            DATOS: [''],
            PACIENTE: [''],
            PRESTADOR: [''],
            ID_CITA: [0],
            ODONTOGRAMA: [''],
            INDICE: [''],
        });
    }

    Cancelar() {
    	this.basica.emit(0);
    	this.clearAll();
    }

    Guardar() {
    	if(this.role == 'ADMINISTRADOR' && ($('#ID_USUARIO').val() == null || $('#ID_USUARIO').val() == '')) {
    		alert("Por favor, escoja el Prestador");
    		return false;
    	}
    	if($('#PACIENTE').val() == null || $('#PACIENTE').val() == '') {
    		alert("Por favor, escoja el paciente a generar el registro clínico.");
    		return false;
    	}
    	if(!confirm("Esta seguro de guardar el registro clínico?"))
    		return false;
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
        this.odontologiaForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.odontologiaForm.get('DATOSHISTORIA').setValue(datos);
    	this.odontologiaForm.get('DATOSPACIENTE').setValue(pac);
        this.odontologiaForm.get('DATOS').setValue(datos1);
        this.odontologiaForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.odontologiaForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.odontologiaForm.get('ID_CITA').setValue(this.id_cita);

        var od: any = [];
        $('.click').each(function() {
            let img: any = $(this).children("img");
            od.push([$(this).prop('id'),$(img)[0].attributes.src.nodeValue]);
        });
        this.odontologiaForm.get('ODONTOGRAMA').setValue(od);

        var ind: any = [];
        $('.clicks').each(function() {
            if($(this).hasClass("indiceorealy"))
                ind.push([$(this).prop('id'), 1]);
            else
                ind.push([$(this).prop('id'), 0]);
        });
        this.odontologiaForm.get('INDICE').setValue(ind);
        if(this.historia_id == 0) {
            this._loadingBar.progress = 50;
            this._loadingBar.start(() => {
                this._loadingBar.progress++;
            });
            this._loadingBar.stop();
	        this.historiasService.saveHistoriaPaciente(this.odontologiaForm.value)
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
            this._loadingBar.stop();
	    	this.historiasService.updateHistoriaPaciente(this.historia_id, this.odontologiaForm.value)
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
                var pdf = new jsPDF('p', 'px', 'a4');
                var div = document.createElement('div');
                var html = '';
                var header = '';
                var odon = da.odontologia;
                /*for(var i = 0; i < odon.length; i++) {
                    if(odon[i]['IMAGEN'] != null)
                        console.log(odon[i]['IMAGEN']);
                }*/
                html = this.Header(da.usuario.empresa.empresa,da.paciente,id);
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
                html = header + this.Page4(da);
                $(div3).prop('id', 'print'+4);
                $(div3).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div3).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+4),false);

                var div4 = document.createElement('div');
                html = header + this.Page5(da) + this.Prestador(da.usuario);
                $(div4).prop('id', 'print'+5);
                $(div4).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div4).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+5),true);
            }
        );
    }

    Page1(datos, page = null) {
        let motivo = datos[100]['VALOR'] != null ? datos[100]['VALOR'] : "";
        let enfermedad = datos[101]['VALOR'] != null ? datos[101]['VALOR'] : "";
        var imc = (datos[21]['VALOR'] != 0 && datos[22]['VALOR'] != 0) ? datos[22]['VALOR']/datos[21]['VALOR'] : 0;
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">MOTIVO DE CONSULTA:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+motivo+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">ENFERMEDAD ACTUAL:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+enfermedad+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">ANTECEDENTES FAMILIARES:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GENERALES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[4]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PATOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[5]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TOXICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[6]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FARMACOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[7]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALERGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[8]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">ANTECEDENTES PERSONALES:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Odontológicos:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[9]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Generales:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[10]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">GRUPO SANGINEO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[11]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PATOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[12]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TRAUMATICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[13]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INF. TRANSMISIÓN SEXUAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[14]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INMUNOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[15]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALERGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[16]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FARMACOLOGICOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[17]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS ANTECEDENTES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[18]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Observaciones:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[19]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN FISICO:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ASPECTO GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[20]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PESO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[21]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TALLA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[22]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">IMC:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+imc+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATICO DE PIEL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[24]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINTOMATICO RESPIRATORIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[25]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SINDROME FEBRIL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[26]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CABEZA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[27]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[28]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[29]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">SIGNOS VITALES:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA CARDIACA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[30]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRECUENCIA RESPIRATORIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[31]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TEMPERATURA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[32]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PRESION ARTERIAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[33]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[34]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page2(datos, page = null) {
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">FACTORES DE RIESGO SALUD MENTAL:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APARIENCIA GENERAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[35]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ATENCION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[36]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MEMORIA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[37]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALTERACION DEL SUEÑO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[38]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">APETITO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[39]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PENSAMIENTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[40]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SOMATIZACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[41]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">INTROSPECCION Y PROSPECCION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[42]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">AFECTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[43]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN ESTOMATOLOGICO TEJIDOS BLANDOS:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LABIO SUPERIOR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[44]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LABIO INFERIOR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[45]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">COMISURAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[46]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MUCOSA ORAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[47]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SURCOS YUGALES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[48]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FRENILLO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[49]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PALADAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[50]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OROFARINGE:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[51]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LENGUA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[52]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PISO DE BOCA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[53]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">REBORDES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[54]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">G SALIVARES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[55]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS HALLAZGOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[56]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN ESTOMATOLOGICO ATM Oclusión:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DOLOR MUSCULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[57]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DOLOR ARTICULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[58]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RUIDO ARTICULAR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[59]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALTERAC. MOVIMIENTO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[60]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MALOCLUSIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[61]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">C Y D:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[62]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS HALLAZGOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[63]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN ESTOMATOLOGICO Tejidos Dentales:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CAMBIO FORMA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[64]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CAMBIO TAMAÑO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[65]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CAMBIO NUMERO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[66]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CAMBIO COLOR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[67]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CAMBIO POSICION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[68]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">IMPACTADOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[69]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS HALLAZGOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[70]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN ESTOMATOLOGICO Periodontal:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SANGRADO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[71]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MOVILIDAD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[72]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">RESECCIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[73]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">BOLSA PERIODONTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[74]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CALCULOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[75]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ABSCESOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[76]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PLACA BACTERIANA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[77]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ENCIAS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[78]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS HALLAZGOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[79]['VALOR']+'</div>' +
                '</div>';
        return html;
    }

    Page3(datos, da, page = null) {
        var diag = da.diagnosticos;
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">EXAMEN ESTOMATOLOGICO Pulpar:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">ALTERAC. VITALIDAD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[80]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DOLOR PERCUSION:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[81]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">MOVILIDAD DENTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[82]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SENSIBILIDAD:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[83]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">FISTULA:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[84]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">DIENTES TRATADOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[85]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OTROS HALLAZGOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[86]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">HISTORIA CLINICA DE ACCION PROVENTIVA:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">A RECIBIDO CHARLAS DE HIGIENE ORAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[87]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PRACTICA CEPILLADO DIARIO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[88]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">USA SEDA DENTAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[89]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">USA ENJUAGUE BUCAL:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[90]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LE HAN APLICADO FLUOR:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[91]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">LE HAN APLICADO SELLANTES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[92]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[93]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">DIAGNOSTICO INGRESO:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>';
                for(var i in diag) {
                    html += '<div class="col-md-12" style="text-transform: uppercase !important;">'+diag[i]['diagnostico']['COD_DIAGNOSTICO']+" "+diag[i]['diagnostico']['NOM_DIAGNOSTICO']+'</div>';
                }
                html += '</div>' +
                '<div class="row">' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">TIPO DE DIAGNOSTICO:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[94]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBSERVACIONES:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[95]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">COP - ceo:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">CARIADOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[96]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">OBTURADOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[97]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">PERDIDOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[98]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">SANOS:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[99]['VALOR']+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">TRATAMIENTO REALIZADO:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[102]['VALOR'] != null ? datos[102]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">PRONOSTICO:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[103]['VALOR'] != null ? datos[103]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">PLAN DE TRATAMIENTO:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(datos[104]['VALOR'] != null ? datos[104]['VALOR'] : "")+'</div>' +
                '</div>';
        return html;
    }

    Page4(da, page = null) {
        var odon = da.odontologia;
        var eralhtml = '',erarhtml = '';
        var dalhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml = '';
        var ralhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml = '',talhtml = '',tarhtml = '';
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">ODONTOGRAMA INICIAL:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '</div>';
                if(da.odontologiainc != null && da.odontologiainc.length > 0) {
                    var eralhtmlini = '',erarhtmlini = '';
                    var dalhtmlini = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
                    var darhtmlini = '';
                    var ralhtmlini = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
                    var rarhtmlini = '',talhtmlini = '',tarhtmlini = '';
                    var odonini = da.odontologiainc;
                    for(var j = 0; j < odonini.length; j++) {
                        if(j <= 39) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            eralhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 40 && j <= 79) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            erarhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 80 && j <= 104) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            dalhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 105 && j <= 129) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            darhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 130 && j <= 154) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            ralhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 155 && j <= 179) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            rarhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 180 && j <= 219) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            talhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                        else
                        if(j >= 220) {
                            let num = odonini[j]['CAMPO'].slice(odonini[j]['CAMPO'].length - 2);
                            tarhtmlini += '<div class="diente">' +
                                    '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                    '<div id="'+odonini[j]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odonini[j]['IMAGEN'] != null ? odonini[j]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odonini[j+1]['IMAGEN'] != null ? odonini[j+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odonini[j+2]['IMAGEN'] != null ? odonini[j+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odonini[j+3]['IMAGEN'] != null ? odonini[j+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                    '<div id="'+odonini[j+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odonini[j+4]['IMAGEN'] != null ? odonini[j+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                    '</div>';
                            j = j + 4;
                        }
                    }
                    html += '<div class="row col-md-12" style="margin: 0; padding: 0">' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+eralhtmlini+'</div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+erarhtmlini+'</div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+dalhtmlini+'</div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+darhtmlini+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+ralhtmlini+'</div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+rarhtmlini+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+talhtmlini+'</div>' +
                            '<div class="col-md-6" style="margin-left: -20px;">'+tarhtmlini+'</div>' +
                            '</div>';
                }
                html += '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">ODONTOGRAMA:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '</div>';
                for(var i = 0; i < odon.length; i++) {
                    if(i <= 39) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        eralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 40 && i <= 79) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        erarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 80 && i <= 104) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        dalhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 105 && i <= 129) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        darhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 130 && i <= 154) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        ralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 155 && i <= 179) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        rarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 180 && i <= 219) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        talhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 220) {
                        let num = odon[i]['CAMPO'].slice(odon[i]['CAMPO'].length - 2);
                        tarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+odon[i]['CAMPO']+'" class="cuadro up click text-center"><img src="'+(odon[i]['IMAGEN'] != null ? odon[i]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro izquierdo click text-center"><img src="'+(odon[i+1]['IMAGEN'] != null ? odon[i+1]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro debajo click text-center"><img src="'+(odon[i+2]['IMAGEN'] != null ? odon[i+2]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro derecha click text-center"><img src="'+(odon[i+3]['IMAGEN'] != null ? odon[i+3]['IMAGEN'] : 'assets/img/white.png')+'" width="15"/></div>' +
                                '<div id="'+odon[i+4]['CAMPO']+'" class="centro click text-center"><img src="'+(odon[i+4]['IMAGEN'] != null ? odon[i+4]['IMAGEN'] : 'assets/img/white.png')+'"/></div>' +
                                '</div>';
                        i = i + 4;
                    }
                }
                html += '<div class="row col-md-12" style="margin: 0; padding: 0">' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+eralhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+erarhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+dalhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+darhtml+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+ralhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+rarhtml+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+talhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+tarhtml+'</div>' +
                        '</div>';
        return html;
    }

    Page5(da) {
        var indi = da.indice;
        var eralhtml = '',erarhtml = '';
        var dalhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml = '';
        var ralhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml = '',talhtml = '',tarhtml = '';
        var html = '<div class="row" style="margin-bottom: 1rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;flex: 0 0 99%;font-size: 12px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;">INDICE OLEARY:</div>' +
                '<div style="width:100%;box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #aaaaaa;"></div>' +
                '</div>';
                for(var i = 0; i < indi.length; i++) {
                    if(i <= 24) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        dalhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 25 && i <= 49) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        darhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 50 && i <= 89) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        eralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 90 && i <= 129) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        erarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 130 && i <= 169) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        talhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 170 && i <= 209) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        tarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 210 && i <= 234) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        ralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                    else
                    if(i >= 135) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        rarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="centro clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 4;
                    }
                }
                html += '<div class="row col-md-12" style="margin: 0; padding: 0">' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+dalhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+darhtml+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+eralhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+erarhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+talhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+tarhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+ralhtml+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+rarhtml+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
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
                '<div class="col-md-12 text-center"><h3>HISTORIA CLINICA ODONTOLOGICA</h3></div>';
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
            height = (height-30 > 595) ? 595 : height-30;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 20, 20, width-30, height);
            pdf.setFontSize(7);
            let pagen: any = 'Página No: '+ (pdf.internal.getNumberOfPages() - 1);
            pdf.setLineWidth(0.1); 
            pdf.line(20, 600, width-20, 600);
            pdf.text(pagen, 20, 605);
            if(terminar == true) {
                pdf.deletePage(1)
                that.print = false;
                $('#print').empty();
                that.tipo_id.emit(0);
                /*pdf.autoPrint();
                pdf.save('HISTORIACLINICAODONTOLOGICA.pdf');*/
                pdf.autoPrint();
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
        this.odontologiaForm.get('DATOSHISTORIA').setValue('');
        this.odontologiaForm.get('DATOSPACIENTE').setValue('');
        this.odontologiaForm.get('DATOS').setValue('');
        this.odontologiaForm.get('PACIENTE').setValue('');
        this.odontologiaForm.get('PRESTADOR').setValue('');
        this.odontologiaForm.get('ID_HISTORIA').setValue(0);
        this.odontologiaForm.get('ID_CITA').setValue(0);
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
