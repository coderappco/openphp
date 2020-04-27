import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Globals} from '../../globals';
import { HistoriasService } from '../../services/historias.service';
import { PacienteService } from '../../services/paciente.service';
import { CitaService } from '../../services/cita.service';
import { CodifService } from '../../services/codif.service';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';

declare var $: any;

@Component({
  	selector: 'app-historias',
  	templateUrl: './historias.component.html',
  	styleUrls: ['./historias.component.css']
})
export class HistoriasComponent implements OnInit {

	historiaForm: FormGroup;
	pacForm: FormGroup;
	pacienteForm: FormGroup;
	historias: any = [];
	id_historia: any = 0;
	historia_id: any = 0;
	roles: any = '';
	idpaciente: any = 0;
	cita_id: any = 0;
	id_pac: any = 0;
	prints:any = false;
	dtOptions: any = {};
  	table: any = '';
  	role: any = '';
  	familiares: any = [];
  	examenes: any = [];
  	servicios: any = [];
  	dptos: any = [];
    municipios: any = [];
    muni_id: any = 1127;
    tipoident: any = [];
    submitted = false;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private historiasService: HistoriasService,private codifService: CodifService,
  				private pacienteService: PacienteService, private route: ActivatedRoute, private citaService: CitaService, private router: Router) { }

  	ngOnInit() {
  		var that = this;
  		this.initForm();
  		let us = JSON.parse(localStorage.getItem('currentUser'));
		this.roles = us.role;
	    if(this.route.snapshot.queryParamMap.get('cita_id') != null && this.route.snapshot.queryParamMap.get('cita_id') != '') {
	    	this.cita_id = this.route.snapshot.queryParamMap.get('cita_id');
	    	this.citaService.getCita(this.route.snapshot.queryParamMap.get('cita_id'))
                .subscribe(data => {
                    let da: any = data;
                    var newOptions = '<option value="'+da.prestador.usuario.ID_USUARIO+'">'+da.prestador.usuario.NOMBRES + ' ' + da.prestador.usuario.APELLIDOS+'</option>';
			        $('#ID_USUARIO').empty().html(newOptions).select2({
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
			            language: { 
			            	inputTooShort: function () { 
			            		return 'Por favor, entre al menos 1 caracter'; 
			            	} 
			            },
			            placeholder: 'Buscar Prestadores',
			            minimumInputLength: 1,
			            allowClear: true
			        });
	                $('#ID_USUARIO').val(da.prestador.usuario.ID_USUARIO).trigger('change');
	                let nombre = da.paciente.PRIMER_NOMBRE + (da.paciente.SEGUNDO_NOMBRE != null ? " "+da.paciente.SEGUNDO_NOMBRE : "");
                    let apellido = da.paciente.PRIMER_APELLIDO + (da.paciente.SEGUNDO_APELLIDO != null ? " "+da.paciente.SEGUNDO_APELLIDO : "");
                    var newOptions1 = '<option value="'+ da.ID_PACIENTE +'">'+ nombre+" "+apellido +'</option>';
	                $('#PACIENTE').empty().html(newOptions1).select2({
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
			            language: { 
			            	inputTooShort: function () { 
			            		return 'Por favor, entre al menos 1 caracter'; 
			            	} 
			            },
			            placeholder: 'Buscar Pacientes',
			            minimumInputLength: 1,
			            allowClear: true
			        });
                    $('#PACIENTE').val(da.ID_PACIENTE).trigger('change');
                }
            );
	    }
  	}

  	ngAfterViewInit(): void {
  		var that = this;
  		let us = JSON.parse(localStorage.getItem('currentUser'));
		this.role = us.role;
		setTimeout(() => 
		{
			var img = document.getElementById('imagenp');
		    var canvas = document.createElement("canvas");
		    canvas.width = 15;
		    canvas.height = 15;
		    //var ctx = canvas.getContext("2d");
		    //ctx.drawImage(img, 0, 0);
		   	var dataURL = canvas.toDataURL("image/png");
		    this.globals.whiteimg = dataURL;
		},0);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%",allowClear: true});
		$(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", maxDate: "today",enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'});
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
            language: { 
            	inputTooShort: function () { 
            		return 'Por favor, entre al menos 1 caracter'; 
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
            language: { 
            	inputTooShort: function () { 
            		return 'Por favor, entre al menos 1 caracter'; 
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
        $('#HISTORIA').on("change", function (e) {
        	if($(this).val() != null && $(this).val() != '') {
        		that.historiasService.getHistoria($(this).val())
					.subscribe(data => {
						let da: any = data;
						if(da.ID_RANGO == null || da.ID_RANGO == '') {
							alert("Esta historia no esta parametrizada, por favor contacte con el administrador.");
							if(that.id_historia != 0)
								$('#HISTORIA').val(that.id_historia).trigger('change');
							else
								$('#HISTORIA').val('').trigger('change');
						}
						else {
							that.prints = false;
							if($('#PACIENTE').val() != null && $('#PACIENTE').val() != '') {
								that.pacienteService.getPaciente($('#PACIENTE').val())
									.subscribe(data => {
						                var paciente: any = data;
						                if(da.GENERO != 3 && da.GENERO != paciente.GENERO) {
						                	alert("Por favor, este registro clínico no parametriza con el género para este paciente, escoja otro registro.");
						                	if(that.id_historia != 0)
												$('#HISTORIA').val(that.id_historia).trigger('change');
											else
												$('#HISTORIA').val('').trigger('change');
											return false;
						                }
						                if(da.GENERO != 3 && da.GENERO == paciente.GENERO) {
						                	let yDiff: any = "0";
						                	let mDiff: any = "0"
						                	if(paciente.FECHA_NAC != null) {
						                        yDiff = moment().year() - moment(paciente.FECHA_NAC).year();
						                        mDiff = moment().month() - moment(paciente.FECHA_NAC).month();
						                        if (mDiff < 0) {
						                            mDiff = 12 + mDiff;
						                            yDiff--;
						                        }
						                        if(da.rango.EDAD_INICIAL_MESES == 1) {
							                        if(mDiff < da.rango.EDAD_INICIAL) {
								                        alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                	if(that.id_historia != 0)
															$('#HISTORIA').val(that.id_historia).trigger('change');
														else
															$('#HISTORIA').val('').trigger('change');
														return false;
							                        }
												}
							                    if(da.rango.EDAD_FINAL_MESES == 1 && (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '')) {
							                       	if(mDiff > da.rango.EDAD_FINAL) {
							                        	alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                	if(that.id_historia != 0)
															$('#HISTORIA').val(that.id_historia).trigger('change');
														else
															$('#HISTORIA').val('').trigger('change');
														return false;
							                        }
							                    }
												if((da.rango.EDAD_FINAL_MESES == 0 && da.rango.EDAD_INICIAL_MESES == 0) && yDiff < da.rango.EDAD_INICIAL || (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '' && yDiff > da.rango.EDAD_FINAL)) {
													alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                if(that.id_historia != 0)
														$('#HISTORIA').val(that.id_historia).trigger('change');
													else
														$('#HISTORIA').val('').trigger('change');
													return false;
												}
						                    }
						                }
						                if(da.GENERO == 3) {
							               	let yDiff: any = "0";
							                let mDiff: any = "0"
							                if(paciente.FECHA_NAC != null) {
							                    yDiff = moment().year() - moment(paciente.FECHA_NAC).year();
							                    mDiff = moment().month() - moment(paciente.FECHA_NAC).month();
							                    if (mDiff < 0) {
							                        mDiff = 12 + mDiff;
							                        yDiff--;
							                    }
							                    if(da.rango.EDAD_INICIAL_MESES == 1) {
							                        if(mDiff < da.rango.EDAD_INICIAL) {
								                        alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                	if(that.id_historia != 0)
															$('#HISTORIA').val(that.id_historia).trigger('change');
														else
															$('#HISTORIA').val('').trigger('change');
														return false;
							                        }
												}
							                    if(da.rango.EDAD_FINAL_MESES == 1 && (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '')) {
							                       	if(mDiff > da.rango.EDAD_FINAL) {
							                        	alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                	if(that.id_historia != 0)
															$('#HISTORIA').val(that.id_historia).trigger('change');
														else
															$('#HISTORIA').val('').trigger('change');
														return false;
							                        }
							                    }
												if((da.rango.EDAD_FINAL_MESES == 0 && da.rango.EDAD_INICIAL_MESES == 0) && yDiff < da.rango.EDAD_INICIAL || (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '' && yDiff > da.rango.EDAD_FINAL)) {
													alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro registro.");
									                if(that.id_historia != 0)
														$('#HISTORIA').val(that.id_historia).trigger('change');
													else
														$('#HISTORIA').val('').trigger('change');
													return false;
												}
											}
										}
						                that.id_historia = $(this).val();
						                setTimeout(() => 
										{
											$('#regis').html(da.NOM_HISTORIA);
											let gestacion = paciente.GESTACION != null ? paciente.GESTACION : 2;
							                $('#ID_ESCOLARIDAD').val(paciente.ID_ESCOLARIDAD).trigger('change');
							                $('#ID_ETNIA').val(paciente.ID_ETNIA).trigger('change');
							                $('#ID_OCUPACION').val(paciente.ID_OCUPACION).trigger('change');
							                $('#ID_DISCAPACIDAD').val(paciente.ID_DISCAPACIDAD).trigger('change');
							                $('#ID_RELIGION').val(paciente.ID_RELIGION).trigger('change');
							                $('#GESTACION').val(gestacion).trigger('change');
							                $('input[name=datos]').each(function() {
							                    $(this).attr('checked', false);
							                    $(this).parent('label').removeClass('active');
							                });
							                if(paciente.DESPLAZADO == 1) {
							                    $('#desplazado').parent('label').addClass('active');
							                    $('#desplazado').attr('checked', true);
							                }
							                if(paciente.PENSIONADO == 1) {
							                    $('#pensionado').parent('label').addClass('active');
							                    $('#pensionado').attr('checked', true);
							                }
							                if(paciente.LGBTI == 1) {
							                    $('#lgbti').parent('label').addClass('active');
							                    $('#lgbti').attr('checked', true);
							                }
							                if(paciente.VIC_MALTRATO == 1) {
							                    $('#maltrato').parent('label').addClass('active');
							                    $('#maltrato').attr('checked', true);
							                }
							                if(paciente.VIC_CONF_ARMADO == 1) {
							                    $('#conflicto').parent('label').addClass('active');
							                    $('#conflicto').attr('checked', true);
							                }
										},1000);
					                }
					            );
							}
							else {
								that.id_historia = $(this).val();
								setTimeout(() => 
								{
									$('#regis').html(da.NOM_HISTORIA);
								},500);
							}
						}
					}
				);
	        }
	        else
	        	that.id_historia = 0;
        });
        $('#PACIENTE').on( 'change', function () {
        	if($(this).val() != null) {
        		that.id_pac = $(this).val();
        		this.table = $('#data-table').DataTable(that.fillTable());
	        	that.pacienteService.getPaciente($(this).val())
		            .subscribe(data => {
		                var paciente: any = data;
		                if(paciente.FECHA_NAC == null) {
		                	if(confirm("El paciente no tiene fecha de nacimiento, desea asignarle una ?")) {
		                		$('#modal_pac').modal('show');
		                		let nombre = paciente.PRIMER_NOMBRE + (paciente.SEGUNDO_NOMBRE != null ? " "+paciente.SEGUNDO_NOMBRE : "");
                    			let apellido = paciente.PRIMER_APELLIDO + (paciente.SEGUNDO_APELLIDO != null ? " "+paciente.SEGUNDO_APELLIDO : "");
		                		$('#pac_name').val(nombre + " " + apellido);
		                		that.idpaciente = $(this).val();
		                	}
		                	else {
			                	if(that.idpaciente != 0)
									$('#PACIENTE').val(that.idpaciente).trigger('change');
								else
									$('#PACIENTE').val('').trigger('change');
								return false;
							}
		                }
		                that.prints = false;
		                if($('#HISTORIA').val() != null && $('#HISTORIA').val() != '') {
							that.historiasService.getHistoria($('#HISTORIA').val())
								.subscribe(data => {
						            var da: any = data;
						            if(da.GENERO != 3 && da.GENERO != paciente.GENERO) {
						               	alert("Por favor, este registro clínico no parametriza con el género para este paciente, escoja otro paciente.");
						                if(that.idpaciente != 0)
											$('#PACIENTE').val(that.idpaciente).trigger('change');
										else
											$('#PACIENTE').val('').trigger('change');
										return false;
						            }
						            if(da.GENERO != 3 && da.GENERO == paciente.GENERO) {
						               	let yDiff: any = "0";
						                let mDiff: any = "0"
						                if(paciente.FECHA_NAC != null) {
						                    yDiff = moment().year() - moment(paciente.FECHA_NAC).year();
						                    mDiff = moment().month() - moment(paciente.FECHA_NAC).month();
						                    if (mDiff < 0) {
						                        mDiff = 12 + mDiff;
						                        yDiff--;
						                    }
						                    if(da.rango.EDAD_INICIAL_MESES == 1) {
						                        if(mDiff < da.rango.EDAD_INICIAL) {
							                        alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
													if(that.idpaciente != 0)
														$('#PACIENTE').val(that.idpaciente).trigger('change');
													else
														$('#PACIENTE').val('').trigger('change');
													return false;
						                        }
											}
						                    if(da.rango.EDAD_FINAL_MESES == 1 && (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '')) {
						                       	if(mDiff > da.rango.EDAD_FINAL) {
						                        	alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
													if(that.idpaciente != 0)
														$('#PACIENTE').val(that.idpaciente).trigger('change');
													else
														$('#PACIENTE').val('').trigger('change');
													return false;
						                        }
						                    }
											if((da.rango.EDAD_FINAL_MESES == 0 && da.rango.EDAD_INICIAL_MESES == 0) && yDiff < da.rango.EDAD_INICIAL || (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '' && yDiff > da.rango.EDAD_FINAL)) {
												alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
												if(that.idpaciente != 0)
													$('#PACIENTE').val(that.idpaciente).trigger('change');
												else
													$('#PACIENTE').val('').trigger('change');
												return false;
											}
										}
									}
									if(da.GENERO == 3) {
						               	let yDiff: any = "0";
						                let mDiff: any = "0"
						                if(paciente.FECHA_NAC != null) {
						                    yDiff = moment().year() - moment(paciente.FECHA_NAC).year();
						                    mDiff = moment().month() - moment(paciente.FECHA_NAC).month();
						                    if (mDiff < 0) {
						                        mDiff = 12 + mDiff;
						                        yDiff--;
						                    }
						                    if(da.rango.EDAD_INICIAL_MESES == 1) {
						                        if(mDiff < da.rango.EDAD_INICIAL) {
							                        alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
													if(that.idpaciente != 0)
														$('#PACIENTE').val(that.idpaciente).trigger('change');
													else
														$('#PACIENTE').val('').trigger('change');
													return false;
						                        }
											}
						                    if(da.rango.EDAD_FINAL_MESES == 1 && (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '')) {
						                       	if(mDiff > da.rango.EDAD_FINAL) {
						                        	alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
													if(that.idpaciente != 0)
														$('#PACIENTE').val(that.idpaciente).trigger('change');
													else
														$('#PACIENTE').val('').trigger('change');
													return false;
						                        }
						                    }
											if((da.rango.EDAD_FINAL_MESES == 0 && da.rango.EDAD_INICIAL_MESES == 0) && yDiff < da.rango.EDAD_INICIAL || (da.rango.EDAD_FINAL != null && da.rango.EDAD_FINAL != '' && yDiff > da.rango.EDAD_FINAL)) {
												alert("Por favor, este registro clínico no parametriza con la edad para este paciente, escoja otro paciente.");
												if(that.idpaciente != 0)
													$('#PACIENTE').val(that.idpaciente).trigger('change');
												else
													$('#PACIENTE').val('').trigger('change');
												return false;
											}
										}
									}
					                that.idpaciente = $(this).val();
					                let genero = paciente.GENERO == 1 ? "Masculino" : paciente.GENERO == 2 ? "Femenino" : "Indefinido";
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
				                    $('#EDAD').val(edad);
				                    $('.genero').val(genero);
				                    $('#DOCUMENTO').val(paciente.identificacion.COD_TIPO_IDENTIFICACION+paciente.NUM_DOC);
					            	$('#DIRECCION').val(paciente.DIREC_PACIENTE);
					            	$('#CELULAR').val(paciente.MOVIL);
					            	$('#ESTADO_CIVIL').val(paciente.estadocivil.NOM_ESTADO_CIVIL);
					            	let admin = paciente.contrato != null ? paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR";
					            	$('#ID_ADMINISTRADORA').val(admin);
					            	let contrato = paciente.contrato != null ? paciente.contrato.contrato.NOM_CONTRATO : "PARTICULAR";
					            	$('#ID_CONTRATO').val(contrato);
					            	$('#OCUPACION').val(paciente.ocupacion.NOM_OCUPACION);
					            	that.id_historia = $('#HISTORIA').val();
					            	let gestacion = paciente.GESTACION != null ? paciente.GESTACION : 2;
					                $('#ID_ESCOLARIDAD').val(paciente.ID_ESCOLARIDAD).trigger('change');
					                $('#ID_ETNIA').val(paciente.ID_ETNIA).trigger('change');
					                $('#ID_OCUPACION').val(paciente.ID_OCUPACION).trigger('change');
					                $('#ID_DISCAPACIDAD').val(paciente.ID_DISCAPACIDAD).trigger('change');
					                $('#ID_RELIGION').val(paciente.ID_RELIGION).trigger('change');
					                $('#GESTACION').val(gestacion).trigger('change');
					                $('input[name=datos]').each(function() {
					                    $(this).attr('checked', false);
					                    $(this).parent('label').removeClass('active');
					                });
					                if(paciente.DESPLAZADO == 1) {
					                    $('#desplazado').parent('label').addClass('active');
					                    $('#desplazado').attr('checked', true);
					                }
					                if(paciente.PENSIONADO == 1) {
					                    $('#pensionado').parent('label').addClass('active');
					                    $('#pensionado').attr('checked', true);
					                }
					                if(paciente.LGBTI == 1) {
					                    $('#lgbti').parent('label').addClass('active');
					                    $('#lgbti').attr('checked', true);
					                }
					                if(paciente.VIC_MALTRATO == 1) {
					                    $('#maltrato').parent('label').addClass('active');
					                    $('#maltrato').attr('checked', true);
					                }
					                if(paciente.VIC_CONF_ARMADO == 1) {
					                    $('#conflicto').parent('label').addClass('active');
					                    $('#conflicto').attr('checked', true);
					                }
					                let nombre = paciente.PRIMER_NOMBRE + (paciente.SEGUNDO_NOMBRE != null ? " "+paciente.SEGUNDO_NOMBRE : "");
                    				let apellido = paciente.PRIMER_APELLIDO + (paciente.SEGUNDO_APELLIDO != null ? " "+paciente.SEGUNDO_APELLIDO : "");
                    				var newOptions1 = '<option value="'+ paciente.ID_PACIENTE +'">'+ nombre+" "+apellido +'</option>';
					                $('#PACIENTE').empty().html(newOptions1).select2({
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
							            language: { 
							            	inputTooShort: function () { 
							            		return 'Por favor, entre al menos 1 caracter'; 
							            	} 
							            },
							            placeholder: 'Buscar Pacientes',
							            minimumInputLength: 1,
							            allowClear: true
							        });
							        setTimeout(() => 
									{
										$('#regis').html(da.NOM_HISTORIA);
									},500);
								}
							);
						}
						else {
							that.idpaciente = $(this).val();
							let genero = paciente.GENERO == 1 ? "Masculino" : paciente.GENERO == 2 ? "Femenino" : "Indefinido";
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
							$('#EDAD').val(edad);
							$('.genero').val(genero);
							$('#DIRECCION').val(paciente.DIREC_PACIENTE);
							$('#CELULAR').val(paciente.MOVIL);
							$('#ESTADO_CIVIL').val(paciente.estadocivil.NOM_ESTADO_CIVIL);
							$('#DOCUMENTO').val(paciente.identificacion.COD_TIPO_IDENTIFICACION+paciente.NUM_DOC);
							let admin = paciente.contrato != null ? paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR";
							$('#ID_ADMINISTRADORA').val(admin);
							let contrato = paciente.contrato != null ? paciente.contrato.contrato.NOM_CONTRATO : "PARTICULAR";
							$('#ID_CONTRATO').val(contrato);
							$('#OCUPACION').val(paciente.ocupacion.NOM_OCUPACION);
							let gestacion = paciente.GESTACION != null ? paciente.GESTACION : 2;
			                $('#ID_ESCOLARIDAD').val(paciente.ID_ESCOLARIDAD).trigger('change');
			                $('#ID_ETNIA').val(paciente.ID_ETNIA).trigger('change');
			                $('#ID_OCUPACION').val(paciente.ID_OCUPACION).trigger('change');
			                $('#ID_DISCAPACIDAD').val(paciente.ID_DISCAPACIDAD).trigger('change');
			                $('#ID_RELIGION').val(paciente.ID_RELIGION).trigger('change');
			                $('#GESTACION').val(gestacion).trigger('change');
			                $('input[name=datos]').each(function() {
			                    $(this).attr('checked', false);
			                    $(this).parent('label').removeClass('active');
			                });
			                if(paciente.DESPLAZADO == 1) {
			                    $('#desplazado').parent('label').addClass('active');
			                    $('#desplazado').attr('checked', true);
			                }
			                if(paciente.PENSIONADO == 1) {
			                    $('#pensionado').parent('label').addClass('active');
			                    $('#pensionado').attr('checked', true);
			                }
			                if(paciente.LGBTI == 1) {
			                    $('#lgbti').parent('label').addClass('active');
			                    $('#lgbti').attr('checked', true);
			                }
			                if(paciente.VIC_MALTRATO == 1) {
			                    $('#maltrato').parent('label').addClass('active');
			                    $('#maltrato').attr('checked', true);
			                }
			                if(paciente.VIC_CONF_ARMADO == 1) {
			                    $('#conflicto').parent('label').addClass('active');
			                    $('#conflicto').attr('checked', true);
			                }
			                let nombre = paciente.PRIMER_NOMBRE + (paciente.SEGUNDO_NOMBRE != null ? " "+paciente.SEGUNDO_NOMBRE : "");
                    		let apellido = paciente.PRIMER_APELLIDO + (paciente.SEGUNDO_APELLIDO != null ? " "+paciente.SEGUNDO_APELLIDO : "");
                    		var newOptions1 = '<option value="'+ paciente.ID_PACIENTE +'">'+ nombre+" "+apellido +'</option>';
					        $('#PACIENTE').empty().html(newOptions1).select2({
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
							    language: { 
							        inputTooShort: function () { 
							            return 'Por favor, entre al menos 1 caracter'; 
							        } 
							    },
							    placeholder: 'Buscar Pacientes',
							    minimumInputLength: 1,
							    allowClear: true
							});
						}
		            }
		        );
			}
		    else {
            	$('#EDAD').val('');
            	$('.genero').val('');
            	$('#DIRECCION').val('');
            	$('#CELULAR').val('');
            	$('#ESTADO_CIVIL').val('');
            	$('#ID_ADMINISTRADORA').val('');
            	$('#ID_CONTRATO').val('');
            	$('#DOCUMENTO').val('');
            	$('#HISTORIA').val('').trigger('change');
            	that.idpaciente = 0;
            	that.cita_id = 0;
            	that.id_historia = 0;
            	that.id_pac = 0;
            	that.familiares = [];
            	that.prints = false;
		    }
        });

        if(this.cita_id == 0) {
	        this.historiasService.listHistorias()
				.subscribe(data => {
					let hi: any = data;
					this.historias = hi;
				}
			);
		}
		else
		{
			this.historiasService.listHistoriasCitaid(this.cita_id)
				.subscribe(data => {
					let hi: any = data;
					this.historias = hi;
					setTimeout(() => 
					{
						$('#HISTORIA').val(hi[0].ID_HISTORIA).trigger('change');
					},500);
				}
			);
		}

		$('#data-table').on( 'click', '.btn-print', function () {
            that.GenerarPdfs($(this).attr('date'));
        });
        $('#data-table').on( 'click', '.btn-edit', function () {
			that.fillHistoria($(this).attr('date'));
		});
		$('input[type=text]').popover('hide');
        $("[data-toggle='popover']").popover('hide');
        $("[data-toggle=popover]").popover('hide');
        $("*").each(function () {
            var popover = $.data(this, "bs.popover");
            if (popover)
                $(this).popover('hide');
        });
	}

	get f() { return this.pacienteForm.controls; }

	initForm() {
        this.historiaForm = this.formBuilder.group({
            PACIENTE: [''],
            EDAD: [''],
            GENERO: [''],
            DIRECCION: [''],
            CELULAR: [''],
            ESTADO_CIVIL: [''],
            ID_ADMINISTRADORA: [''],
            ID_CONTRATO: [''],
            HISTORIA: [''],
            OCUPACION: [''],
            DOCUMENTO: [''],
        });

        this.pacForm = this.formBuilder.group({
            FECHA_NAC: [''],
        });

        this.pacienteForm = this.formBuilder.group({
            ID_TIPO_DOC: [''],
            NUM_DOC: ['', [Validators.required]],
            FECHA_NAC: ['', [Validators.required]],
            GENERO: [''],
            PRIMER_NOMBRE: ['', [Validators.required]],
            SEGUNDO_NOMBRE: [''],
            PRIMER_APELLIDO: ['', [Validators.required]],
            SEGUNDO_APELLIDO: [''],
            dpto: [34],
            ID_MUNICIPIO: [1127],
            ZONA: [1],
            BARRIO: [''],
            TELEF: [''],
            MOVIL: [''],
            CORREO: ['', [Validators.email]],
            DIREC_PACIENTE: [''],
            ACTIVO: [1],
            ID_ESTADO_CIVIL: [6],
            ID_GRP_SANG: [1],
            ID_ESCOLARIDAD: [1],
            ID_ETNIA: [6],
            ID_OCUPACION: [511],
            ID_DISCAPACIDAD: [5],
            ID_RELIGION: [6],
            GESTACION: [''],
            ID_TIPO_AFIL: [7],
            FECHA_AFIL: [''],
            NUM_SISBEN: [''],
            FECHA_SISBEN: [''],
            ID_REGIMEN: [5],
            ID_ADMINISTRADORA: [''],
            CONTRATO: [''],
            DATOS: [''],
            NOTIFICACION: [1],
        });
    }

    PacienteModal() {
        /*this.codifService.getDptos()
            .subscribe(data => {
                this.dptos = data;
                this.codifService.getMunicipios()
                    .subscribe(data => {
                        this.municipios = data;
                        this.codifService.getTipoIdent()
                            .subscribe(data => this.tipoident = data);
                    }
                );
            }
        );*/
		this.codifService.getTipoIdent()
            .subscribe(data => this.tipoident = data);
        setTimeout(() => 
        {
            $('#paciente_modal').modal('show');
        },500);
    }

    CancelPaciente() {
        $('#paciente_modal').modal('hide');
    }

    RegistrarP() {
        var that = this;
        this.submitted = true;

        if (this.pacienteForm.invalid) {
            return;
        }
        if($('#ID_TIPO_DOC').val() == '' || $('#ID_TIPO_DOC').val() == null) {
            alert("Por favor, escoja el tipo de documento");
            return false;
        }

        /*if(!confirm("Esta Seguro que desea Registrar el PACIENTE?")) 
                return false;*/
        this.pacienteForm.get('ID_MUNICIPIO').setValue(1127);
        this.pacienteForm.get('ID_TIPO_DOC').setValue($('#ID_TIPO_DOC').val());
        this.pacienteService.crearPacienteCita(this.pacienteForm.value)
            .subscribe(data => {
                let da: any = data;
                this.showMessage("Paciente registrado");
                this.submitted = false;
                var nombre = da.PRIMER_NOMBRE + (da.SEGUNDO_NOMBRE != null ? " "+da.SEGUNDO_NOMBRE : "");
                var apellidos = da.PRIMER_APELLIDO + (da.SEGUNDO_APELLIDO != null ? " "+da.SEGUNDO_APELLIDO : "");
                var newOptions = '<option value="'+da.ID_PACIENTE+'">'+nombre + ' ' + apellidos+'</option>';
                $('#PACIENTE').empty().html(newOptions).select2({
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
                    language: { 
                        inputTooShort: function () { 
                            return 'Por favor, entre al menos 1 caracter'; 
                        } 
                    },
                    placeholder: 'Buscar Pacientes',
                    minimumInputLength: 1,
                    allowClear: true
                });
                $('#PACIENTE').val(da.ID_PACIENTE).trigger('change');
                this.clearPac();
            }
        );
    }

    clearPac() {
        this.pacienteForm.get('ID_TIPO_DOC').setValue('');
        this.pacienteForm.get('NUM_DOC').setValue('');
        this.pacienteForm.get('FECHA_NAC').setValue('');
        this.pacienteForm.get('GENERO').setValue('');
        this.pacienteForm.get('PRIMER_NOMBRE').setValue('');
        this.pacienteForm.get('SEGUNDO_NOMBRE').setValue('');
        this.pacienteForm.get('PRIMER_APELLIDO').setValue('');
        this.pacienteForm.get('SEGUNDO_APELLIDO').setValue('');
        this.pacienteForm.get('dpto').setValue(34);
        this.pacienteForm.get('ID_MUNICIPIO').setValue(1127);
        this.pacienteForm.get('ZONA').setValue(1);
        this.pacienteForm.get('BARRIO').setValue('');
        this.pacienteForm.get('TELEF').setValue('');
        this.pacienteForm.get('MOVIL').setValue('');
        this.pacienteForm.get('CORREO').setValue('');
        this.pacienteForm.get('DIREC_PACIENTE').setValue('');
        this.pacienteForm.get('ACTIVO').setValue(1);
        this.pacienteForm.get('ID_ESTADO_CIVIL').setValue(6);
        this.pacienteForm.get('ID_GRP_SANG').setValue(1);
        this.pacienteForm.get('ID_ESCOLARIDAD').setValue(1);
        this.pacienteForm.get('ID_ETNIA').setValue(6);
        this.pacienteForm.get('ID_OCUPACION').setValue(511);
        this.pacienteForm.get('ID_DISCAPACIDAD').setValue(5);
        this.pacienteForm.get('ID_RELIGION').setValue(6);
        this.pacienteForm.get('GESTACION').setValue(2);
        this.pacienteForm.get('ID_TIPO_AFIL').setValue(7);
        this.pacienteForm.get('FECHA_AFIL').setValue('');
        this.pacienteForm.get('NUM_SISBEN').setValue('');
        this.pacienteForm.get('FECHA_SISBEN').setValue('');
        this.pacienteForm.get('ID_REGIMEN').setValue(5);
        this.pacienteForm.get('ID_ADMINISTRADORA').setValue('');
        this.pacienteForm.get('CONTRATO').setValue('');
        this.pacienteForm.get('DATOS').setValue('');
        /*this.muni_id = 1127;
        $('#dpto').val(34).trigger('change');*/
        $('#ID_TIPO_DOC').val('').trigger('change');
        /*this.getMunicipios(null);
        setTimeout(() => 
        {
            $('#ID_MUNICIPIO').val(1127).trigger('change');
        },500);*/
        $('#paciente_modal').modal('hide');
    }

    Registrar() {
    	if($('#fecha_pac').val() == '' || $('#fecha_pac').val() == null) {
    		alert("Por favor, debe escoger la fecha de nacimiento");
    		return false;
    	}
    	/*if(!confirm("Esta seguro que desea actualizar el dato del paciente?")) {
    		return false;
    	}*/
    	else {
	    	this.pacForm.get('FECHA_NAC').setValue($('#fecha_pac').val());
	    	this.pacienteService.updatePacienteFecha(this.idpaciente, this.pacForm.value)
	    		.subscribe(data => {
	    			$('#modal_pac').modal('hide');
	    			$('#PACIENTE').val(this.idpaciente).trigger('change');
	    			this.showMessage("Paciente actualizado");
	    		}
	    	);
	    }
    }

    CancelPac() {
    	$('#modal_pac').modal('hide');
		$('#PACIENTE').val('').trigger('change');
		this.idpaciente = 0;
    }

    UpdateH(evento) {
    	this.id_historia = evento;
    	this.historia_id = 0;
    	this.prints = false;
    	$('#ID_USUARIO').val('').trigger('change');
    	$('#HISTORIA').val('').trigger('change');
    	this.table = $('#data-table').DataTable(this.fillTable());
    }

    UpdateCita(evento) {
    	this.cita_id = 0;
    }

    UpdateTipo(evento) {
    	this.id_historia = evento;
    	this.historia_id = 0;
    	this.prints = false;
    }

    CancelarRegistro() {
    	this.cita_id = 0;
    	$('#PACIENTE').val('').trigger('change');
    	let url: any = '/historias';
	    this.router.navigateByUrl(url);
	    this.historiasService.listHistorias()
			.subscribe(data => {
				let hi: any = data;
				this.historias = hi;
                var newOptions = '<option value="">Seleccione...</option>';
                for(var i in hi) {
                	newOptions += '<option value="'+hi[i].ID_HISTORIA+'">'+hi[i].NOM_HISTORIA+'</option>';
                }
                $('#HISTORIA').empty().html(newOptions).select2({
                    dropdownAutoWidth:!0,
                    width:"100%",
                });
			}
		);
    	/*$('#EDAD').val('');
	    $('.genero').val('');
		$('#DIRECCION').val('');
		$('#CELULAR').val('');
		$('#ESTADO_CIVIL').val('');
		$('#ID_ADMINISTRADORA').val('');
		$('#ID_CONTRATO').val('');
		this.id_historia = 0;*/
    }

    ShowHistorico() {
    	$('#modal_historico').modal('show');
    }

    CancelHistorico() {
    	$('#HISTORIA').val('').trigger('change');
    	this.historia_id = 0;
    	$('#modal_historico').modal('hide');
    	this.prints = false;
    }

    fillTable() {
        let id_pac: any = this.id_pac;
        var that = this;
        return this.dtOptions = {
            pageLength: 5,
            autoWidth: !1,
            responsive: !0,
            "destroy": true,
            "order": [[0, 'desc']],
            language: {
                "url": "assets/Spanish.json",
                searchPlaceholder: "Escriba parametro a filtrar...",
                "emptyTable": "SIN HISTORIAS CLINICAS"
            },
            ajax: this.globals.apiUrl+'/historias/historiapaciente?id_pac='+id_pac,
            columns: [
                { title: 'Fecha diligenciada', data: 'FEC_DILIGENCIADA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<i class="zmdi zmdi-calendar-check"></i> '+moment(data).format('YYYY/MM/DD H:mm');
                }},
                { title: 'Prestador', data: 'ID_USUARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  row.usuario.NOMBRES + " " + row.usuario.APELLIDOS;
                }},
                { title: 'Registro clínico', data: 'ID_HISTORIA', className: "align-middle", "render": function ( data, type, row, meta ) {
                        return  row.historia.NOM_HISTORIA;
                }},
                { title: 'Acción', data: 'ID_HISTORIA_PACIENTE', "render": function ( data, type, row, meta ) {
                    let imprimir = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-print" title="Generar PDF" data-toggle="tooltip"><i class="actions__item zmdi zmdi-print"></i></button> ';
                    let editar = (that.role == "ADMINISTRADOR" || that.role == "ADMIN") ? '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar historia" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ' : '';
                    return imprimir + editar;
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

    fillHistoria(id) {
        var that = this;
        this.prints = false;
        this.historiasService.getHistoriaPacientes(id)
            .subscribe(data => {
                let da: any = data;
                this.historia_id = id;
                $('#HISTORIA').val(da.ID_HISTORIA).trigger('change');
                var newOptions = '<option value="'+da.usuario.ID_USUARIO+'">'+da.usuario.NOMBRES + ' ' + da.usuario.APELLIDOS+'</option>';
                $('#ID_USUARIO').empty().html(newOptions).select2({
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
                $('#ID_USUARIO').val(da.ID_USUARIO).trigger('change');
                setTimeout(() => 
				{
					$('#PARENTESCO').val(da.ID_PARENTESCO).trigger('change');
					var campos = da.campos;
	                for(var i in campos) {
	                    var obj = document.getElementById(campos[i]['CAMPO']);
	                    if($(obj).prop('class') == "wysiwyg-editor trumbowyg-editor" || $(obj).prop('class') == "trumbowyg-textarea") {
	                    	$('#editor').val(campos[i]['VALOR']);
	                    	$(obj).html(campos[i]['VALOR']);
	                    }
	                    else {
	                    	if(campos[i]['CAMPO'] == 'DIAGNOSTICO' || campos[i]['CAMPO'] == 'DIAGNOSTICOD' || campos[i]['CAMPO'] == 'DIAGNOSTICOF' || campos[i]['CAMPO'] == 'DIAGNOSTICOO' ||
	                    		campos[i]['CAMPO'] == 'DIAGNOSTICOG' || campos[i]['CAMPO'] == 'DIAGNOSTICOSB' || campos[i]['CAMPO'] == 'DIAGNOSTICODI' || campos[i]['CAMPO'] == 'DIAGNOSTICOAN' ||
	                    		campos[i]['CAMPO'] == 'DIAGNOSTICOMA' || campos[i]['CAMPO'] == 'DIAGNOSTICOEV' || campos[i]['CAMPO'] == 'DIAGNOSTICOFI' || campos[i]['CAMPO'] == 'DIAGNOSTICOPPAL' || 
	                    		campos[i]['CAMPO'] == 'DIAGNOSTICOR1' || campos[i]['CAMPO'] == 'DIAGNOSTICOR2' || campos[i]['CAMPO'] == 'DIAGNOSTICOR3' || campos[i]['CAMPO'] == 'DIAGNOSTICOA' ||
	                    		campos[i]['CAMPO'] == 'DIAGNOSTICOP' || campos[i]['CAMPO'] == 'DIAGNOSTICOPE' || campos[i]['CAMPO'] == 'DIAGNOSTICOT' || campos[i]['CAMPO'] == 'DIAGNOSTICOOT' ||
	                    		campos[i]['CAMPO'] == 'DIAGNOSTICOPR' || campos[i]['CAMPO'] == 'DIAGNOSTICOHIST') {
	                    		if(campos[i]['VALOR'] != null) {
	                    			let camp: any = campos[i]['CAMPO'];
	                    			var newOptions = '<option value="'+campos[i]['VALOR']+'">'+da[camp]+'</option>';
			                		$(obj).empty().html(newOptions).select2({
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
									    }
									);
									$(obj).val(campos[i]['VALOR']).trigger('change');
							    }
	                    	}
	                    	else if(campos[i]['CAMPO'] == 'TDIAGNOSTICO')
	                    		$(obj).val(campos[i]['VALOR']).trigger('change');
	                    	else
	                    		$(obj).val(campos[i]['VALOR']);
	                    }
	                }
	                if(da.familiares.length > 0) {
	                	var arr = [];
	                	for(var i in da.familiares){
	                		arr.push({'nombre': da.familiares[i]['NOMBRE'], 'edad': da.familiares[i]['EDAD'], 'parentesco': da.familiares[i]['ID_PARENTESCO'], 'ocupacion': da.familiares[i]['ID_OCUPACION'],
	                				'parent': da.familiares[i]['parentesco']['NOM_PARENTESCO'], 'ocup': da.familiares[i]['ocupacion']['NOM_OCUPACION']});
	                	}
	                	that.familiares = arr;
	                }
	                else
	                	that.familiares = [];
	                if(da.diagnosticos.length > 0) {
	                	var arr = [];
	                	var campo = da.diagnosticos[0]['CAMPO'];
	                	var newOptions = '';
	                	for(var i in da.diagnosticos){
	                		arr.push(da.diagnosticos[i]['ID_DIAGNOSTICO']);
	                		newOptions += '<option value="'+da.diagnosticos[i]['ID_DIAGNOSTICO']+'">'+da.diagnosticos[i]['diagnostico']['COD_DIAGNOSTICO']+ " " +da.diagnosticos[i]['diagnostico']['NOM_DIAGNOSTICO'] +'</option>';
	                	}
	                	var objs = document.getElementById(campo);
	                	$(objs).empty().html(newOptions).select2({
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
						$(objs).val(arr).trigger('change');
	                }
	                if(da.odontologia.length > 0) {
	                	for(var i in da.odontologia){
	                		let campo: any = document.getElementById(da.odontologia[i]['CAMPO']);
	                		let img: any = $(campo).children("img");
	                		if(da.odontologia[i]['DIAGNSOTICO'] != 0) {
	                			that.codifService.getDiagOdontologia(da.odontologia[i]['DIAGNSOTICO'])
	                				.subscribe(datos => {
	                					let diag: any = datos;
	                					if(diag.TIPO_IDENTI == 1) {
		        							$(img).prop('src', 'assets/img/odontologia/'+diag.VALOR);
		        							$(campo).prop('diag', diag.ID_DIAG_HIJO);
	                					}
				                		else {
				                			$(campo).prop('style', 'background-color: #'+diag.VALOR+';');
		        							$(campo).prop('diag', diag.ID_DIAG_HIJO);
				                		}
	                				})
	                		}
	                		else {
	                			$(img).prop('src', 'assets/img/white.png');
	                			$(campo).prop('style', 'background-color: #FFFFFF;');
	                			$(campo).prop('diag', '0');
	                		}
	                	}
	                }
	                if(da.odontrat.length > 0) {
	                	for(var i in da.odontrat){
	                		let campo: any = document.getElementById(da.odontrat[i]['CAMPO']);
	                		let img: any = $(campo).children("img");
	                		if(da.odontrat[i]['TRATAMIENTO'] != 0) {
				                if(da.odontrat[i]['EVOLUCION'] == '1') {
					                let div: any = document.getElementById('rowevolucion');
									let dive: any = $(div).find('div').children('div[name="'+da.odontrat[i]['DIENTE']+'"]').children('div[name="'+da.odontrat[i]['NAME']+'"]');
									$(dive).prop('style', 'background-color: #0358f3;');
								}
	                			that.codifService.getTratOdontologia(da.odontrat[i]['TRATAMIENTO'])
	                				.subscribe(datos => {
	                					let trat: any = datos;
	                					if(trat.TIPO_IDENTI == 1) {
		        							$(img).prop('src', 'assets/img/odontologia/'+trat.VALOR);
		        							$(campo).prop('trat', trat.ID_TRAT_HIJO);
	                					}
				                		else {
				                			$(campo).prop('style', 'background-color: #'+trat.VALOR+';');
		        							$(campo).prop('trat', trat.ID_TRAT_HIJO);
				                		}
	                				})
	                		}
	                		else {
	                			$(img).prop('src', 'assets/img/white.png');
	                			$(campo).prop('style', 'background-color: #FFFFFF;');
	                			$(campo).prop('trat', '0');
	                		}
	                	}
	                }
	                if(da.consentimientos.length > 0) {
	                	for(var i in da.consentimientos){
	                		let che: any = (da.consentimientos[i].VALOR == 1 ? true : false);
	                		let campo: any = document.getElementById(da.consentimientos[i].CAMPO);
	                		$(campo).prop('checked', che);
	                	}
	                }
	                if(da.indice.length > 0) {
	                	for(var i in da.indice){
	                		let campo: any = document.getElementById(da.indice[i]['CAMPO']);
	                		if($(campo).hasClass("indiceorealy") && da.indice[i]['VALOR'] == 0) {
	                			$(campo).removeClass("indiceorealy");
	                		}
	                		else
	                		if(da.indice[i]['VALOR'] == 1)
	                			$(campo).addClass("indiceorealy");
	                	}
	                }
	                if(da.examenurg.length > 0) {
	                	var arr = [];
	                	for(var i in da.examenurg){
	                		arr.push({'examen': da.examenurg[i]['items']['COD_ITEM'] + " " + da.examenurg[i]['items']['NOM_ITEM'], 'cantidad': da.examenurg[i]['CANTIDAD'], 'id': da.examenurg[i]['ID_ITEM']});
	                	}
	                	that.examenes = arr;
	                }
	                else
	                	that.examenes = [];
	                if(da.servicio.length > 0) {
	                	var arr = [];
	                	for(var i in da.servicio){
	                		arr.push({'servicio': da.servicio[i]['items']['COD_ITEM'] + " " + da.servicio[i]['items']['NOM_ITEM'], 'cantidad': da.servicio[i]['CANTIDAD'], 'descripcion': da.servicio[i]['DESCRIPCION'], 'id': da.servicio[i]['ID_ITEM']});
	                	}
	                	that.servicios = arr;
	                }
	                else
	                	that.servicios = [];
	                $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar Registro');
	                $('#modal_historico').modal('hide');
				},2000);
            })
    }

    GenerarPdfs(id) {
    	this.historiasService.getHistoriaPacientes(id)
            .subscribe(data => {
                let da: any = data;
                this.historia_id = id;
                this.prints = true;
                this.id_historia = da.ID_HISTORIA;
            }
        );
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