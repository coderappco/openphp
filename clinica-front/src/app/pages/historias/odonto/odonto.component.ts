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
  selector: 'app-odonto',
  templateUrl: './odonto.component.html',
  styleUrls: ['./odonto.component.css']
})
export class OdontoComponent implements OnInit {

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
    odon_list: any = [];
    tipos: any = 0;
    valor: any = '';
    padre: any = '';
    diag_id: any = 0;
    trat_list: any = [];
    tipost: any = 0;
    valort: any = '';
    hijo: any = '';
    trat_id: any = 0;
    valores: any = [];
    valorest: any = [];
    diagnostico: any = '';
    tratamiento: any = '';
    diente: any = '';
    superficie: any = '';
    image: any = '';
    white: any = '';
    imaget: any = '';
    id_trat: any = 0;
    id_diag: any = 0;
    obs: any = '';

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
            if(his.currentValue != 0) {
                this.historia_id = his.currentValue;
                this.valores = [];
    			this.valorest = [];
            }
            else {
                his.previousValue = 0;
                this.historia_id = 0;
                this.valores = [];
    			this.valorest = [];
            }
        if(tipo)
            if(tipo.currentValue == 20 && pr) {
                if(pr.currentValue == true)
                    this.GenerarPdf(this.historia_id);
            }
	}

	ngAfterViewInit(): void {
  		var that = this;
  		$('[data-toggle="tooltip"]').tooltip();
        $('.diag_odon').dialog({
            autoOpen: false,
        });
  		$('.diag_odon').dialog('destroy');
        $('.diag_odon').dialog({
            autoOpen: false,
        });
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
        $('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
        $("#ID_DIAG_PADRE").select2({
			templateResult: that.formatData,
			templateSelection: that.formatData,
			dropdownAutoWidth:!0,
            width:"100%"
		});
		$("#ID_TRAT_PADRE").select2({
			templateResult: that.formatData,
			templateSelection: that.formatData,
			dropdownAutoWidth:!0,
            width:"100%"
		});
        this.codifService.getDiagnosticoOdon()
        	.subscribe(data => {
        		let da: any = data;
        		this.odon_list = da;
        	})
        this.codifService.getTratamientosOdon()
        	.subscribe(data => {
        		let da: any = data;
        		this.trat_list = da;
        	})
        let us = JSON.parse(localStorage.getItem('currentUser'));
		this.role = us.role;
		this.id_user = us.user.ID_USUARIO;
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
        $('#DIAGNOSTICOA').select2({
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
        $('#DIAGNOSTICOP').select2({
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
        $('#DIAGNOSTICOPE').select2({
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
        $('#DIAGNOSTICOT').select2({
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
        $('#DIAGNOSTICOOT').select2({
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
        $('#DIAGNOSTICOPR').select2({
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
        $('#ID_DIAG_PADRE').on("change", function (e) {
        	that.tipos = $('#ID_DIAG_PADRE option:selected').attr('tipo');
        	that.valor = $('#ID_DIAG_PADRE option:selected').attr('valor');
        	that.diag_id = $(this).val();
            if(that.tipos == 1) {
                var img = document.createElement('img');
                img.src = that.globals.urlDomain + 'assets/img/odontologia/'+that.valor;
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                that.image = dataURL;
            }
        });
        $('#ID_TRAT_PADRE').on("change", function (e) {
        	that.tipost = $('#ID_TRAT_PADRE option:selected').attr('tipo');
        	that.valort = $('#ID_TRAT_PADRE option:selected').attr('valor');
        	that.trat_id = $(this).val();
            if(that.tipost == 1) {
                var img = document.createElement('img');
                img.src = that.globals.urlDomain + 'assets/img/odontologia/'+that.valort;
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                that.imaget = dataURL;
            }
        });
        $('.mostrard').hover(function (event) {          
            $('.diag_odon').dialog({
                autoOpen: false,
            });
            $('.diag_odon').dialog('destroy');
            $('.diag_odon').dialog({
                autoOpen: false,
            });
        });
        $('.navigation').hover(function (event) {          
            $('.diag_odon').dialog({
                autoOpen: false,
            });
            $('.diag_odon').dialog('destroy');
            $('.diag_odon').dialog({
                autoOpen: false,
            });
        });
        $('.diente').hover(function (event) {
        	that.padre = $(this);
        	if(that.historia_id != 0) {
	        	that.historiasService.getDatosDiente(that.historia_id, $(this).attr('name'))
	        		.subscribe(data => {
	        			let da: any = data;
	        			var htmld = '';
	        			for(var i in da.diagnostico) {
                            let extd: any = false;
	        				if(da.diagnostico[i]['diagnosticos'] !== null) {
                                if(that.valores.length > 0) {
                                    for(var j in that.valores) {
                                        if(that.valores[j].ind == $(this).attr('name')) {
                                            extd = true;
                                        }
                                    }
                                }
                                if(extd == false)
                                    htmld += '<div class="listview__item" id="diag'+$(this).attr('name')+da.diagnostico[i]['NAME']+'"><div class="listview__content">' +
						                '<div class="listview__heading">'+da.diagnostico[i]['diagnosticos']['CODIGO']+" "+da.diagnostico[i]['diagnosticos']['DESCRIPCION']+'</div>'+
						                '<div class="listview__attrs"><span>Superficie: '+da.diagnostico[i]['NAME']+'</span>'+
						                '</div></div><div class="actions listview__actions">'+(da.tratamiento[i] != null && da.tratamiento[i]['EVOLUCION'] != 1 ? '<i class="actions__item zmdi zmdi-delete deldiagh" super="'+da.diagnostico[i]['NAME']+'" title="Eliminar Diagnóstico" data-toggle="tooltip"></i>' : 'Tratamiento finalizado') +
						            	'</div></div>';
	        				}
	        			}
	        			var htmlt = '';
	        			for(var i in da.tratamiento) {
                            let extt: any = false;
	        				if(da.tratamiento[i].tratamientos != null) {
                                if(that.valorest.length > 0) {
                                    for(var j in that.valorest) {
                                        if(that.valorest[j].ind == $(this).attr('name')) {
                                            extt = true;
                                        }
                                    }
                                }
                                if(extt == false)
                                    htmlt += '<div class="listview__item" id="trat'+$(this).attr('name')+da.tratamiento[i]['NAME']+'"><div class="listview__content">' +
						                '<div class="listview__heading">'+da.tratamiento[i]['tratamientos']['CODIGO']+" "+da.tratamiento[i]['tratamientos']['DESCRIPCION']+'</div>'+
						                '<div class="listview__attrs"><span>Superficie: '+da.tratamiento[i]['NAME']+'</span>'+
						                '</div></div><div class="actions listview__actions">'+(da.tratamiento[i] != null && da.tratamiento[i]['EVOLUCION'] != 1 ? '<i class="actions__item zmdi zmdi-assignment-account evolucion" title="Evolucionar" data-toggle="tooltip" trat_id="'+da.tratamiento[i].TRATAMIENTO+'" super="'+da.tratamiento[i]['NAME']+'"></i><i class="actions__item zmdi zmdi-delete deltrath" super="'+da.tratamiento[i]['NAME']+'" title="Eliminar Tratamiento" data-toggle="tooltip"></i>' : 'Tratamiento finalizado') +
						            	'</div></div>';
	        				}
	        			}
						if(that.valores.length > 0) {
							for(var i in that.valores) {
					        	if(that.valores[i].ind == $(this).attr('name')) {
					        		htmld += '<div class="listview__item" id="diag'+that.valores[i].ind+that.valores[i].name+'"><div class="listview__content">' +
								    '<div class="listview__heading">'+that.valores[i].valor+'</div>'+
								    '<div class="listview__attrs"><span>Superficie: '+that.valores[i].name+'</span>'+
								    '</div></div><div class="actions listview__actions">'+((that.valorest[i] == null || that.valorest[i].evol == 0) ? '<i class="actions__item zmdi zmdi-delete deldiag" super="'+that.valores[i].name+'" title="Eliminar Diagnóstico" data-toggle="tooltip"></i>' : 'Tratamiento finalizado') +
								    '</div></div>';
					        	}
					        }
			        	}
						if(that.valorest.length > 0) {
							for(var i in that.valorest) {
					        	if(that.valorest[i].ind == $(this).attr('name')) {
					        		htmlt += '<div class="listview__item" id="trat'+that.valorest[i].ind+that.valorest[i].name+'"><div class="listview__content">' +
								    '<div class="listview__heading">'+that.valorest[i].valor+'</div>'+
								    '<div class="listview__attrs"><span>Superficie: '+that.valorest[i].name+'</span>'+
								    '</div></div><div class="actions listview__actions">'+(that.valorest[i].evol == 0 ? '<i class="actions__item zmdi zmdi-assignment-account evolucion" obs="'+(that.valorest[i].obs != null ? that.valorest[i].obs : '')+'" diag_id="'+(that.valores[i] != null ? that.valores[i].diag_id : 0)+'" trat_id="'+that.valorest[i].trat+'" super="'+that.valorest[i].name+'" title="Evolucionar" data-toggle="tooltip"></i><i class="actions__item zmdi zmdi-delete deltrat" super="'+that.valorest[i].name+'" title="Eliminar Tratamiento" data-toggle="tooltip"></i>' : 'Tratamiento finalizado')+
								    '</div></div>';
					        	}
					        }
			        	}
                        if(htmld != '' || htmlt != '') {
                            $(".diag_odon").dialog({
                                position: {
                                    my: "left+30 top-15",
                                    of: that.padre,
                                },
                                maxWidth: "520",
                                height: "300",
                                overflow: "auto",
                                width: "37%",
                            });
                            $('#diag').html(htmld);
                            $('#trat').html(htmlt);
                            $('[data-toggle="tooltip"]').tooltip();
                            $("span.ui-dialog-title").text("Información del diente número " + $(this).attr('name'));
                            $('.diag_odon').dialog('open');
                        }
                        else {
                            $('.diag_odon').dialog({
                                autoOpen: false,
                            });
                            $('.diag_odon').dialog('destroy');
                            $('.diag_odon').dialog({
                                autoOpen: false,
                            });
                            /*if ($("#infoMsj").data("ui-dialog")) {
                                $("#infoMsj").dialog("destroy");
                            }*/
                        }
	        		})
			}
			else {
				var htmld = '';
				if(that.valores.length > 0) {
					for(var i in that.valores) {
			        	if(that.valores[i].ind == $(this).attr('name')) {
			        		htmld += '<div class="listview__item" id="diag'+that.valores[i].ind+that.valores[i].name+'"><div class="listview__content">' +
						    '<div class="listview__heading">'+that.valores[i].valor+'</div>'+
						    '<div class="listview__attrs"><span>Superficie: '+that.valores[i].name+'</span>'+
						    '</div></div><div class="actions listview__actions">'+((that.valorest[i] == null || that.valorest[i].evol == 0) ? '<i class="actions__item zmdi zmdi-delete deldiag" super="'+that.valores[i].name+'" title="Eliminar Diagnóstico" data-toggle="tooltip"></i>' : 'Tratamiento finalizado') +
						    '</div></div>';
			        	}
			        }
			        $('#diag').html(htmld);
	        	}
	        	var htmlt = '';
				if(that.valorest.length > 0) {
					for(var i in that.valorest) {
			        	if(that.valorest[i].ind == $(this).attr('name')) {
			        		htmlt += '<div class="listview__item" id="trat'+that.valorest[i].ind+that.valorest[i].name+'"><div class="listview__content">' +
						    '<div class="listview__heading">'+that.valorest[i].valor+'</div>'+
						    '<div class="listview__attrs"><span>Superficie: '+that.valorest[i].name+'</span>'+
						    '</div></div><div class="actions listview__actions">'+(that.valorest[i].evol == 0 ? '<i class="actions__item zmdi zmdi-assignment-account evolucion" obs="'+(that.valorest[i].obs != null ? that.valorest[i].obs : '')+'" diag_id="'+(that.valores[i] != null ? that.valores[i].diag_id : 0)+'" trat_id="'+that.valorest[i].trat+'" super="'+that.valorest[i].name+'" title="Evolucionar" data-toggle="tooltip"></i><i class="actions__item zmdi zmdi-delete deltrat" super="'+that.valorest[i].name+'" title="Eliminar Tratamiento" data-toggle="tooltip"></i>' : 'Tratamiento finalizado')+
						    '</div></div>';
			        	}
			        }
			        $('#trat').html(htmlt);
	        	}
			    $('[data-toggle="tooltip"]').tooltip();               
                if(htmld != '' || htmlt != '') {
                    $('.diag_odon').dialog('destroy');
                    /*setTimeout(() => 
                    {*/
                        $(".diag_odon").dialog({
                            position: {
                                my: "left+30 top+25",
                                of: that.padre,
                            },
                            maxWidth: "520",
                            maxHeight: "220",
                            height: "300",
                            overflow: "auto",
                            width: "37%",
                        });
                        $("span.ui-dialog-title").text("Información del diente número " + $(this).attr('name'));
                        $('.diag_odon').dialog('open');
                   // },0);
                }
                else {
                    $('.diag_odon').dialog({
                        autoOpen: false,
                    });
                    $('.diag_odon').dialog('destroy');
                    $('.diag_odon').dialog({
                        autoOpen: false,
                    });
                }                    
			}	
        });
		$('#diag').on('click', '.deldiag', function (e) {console.log(1);
        	if(that.historia_id == 0) {
        		that.deleteDiag($(this).attr('super'));
        	}
        });
        $('#trat').on('click', '.deltrat', function (e) {console.log(2);
        	if(that.historia_id == 0) {
        		that.deleteTrat($(this).attr('super'));
        	}
        });
        $('#diag').on('click', '.deldiagh', function (e) {console.log(3);
        	that.deleteDiagH($(this).attr('super'));
        });
        $('#trat').on('click', '.deltrath', function (e) {console.log(4);
        	that.deleteTratH($(this).attr('super'));
        });
        $('.pruebap').on('click', function (e) {
            console.log(3);
        });
        $('#trat').on('click', '.pruebap', function (e) {
            console.log(2);
        });
        $('#boton').on('click', function (e) {
            console.log(1);
        });
        $('#trat').on('click', '.evolucion', function (e) {
            that.id_trat = $(this).attr('trat_id');
            that.id_diag = $(this).attr('diag_id');
            that.obs = $(this).attr('obs');
            that.ShowEvolucion($(this).attr('super'));
        });
        $('.click').on("click", function (event) {
        	let parent: any = $(this).parent();
        	let cuadro: any = $(this)[0].classList[0];
        	let img: any = $(this).children("img");
        	if(that.tipos != '') {
	        	if(that.tipos == 1) {
	        		let im: any = 'assets/img/odontologia/' + that.valor;
	        		$(this).prop('style', 'background-color: #FFFFFF;');
		        	/*if($(img)[0].attributes.src.nodeValue == im) {
		        		$(img).prop('src', this.globals.whiteimg);
		        		$(this).prop('diag', '0');
		        	}
		        	else {
		        		$(img).prop('src', im);
		        		$(this).prop('diag', that.diag_id);
		        	}*/
                    $(img).prop('src', im);
                    $(this).prop('diag', that.diag_id);
                    $(this).prop('tipo', that.tipos);
                    $(this).prop('valor', that.image);
		        }
		        else {
		        	let div = document.createElement('div');
		        	$(div).prop('style', 'background-color: #'+ that.valor + ';');
		        	document.body.appendChild(div);
		        	let sty: any = $(this).css("background-color");
		        	$(img).prop('src', ''+that.globals.whiteimg+'');
		        	/*if($(div).css("background-color") == $(this).css("background-color")) {
		        		$(this).prop('style', 'background-color: #FFFFFF;');
		        		$(this).prop('diag', '0');
		        	}
		        	else {
		        		$(this).prop('style', 'background-color: #'+ that.valor + ';');
		        		$(this).prop('diag', that.diag_id);
		        	}*/
                    $(this).prop('style', 'background-color: #'+ that.valor + ';');
                    $(this).prop('diag', that.diag_id);
		        	$(div).remove();
		        }

		        that.codifService.getDiagOdontologia(that.diag_id)
		        	.subscribe(data => {
		        		let da: any = data;
		        		let existe = false;
		        		let dele = false;
		        		let pos: any = 0;
		        		let name = $(this).attr('name');
		        		for(var i in that.valores) {
			        		if(that.valores[i].ind == parent[0].attributes.name.value && that.valores[i].name == name && that.valores[i].valor == da.CODIGO + " " + da.DESCRIPCION) {
			        			dele = true;
			        			pos = i;
			        		}
			        		else
			        		if(that.valores[i].ind == parent[0].attributes.name.value && that.valores[i].name == name) {
			        			existe = true;
			        			pos = i;
			        		}
			        	}
			        	if(dele == true)
			        		that.valores.splice(pos, 1);
			        	else
			        	if(existe == false)
			        		that.valores.push({'ind': parent[0].attributes.name.value, 'name': name, 'valor': da.CODIGO + " " + da.DESCRIPCION, 'diag_id': that.diag_id});
			        	else {
			        		that.valores.splice(pos, 1, {'ind': parent[0].attributes.name.value, 'name': name, 'valor': da.CODIGO + " " + da.DESCRIPCION, 'diag_id': that.diag_id})
			        	}
		        	})
		    }

            /*switch (that.convension) {
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
                                $(img).prop('src',this.globals.whiteimg);
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
			}*/
        });

		$('.clickt').on("click", function (event) {
        	let parent: any = $(this).parent();
        	let cuadro: any = $(this)[0].classList[0];
        	let img: any = $(this).children("img");
        	/*if(that.valores.length == 0) {
        		alert("No existen diagnósticos asignados al diente dientes, por favor asigne al menos uno");
        		return false;
        	}
        	else {
        		let name = $(this).attr('name');
        		let existe = false;
        		for(var i in that.valores) {
        			if(that.valores[i].ind == parent[0].attributes.name.value && that.valores[i].name == name)
        				existe = true;
        		}
        		if(existe == false) {
        			alert("No existen diagnósticos asignados a la superficie del diente seleccionado, por favor asigne uno");
        			return false;
        		}
        	}*/
        	if(that.tipost != '') {
	        	if(that.tipost == 1) {
	        		let im: any = 'assets/img/odontologia/' + that.valort;
	        		$(this).prop('style', 'background-color: #FFFFFF;');
		        	/*if($(img)[0].attributes.src.nodeValue == im) {
		        		$(img).prop('src', this.globals.whiteimg);
		        		$(this).prop('trat', '0');
		        	}
		        	else {
		        		$(img).prop('src', im);
		        		$(this).prop('trat', that.trat_id);
		        	}*/
                    $(img).prop('src', im);
                    $(this).prop('trat', that.trat_id);
                    $(this).prop('tipo', that.tipost);
                    $(this).prop('valor', that.imaget);
		        }
		        else {
		        	let div = document.createElement('div');
		        	$(div).prop('style', 'background-color: #'+ that.valort + ';');
		        	document.body.appendChild(div);
		        	let sty: any = $(this).css("background-color");
		        	$(img).prop('src', that.globals.whiteimg);
		        	/*if($(div).css("background-color") == $(this).css("background-color")) {
		        		$(this).prop('style', 'background-color: #FFFFFF;');
		        		$(this).prop('trat', '0');
		        	}
		        	else {
		        		$(this).prop('style', 'background-color: #'+ that.valort + ';');
		        		$(this).prop('trat', that.trat_id);
		        	}*/
                    $(this).prop('style', 'background-color: #'+ that.valort + ';');
                    $(this).prop('trat', that.trat_id);
		        	$(div).remove();
		        }

		        that.codifService.getTratOdontologia(that.trat_id)
		        	.subscribe(data => {
		        		let da: any = data;
		        		let existe = false;
		        		let dele = false;
		        		let pos: any = 0;
		        		let name = $(this).attr('name');
		        		for(var i in that.valorest) {
			        		if(that.valorest[i].ind == parent[0].attributes.name.value && that.valorest[i].name == name && that.valorest[i].valor == da.CODIGO + " " + da.DESCRIPCION) {
			        			dele = true;
			        			pos = i;
			        		}
			        		else
			        		if(that.valorest[i].ind == parent[0].attributes.name.value && that.valorest[i].name == name) {
			        			existe = true;
			        			pos = i;
			        		}
			        	}
			        	if(dele == true)
			        		that.valorest.splice(pos, 1);
			        	else
			        	if(existe == false)
			        		that.valorest.push({'ind': parent[0].attributes.name.value, 'name': name, 'valor': da.CODIGO + " " + da.DESCRIPCION, 'trat': that.trat_id, 'evol' : 0});
			        	else {
			        		that.valorest.splice(pos, 1, {'ind': parent[0].attributes.name.value, 'name': name, 'valor': da.CODIGO + " " + da.DESCRIPCION, 'trat': that.trat_id, 'evol' : 0})
			        	}
		        	})
		    }

            /*switch (that.convension) {
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
                                $(img).prop('src',this.globals.whiteimg);
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
			}*/
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
            TRATAMIENTOS: [''],
            CONSENTIMIENTOS: [''],
        });
    }

    deleteDiag(superficie) {
		let div: any = document.getElementById('rowdiag');
		let divd: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
		let img: any = $(divd).children("img");
    	$(img).prop('src', this.globals.whiteimg);
		$(divd).prop('diag', '0');
		$(divd).prop('style', 'background-color: #FFFFFF;');
        $(divd).prop('tipo', '0');
        $(divd).prop('valor', '');
		div = document.getElementById('rowtrat');
		let divt: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
		let imgt: any = $(divt).children("img");
    	$(imgt).prop('src', this.globals.whiteimg);
		$(divt).prop('trat', '0');
		$(divt).prop('style', 'background-color: #FFFFFF;');
        $(divt).prop('tipo', '0');
        $(divt).prop('valor', '');
		let id_del: any = "diag"+$(this.padre).attr('name')+superficie;
		let obj: any = document.getElementById(id_del);
		$(obj).remove();
		let id_delt: any = "trat"+$(this.padre).attr('name')+superficie;
		let objt: any = document.getElementById(id_delt);
		$(objt).remove();
		let pos: any = 0;
		for(var i in this.valores) {
			if(this.valores[i].ind == $(this.padre).attr('name') && this.valores[i].name == superficie) {
			    pos = i;
			}
		}
		this.valores.splice(pos, 1);
		this.valorest.splice(pos, 1);
    }

    deleteTrat(superficie) {
    	let div:any = document.getElementById('rowtrat');
		let divt: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
		let imgt: any = $(divt).children("img");
    	$(imgt).prop('src', this.globals.whiteimg);
		$(divt).prop('trat', '0');
		$(divt).prop('style', 'background-color: #FFFFFF;');
        $(divt).prop('tipo', '0');
        $(divt).prop('valor', '');
		let id_delt: any = "trat"+$(this.padre).attr('name')+superficie;
		let objt: any = document.getElementById(id_delt);
		$(objt).remove();
		let pos: any = 0;
		for(var i in this.valorest) {
			if(this.valorest[i].ind == $(this.padre).attr('name') && this.valorest[i].name == superficie) {
			    pos = i;
			}
		}
		this.valorest.splice(pos, 1);
    }

    deleteDiagH(superficie) {
    	this.historiasService.getHistoriaOdTra(this.historia_id, $(this.padre).attr('name'), superficie, 1)
    		.subscribe(data => {
    			let da: any = data;
    			this.showMessage("Diagnóstico eliminado");
    			let div: any = document.getElementById('rowdiag');
				let divd: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
				let img: any = $(divd).children("img");
		    	$(img).prop('src', this.globals.whiteimg);
				$(divd).prop('diag', '0');
				$(divd).prop('style', 'background-color: #FFFFFF;');
                $(divd).prop('tipo', '0');
                $(divd).prop('valor', '');
				div = document.getElementById('rowtrat');
				let divt: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
				let imgt: any = $(divt).children("img");
		    	$(imgt).prop('src', this.globals.whiteimg);
				$(divt).prop('trat', '0');
				$(divt).prop('style', 'background-color: #FFFFFF;');
                $(divt).prop('tipo', '0');
                $(divt).prop('valor', '');
				let id_del: any = "diag"+$(this.padre).attr('name')+superficie;
				let obj: any = document.getElementById(id_del);
				$(obj).remove();
				let id_delt: any = "trat"+$(this.padre).attr('name')+superficie;
				let objt: any = document.getElementById(id_delt);
				$(objt).remove();
				let pos: any = 0;
				for(var i in this.valores) {
					if(this.valores[i].ind == $(this.padre).attr('name') && this.valores[i].name == superficie) {
					    pos = i;
					}
				}
				this.valores.splice(pos, 1);
				this.valorest.splice(pos, 1);
    		})
    }

    deleteTratH(superficie) {
    	this.historiasService.getHistoriaOdTra(this.historia_id, $(this.padre).attr('name'), superficie, 0)
    		.subscribe(data => {
    			let da: any = data;
    			this.showMessage("Tratamiento eliminado");
		    	let div:any = document.getElementById('rowtrat');
				let divt: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+superficie+'"]');
				let imgt: any = $(divt).children("img");
		    	$(imgt).prop('src', this.globals.whiteimg);
				$(divt).prop('trat', '0');
				$(divt).prop('style', 'background-color: #FFFFFF;');
                $(divt).prop('tipo', '0');
                $(divt).prop('valor', '');
				let id_delt: any = "trat"+$(this.padre).attr('name')+superficie;
				let objt: any = document.getElementById(id_delt);
				$(objt).remove();
				let pos: any = 0;
				for(var j in this.valorest) {
					if(this.valorest[j].ind == $(this.padre).attr('name') && this.valorest[j].name == superficie) {
					    pos = j;
					}
				}
				this.valorest.splice(pos, 1);
			})
    }

    ShowEvolucion(superficie) {
        if(this.historia_id != 0) {
            this.historiasService.getEvolucionar(this.historia_id, $(this.padre).attr('name'), superficie)
                .subscribe(data => {
                    let da: any = data;
                    if(da.diagnostico.diagnosticos == null) {
                        var existed = false;
                        for(var i in this.valores) {
                            if(this.valores[i].ind == $(this.padre).attr('name') && this.valores[i].name == superficie) {
                                existed = true;
                            }
                        }
                        this.diagnostico = (existed == true ? this.valores[i].valor : 'Sin Diagnóstico');
                    }
                    else
                        this.diagnostico = (da.diagnostico.diagnosticos != null ? da.diagnostico.diagnosticos.CODIGO + " " + da.diagnostico.diagnosticos.DESCRIPCION : "Sin diagnóstico");
                    if(da.tratamiento.tratamientos == null) {
                        var existet = false;
                        for(var i in this.valorest) {
                            if(this.valorest[i].ind == $(this.padre).attr('name') && this.valorest[i].name == superficie) {
                                existet = true;
                            }
                        }
                        this.tratamiento = (existet == true ? this.valorest[i].valor : 'Sin Tratamiento');
                    }
                    else
                        this.tratamiento = (da.tratamiento.tratamientos != null ? da.tratamiento.tratamientos.CODIGO + " " + da.tratamiento.tratamientos.DESCRIPCION : "Sin tratamiento");
                    this.diente = da.tratamiento.DIENTE;
                    this.superficie = da.tratamiento.NAME;
                    let evol: any = (da.tratamiento.OBSERVACION != null ? da.tratamiento.OBSERVACION : (this.obs != '' && this.obs != null ? this.obs : ''));
                    $('#evoluciont').val(evol);
                    $('.diag_odon').dialog({
                        autoOpen: false,
                    });
                    $('.diag_odon').dialog('destroy');
                    $('#evolucion').modal('show');
                })
        }
        else {
            this.codifService.getDiagTrat(this.id_diag, this.id_trat)
                .subscribe(data => {
                    let da: any = data;
                    this.diagnostico = (da.diag != null ? da.diag.CODIGO + " " + da.diag.DESCRIPCION : "Sin diagnóstico");
                    this.tratamiento = da.trat.CODIGO + " " + da.trat.DESCRIPCION;
                    this.diente = $(this.padre).attr('name');
                    this.superficie = superficie;
                    let evol: any = this.obs;
                    $('#evoluciont').val(evol);
                    $('.diag_odon').dialog({
                        autoOpen: false,
                    });
                    $('.diag_odon').dialog('destroy');
                    $('#evolucion').modal('show');
                })
        }
    }

    Cancel() {
        $('#evolucion').modal('hide');
        this.diagnostico = '';
        this.tratamiento = '';
        this.diente = '';
        this.superficie = '';
        $('#finalizado').prop('checked', false);
        $('#evoluciont').val('');
    }

    Evolucionar() {
        let fin: any = ($('#finalizado').prop('checked') == true ? 1 : 0);
        if(this.historia_id != 0) {
            this.historiasService.updateEvolucionar(this.historia_id, $(this.padre).attr('name'), this.superficie, $('#evoluciont').val(), fin, this.id_trat)
                .subscribe(data => {
                    if(fin == 1) {
                        let div: any = document.getElementById('rowevolucion');
                        let dive: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+this.superficie+'"]');
                        $(dive).prop('style', 'background-color: #0358f3;');
                    }
                    this.showMessage("Tratamiento evolucionado");
                    $('#evolucion').modal('hide');
                    this.diagnostico = '';
                    this.tratamiento = '';
                    this.diente = '';
                    this.superficie = '';
                    $('#finalizado').prop('checked', false);
                    $('#evoluciont').val('');
                })
        }
        else {
            if(fin == 1) {
                let div: any = document.getElementById('rowevolucion');
                let dive: any = $(div).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+this.superficie+'"]');
                $(dive).prop('style', 'background-color: #0358f3;');
            }
            let divt: any = document.getElementById('rowtrat');
            let divth: any = $(divt).find('div').children('div[name="'+$(this.padre).attr('name')+'"]').children('div[name="'+this.superficie+'"]');
            $(divth).prop('obs', $('#evoluciont').val());
            $(divth).prop('evol', fin);
            let pos: any = 0;
            let name = this.superficie;
            for(var i in this.valorest) {
                if(this.valorest[i].ind == $(this.padre).attr('name') && this.valorest[i].name == name) {
                    let cod: any = this.valorest[i].valor;
                    this.valorest.splice(i, 1, {'ind': $(this.padre).attr('name'), 'name': name, 'valor': cod, 'trat': this.id_trat, 'evol' : fin, 'obs': $('#evoluciont').val()});
                }
            }
            this.showMessage("Tratamiento evolucionado");
            $('#evolucion').modal('hide');
            this.diagnostico = '';
            this.tratamiento = '';
            this.diente = '';
            this.superficie = '';
            $('#finalizado').prop('checked', false);
            $('#evoluciont').val('');
        }
    }

    formatData(data) {
    	if (!data.id) {
    		return data.text;
  		}
  		var elemento;
  		if(data.element.attributes.tipo.value == 1)
  			elemento = '<img src="/assets/img/odontologia/'+data.element.attributes.valor.value+'" class="img-flag" width="12" height="12"/>';
  		else
  			elemento = '<div style="background-color: #'+data.element.attributes.valor.value+'; display: inline-block; width: 10px; height: 10px;"></div>';
  		var $data = $(
	    	'<span>' + elemento + " " + data.text + '</span>'
	  	);
	  	return $data;
	};

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
        var that = this;
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
        this.odontologiaForm.get('ID_HISTORIA').setValue($('#HISTORIA').val());
    	this.odontologiaForm.get('DATOSHISTORIA').setValue(datos);
    	this.odontologiaForm.get('DATOSPACIENTE').setValue(pac);
        this.odontologiaForm.get('DATOS').setValue(datos1);
        this.odontologiaForm.get('PACIENTE').setValue($('#PACIENTE').val());
        this.odontologiaForm.get('PRESTADOR').setValue(this.role == 'ADMINISTRADOR' ? $('#ID_USUARIO').val() : this.id_user);
        this.odontologiaForm.get('ID_CITA').setValue(this.id_cita);

        var od: any = [];
        $('.click').each(function() {
        	let pa: any = $(this).parent()[0];
            if($(this).prop('diag') != null) {
                if($(this).prop('tipo') == 1) {
                    od.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'diag': $(this).prop('diag'), 'diente': pa.attributes.name.value,'image': $(this).prop('valor')});
                }
                else
                    od.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'diag': $(this).prop('diag'), 'diente': pa.attributes.name.value});
            }
            else
            	od.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'diag': '0', 'diente': pa.attributes.name.value});
        });
        this.odontologiaForm.get('ODONTOGRAMA').setValue(od);

        var tr: any = [];
        $('.clickt').each(function() {
        	let pa: any = $(this).parent()[0];
            if($(this).prop('trat') != null) {
                if($(this).prop('tipo') == 1) 
            	   tr.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'trat': $(this).prop('trat'), 'diente': pa.attributes.name.value,'image': $(this).prop('valor'), 'obs': $(this).prop('obs'), 'evol': $(this).prop('evol')});
                else
                   tr.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'trat': $(this).prop('trat'), 'diente': pa.attributes.name.value, 'obs': $(this).prop('obs'), 'evol': $(this).prop('evol')});
            }
            else
            	tr.push({'id': $(this).prop('id'),'name': $(this).attr('name'), 'trat': '0', 'diente': pa.attributes.name.value});
        });
        this.odontologiaForm.get('TRATAMIENTOS').setValue(tr);

        var ind: any = [];
        $('.clicks').each(function() {
            if($(this).hasClass("indiceorealy"))
                ind.push([$(this).prop('id'), 1]);
            else
                ind.push([$(this).prop('id'), 0]);
        });
        this.odontologiaForm.get('INDICE').setValue(ind);

        var consenti: any = [];
        $('input[type=checkbox]').each(function() {
            let che: any = ($(this).prop('checked') == true ? 1 : 0);
            consenti.push([$(this).prop('id'), che]);
        });
        this.odontologiaForm.get('CONSENTIMIENTOS').setValue(consenti);
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
        //this.getWhiteEncode();
        this._loadingBar.stop();
        this.historiasService.getHistoriaPacientes(id)
            .subscribe(data => {
                let da: any = data;
                var pdf = new jsPDF('p', 'px', 'letter');
                var div = document.createElement('div');
                var html = '';
                var header = '';
                var odon = da.odontologia;
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
                html = header + this.Page2(da.campos, da);
                $(div1).prop('id', 'print'+2);
                $(div1).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div1).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+2),false);

                setTimeout(() => 
                {
                    var div2 = document.createElement('div');
                    html = header + this.Page3(da.campos, da);
                    $(div2).prop('id', 'print'+3);
                    $(div2).addClass('row col-md-12').html(html);
                    var datos = document.getElementById('print');
                    $(div2).appendTo($(datos));
                    that.CrearImagen(pdf,document.getElementById('print'+3),false);
                }, 4000);

                setTimeout(() => 
                {
                    var div3 = document.createElement('div');
                    html = header + this.Page4(da);
                    $(div3).prop('id', 'print'+4);
                    $(div3).addClass('row col-md-12').html(html);
                    var datos = document.getElementById('print');
                    $(div3).appendTo($(datos));
                    that.CrearImagen(pdf,document.getElementById('print'+4),false);

                    var div4 = document.createElement('div');
                    html = header + this.Page5(da);
                    $(div4).prop('id', 'print'+5);
                    $(div4).addClass('row col-md-12').html(html);
                    var datos = document.getElementById('print');
                    $(div4).appendTo($(datos));
                    that.CrearImagen(pdf,document.getElementById('print'+5),false);

                    var div5 = document.createElement('div');
                    html = header + this.Page6(da) + this.Prestador(da.usuario);
                    $(div5).prop('id', 'print'+6);
                    $(div5).addClass('row col-md-12').html(html);
                    var datos = document.getElementById('print');
                    $(div5).appendTo($(datos));
                    that.CrearImagen(pdf,document.getElementById('print'+6),true);
                }, 5000);
            }
        );
    }

    Page1(datos, page = null) {
        let motivo = datos[127]['VALOR'] != null ? datos[127]['VALOR'] : "NO REFIERE";
        let enfermedad = datos[128]['VALOR'] != null ? datos[128]['VALOR'] : "NO REFIERE";
        let antecedentes = datos[130]['VALOR'] != null ? datos[130]['VALOR'] : "NO REFIERE";
        var imc = (datos[21]['VALOR'] != 0 && datos[22]['VALOR'] != 0) ? datos[22]['VALOR']/datos[21]['VALOR'] : 0;
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">MOTIVO DE CONSULTA:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 40px;">'+motivo+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EVOLUCION Y ESTADO ACTUAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 60px;">'+enfermedad+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES FAMILIARES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 60px;">'+antecedentes+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ANTECEDENTES ODONTOLOGICOS Y MEDICOS GENRALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Alergias:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[4]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[5]['VALOR'] != null ? datos[5]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Discrasias Sanguíneas:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[6]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[7]['VALOR'] != null ? datos[7]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cardiopatías:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[8]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[9]['VALOR'] != null ? datos[9]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Embarazo:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[10]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[11]['VALOR'] != null ? datos[11]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Alteraciones Presión alterial:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[12]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[13]['VALOR'] != null ? datos[13]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Toma de medicamentos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[14]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[15]['VALOR'] != null ? datos[15]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Tratamiento médico actual:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[16]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[17]['VALOR'] != null ? datos[17]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Hepatitis:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[18]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[19]['VALOR'] != null ? datos[19]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Diabetes:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[20]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[21]['VALOR'] != null ? datos[21]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Fiebre reumatica:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[22]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[23]['VALOR'] != null ? datos[23]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">HIV - Sida:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[24]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[25]['VALOR'] != null ? datos[25]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Inmunosupresión:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[26]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[27]['VALOR'] != null ? datos[27]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Patologías renales:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[28]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[29]['VALOR'] != null ? datos[29]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Patologías respiratoria:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[30]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[31]['VALOR'] != null ? datos[31]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Trastornos gástricos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[32]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[33]['VALOR'] != null ? datos[33]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Trastornos emocionale:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[34]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[35]['VALOR'] != null ? datos[35]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Sinusitis:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[36]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[37]['VALOR'] != null ? datos[37]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cirugías (Incluso orales):</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[38]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[39]['VALOR'] != null ? datos[39]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Exodoncias:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[40]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[41]['VALOR'] != null ? datos[41]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Enfermedades orales:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[42]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[43]['VALOR'] != null ? datos[43]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Uso de prótesis o aparatología oral:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[44]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[45]['VALOR'] != null ? datos[45]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Hábitos y otras patologías:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;height: 60px;">'+(datos[131]['VALOR'] != null ? datos[131]['VALOR'] : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMEN ESTOMATOLOGICO:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Labio superior:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[46]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[47]['VALOR'] != null ? datos[47]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Labio inferior:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[48]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[49]['VALOR'] != null ? datos[49]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Comisuras:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[50]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[51]['VALOR'] != null ? datos[51]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Mucosa oral:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[52]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[53]['VALOR'] != null ? datos[53]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Surcos yugales:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[54]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[55]['VALOR'] != null ? datos[55]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Frenillos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[56]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[57]['VALOR'] != null ? datos[57]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Orofaringe:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[58]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[59]['VALOR'] != null ? datos[59]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Paladar:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[60]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[61]['VALOR'] != null ? datos[61]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Glándulas salivales:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[62]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[63]['VALOR'] != null ? datos[63]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Piso de Boca:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[64]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[65]['VALOR'] != null ? datos[65]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Dorso de lengua:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[66]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[67]['VALOR'] != null ? datos[67]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Vientre de lengua:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[68]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[69]['VALOR'] != null ? datos[69]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ARTICULACION TEMPORO MANDIBULAR:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Ruidos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[70]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[71]['VALOR'] != null ? datos[71]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Desviación:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[72]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[73]['VALOR'] != null ? datos[73]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cambio de volumen:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[74]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[75]['VALOR'] != null ? datos[75]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Bloqueo mandibular:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[76]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[77]['VALOR'] != null ? datos[77]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Limitación de apertura:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[78]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[79]['VALOR'] != null ? datos[79]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Dolor articular:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[80]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[81]['VALOR'] != null ? datos[81]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Dolor muscular:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[82]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[83]['VALOR'] != null ? datos[83]['VALOR'] : "")+'</div>' +
                '</div>';
        return html;
    }

    Page2(datos, da, page = null) {
        var odon = da.odontologia;
        var eralhtml = '';
        var erarhtml = '';
        var dalhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml = '';
        var ralhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml = '',talhtml = '',tarhtml = '';
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ODONTOGRAMA DIAGNOSTICOS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '</div>';
                for(var i = 0; i < odon.length; i++) {
                    if(i <= 55) {
                        eralhtml += '<div id="dienteindex18" class="diente" name="18">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            eralhtml += '<div class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';                        
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            eralhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        eralhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 56 && i <= 111) {
                        erarhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            erarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        erarhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 112 && i <= 146) {
                        dalhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            dalhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        dalhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 147 && i <= 181) {
                        darhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            darhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        darhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 182 && i <= 216) {
                        ralhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            ralhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        ralhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 217 && i <= 251) {
                        rarhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            rarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        rarhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 252 && i <= 307) {
                        talhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            talhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        talhtml += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 308) {
                        tarhtml += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].diagnosticos != null && odon[i].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['DIAGNSOTICO'] != 0 ? odon[i].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].diagnosticos != null && odon[i+1].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['DIAGNSOTICO'] != 0 ? odon[i+1].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].diagnosticos != null && odon[i+2].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['DIAGNSOTICO'] != 0 ? odon[i+2].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].diagnosticos != null && odon[i+3].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['DIAGNSOTICO'] != 0 ? odon[i+3].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].diagnosticos != null && odon[i+4].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['DIAGNSOTICO'] != 0 ? odon[i+4].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].diagnosticos != null && odon[i+5].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['DIAGNSOTICO'] != 0 ? odon[i+5].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].diagnosticos != null && odon[i+6].diagnosticos.TIPO_IDENTI == 1)
                            tarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['DIAGNSOTICO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['DIAGNSOTICO'] != 0 ? odon[i+6].diagnosticos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        tarhtml += '</div>';
                        i = i + 6;
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
        odon = da.odontrat;
        var eralhtml1 = '';
        var erarhtml1 = '';
        var dalhtml1 = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml1 = '';
        var ralhtml1 = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml1 = '',talhtml1 = '',tarhtml1 = '';
        html += '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ODONTOGRAMA TRATAMIENTOS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '</div>';
                for(var i = 0; i < odon.length; i++) {
                    if(i <= 55) {
                        eralhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            eralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            eralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        eralhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 56 && i <= 111) {
                        erarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            erarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            erarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        erarhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 112 && i <= 146) {
                        dalhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            dalhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            dalhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        dalhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 147 && i <= 181) {
                        darhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            darhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            darhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        darhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 182 && i <= 216) {
                        ralhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            ralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            ralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        ralhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 217 && i <= 251) {
                        rarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            rarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            rarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        rarhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 252 && i <= 307) {
                        talhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            talhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            talhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        talhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 308) {
                        tarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        if(odon[i].tratamientos != null && odon[i].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center">'+(odon[i]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['TRATAMIENTO'] != 0 ? odon[i].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+1].tratamientos != null && odon[i+1].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center">'+(odon[i+1]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+1]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['TRATAMIENTO'] != 0 ? odon[i+1].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+2].tratamientos != null && odon[i+2].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center">'+(odon[i+2]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+2]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['TRATAMIENTO'] != 0 ? odon[i+2].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+3].tratamientos != null && odon[i+3].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center">'+(odon[i+3]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+3]['IMAGE']+'" width="10" class="imgcervical"/>' : '<img src="'+this.globals.whiteimg+'" width="10" class="imgcervical"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['TRATAMIENTO'] != 0 ? odon[i+3].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+4].tratamientos != null && odon[i+4].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center">'+(odon[i+4]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+4]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['TRATAMIENTO'] != 0 ? odon[i+4].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+5].tratamientos != null && odon[i+5].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center">'+(odon[i+5]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+5]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['TRATAMIENTO'] != 0 ? odon[i+5].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        if(odon[i+6].tratamientos != null && odon[i+6].tratamientos.TIPO_IDENTI == 1)
                            tarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center">'+(odon[i+6]['TRATAMIENTO'] != 0 ? '<img src="'+odon[i+6]['IMAGE']+'" width="15"/>' : '<img src="'+this.globals.whiteimg+'" width="15"/>')+'</div>';
                        else
                            tarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['TRATAMIENTO'] != 0 ? odon[i+6].tratamientos.VALOR : 'FFFFFF')+'"><img src="'+this.globals.whiteimg+'" width="15"/></div>';
                        tarhtml1 += '</div>';
                        i = i + 6;
                    }
                }
                html += '<div class="row col-md-12" style="margin: 0; padding: 0">' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+eralhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+erarhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+dalhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+darhtml1+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+ralhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+rarhtml1+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+talhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+tarhtml1+'</div>' +
                        '</div>';
        return html;
    }

    Page3(datos, da, page = null) {
        var odon = da.odontrat;
        var eralhtml1 = '';
        var erarhtml1 = '';
        var dalhtml1 = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml1 = '';
        var ralhtml1 = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml1 = '',talhtml1 = '',tarhtml1 = '';
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ODONTOGRAMA EVOLUCION:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '</div>';
                for(var i = 0; i < odon.length; i++) {
                    if(i <= 55) {
                        eralhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        eralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        eralhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 56 && i <= 111) {
                        erarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        erarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        erarhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 112 && i <= 146) {
                        dalhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        dalhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        dalhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 147 && i <= 181) {
                        darhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        darhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        darhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 182 && i <= 216) {
                        ralhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        ralhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        ralhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 217 && i <= 251) {
                        rarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        rarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        rarhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 252 && i <= 307) {
                        talhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        talhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        talhtml1 += '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 308) {
                        tarhtml1 += '<div class="diente">' +
                        '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+odon[i]['DIENTE']+'</span>';
                        tarhtml1 += '<div id="'+odon[i]['CAMPO']+'" class="cuadro superior click text-center" style="background-color: #'+(odon[i]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+1]['CAMPO']+'" class="cuadro up click text-center" style="background-color: #'+(odon[i+1]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+2]['CAMPO']+'" class="cuadro izquierdo click text-center" style="background-color: #'+(odon[i+2]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+3]['CAMPO']+'" class="cuadro inferior click text-center" style="background-color: #'+(odon[i+3]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+4]['CAMPO']+'" class="cuadro debajo click text-center" style="background-color: #'+(odon[i+4]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+5]['CAMPO']+'" class="cuadro derecha click text-center" style="background-color: #'+(odon[i+5]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '<div id="'+odon[i+6]['CAMPO']+'" class="centro click text-center" style="background-color: #'+(odon[i+6]['EVOLUCION'] == 1 ? '0358f3' : 'FFFFFF')+'"></div>';
                        tarhtml1 += '</div>';
                        i = i + 6;
                    }
                }
                html += '<div class="row col-md-12" style="margin: 0; padding: 0">' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+eralhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+erarhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+dalhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+darhtml1+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+ralhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+rarhtml1+'<div class="diente"></div><div class="diente"></div><div class="diente"></div></div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+talhtml1+'</div>' +
                        '<div class="col-md-6" style="margin-left: -20px;">'+tarhtml1+'</div>' +
                        '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">CONSENTIMIENTOS INFORMADOS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6">Consentimiento informado<div class="form-group">'+(da.consentimientos[6].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Operatoria<div class="form-group">'+(da.consentimientos[7].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Anestecia local<div class="form-group">'+(da.consentimientos[8].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Endodoncia<div class="form-group">'+(da.consentimientos[9].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Endodoncia simple<div class="form-group">'+(da.consentimientos[10].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Exodoncia de Cordales e Incluidos<div class="form-group">'+(da.consentimientos[11].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Cirugía apical<div class="form-group">'+(da.consentimientos[12].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Consentimiento Informado para Terapia neural<div class="form-group">'+(da.consentimientos[13].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Revocación<div class="form-group">'+(da.consentimientos[14].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '<div class="col-md-6">Formulario de Negación del Consentimiento Informado<div class="form-group">'+(da.consentimientos[15].VALOR == 1 ? 'SI' : 'NO')+'</div></div>' +
                '</div>';
        return html;
    }

    Page4(da, page = null) {
        var datos = da.campos;
        var indi = da.indice;
        var eralhtml = '',erarhtml = '';
        var dalhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var darhtml = '';
        var ralhtml = '<div class="diente"></div><div class="diente"></div><div class="diente"></div>';
        var rarhtml = '',talhtml = '',tarhtml = '';
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">PROTESIS:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Presencia de prótesis:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[84]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Tipo de Prótesis:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[85]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Observaciones:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+(datos[86]['VALOR'] != null ? datos[86]['VALOR'] : '')+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">HIGIENE ORAL:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Higiene oral:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[87]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Frecuencia cepillado:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[88]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Grado de riesgo:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[89]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Sedal dental:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[90]['VALOR']+'</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">Pigmentaciones:</div>' +
                '<div class="col-md-6" style="text-transform: uppercase !important;">'+datos[91]['VALOR']+'</div>' +
                '</div>';
        html += '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">INDICE OLEARY:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '</div>';
                for(var i = 0; i < indi.length; i++) {
                    if(i <= 34) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        dalhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 35 && i <= 69) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        darhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 70 && i <= 125) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        eralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 126 && i <= 181) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        erarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 182 && i <= 237) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        talhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 238 && i <= 293) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        tarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 294 && i <= 328) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        ralhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
                    }
                    else
                    if(i >= 329) {
                        let num = indi[i]['CAMPO'].slice(indi[i]['CAMPO'].length - 2);
                        rarhtml += '<div class="diente">' +
                                '<span style="margin-left: -5px; margin-bottom:5px; display: inline-block !important; border-radius: 10px !important;" class="text-center badge badge-pill badge-primary">'+num+'</span>' +
                                '<div id="'+indi[i]['CAMPO']+'" class="cuadro superior clicks text-center '+(indi[i]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+1]['CAMPO']+'" class="cuadro up clicks text-center '+(indi[i+1]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+2]['CAMPO']+'" class="cuadro izquierdo clicks text-center '+(indi[i+2]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+3]['CAMPO']+'" class="cuadro inferior clicks text-center '+(indi[i+3]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+4]['CAMPO']+'" class="cuadro debajo clicks text-center '+(indi[i+4]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+5]['CAMPO']+'" class="cuadro derecha clicks text-center '+(indi[i+5]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '<div id="'+indi[i+6]['CAMPO']+'" class="centro clicks text-center '+(indi[i+6]['VALOR'] == 1 ? 'indiceorealy' : '')+'"></div>' +
                                '</div>';
                        i = i + 6;
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
                        '</div>' +
                        '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                        '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Observaciones y/o indicaciones:</div>' +
                        '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                        '<div class="col-md-12" style="text-transform: uppercase !important;height: 70px;">'+(datos[129]['VALOR'] != null ? datos[129]['VALOR'] : "NO REFIERE")+'</div>' +
                        '</div>';
        return html;
    }

    Page5(da, page = null) {
        var datos = da.campos;
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">EXAMEN PULPAR:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cuellos sensibles:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[92]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[93]['VALOR'] != null ? datos[93]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Abscesos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[94]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[95]['VALOR'] != null ? datos[95]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Exposición pulpar:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[96]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[97]['VALOR'] != null ? datos[97]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cambio de color:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[98]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[99]['VALOR'] != null ? datos[99]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">TEJIDOS DENTARIOS Y OCLUCION:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Supernumerarios:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[100]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[101]['VALOR'] != null ? datos[101]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Decoloracion:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[102]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[103]['VALOR'] != null ? datos[103]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Descalcificación:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[104]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[105]['VALOR'] != null ? datos[105]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Facetas de Desgaste:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[106]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[107]['VALOR'] != null ? datos[107]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Abrasión y/o erosión:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[108]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[109]['VALOR'] != null ? datos[109]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Fluorosis:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[110]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[111]['VALOR'] != null ? datos[111]['VALOR'] : "")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">ALTERACIONS PERIODONTALES:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Sangrado:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[112]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[113]['VALOR'] != null ? datos[113]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Exudado:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[114]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[115]['VALOR'] != null ? datos[115]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Supuración:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[116]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[117]['VALOR'] != null ? datos[117]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Cálculos:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[118]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[119]['VALOR'] != null ? datos[119]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Inflamación:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[120]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[121]['VALOR'] != null ? datos[121]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Retracciones:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[122]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[123]['VALOR'] != null ? datos[123]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Presencia de bolas:</div>' +
                '<div class="col-md-1" style="text-transform: uppercase !important;">'+datos[124]['VALOR']+'</div>' +
                '<div class="col-md-8" style="text-transform: uppercase !important;">'+(datos[125]['VALOR'] != null ? datos[125]['VALOR'] : "")+'</div>' +
                '<div class="col-md-3" style="text-transform: uppercase !important;">Tipo de oclución:</div>' +
                '<div class="col-md-9" style="text-transform: uppercase !important;">'+(datos[126]['VALOR'] != null ? datos[126]['VALOR'] : '')+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Articular:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOA != '' ? da.DIAGNOSTICOA : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Pulpar:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOP != '' ? da.DIAGNOSTICOP : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Periodontal:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOPE != '' ? da.DIAGNOSTICOPE : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Dental:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOD != '' ? da.DIAGNOSTICOD : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">C y D - Oclución:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOO != '' ? da.DIAGNOSTICOO : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Tejidos blandos:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOT != '' ? da.DIAGNOSTICOT : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Otros:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOOT != '' ? da.DIAGNOSTICOOT : "NO REFIERE")+'</div>' +
                '</div>' +
                '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">Principal:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-12" style="text-transform: uppercase !important;">'+(da.DIAGNOSTICOPR != '' ? da.DIAGNOSTICOPR : "NO REFIERE")+'</div>' +
                '</div>';
        return html;
    }

    Page6(da, page = null) {
        var html = '<div class="row" style="margin-bottom: 2rem !important;-webkit-box-flex: 0;-ms-flex: 0 0 99%;padding-right: 15px;padding-left: 15px;flex: 0 0 99%;font-size: 15px; box-sizing: content-box;overflow: visible; border: 0; border: 1px solid #e9ecef;">' +
                '<div class="col-md-12" style="background-color: #f3f3f3;font-weight: bolder;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;">HOJA DE EVOLUCION:</div>' +
                '<div class="col-md-12" style="height: 0;border: 0; border-top: 1px solid #aaaaaa;-webkit-box-flex: 0;-ms-flex: 0 0 100%;flex: 0 0 100%;margin-left: -15px;box-sizing: content-box;overflow: visible;"></div>' +
                '<div class="col-md-2">Código</div><div class="col-md-4">Procedimiento</div><div class="col-md-1">Diente</div><div class="col-md-1">Superfi.</div><div class="col-md-4">Observaciones</div>';
                for(var i = 0; i < da.odontrat.length; i++) {
                    if(da.odontrat[i].TRATAMIENTO != 0) {
                        html += '<div class="col-md-2">'+da.odontrat[i].tratamientos.CODIGO+'</div><div class="col-md-4">'+da.odontrat[i].tratamientos.DESCRIPCION+'</div><div class="col-md-1">'+da.odontrat[i].DIENTE+'</div><div class="col-md-1">'+da.odontrat[i].NAME+'</div><div class="col-md-4">'+(da.odontrat[i].OBSERVACION != null ? da.odontrat[i].OBSERVACION : '')+'</div>';
                    }
                }
                html += '</div>';
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
                that._loadingBar.complete();
                that.tipo_id.emit(0);
                setTimeout(() => 
                {
                    $('#print').empty();
                    var blob = pdf.output('blob');
                    var bloburl = URL.createObjectURL(blob);
                    window.open(bloburl);
                },3000);
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
