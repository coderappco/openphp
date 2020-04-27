import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as Dropzone from "src/assets/plantilla/vendors/bower_components/dropzone/dist/dropzone.js";
import * as moment from 'src/assets/plantilla/vendors/bower_components/moment/min/moment.min.js';

import { CodifService } from '../../../services/codif.service';
import { AdministradoraService } from '../../../services/administradora.service';
import { ContratoService } from '../../../services/contrato.service';
import { PacienteService } from '../../../services/paciente.service';

declare var $: any;

@Component({
  	selector: 'app-paciente',
  	templateUrl: './paciente.component.html',
  	styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  	submitted = false;
  	pacienteForm: FormGroup;
  	dtOptions: any = {};
  	table: any = '';
  	paciente_id = 0;
    drop: any = '';
    opt: any = '';
    tipoident: any = [];
    dptos: any = [];
    municipios: any = [];
    estadocivil: any = [];
    gruposanguineo: any = [];
    escolaridad: any = [];
    etnia: any = [];
    ocupacion: any = [];
    discapacidad: any = [];
    religion: any = [];
    afiliado: any = [];
    regimen: any = [];
    administradoras: any = [];
    datos: any;
    datos1: any = 0;
    muni_id: any = 1127

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService, private adminService: AdministradoraService,
                private contratoService: ContratoService, private pacienteService: PacienteService) { }

  	ngOnInit() {
        this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
    	var that = this;
    	setTimeout(() => 
      		{
      			this.globals.getUrl = 'paciente';
      		}
    	,0);

    	$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
        $('.select2.contrat').prop("disabled", true).select2({dropdownAutoWidth:!0,width:"100%"});

    	$('.select2.dpto').on("change", function (e) {
            $('.select2.muni').prop("disabled", true);
        	that.getMunicipios($(this).val());
    	});

        $('.select2.admin').on("change", function (e) {
            that.getContratos($(this).val());
        });

        this.UploadPhoto();

        this.codifService.getTipoIdent()
            .subscribe(data => {
                this.tipoident = data;
                this.codifService.getDptos()
                    .subscribe(data => {
                        this.dptos = data;
                        this.codifService.getMunicipios()
                            .subscribe(data => {
                                this.municipios = data;
                                this.codifService.getOcupacion()
                                    .subscribe(data => {
                                        this.ocupacion = data;
                                        this.codifService.getEstadoCivil()
                                            .subscribe(data => {
                                                this.estadocivil = data;
                                                this.codifService.getDiscapacidad()
                                                    .subscribe(data => {
                                                        this.discapacidad = data;
                                                        this.codifService.getGrupoSanguineo()
                                                            .subscribe(data => this.gruposanguineo = data);
                                                        this.codifService.getEscolaridad()
                                                            .subscribe(data => this.escolaridad = data);
                                                        this.codifService.getEtnia()
                                                            .subscribe(data => this.etnia = data);
                                                        this.codifService.getReligion()
                                                            .subscribe(data => this.religion = data);
                                                        this.codifService.getAfiliado()
                                                            .subscribe(data => this.afiliado = data);
                                                        this.codifService.getRegimen()
                                                            .subscribe(data => this.regimen = data);
                                                        this.adminService.getAdministradoras()
                                                            .subscribe(data => this.administradoras = data);
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

        $('#data-table').on( 'click', '.btn-del', function () {
            that.deletePaciente($(this).attr('date'));
        });

        $('#data-table').on( 'click', '.btn-edit', function () {
            that.fillPaciente($(this).attr('date'));
        });

        $(".date-picker").flatpickr({dateFormat: 'd/m/Y', "locale": "es", enableTime:!1,nextArrow:'<i class="zmdi zmdi-long-arrow-right" />',prevArrow:'<i class="zmdi zmdi-long-arrow-left" />'})

    		$("body").on("click", "[data-table-action]", function(a) {
            a.preventDefault();
            var b = $(this).data("table-action");
            if ("excel" === b && $(this).closest(".dataTables_wrapper").find(".buttons-excel").trigger("click"),
            "csv" === b && $(this).closest(".dataTables_wrapper").find(".buttons-csv").trigger("click"),
            "print" === b && $(this).closest(".dataTables_wrapper").find(".buttons-print").trigger("click"),
            "fullscreen" === b) {
                var c = $(this).closest(".card");
                c.hasClass("card--fullscreen") ? (c.removeClass("card--fullscreen"),
                $("body").removeClass("data-table-toggled")) : (c.addClass("card--fullscreen"),
                $("body").addClass("data-table-toggled"))
            }
        })
  	}

  	get f() { return this.pacienteForm.controls; }

  	initForm() {
        this.pacienteForm = this.formBuilder.group({
            ID_TIPO_DOC: [''],
            NUM_DOC: ['', [Validators.required]],
            FECHA_NAC: [''],
            GENEROS: [''],
            PRIMER_NOMBRE: ['', [Validators.required]],
            SEGUNDO_NOMBRE: [''],
            PRIMER_APELLIDO: ['', [Validators.required]],
            SEGUNDO_APELLIDO: [''],
            dpto: [34],
            ID_MUNICIPIO: [1127],
            ZONA: [''],
            BARRIO: [''],
            TELEF: [''],
            MOVIL: [''],
            CORREO: ['', [Validators.email]],
            DIREC_PACIENTE: [''],
            ACTIVO: [''],
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
            NOTIFICACION: [''],
            COD_APORTANTE: [''],
            NOM_APORTANTE: [''],
  	    });
  	}

    fillTable() {
        return this.dtOptions = {
            pageLength: 10,
            autoWidth: true,
            fixedColumns: true,
            responsive: true,
            "destroy": true,
            language: {
                "url": "src/assets/Spanish.json",
                 searchPlaceholder: "Escriba parametro a filtrar..."
            },
            ajax: this.globals.apiUrl+'/pacientes',
            columns: [
                { title: 'Identificación', data: 'NUM_DOC', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<code><i class="zmdi zmdi-badge-check"></i> '+row.identificacion.COD_TIPO_IDENTIFICACION+data+'</code>';
                }},
                { title: 'Paciente', data: 'ID_PACIENTE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    var nombre = row.PRIMER_NOMBRE + (row.SEGUNDO_NOMBRE != null ? " "+row.SEGUNDO_NOMBRE : "");
                    var apellidos = row.PRIMER_APELLIDO + (row.SEGUNDO_APELLIDO != null ? " "+row.SEGUNDO_APELLIDO : "");
                    return  nombre+" "+apellidos;
                }},
                { title: 'Departamento', data: 'ID_PACIENTE', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.dpto.NOM_DEPARTAMENTO;
                } },
                { title: 'Municipio', data: 'ID_EMPRESA', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.NOM_MUNICIPIO;
                } }, 
                { title: 'Estado', data: 'ACTIVO', className: "align-middle", "render": function ( data, type, row, meta ) {
                    return  data == 1 ? "Activo" : "Inactivo";
                } },
                { title: 'Acción', data: 'ID_PACIENTE', "render": function ( data, type, row, meta ) {
                    let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar paciente" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
                    let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar paciente" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
                    return editar + eliminar;
                }}
            ],
            "columnDefs": [
                { "width": "180px", "targets": 0 },
                { "width": "350px", "targets": 1 },
                { "width": "250px", "targets": 2 },
                { "width": "250px", "targets": 3 },
                { "width": "150px", "targets": 4 },
                { "width": "150px", "targets": 5 }
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

    clearAll() {
        this.pacienteForm.get('ID_TIPO_DOC').setValue('');
        this.pacienteForm.get('NUM_DOC').setValue('');
        this.pacienteForm.get('FECHA_NAC').setValue('');
        this.pacienteForm.get('GENEROS').setValue('');
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
        this.paciente_id = 0;
        this.datos1 = 0;
        this.muni_id = 1127;
        $('#dpto').val(34).trigger('change');
        //$('#ID_MUNICIPIO').val(1127).trigger('change');
        $('#ID_TIPO_DOC').val('').trigger('change');
        $('#GENEROS').val('').trigger('change');
        $('#ZONA').val(1).trigger('change');
        $('#ID_ESTADO_CIVIL').val(6).trigger('change');
        $('#ID_GRP_SANG').val(1).trigger('change');
        $('#ID_ESCOLARIDAD').val(1).trigger('change');
        $('#ID_ETNIA').val(6).trigger('change');
        $('#ID_OCUPACION').val(511).trigger('change');
        $('#ID_DISCAPACIDAD').val(5).trigger('change');
        $('#ID_RELIGION').val(6).trigger('change');
        $('#GESTACION').val(2).trigger('change');
        $('#ID_TIPO_AFIL').val(7).trigger('change');
        $('#ID_REGIMEN').val(5).trigger('change');
        $('#ID_ADMINISTRADORA').val('').trigger('change');
        $('#CONTRATO').val('').trigger('change');
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        //this.initForm();
        $('.select2.contrat').prop("disabled", true).select2({dropdownAutoWidth:!0,width:"100%"});
        var drop = Dropzone.forElement(".dropzone");
        if(drop.files.length > 0) {
            drop.files[0].update = 1;
            var file = drop.files[0];
            drop.removeFile(file);
            drop.files.pop();
        }
        $('input[name=datos]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');            
        });
        $('input[name=datos1]').each(function() {
            $(this).attr('checked', false);
            $(this).parent('label').removeClass('active');
        });
        $('#correo').parent('label').addClass('active');
        $('#correo').attr('checked', true);
        this.getMunicipios(null);
        setTimeout(() => 
        {
            $('#ID_MUNICIPIO').val(1127).trigger('change');
        },500);
    }

    Registrar() {
        this.submitted = true;

        if (this.pacienteForm.invalid) {
            return;
        }

        if(!this.validateForm()){
            return false;
        }

        if(this.paciente_id == 0) {
            /*if(!confirm("Esta Seguro que desea Registrar el PACIENTE?")) 
                return false;*/

            this.pacienteForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
            this.pacienteForm.get('ID_TIPO_DOC').setValue($('#ID_TIPO_DOC').val());
            this.pacienteForm.get('GENEROS').setValue($('#GENEROS').val());
            this.pacienteForm.get('ZONA').setValue($('#ZONA').val());
            this.pacienteForm.get('ID_ESTADO_CIVIL').setValue($('#ID_ESTADO_CIVIL').val());
            this.pacienteForm.get('ID_GRP_SANG').setValue($('#ID_GRP_SANG').val());
            this.pacienteForm.get('ID_ESCOLARIDAD').setValue($('#ID_ESCOLARIDAD').val());
            this.pacienteForm.get('ID_ETNIA').setValue($('#ID_ETNIA').val());
            this.pacienteForm.get('ID_OCUPACION').setValue($('#ID_OCUPACION').val());
            this.pacienteForm.get('ID_DISCAPACIDAD').setValue($('#ID_DISCAPACIDAD').val());
            this.pacienteForm.get('ID_RELIGION').setValue($('#ID_RELIGION').val());
            this.pacienteForm.get('GESTACION').setValue($('#GESTACION').val());
            this.pacienteForm.get('ID_TIPO_AFIL').setValue($('#ID_TIPO_AFIL').val());
            this.pacienteForm.get('ID_REGIMEN').setValue($('#ID_REGIMEN').val());
            this.pacienteForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
            this.pacienteForm.get('CONTRATO').setValue($('#CONTRATO').val());
            this.pacienteForm.get('DATOS').setValue(this.datos);
            this.pacienteForm.get('NOTIFICACION').setValue(this.datos1);
            var activo = $('#activo').prop('checked') == true ? 1 : 0;
            this.pacienteForm.get('ACTIVO').setValue(activo);
            this.pacienteService.crearPaciente(this.pacienteForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Paciente registrado");
                    this.submitted = false;
                    var drop = Dropzone.forElement(".dropzone");
                    if(drop.files.length > 0) {
                        drop.files[0].update = 1;
                        var file = drop.files[0];
                        drop.removeFile(file);
                        drop.files.pop();
                    }
                }
            );
            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
        }
        else {
            /*if(!confirm("Esta Seguro que desea Modificar el PACIENTE?")) 
                return false;*/
            this.pacienteForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
            this.pacienteForm.get('ID_TIPO_DOC').setValue($('#ID_TIPO_DOC').val());
            console.log($('#GENEROS option:selected').val());
            this.pacienteForm.get('GENEROS').setValue($('#GENEROS option:selected').val());
            this.pacienteForm.get('ZONA').setValue($('#ZONA').val());
            this.pacienteForm.get('ID_ESTADO_CIVIL').setValue($('#ID_ESTADO_CIVIL').val());
            this.pacienteForm.get('ID_GRP_SANG').setValue($('#ID_GRP_SANG').val());
            this.pacienteForm.get('ID_ESCOLARIDAD').setValue($('#ID_ESCOLARIDAD').val());
            this.pacienteForm.get('ID_ETNIA').setValue($('#ID_ETNIA').val());
            this.pacienteForm.get('ID_OCUPACION').setValue($('#ID_OCUPACION').val());
            this.pacienteForm.get('ID_DISCAPACIDAD').setValue($('#ID_DISCAPACIDAD').val());
            this.pacienteForm.get('ID_RELIGION').setValue($('#ID_RELIGION').val());
            this.pacienteForm.get('GESTACION').setValue($('#GESTACION').val());
            this.pacienteForm.get('ID_TIPO_AFIL').setValue($('#ID_TIPO_AFIL').val());
            this.pacienteForm.get('ID_REGIMEN').setValue($('#ID_REGIMEN').val());
            this.pacienteForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
            this.pacienteForm.get('CONTRATO').setValue($('#CONTRATO').val());
            this.pacienteForm.get('DATOS').setValue(this.datos);
            this.pacienteForm.get('NOTIFICACION').setValue(this.datos1);
            var activo = $('#activo').prop('checked') == true ? 1 : 0;
            this.pacienteForm.get('ACTIVO').setValue(activo);
            this.pacienteService.updatePaciente(this.paciente_id, this.pacienteForm.value)
                .subscribe(data => {
                    this.clearAll();
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Paciente actualizado");
                    this.submitted = false;
                    var drop = Dropzone.forElement(".dropzone");
                    if(drop.files.length > 0) {
                        drop.files[0].update = 1;
                        var file = drop.files[0];
                        drop.removeFile(file);
                        drop.files.pop();
                    }
                }
            );
            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
        }
    }

    fillPaciente(p) {
        var that = this;
        var datos = [];
        setTimeout(() => 
        {
            $('#collapseOne').collapse('show');
            $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
        },1500);
        this.pacienteService.getPaciente(p)
            .subscribe(data => {
                var paciente: any = data;
                this.paciente_id = paciente.ID_PACIENTE;
                this.initForm();
                this.pacienteForm.get('ID_TIPO_DOC').setValue(paciente.ID_TIPO_DOC);
                this.pacienteForm.get('NUM_DOC').setValue(paciente.NUM_DOC);
                this.pacienteForm.get('FECHA_NAC').setValue(paciente.FECHA_NAC != null ? moment(paciente.FECHA_NAC).format('DD/MM/YYYY') : '');
                this.pacienteForm.get('GENEROS').setValue(paciente.GENERO);
                this.pacienteForm.get('PRIMER_NOMBRE').setValue(paciente.PRIMER_NOMBRE);
                this.pacienteForm.get('SEGUNDO_NOMBRE').setValue(paciente.SEGUNDO_NOMBRE);
                this.pacienteForm.get('PRIMER_APELLIDO').setValue(paciente.PRIMER_APELLIDO);
                this.pacienteForm.get('SEGUNDO_APELLIDO').setValue(paciente.SEGUNDO_APELLIDO);
                this.pacienteForm.get('ID_MUNICIPIO').setValue(paciente.ID_MUNICIPIO);
                this.pacienteForm.get('ZONA').setValue(paciente.ZONA);
                this.pacienteForm.get('BARRIO').setValue(paciente.BARRIO);
                this.pacienteForm.get('TELEF').setValue(paciente.TELEF);
                this.pacienteForm.get('MOVIL').setValue(paciente.MOVIL);
                this.pacienteForm.get('CORREO').setValue(paciente.CORREO);
                this.pacienteForm.get('DIREC_PACIENTE').setValue(paciente.DIREC_PACIENTE);
                this.pacienteForm.get('ACTIVO').setValue(paciente.ACTIVO);
                this.pacienteForm.get('ID_ESTADO_CIVIL').setValue(paciente.ID_ESTADO_CIVIL);
                this.pacienteForm.get('ID_GRP_SANG').setValue(paciente.ID_GRP_SANG);
                this.pacienteForm.get('ID_ESCOLARIDAD').setValue(paciente.ID_ESCOLARIDAD);
                this.pacienteForm.get('ID_ETNIA').setValue(paciente.ID_ETNIA);
                this.pacienteForm.get('ID_OCUPACION').setValue(paciente.ID_OCUPACION);
                this.pacienteForm.get('ID_DISCAPACIDAD').setValue(paciente.ID_DISCAPACIDAD);
                this.pacienteForm.get('ID_RELIGION').setValue(paciente.ID_RELIGION);
                this.pacienteForm.get('GESTACION').setValue(paciente.GESTACION);
                this.pacienteForm.get('ID_TIPO_AFIL').setValue(paciente.ID_TIPO_AFIL);
                this.pacienteForm.get('FECHA_AFIL').setValue(paciente.FECHA_AFIL != null ? moment(paciente.FECHA_AFIL).format('DD/MM/YYYY') : '');
                this.pacienteForm.get('NUM_SISBEN').setValue(paciente.NUM_SISBEN);
                this.pacienteForm.get('FECHA_SISBEN').setValue(paciente.FECHA_SISBEN != null ? moment(paciente.FECHA_SISBEN).format('DD/MM/YYYY') : '');
                this.pacienteForm.get('ID_REGIMEN').setValue(paciente.ID_REGIMEN);
                this.pacienteForm.get('NOTIFICACION').setValue(paciente.NOTIFICACION);
                if(paciente.contrato != null) {
                    this.pacienteForm.get('ID_ADMINISTRADORA').setValue(paciente.contrato.contrato.administradora.ID_ADMINISTRADORA);
                    this.pacienteForm.get('CONTRATO').setValue(paciente.contrato.ID_CONTRATO);
                }
                else {
                    this.pacienteForm.get('ID_ADMINISTRADORA').setValue('');
                    this.pacienteForm.get('CONTRATO').setValue('');
                }
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
                $('input[name=datos1]').each(function() {
                    if($(this).val() == paciente.NOTIFICACION) {
                        $(this).attr('checked', true);
                        $(this).parent('label').addClass('active');
                    }
                    else {
                        $(this).attr('checked', false);
                        $(this).parent('label').removeClass('active');
                    }
                });
                //this.pacienteForm.get('DATOS').setValue(paciente.DATOS);
                this.muni_id = paciente.municipio.ID_MUNICIPIO;
                $('#dpto').val(paciente.municipio.dpto.ID_DPTO).trigger('change');
                $('#ID_TIPO_DOC').val(paciente.ID_TIPO_DOC).trigger('change');
                $('#GENEROS').val(paciente.GENERO).trigger('change');
                $('#ZONA').val(paciente.ZONA).trigger('change');
                $('#ID_ESTADO_CIVIL').val(paciente.ID_ESTADO_CIVIL).trigger('change');
                $('#ID_GRP_SANG').val(paciente.ID_GRP_SANG).trigger('change');
                $('#ID_ESCOLARIDAD').val(paciente.ID_DISCAPACIDAD).trigger('change');
                $('#ID_ETNIA').val(paciente.ID_ETNIA).trigger('change');
                $('#ID_OCUPACION').val(paciente.ID_OCUPACION).trigger('change');
                $('#ID_DISCAPACIDAD').val(paciente.ID_DISCAPACIDAD).trigger('change');
                $('#ID_RELIGION').val(paciente.ID_RELIGION).trigger('change');
                $('#GESTACION').val(paciente.GESTACION).trigger('change');
                $('#ID_TIPO_AFIL').val(paciente.ID_TIPO_AFIL).trigger('change');
                $('#ID_REGIMEN').val(paciente.ID_REGIMEN).trigger('change');
                if(paciente.contrato != null) 
                    $('#ID_ADMINISTRADORA').val(paciente.contrato.contrato.administradora.ID_ADMINISTRADORA).trigger('change');
                else
                    $('#ID_ADMINISTRADORA').val('').trigger('change');
                setTimeout(() => 
                {
                    //$('#ID_MUNICIPIO').val(paciente.municipio.ID_MUNICIPIO).trigger('change');
                    if(paciente.contrato != null)
                        $('#CONTRATO').val(paciente.contrato.ID_CONTRATO).trigger('change');
                    else
                        $('#CONTRATO').val('').trigger('change');
                }, 500);
                $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
                if(paciente.PHOTO != null) {
                    var mockFile = { name: paciente.PHOTO, size: paciente.PHOTO_SIZE, isMock : true};
                    var drop = Dropzone.forElement(".dropzone");
                    if(drop.files.length > 0) {
                        drop.files[0].update = 1;
                        var file = drop.files[0];
                        drop.removeFile(file);
                        drop.files.pop();
                    }
                    drop.emit("addedfile", mockFile);
                    drop.emit("thumbnail", mockFile, that.globals.urlPhoto+"pacientes/ID("+this.paciente_id+")"+paciente.PHOTO);
                    drop.emit("complete", mockFile);
                    drop.files.push( mockFile );
                }
                else
                {
                    var drop = Dropzone.forElement(".dropzone");
                    if(drop.files.length > 0) {
                        drop.files[0].update = 1;
                        var file = drop.files[0];
                        drop.removeFile(file);
                        drop.files.pop();
                    }
                }
                $('#NUM_DOC').focus();
            }
        );
    }

    deletePaciente(id) {
        if(confirm("Esta Seguro que desea eliminar el Paciente?")) {
            this.pacienteService.delPaciente(id)
                .subscribe(data => {
                    this.table = $('#data-table').DataTable(this.fillTable());
                    this.showMessage("Paciente eliminado");
                    this.clearAll();
                }
            );
        }
    }

    validateForm() {
        var that = this;
        var datos = [], i = 0;
        if($('#ID_TIPO_DOC').val() == '') {
            alert("Por favor, escoja el tipo de Documento");
            return false;
        }
        else
        if($('#ID_ADMINISTRADORA').val() != '') {
            if($('#CONTRATO').val() == '') {
                alert("Por favor, escoja el contrato");
                return false;
            }
        }        
        
        $('input[name=datos]').each(function() {
            if($(this).prop('checked') == true) {               
                datos[i] = 1;
                i++;
            }
            else
            {
                datos[i] = 0;
                i++;
            }
        });
        that.datos1 = 0;
        $('input[name=datos1]').each(function() {
            if($(this).prop('checked') == true) {               
                that.datos1 = $(this).val();
            }
        });
        if(that.datos1 == 0) {
            alert("Por favor, escoja la forma de notificación");
            return false
        }
        if($('#ID_MUNICIPIO').val() == null){
            alert("Por favor, escoja el municipio");
            return false
        }

        this.datos = datos;

        return true;
    }

    UploadPhoto() {
        var that = this;
        var url = this.globals.apiUrl+"/paciente/photos";
        this.opt = {
            dictDefaultMessage: "Arrastre la foto aqui",
            uploadMultiple: false,
            parallelUploads: 1,
            maxFiles: 1,
            url: url,
            addRemoveLinks:true,
            acceptedFiles: "image/*",
            thumbnailWidth: 120,
            thumbnailHeight: 120,
            init: function() {    
                this.on('addedfile', function(file) {
                    if (this.files.length > 1) {
                        this.removeFile(file);
                        alert("Solo puede escoger una foto");
                    }
                });
                this.on("thumbnail", function(file, dataUrl) {
                    $('.dz-image').last().find('img').attr({width: '100%', height: '100%'});
                });
                this.on("success", function(file) {
                    $('.dz-image').css({"width":"100%", "height":"auto"});
                })
            },
            removedfile: function(file) {
                var _ref;
                if(file.update != 1)
                    that.pacienteService.removePhoto(that.paciente_id, file.name)
                        .subscribe(data => {
                                    
                        }
                    );
                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            }
        };
        Dropzone.autoDiscover = false;
        this.drop = new Dropzone('#photo', this.opt);
    }

    getMunicipios(e) {
        this.codifService.getMunicipios(e)
            .subscribe(data => {
                var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_MUNICIPIO +'">'+ data[d].NOM_MUNICIPIO +'</option>';
                }
                $('.select2.muni').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
                $('#ID_MUNICIPIO').val(this.muni_id).trigger('change');
            }
        );
    }

    getContratos(e) {
        this.contratoService.getAdminContratos(e)
            .subscribe(data => {
                var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_CONTRATO +'">'+ data[d].NOM_CONTRATO +'</option>';
                }
                $('.select2.contrat').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
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
