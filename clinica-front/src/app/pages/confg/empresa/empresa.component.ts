import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as Dropzone from "src/assets/plantilla/vendors/bower_components/dropzone/dist/dropzone.js";

import { CodifService } from '../../../services/codif.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;

@Component({
  	selector: 'app-empresa',
  	templateUrl: './empresa.component.html',
  	styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  	submitted = false;
	empresaForm: FormGroup;
	dtOptions: any = {};
	table: any = '';
	empresa_id = 0;
	dptos: any = [];
	municipios: any = [];
	drop: any = '';
	opt: any = '';

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private codifService: CodifService, private empresaService: EmpresaService) { }

  	ngOnInit() {
  		this.initForm();
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
			{
				this.globals.getUrl = 'empresa';
			}
		,0);

		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

		$('.select2.dpto').on("change", function (e) {
			$('.select2.muni').prop("disabled", true);
    		that.getMunicipios($(this).val());
		});

		this.codifService.getDptos()
			.subscribe(data => this.dptos = data);
		this.codifService.getMunicipios()
			.subscribe(data => this.municipios = data);

		this.UploadPhoto();

		$('#data-table').on( 'click', '.btn-del', function () {
			that.deleteEmpresa($(this).attr('date'));
		});

		$('#data-table').on( 'click', '.btn-edit', function () {
			that.fillEmpresa($(this).attr('date'));
		});

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

	get f() { return this.empresaForm.controls; }

	initForm() {
        this.empresaForm = this.formBuilder.group({
            ID_MUNICIPIO: [''],
            NUM_TRIBUTARIO: ['', [Validators.required]],
            NOM_EMPRESA: ['', [Validators.required]],
            NUM_DOC_REP_LEGAL: [''],
            NOM_REP_LEGAL: [''],
            DIREC_EMP: [''],
            TELEF: [''],
            CORREO: ['', [Validators.email]],                
			LOGO_EMP: [''],
			WEBSITE: [''],
			dpto: [''],
  	    });
  	}

	fillTable() {
    	return this.dtOptions = {
  	      	pageLength: 10,
  	      	autoWidth: !1,
            responsive: !0,
            "destroy": true,
        	language: {
          		"url": "src/assets/Spanish.json",
          		 searchPlaceholder: "Escriba parametro a filtrar..."
      		},
        	ajax: this.globals.apiUrl+'/empresas',
        	columns: [
					{ title: 'Iden. Tributario', data: 'NUM_TRIBUTARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<code><i class="zmdi zmdi-badge-check"></i> '+data+'</code>';
					}},
					{ title: 'Empresa', data: 'NOM_EMPRESA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  data;
					}},
        			{ title: 'Departamento', data: 'ID_EMPRESA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.dpto.NOM_DEPARTAMENTO;
					} },
        			{ title: 'Municipio', data: 'ID_EMPRESA', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-pin"></i> '+row.municipio.NOM_MUNICIPIO;
					} }, 
					{ title: 'Representante Legal', data: 'NOM_REP_LEGAL', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-account-box"></i> '+data;
					} },
        			{ title: 'Acción', data: 'ID_EMPRESA', "render": function ( data, type, row, meta ) {
        				let editar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar empresa" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
        				let eliminar = '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar empresa" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
        				return editar + eliminar;
			}}],
			"columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "250px", "targets": 1 },
                { "width": "250px", "targets": 2 },
                { "width": "250px", "targets": 3 },
                { "width": "300px", "targets": 4 },
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
		this.empresaForm.get('ID_MUNICIPIO').setValue('');
		this.empresaForm.get('NUM_TRIBUTARIO').setValue('');
		this.empresaForm.get('NOM_EMPRESA').setValue('');
		this.empresaForm.get('NUM_DOC_REP_LEGAL').setValue('');
		this.empresaForm.get('NOM_REP_LEGAL').setValue('');
		this.empresaForm.get('DIREC_EMP').setValue('');
		this.empresaForm.get('CORREO').setValue('');
		this.empresaForm.get('TELEF').setValue('');
        this.empresaForm.get('LOGO_EMP').setValue('');
        this.empresaForm.get('WEBSITE').setValue('');
        this.empresaForm.get('dpto').setValue('');
		this.empresa_id = 0;
		$('#dpto').val('').trigger('change');
		$('#ID_MUNICIPIO').val('').trigger('change');
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
		var drop = Dropzone.forElement(".dropzone");
 		if(drop.files.length > 0) {
		    drop.files[0].update = 1;
 			var file = drop.files[0];
 			drop.removeFile(file);
 			drop.files.pop();
		}
		this.getMunicipios(null);
	}

	Registrar() {
		this.submitted = true;

        if (this.empresaForm.invalid) {
            return;
        }
        if($('#ID_MUNICIPIO').val() == '') {
        	alert("Por favor, escoja el Municipio");
        	return false;
        }

        if(this.empresa_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar la EMPRESA?")) 
				return false;*/

        	this.empresaForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        	this.empresaService.crearEmpresa(this.empresaForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Empresa creada");
					this.submitted = false;
					var drop = Dropzone.forElement(".dropzone");
 					if(drop.files.length > 0) {
		        		drop.files[0].update = 1;
 						var file = drop.files[0];
 						drop.removeFile(file);
 						drop.files.pop();
		        	}
				},
				error => {
					this.showMessage(error.errors.email[0]);
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar la EMPRESA?")) 
				return false;*/
			this.empresaForm.get('ID_MUNICIPIO').setValue($('#ID_MUNICIPIO').val());
        	this.empresaService.updateEmpresa(this.empresa_id, this.empresaForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Empresa actualizada");
					this.submitted = false;
					var drop = Dropzone.forElement(".dropzone");
 					if(drop.files.length > 0) {
		        		drop.files[0].update = 1;
 						var file = drop.files[0];
 						drop.removeFile(file);
 						drop.files.pop();
		        	}
				},
				error => {
					this.showMessage(error.errors.email[0]);
				}
			);
        }
	}

	fillEmpresa(p) {
		var that = this;
		this.empresaService.getEmpresa(p)
			.subscribe(data => {
				var empresa: any = data;
				this.empresa_id = empresa.ID_EMPRESA;
				this.initForm();
				this.empresaForm.get('ID_MUNICIPIO').setValue(empresa.ID_MUNICIPIO);
				this.empresaForm.get('NUM_TRIBUTARIO').setValue(empresa.NUM_TRIBUTARIO);
				this.empresaForm.get('NOM_EMPRESA').setValue(empresa.NOM_EMPRESA);
				this.empresaForm.get('NUM_DOC_REP_LEGAL').setValue(empresa.NUM_DOC_REP_LEGAL);
				this.empresaForm.get('NOM_REP_LEGAL').setValue(empresa.NOM_REP_LEGAL);
				this.empresaForm.get('DIREC_EMP').setValue(empresa.DIREC_EMP);
				this.empresaForm.get('CORREO').setValue(empresa.CORREO);
				this.empresaForm.get('TELEF').setValue(empresa.TELEF);
		        this.empresaForm.get('WEBSITE').setValue(empresa.WEBSITE);
		        this.empresaForm.get('dpto').setValue(empresa.municipio.dpto.ID_DPTO);
				$('#dpto').val(empresa.municipio.dpto.ID_DPTO).trigger('change');
				setTimeout(() => 
				{
					$('#ID_MUNICIPIO').val(empresa.municipio.ID_MUNICIPIO).trigger('change');
				}, 500);
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
				if(empresa.LOGO_EMP != null) {
		        	var mockFile = { name: empresa.LOGO_EMP, size: empresa.LOGO_SIZE, isMock : true};
		        	var drop = Dropzone.forElement(".dropzone");
		        	if(drop.files.length > 0) {
		        		drop.files[0].update = 1;
 						var file = drop.files[0];
 						drop.removeFile(file);
 						drop.files.pop();
		        	}
					drop.emit("addedfile", mockFile);
					drop.emit("thumbnail", mockFile, that.globals.urlPhoto+"logos/ID("+this.empresa_id+")"+empresa.LOGO_EMP);
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
				$('#collapseOne').collapse('show');
				$('#NUM_TRIBUTARIO').focus();
				$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteEmpresa(id) {
		if(confirm("Esta Seguro que desea eliminar la EMPRESA?")) {
			this.empresaService.delEmpresa(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Empresa eliminada");
					this.clearAll();
				}
			);
		}
	}

	UploadPhoto() {
  		var that = this;
  		var url = this.globals.apiUrl+"/empresa/logo";
		this.opt = {
			dictDefaultMessage: "Arrastre el logo aqui",
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
					that.empresaService.removePhoto(that.empresa_id, file.name)
					    .subscribe(data => {
					                
					    }
					);
				return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
			}
		};
		Dropzone.autoDiscover = false;
		this.drop = new Dropzone('#logo', this.opt);
  	}

  	getMunicipios(e) {
		this.codifService.getMunicipios(e)
			.subscribe(data => {
				var newOptions = '<option value="">Seleccione...</option>';
                for(var d in data) {
                    newOptions += '<option value="'+ data[d].ID_MUNICIPIO +'">'+ data[d].NOM_MUNICIPIO +'</option>';
                }
				$('.select2.muni').empty().html(newOptions).prop("disabled", false).select2({dropdownAutoWidth:!0,width:"100%"});
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
