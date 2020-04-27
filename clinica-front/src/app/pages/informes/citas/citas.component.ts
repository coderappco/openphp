import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/moment.js';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { UserService } from '../../../services/usuario.service';
import { AdministradoraService } from '../../../services/administradora.service';
import { CodifService } from '../../../services/codif.service';
import { ReportesService } from '../../../services/reportes.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  	selector: 'app-citas',
  	templateUrl: './citas.component.html',
  	styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

	citaForm: FormGroup;
	prestadores: any = [];
	administradoras: any = [];
	empresas: any = [];
	print:any = false;
	motivoc: any = [];
	rol: any = '';
	disabled: any = false;
	empresa_id: any = 0;
	dtOptions: any = {};
  	table: any = '';

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private userService: UserService, private adminService: AdministradoraService,
  				private codifService: CodifService, private _loadingBar: SlimLoadingBarService, private reportesService: ReportesService, private empresaService: EmpresaService) { }

  	ngOnInit() {
  		this.initForm();
  		let us = JSON.parse(localStorage.getItem('currentUser'));
  		this.rol = us.role;
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
		{
			this.globals.getUrl = 'informecita';
		},0);

		$('.select2').select2({dropdownAutoWidth:!0,width:"100%",allowClear: true});
		$(".date-picker.fecha").flatpickr({mode: "range", dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'});

        let us = JSON.parse(localStorage.getItem('currentUser'));
        let empresa: any = null;
		if(us.role != 'ADMINISTRADOR') {
			empresa = us.empresa_id;
			this.empresa_id = us.empresa_id;
			setTimeout(() => 
			{
				this.disabled = true;
			},0);
			this.userService.getPrestadores(empresa)
            	.subscribe(data => this.prestadores = data);
		}
		else {
			this.empresaService.getEmpresas()
				.subscribe(data => this.empresas = data);
		}

        this.adminService.getAdministradoras()
            .subscribe(data => this.administradoras = data);
        this.codifService.getMotivoC()
            .subscribe(data => this.motivoc = data);

        $('#ID_EMPRESA').on( 'change', function () {
        	if($(this).val() != '') {
	        	that.empresa_id = $(this).val();
	            that.userService.getPrestadores(that.empresa_id)
	                .subscribe(data => {
	                    var newOptions = '<option value="">Seleccione...</option>';
	                    for(var d in data) {
	                        newOptions += '<option value="'+ data[d].ID_USUARIO +'">'+ data[d].NOMBRES +" "+ data[d].APELLIDOS +'</option>';
	                    }
	                    $('#ID_PRESTADOR').empty().html(newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
	            });
	        }
	        else
	        	$('#ID_PRESTADOR').empty().select2({dropdownAutoWidth:!0,width:"100%"});
        });
	}

	get f() { return this.citaForm.controls; }

	initForm() {
        this.citaForm = this.formBuilder.group({
            ID_PRESTADOR: [''],
            ID_ADMINISTRADORA: [''],
            FECHA: [''],
            ID_MOTIVO_CONSULTA: [''],
            ESTADO_CITA: [''],
            ESTADO_PACIENTE: [''],
            ID_EMPRESA: [''],
  	    });
  	}

  	exportAsExcelFile(json: any[], excelFileName: string, empresa: any) {
		/*const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		workbook.SheetNames.push("Test Sheet");
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });*/
		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.json_to_sheet(json);
        wb.SheetNames.push(empresa);
        wb.Sheets[empresa] = ws;
        var excelBuffer: any = XLSX.write(wb, {bookType:'xlsx',  type: 'array'});
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	saveAsExcelFile(buffer: any, fileName: string) {
		const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
		FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + ".xlsx");
	}

	Buscar() {
		if(this.rol == 'ADMINISTRADOR' && $('#ID_EMPRESA').val() == '') {
  			alert("Por favor, debe escoger la empresa");
  			return false;
  		}
    	var that = this;
	    var estadoc = 0;
	    $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                estadoc = $(this).val();
            }
        });
        var estadop = ($('#estadop').prop('checked') == true) ? 1 : 0;
		let data: any = 'pres='+$('#ID_PRESTADOR').val()+'&admin='+$('#ID_ADMINISTRADORA').val()+'&motivo='+$('#ID_MOTIVO_CONSULTA').val()+
						'&estado='+estadoc+'&fecha='+$('#FECHA').val()+'&paciente='+estadop+'&empresa='+this.empresa_id;
		$('.table-responsive').prop('style', 'display: block');
  		this.table = $('#data-table').DataTable(this.fillTable(data));
  	}

  	fillTable(data) {
        return this.dtOptions = {
            pageLength: 10,
            responsive: !0,
            "destroy": true,
            language: {
                "url": "src/assets/Spanish.json",
                 searchPlaceholder: "Escriba parametro a filtrar..."
            },
            ajax: this.globals.apiUrl+'/reportes/citas/table?'+data,
            columns: [
                { title: 'Tipo Identificación', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return row.paciente.identificacion.NOM_TIPO_IDENTIFICACION;
                }},
                { title: 'Identificación', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return row.paciente.NUM_DOC;
                }},
                { title: 'Paciente', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    let nombre = row.paciente.PRIMER_NOMBRE + (row.paciente.SEGUNDO_NOMBRE != null ? " "+row.paciente.SEGUNDO_NOMBRE : "");
					let apellido = row.paciente.PRIMER_APELLIDO + (row.paciente.SEGUNDO_APELLIDO != null ? " "+row.paciente.SEGUNDO_APELLIDO : "");
                    return nombre+" "+apellido;
                }},
                { title: 'Género', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                	let genero = (row.paciente.GENERO != null) ? (row.paciente.GENERO == 1 ? "Masculino" : (row.paciente.GENERO == 2 ? "Femenino" : "Indeterminado")) : "Indeterminado";
                    return '<code><i class="zmdi zmdi-badge-check"></i> '+genero+'</code>';
                }},
                { title: 'Edad', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    let yDiff: any = "-";
        			let mDiff: any = "-";
	    			if(row.paciente.FECHA_NAC != null) {
			    		let m1: any = moment(row.paciente.FECHA_NAC);
						let m2: any = moment().format('YYYY-MM-DD');
						yDiff = moment().year() - moment(row.paciente.FECHA_NAC).year();
        				mDiff = moment().month() - moment(row.paciente.FECHA_NAC).month();
        				if (mDiff < 0) {
				            mDiff = 12 + mDiff;
				            yDiff--;
				        }
					}
                    return yDiff != "-" ? yDiff + " años " + mDiff + " meses" : "NO ASIGNADO";
                }},
                { title: 'Fecha Cita', data: 'FEC_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return '<i class="zmdi zmdi-calendar"></i> '+moment(data).format('DD/MM/YYYY hh:mm A');
                } },
                { title: 'Prestador', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return '<i class="zmdi zmdi-user"></i> '+row.prestador.usuario.NOMBRES + " " + row.prestador.usuario.APELLIDOS;
                } }, 
                { title: 'Administradora', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    let contrato = row.paciente.contrato != null ? row.paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR";
                    return contrato;
                } },
                { title: 'Tipo de Cita', data: 'ID_CITA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    let tipo = '';
                    if(row.TIPO_CITA != 0) {
                       	if(row.TIPO_CITA == 1) tipo = "ADULTO MAYOR";
		                if(row.TIPO_CITA == 2) tipo = "AGUDEZA VISUAL";
		                if(row.TIPO_CITA == 3) tipo = "CITOLOGIA";
		                if(row.TIPO_CITA == 4) tipo = "CITOLOGIA GESTANTE";
		                if(row.TIPO_CITA == 5) tipo = "CONSULTA 1 VEZ";
		                if(row.TIPO_CITA == 6) tipo = "CONSULTA EXTERNA";
		                if(row.TIPO_CITA == 7) tipo = "CONTROL ECNT";
		                if(row.TIPO_CITA == 8) tipo = "CP 1 VEZ";
                    }
                    else
                       tipo = "ADULTO MAYOR"; 
                    return tipo;
                } },
                { title: 'Motivo', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    return row.motivoc.NOM_MOTIVO_CONSULTA;
                } },
                { title: 'Servicio', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    let cod_cup = row.servicio.COD_CUP != null ? row.servicio.COD_CUP : "-";
                    return cod_cup + " " + row.servicio.NOM_ITEM;
                } },
                { title: 'Telefonos', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    let telefono = row.paciente.TELEF != null ? row.paciente.TELEF : "-";
                    let movil = row.paciente.MOVIL != null ? row.paciente.MOVIL : "-";
                    return telefono + "-" + movil;
                } },
                { title: 'Dirección', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    let dire = row.paciente.DIREC_PACIENTE != null ? row.paciente.DIREC_PACIENTE : "-";
                    return dire;
                } },
                { title: 'Barrio', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    let barrio = row.paciente.BARIIO != null ? row.paciente.BARIIO != null : '-';
                    return barrio;
                } },
                { title: 'Sede', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                    return row.consultorio.sede.NOM_SEDE;
                } },
                { title: 'Víctima de Maltrato', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
                	let vmaltrato = row.paciente.VIC_MALTRATO == 1 ? "SI" : "-";
                    return vmaltrato;
                } },
                { title: 'Víctima conflicto', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let varmado = row.paciente.VIC_CONF_ARMADO == 1 ? "SI" : "-";
                    return varmado;
                } },
                { title: 'Desplazado', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let desplazado = row.paciente.DESPLAZADO == 1 ? "SI" : "-";
                    return desplazado;
                } },
                { title: 'LGBTI', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let lgbti = row.paciente.LGBTI == 1 ? "SI" : "-";
                    return lgbti;
                } },
                { title: 'Pensionado', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let pensionado = row.paciente.PENSIONADO == 1 ? "SI" : "-";
                    return pensionado;
                } },
                { title: 'Etnia', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let etnia = row.paciente.etnia.NOM_ETNIA;
                    return etnia;
                } },
                { title: 'Discapacidad', data: 'ID_CITA', className: "align-left", "render": function ( data, type, row, meta ) {
	    			let discapacidad = row.paciente.discapacidad.NOM_DISCAPACIDAD;
                    return discapacidad;
                } }
            ],
            dom: '<"dataTables__top"lfB>rt<"dataTables__bottom"ip><"clear">',
            "initComplete": function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    //$(this).closest(".dataTables_wrapper").find(".dataTables__top").prepend('<div class="dataTables_buttons hidden-sm-down actions"><span class="actions__item zmdi zmdi-print" data-table-action="print" /><span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" /><div class="dropdown actions__item"><i data-toggle="dropdown" class="zmdi zmdi-download" /><ul class="dropdown-menu dropdown-menu-right"><a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a><a href="" class="dropdown-item" data-table-action="csv">CSV (.csv)</a></ul></div></div>')
            },
        };
    }

	exportAsXLSX() {
		if(this.rol == 'ADMINISTRADOR' && $('#ID_EMPRESA').val() == '') {
  			alert("Por favor, debe escoger la empresa");
  			return false;
  		}
		var that = this;
		var estadoc = 0;
	    this._loadingBar.start();
	    that.citaForm.get('ID_PRESTADOR').setValue($('#ID_PRESTADOR').val());
	    that.citaForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
	    that.citaForm.get('FECHA').setValue($('#FECHA').val());
	    that.citaForm.get('ID_MOTIVO_CONSULTA').setValue($('#ID_MOTIVO_CONSULTA').val());
	    that.citaForm.get('ID_EMPRESA').setValue(this.empresa_id);
	    $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                estadoc = $(this).val();
            }
        });
        var estadop = ($('#estadop').prop('checked') == true) ? 1 : 0;
	    that.citaForm.get('ESTADO_CITA').setValue(estadoc);
	    that.citaForm.get('ESTADO_PACIENTE').setValue(estadop);
	    this.reportesService.getReporteCitas(this.citaForm.value)
	    	.subscribe(data => {
	    		let da: any = data;
	    		var arr: any = [];
	    		for(var i in da){
	    			let yDiff: any = "-";
        			let mDiff: any = "-";
        			let tipo = '';
	    			if(da[i].paciente.FECHA_NAC != null) {
			    		let m1: any = moment(da[i].paciente.FECHA_NAC);
						let m2: any = moment().format('YYYY-MM-DD');
						yDiff = moment().year() - moment(da[i].paciente.FECHA_NAC).year();
        				mDiff = moment().month() - moment(da[i].paciente.FECHA_NAC).month();
        				if (mDiff < 0) {
				            mDiff = 12 + mDiff;
				            yDiff--;
				        }
					}
					if(da[i].TIPO_CITA != 0) {
                       	if(da[i].TIPO_CITA == 1) tipo = "ADULTO MAYOR";
		                if(da[i].TIPO_CITA == 2) tipo = "AGUDEZA VISUAL";
		                if(da[i].TIPO_CITA == 3) tipo = "CITOLOGIA";
		                if(da[i].TIPO_CITA == 4) tipo = "CITOLOGIA GESTANTE";
		                if(da[i].TIPO_CITA == 5) tipo = "CONSULTA 1 VEZ";
		                if(da[i].TIPO_CITA == 6) tipo = "CONSULTA EXTERNA";
		                if(da[i].TIPO_CITA == 7) tipo = "CONTROL ECNT";
		                if(da[i].TIPO_CITA == 8) tipo = "CP 1 VEZ";
                    }
                    else
                        tipo = "ADULTO MAYOR";
                    let telefono = da[i].paciente.TELEF != null ? da[i].paciente.TELEF : "-";
                    let movil = da[i].paciente.MOVIL != null ? da[i].paciente.MOVIL : "-";
                    let dire = da[i].paciente.DIREC_PACIENTE != null ? da[i].paciente.DIREC_PACIENTE : "-";
                    let cod_cup = da[i].servicio.COD_CUP != null ? da[i].servicio.COD_CUP : "-";
	    			let genero = da[i].paciente.GENERO == 1 ? "Masculino" : da[i].paciente.GENERO == 2 ? "Femenino" : "Indefinido";
	    			let admin = da[i].paciente.contrato != null ? da[i].paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR";
	    			let barrio = da[i].paciente.BARIIO != null ? da[i].paciente.BARIIO != null : '-';
	    			let vmaltrato = da[i].paciente.VIC_MALTRATO == 1 ? "SI" : "-";
	    			let varmado = da[i].paciente.VIC_CONF_ARMADO == 1 ? "SI" : "-";
	    			let desplazado = da[i].paciente.DESPLAZADO == 1 ? "SI" : "-";
	    			let lgbti = da[i].paciente.LGBTI == 1 ? "SI" : "-";
	    			let pensionado = da[i].paciente.PENSIONADO == 1 ? "SI" : "-";
	    			let etnia = da[i].paciente.etnia.NOM_ETNIA;
	    			let discapacidad = da[i].paciente.discapacidad.NOM_DISCAPACIDAD;
                    let edad = yDiff != "-" ? yDiff + " años " + mDiff + " meses" : "NO ASIGNADA";
	    			arr[i] = {'ID_CITA': da[i].ID_CITA,'Tipo_Documento': da[i].paciente.identificacion.NOM_TIPO_IDENTIFICACION,'Primer Nombre': da[i].paciente.PRIMER_NOMBRE,
	    					'Segundo Nombre': da[i].SEGUNDO_NOMBRE, 'Primer Apellido': da[i].paciente.PRIMER_APELLIDO, 'Segundo Apellido': da[i].paciente.SEGUNDO_APELLIDO,
	    					'Genero': genero, 'Edad': edad, 'Administradora': admin, 'Fecha Cita': moment(da[i].FEC_CITA).format('DD/MM/YYYY'),
	    					'Prestador': da[i].prestador.usuario.NOMBRES + " " + da[i].prestador.usuario.APELLIDOS, 'Tipo Cita': tipo, 'Motivo Consulta': da[i].motivoc.NOM_MOTIVO_CONSULTA,
	    					'Servicio': cod_cup + " " + da[i].servicio.NOM_ITEM, 'Teléfono': telefono + "-" + movil, 'Dirección': dire, 'Barrio': barrio, 'Sede': da[i].consultorio.sede.NOM_SEDE,
	    					'Víctima Maltrato': vmaltrato, 'Víc. Conflicto Armado': varmado, 'Deslazado': desplazado, 'LGBTI': lgbti, 'Pensionado': pensionado, 'Etnia': etnia,
	    					'Discapacidad': discapacidad};
	    		}
	    		let empresa_name: any = '';
	    		if(da.length == 0) 
	    			arr[0] = {'RESULTADO': "No existen resultados para los criterios de Búsqueda."};
	    		if(da.length == 0) {
					this.empresaService.getEmpresa(this.empresa_id)
						.subscribe(data => {
							let em: any = data;
							empresa_name = em.NOM_EMPRESA;
							this.exportAsExcelFile(arr, 'reporte_citas', empresa_name);
	    					that._loadingBar.complete();
						}
					);
				}
				else {
	    			empresa_name = da[0].prestador.usuario.empresa.empresa.NOM_EMPRESA;
		    		this.exportAsExcelFile(arr, 'reporte_citas', empresa_name);
		    		that._loadingBar.complete();
		    	}
	    	}
	    );
	}

  	clearAll() {
  		this.citaForm.get('ID_PRESTADOR').setValue('');
	    this.citaForm.get('ID_ADMINISTRADORA').setValue('');
	    this.citaForm.get('FECHA').setValue('');
	    this.citaForm.get('ID_MOTIVO_CONSULTA').setValue('');
	    this.citaForm.get('ID_EMPRESA').setValue('');
        $('#estadop').prop('checked', true);
	    this.citaForm.get('ESTADO_CITA').setValue('');
	    this.citaForm.get('ESTADO_PACIENTE').setValue('');
	    $('input[name=datos]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');            
        });
        $('#ID_PRESTADOR').val('').trigger('change');
        $('#ID_ADMINISTRADORA').val('').trigger('change');
        $('#ID_MOTIVO_CONSULTA').val('').trigger('change');
        $('#FECHA').val('');
        $('#ID_EMPRESA').val('').trigger('change');
        $('.table-responsive').prop('style', 'display: none');
  	}

  	GenerarPdf() {
  		if(this.rol == 'ADMINISTRADOR' && $('#ID_EMPRESA').val() == '') {
  			alert("Por favor, debe escoger la empresa");
  			return false;
  		}
    	var that = this;
	    this.print = true;
	    var estadoc = 0;
	    this._loadingBar.start();
	    that.citaForm.get('ID_PRESTADOR').setValue($('#ID_PRESTADOR').val());
	    that.citaForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
	    that.citaForm.get('FECHA').setValue($('#FECHA').val());
	    that.citaForm.get('ID_MOTIVO_CONSULTA').setValue($('#ID_MOTIVO_CONSULTA').val());
	    that.citaForm.get('ID_EMPRESA').setValue(this.empresa_id);
	    $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                estadoc = $(this).val();
            }
        });
        var estadop = ($('#estadop').prop('checked') == true) ? 1 : 0;
	    that.citaForm.get('ESTADO_CITA').setValue(estadoc);
	    that.citaForm.get('ESTADO_PACIENTE').setValue(estadop);
	    this.reportesService.getReporteCitas(this.citaForm.value)
	    	.subscribe(data => {
	    		let da: any = data;
	    		var page = 1;
			    var pdf = new jsPDF('l', 'cm', 'A4');
			    var div = document.createElement('div');
			    var i = 0;
			    var item = 1;
				var html = '';
				if(da.length > 0) {
					for(i = 0; i < da.length; i++) {
						if(item <= 25) {
							html = this.Paciente(html, da[i]);
							item++;
							if(i == (da.length - 1)) {
								$(div).prop('id', 'print'+page);
								$(div).addClass('row col-md-12').html(that.Header(da[i].prestador.usuario.empresa.empresa)+html);
								var datos = document.getElementById('print');
								$(div).appendTo($(datos));
								var terminar = true;
								that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
							}
						}
						else {
							html = this.Paciente(html, da[i]);
							var div = document.createElement('div');
							$(div).prop('id', 'print'+page);
							$(div).addClass('row col-md-12').html(that.Header(da[i].prestador.usuario.empresa.empresa)+html);
							var datos = document.getElementById('print');
							$(div).appendTo($(datos));
							var terminar = false;
							that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
							page++;
							item = 1;
							html = '';
						}
					}
				}
				else {
					this.empresaService.getEmpresa(this.empresa_id)
						.subscribe(data => {
							let em: any = data ;
							$(div).prop('id', 'print'+page);
							$(div).addClass('row col-md-12').html(that.Header(em)+'<div class="col-md-12 text-center">NO EXISTEN DATOS PARA ESTOS CRITERIOS DE BUSQUEDA</div>');
							var datos = document.getElementById('print');
							$(div).appendTo($(datos));
							var terminar = true;
							that.CrearImagen(pdf,document.getElementById('print'+page),terminar);
						}
					);
				}
	    	}
	    )
	}

	Paciente(html, cita) {
		let nombre = cita.paciente.PRIMER_NOMBRE + (cita.paciente.SEGUNDO_NOMBRE != null ? " "+cita.paciente.SEGUNDO_NOMBRE : "");
		let apellido = cita.paciente.PRIMER_APELLIDO + (cita.paciente.SEGUNDO_APELLIDO != null ? " "+cita.paciente.SEGUNDO_APELLIDO : "");
    	let genero = (cita.paciente.GENERO != null) ? (cita.paciente.GENERO == 1 ? "M" : (cita.paciente.GENERO == 2 ? "F" : "I")) : "I";
    	let contrato = cita.paciente.contrato != null ? cita.paciente.contrato.contrato.administradora.NOM_ADMINISTRADORA : "PARTICULAR"
    	html = html + '<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:3%;">'+ cita.paciente.identificacion.COD_TIPO_IDENTIFICACION + '</div>'+
                '<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:9%;">'+ cita.paciente.NUM_DOC + '</div>'+
                '<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:20%;">'+ nombre + ' ' + apellido + '</div>'+
    			'<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:5%;">'+ genero + '</div>' +
    			'<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:9%;">'+ cita.FEC_CITA + '</div>' +
    			'<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:18%;">'+ cita.prestador.usuario.NOMBRES + " " + cita.prestador.usuario.APELLIDOS + '</div>' +
    			'<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:18%;">' + contrato + '</div>' +
    			'<div class="align-middle text-left" style="margin: 0;padding: 0;padding-bottom: 2px;width:18%;">'+ cita.motivoc.NOM_MOTIVO_CONSULTA + '</div>';
    	return html;
    }

	Header(empresa) {
		let dire: any = empresa.DIREC_EMP != null ? empresa.DIREC_EMP : "-";
		let tele: any = empresa.TELEF != null ? empresa.TELEF : "-";
        let fechai = moment().format('DD/MM/YYYY H:mm');
    	var html = '<div class="col-md-6 text-left"><h5>EMPRESA: '+empresa.NOM_EMPRESA+'</h5></div>' +
                '<div class="col-md-6 text-right">Fecha de Impresión: '+fechai+'</div>' +
    			'<div class="col-md-12 text-left"><h5>DIRECCION: '+dire+'</h5></div>' +
    			'<div class="col-md-12 text-left"><h5>TELÉFONO: '+tele+'</h5></div>' +
    			'<div class="col-md-12 text-left"><h5>MUNICIPIO: '+empresa.municipio.NOM_MUNICIPIO+'</h5></div>' +
    			'<div class="col-md-12 text-center"><h2>INFORME DE CITAS</h2></div>' +
    			'<div class="col-md-12" style="box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef;"></div>'+
    			'<div class="text-left" style="margin: 0;padding: 0;width:3%;">Tipo</div>' +
                '<div class="text-left" style="margin: 0;padding: 0;width:9%;">No. Identidad</div>' +
                '<div class="text-left" style="margin: 0;padding: 0;width:20%;">Nombre y Apellidos</div>' +
    			'<div class="text-left" style="margin: 0;padding: 0;width:5%;">Género</div>' +
    			'<div class="text-left" style="margin: 0;padding: 0;width:9%;">Fecha cita</div>'+
    			'<div class="text-left" style="margin: 0;padding: 0;width:18%;">Prestador</div>'+
    			'<div class="text-left" style="margin: 0;padding: 0;width:18%;">Administradora</div>'+
    			'<div class="text-left" style="margin: 0;padding: 0;width:18%;">Motivo Consulta</div>'+
    			'<div class="col-md-12" style="box-sizing: content-box;height: 0;overflow: visible; border: 0; border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef;"></div>';
    	return html;
    }

	CrearImagen(pdf, div, terminar) {
    	var that = this;
    	html2canvas(div).then(canvas => {
    		var imgWidth = 28; 
			var pageHeight = 20;		
			var imgHeight = canvas.height * imgWidth / canvas.width;
			var heightLeft = imgHeight;								
			var contentDataURL = canvas.toDataURL('image/png');
			pdf.addPage();
			pdf.addImage(contentDataURL, 'PNG', 1, 1, imgWidth, imgHeight);
			if(terminar == true) {
					pdf.deletePage(1)
					that.print = false;
					$('#print').empty();
					pdf.save('informe_citas.pdf');
					that._loadingBar.complete();
			}	
		})
    }
}
