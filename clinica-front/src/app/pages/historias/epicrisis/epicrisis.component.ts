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
import { AdultomayorComponent } from '../adultomayor/adultomayor.component';
import { VisualComponent } from '../visual/visual.component';
import { AiepiComponent } from '../aiepi/aiepi.component';
import { Consulta1vezComponent } from '../consulta1vez/consulta1vez.component';
import { ConsultaexComponent } from '../consultaex/consultaex.component';
import { ExternaComponent } from '../externa/externa.component';
import { UrgenciasComponent } from '../urgencias/urgencias.component';
import { DermatologicaComponent } from '../dermatologica/dermatologica.component';
import { JovenpypComponent } from '../jovenpyp/jovenpyp.component';
import { OdontologiaComponent } from '../odontologia/odontologia.component';
import { EodontologiaComponent } from '../eodontologia/eodontologia.component';
import { UodontologiaComponent } from '../uodontologia/uodontologia.component';
import { OdontoComponent } from '../odonto/odonto.component';
import { PlanifamComponent } from '../planifam/planifam.component';
import { ReferenciaComponent } from '../referencia/referencia.component';
import { TraigeComponent } from '../traige/traige.component';
import { PsicologicaComponent } from '../psicologica/psicologica.component';
import { CitologiaComponent } from '../citologia/citologia.component';
import { MaternaComponent } from '../materna/materna.component';
import { CydaintegralComponent } from '../cydaintegral/cydaintegral.component';
import { BasicaComponent } from '../basica/basica.component';
import { Aiepi2mComponent } from '../aiepi2m/aiepi2m.component';
import { EnfermedadescComponent } from '../enfermedadesc/enfermedadesc.component';
import { PsiquiatricaComponent } from '../psiquiatrica/psiquiatrica.component';

declare var $: any

@Component({
  	selector: 'app-epicrisis',
  	templateUrl: './epicrisis.component.html',
  	styleUrls: ['./epicrisis.component.css'],
  	providers:[AdultomayorComponent,VisualComponent,ConsultaexComponent,Consulta1vezComponent,AiepiComponent,ExternaComponent,UrgenciasComponent,DermatologicaComponent,
    JovenpypComponent,OdontologiaComponent,EodontologiaComponent,PlanifamComponent,ReferenciaComponent,TraigeComponent,PsicologicaComponent,CitologiaComponent,MaternaComponent,
    CydaintegralComponent,BasicaComponent,Aiepi2mComponent,EnfermedadescComponent,PsiquiatricaComponent,UodontologiaComponent,OdontoComponent]
})
export class EpicrisisComponent implements OnInit {

	epicrisisForm: FormGroup;
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
    historias: any = [];

  	constructor(private formBuilder: FormBuilder, private codifService: CodifService, private globals: Globals, private historiasService: HistoriasService,
  				private _loadingBar: SlimLoadingBarService, private router: Router, private pacienteService: PacienteService, private adulto: AdultomayorComponent,
                private visual: VisualComponent, private aiepi: AiepiComponent, private consult1vez: Consulta1vezComponent,private consultaex: ConsultaexComponent,
                private externa: ExternaComponent,private urgencias: UrgenciasComponent,private derma: DermatologicaComponent,private joven: JovenpypComponent,
                private odonto: OdontoComponent,private edonto: EodontologiaComponent,private planifam: PlanifamComponent, private refer: ReferenciaComponent,
                private traige: TraigeComponent,private psico: PsicologicaComponent,private cito: CitologiaComponent, private materna: MaternaComponent,
                private cyda: CydaintegralComponent,private basic: BasicaComponent,private aiepi2m: Aiepi2mComponent,private enfer: EnfermedadescComponent,
                private psiqui: PsiquiatricaComponent, private udonto: UodontologiaComponent) { }

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
            if(tipo.currentValue == 10 && pr) {
                if(pr.currentValue == true)
                    this.GenerarPdf(this.historia_id);
            }
        if(us)
            if(us.currentValue != 0) {
            	this.historiasService.getHistoriasPacientes(us.currentValue)
					.subscribe(data => {
						let da: any = data;
						this.historias = data;
						var newOptions = '';
						for(var i = 0; i < da.length; i++)
							newOptions += '<option value="'+da[i].ID_HISTORIA_PACIENTE+'">'+moment(da[i].FEC_DILIGENCIADA).format('DD/MM/YYYY') + ' ' + da[i].historia.NOM_HISTORIA + " " + da[i].usuario.NOMBRES + " " + da[i].usuario.APELLIDOS + '</option>';
						$('#REGISTROSC').empty().html(newOptions).select2({
				            dropdownAutoWidth:!0,
				            width:"100%",
				            placeholder: 'Buscar Historias',
				            multiple: true,
				        });
					});
            }
            else {
                us.previousValue = 0;
            }
	}

	ngAfterViewInit(): void {
  		var that = this;	
        let us = JSON.parse(localStorage.getItem('currentUser'));
		this.role = us.role;
		this.id_user = us.user.ID_USUARIO;
		if($('#PACIENTE').val() != null && $('#PACIENTE').val() != '')
			this.historiasService.getHistoriasPacientes($('#PACIENTE').val())
				.subscribe(data => this.historias = data);
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
        $('#REGISTROSC').select2({
            dropdownAutoWidth:!0,
            width:"100%",
            placeholder: 'Buscar Historias',
            multiple: true,
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
        this.epicrisisForm = this.formBuilder.group({
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

    Header(empresa, paciente, id) {
        let dire: any = empresa.DIREC_EMP != null ? empresa.DIREC_EMP : "-";
        let tele: any = empresa.TELEF != null ? empresa.TELEF : "-";
        let fechai = moment().format('DD/MM/YYYY');
        var html = '<div class="col-md-3 text-left" style="margin: 0;padding: 0;font-size: 12px;">Fecha Impresión: '+fechai+'</div>' +
                '<div class="col-md-6 text-center" style="margin: 0;padding: 0;text-transform: uppercase !important;"><h3>'+empresa.NOM_EMPRESA+'</h3></div>' +
                '<div class="col-md-3 text-right" style="margin: 0;padding: 0;font-size: 12px;">Folio No: '+paciente.NUM_DOC+'-'+id+'</div>' +
                '<div class="col-md-12 text-center" style="margin: 0;padding: 0;font-size: 12px;">Dirección: '+dire+' Teléfono: '+tele+'</div>' +
                '<div class="col-md-12 text-center"><h3>HISTORIA CLINICA EPICRISIS</h3></div>';
        return html;
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
    	if(($('#REGISTROSC').val() == '' || $('#REGISTROSC').val() == null || $('#REGISTROSC').val().length == 0) && $('#todos').prop('checked') == false) {
    		alert("Por favor, escoja los registros clínicos para generar la epicrisis");
    		return false;
    	}
        if($('#PACIENTE').val() == null || $('#PACIENTE').val() == '') {
            alert("Por favor, escoja el paciente a generar el registro clínico.");
            return false;
        }
        this.print = true;
        this._loadingBar.progress = 50;
        this._loadingBar.start(() => {
            this._loadingBar.progress++;
        });
        this._loadingBar.stop();
        let arr: any = ($('#todos').prop('checked') == true ? [0] : $('#REGISTROSC').val());
        let us = JSON.parse(localStorage.getItem('currentUser'));
    	this.historiasService.getHistoriasIds(arr, us.user.ID_USUARIO, $('#PACIENTE').val())
    		.subscribe(data => {
    			let da: any = data;
                var pdf = new jsPDF('p', 'px', 'letter');
                var page = 1;
                var fin = false;
		    	for(var i = 0; i < da.length; i++) {
                    var id_h = da[i].ID_HISTORIA;
                    switch (id_h) {
                        case 1:
                        case 35:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa,da[i].paciente,da[i].ID_HISTORIA_PACIENTE);
                            html += this.adulto.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.adulto.OtrosDatos(da[i]);
                            html += this.adulto.Page1(da[i].campos,page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.adulto.Page2(da[i].campos,page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.adulto.Page3(da[i].campos, da[i]) + this.adulto.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 2:
                        case 42:
                            let divv = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.visual.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.visual.OtrosDatos(da[i]);
                            html += this.visual.Page1(da[i].campos,page);
                            $(divv).attr('id', 'print'+page);
                            $(divv).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(divv).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.visual.Page2(da[i].campos, da[i]) + this.visual.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 3:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.aiepi.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.aiepi.OtrosDatos(da[i]);
                            html += this.aiepi.Page1(da[i].campos,page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.aiepi.Page2(da[i].campos,page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.aiepi.Page3(da[i].campos, da[i],page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.aiepi.Page4(da[i].campos, da[i]);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div4 = document.createElement('div');
                            html = header + this.aiepi.Page5(da[i].campos, da[i],page) + this.aiepi.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div4).prop('id', 'print'+page);
                            $(div4).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div4).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                        break;
                        case 6:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.consult1vez.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.consult1vez.OtrosDatos(da[i]);
                            html += this.consult1vez.Page1(da[i].campos,page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.consult1vez.Page2(da[i].campos,page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.consult1vez.Page3(da[i].campos, da[i]) + this.consult1vez.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 7:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.consultaex.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.consultaex.OtrosDatos(da[i]);
                            html += this.consultaex.Page1(da[i].campos,page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.consultaex.Page2(da[i].campos,page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.consultaex.Page3(da[i].campos, da[i]) + this.consultaex.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario)),page;
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 13:
                        case 15:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.externa.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.externa.OtrosDatos(da[i]);
                            html += this.externa.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.externa.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.externa.Page3(da[i].campos, da[i]) + this.externa.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 14:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.urgencias.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.urgencias.OtrosDatos(da[i]);
                            html += this.urgencias.Page1(da[i].campos,page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.urgencias.Page2(da[i].campos,page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.urgencias.Page3(da[i].campos, da[i]) + this.urgencias.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 16:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.derma.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.derma.OtrosDatos(da[i]);
                            html += this.derma.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.derma.Page2(da[i].campos, da[i], page) + this.derma.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 18:
                        case 36:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.joven.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.joven.OtrosDatos(da[i]);
                            html += this.joven.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.joven.Page2(da[i].campos);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.joven.Page3(da[i].campos, da[i]) + this.joven.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario));
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 20:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            var odon = da[i].odontologia;
                            html = this.Header(da[i].usuario.empresa.empresa,da[i].paciente,da[i].ID_HISTORIA_PACIENTE);
                            html += this.odonto.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.odonto.OtrosDatos(da[i]);
                            html += this.odonto.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.odonto.Page2(da[i].campos, da[i], page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.odonto.Page3(da[i].campos, da[i], page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.odonto.Page4(da[i], page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div4 = document.createElement('div');
                            html = header + this.odonto.Page5(da[i], page);
                            $(div4).prop('id', 'print'+page);
                            $(div4).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div4).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;

                            var div5 = document.createElement('div');
                            html = header + this.odonto.Page6(da[i]) + this.odonto.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div5).prop('id', 'print'+page);
                            $(div5).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div5).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 21:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa,da[i].paciente,da[i].ID_HISTORIA_PACIENTE);
                            html += this.udonto.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.udonto.OtrosDatos(da[i]);
                            html += this.udonto.Page1(da[i].campos, da[i], page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.udonto.Page2(da[i].campos) + this.udonto.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 24:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.planifam.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.planifam.OtrosDatos(da[i]);
                            html += this.planifam.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.planifam.Page2(da[i].campos,da[i], page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.planifam.Page3(da[i].campos, da[i], page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.planifam.Page4(da[i].campos) + this.planifam.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 25:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.refer.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.refer.OtrosDatos(da[i]);
                            html += this.refer.Page1(da[i].campos, da[i], page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.refer.Page2(da[i].campos) + this.refer.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 28:
                        case 39:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.traige.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.traige.Page1(da[i].campos) + this.traige.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 30:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa,da[i].paciente,da[i].ID_HISTORIA_PACIENTE);
                            html += this.psico.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.psico.OtrosDatos(da[i]);
                            html += this.psico.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.psico.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.psico.Page3(da[i].campos, da[i], da[i].familiares, page) + this.psico.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 31:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.cito.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.cito.OtrosDatos(da[i]);
                            html += this.cito.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.cito.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.cito.Page3(da[i].campos, page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.cito.Page4(da[i].campos, da[i]) + this.cito.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario),page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break
                        case 32:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.materna.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.materna.OtrosDatos(da[i]);
                            html += this.materna.Page1(da[i].campos, da[i], page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.materna.Page2(da[i].campos, da[i], page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.materna.Page3(da[i].campos, page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.materna.Page4(da[i].campos, page) + this.materna.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 37:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.cyda.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.cyda.OtrosDatos(da[i]);
                            html += this.cyda.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.cyda.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.cyda.Page3(da[i].campos, page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.cyda.Page4(da[i].campos, da[i]) + this.cyda.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 40:
                            var div = document.createElement('div');
                            var html = '';
                            html = this.Header(da.usuario.empresa.empresa, da.paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.basic.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            html += this.basic.OtrosDatos(da[i]);
                            html += this.basic.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 41:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.aiepi2m.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.aiepi2m.OtrosDatos(da[i]);
                            html += this.aiepi2m.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.aiepi2m.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.aiepi2m.Page3(da[i].campos, page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.aiepi2m.Page4(da[i].campos, da[i]) + this.aiepi2m.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 43:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa, da[i].paciente, da[i].ID_HISTORIA_PACIENTE);
                            html += this.enfer.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.enfer.OtrosDatos(da[i]);
                            html += this.enfer.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.enfer.Page2(da[i].campos, page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div2 = document.createElement('div');
                            html = header + this.enfer.Page3(da[i].campos, page);
                            $(div2).prop('id', 'print'+page);
                            $(div2).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div2).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div3 = document.createElement('div');
                            html = header + this.enfer.Page4(da[i].campos, da[i], page);
                            $(div3).prop('id', 'print'+page);
                            $(div3).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div3).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div4 = document.createElement('div');
                            html = header + this.enfer.Page5(da[i].campos, da[i], page) + this.enfer.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div4).prop('id', 'print'+page);
                            $(div4).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div4).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        case 44:
                            var div = document.createElement('div');
                            var html = '';
                            var header = '';
                            html = this.Header(da[i].usuario.empresa.empresa,da[i].paciente,da[i].ID_HISTORIA_PACIENTE);
                            html += this.psiqui.Paciente(da[i].paciente,da[i].FEC_DILIGENCIADA,da[i].DIAGNOSTICOHIST);
                            header = html;
                            html += this.psiqui.OtrosDatos(da[i]);
                            html += this.psiqui.Page1(da[i].campos, page);
                            $(div).prop('id', 'print'+page);
                            $(div).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div).appendTo($(datos));
                            that.CrearImagen(pdf,document.getElementById('print'+page),false);
                            page++;

                            var div1 = document.createElement('div');
                            html = header + this.psiqui.Page2(da[i].campos, da[i]) + this.psiqui.Prestador((da[0].presta != null ? da[0].presta : da[i].usuario), page);
                            $(div1).prop('id', 'print'+page);
                            $(div1).addClass('row col-md-12').html(html);
                            var datos = document.getElementById('print');
                            $(div1).appendTo($(datos));
                            if(i == da.length - 1)
                                fin = true;
                            that.CrearImagen(pdf,document.getElementById('print'+page),fin);
                            page++;
                            break;
                        default:
                            break;
                    }
                }
    		});
    }

    GenerarPdf(id) {
        /*var that = this;
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
                html = this.Header(da.usuario.empresa.empresa, da.paciente, id);
                html += this.Paciente(da.paciente,da.FEC_DILIGENCIADA);
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
                html = header + this.Page5(da.campos, da);
                $(div4).prop('id', 'print'+5);
                $(div4).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div4).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+5),false);

                var div5 = document.createElement('div');
                html = header + this.Page6(da.campos, da) + this.Prestador(da.usuario);
                $(div5).prop('id', 'print'+6);
                $(div5).addClass('row col-md-12').html(html);
                var datos = document.getElementById('print');
                $(div5).appendTo($(datos));
                that.CrearImagen(pdf,document.getElementById('print'+6),true);
            }
        );*/
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
                setTimeout(() => 
                {
                    /*pdf.save('EPICRISIS.pdf');*/
                    //pdf.autoPrint();
                    var blob = pdf.output('blob');
                    window.open(URL.createObjectURL(blob));
                    that._loadingBar.complete();
                },2500);
            }
        })
    }

    Siguiente(id) {
        $('.nav-fill a[href="#'+id+'"]').tab('show');
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
    }

    clearAll() {
        this.epicrisisForm.get('DATOSHISTORIA').setValue('');
        this.epicrisisForm.get('DATOSPACIENTE').setValue('');
        this.epicrisisForm.get('DATOS').setValue('');
        this.epicrisisForm.get('PACIENTE').setValue('');
        this.epicrisisForm.get('PRESTADOR').setValue('');
        this.epicrisisForm.get('ID_HISTORIA').setValue(0);
        this.epicrisisForm.get('ID_CITA').setValue(0);
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
