import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import * as Dropzone from "src/assets/plantilla/vendors/bower_components/dropzone/dist/dropzone.js";

import { UserService } from '../../../services/usuario.service';
import { CodifService } from '../../../services/codif.service';
import { EmpresaService } from '../../../services/empresa.service';

declare var $: any;

@Component({
  	selector: 'app-usuarios',
  	templateUrl: './usuarios.component.html',
  	styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  	submitted = false;
	userForm: FormGroup;
	dtOptions: any = {};
	table: any = '';
	user_id = 0;
	tipoident: any = [];
	drop: any = '';
	dropf: any = '';
	opt: any = '';
	optf: any = '';
	especialidades: any = [];
	rol: any = false;
	empresas: any = [];
	empresa_id: any = 0;
	firma: any = false;

  	constructor(private formBuilder: FormBuilder, private globals: Globals, private userService: UserService, private codifService: CodifService, private empresaService: EmpresaService) { }

  	ngOnInit() {
  		var that = this;
  		this.initForm();
  		let us = JSON.parse(localStorage.getItem('currentUser'));
  		if(us.role != "ADMINISTRADOR") {
  			this.empresa_id = us.empresa_id;
  		}
        this.table = $('#data-table').DataTable(this.fillTable());
  	}

  	ngAfterViewInit(): void {
  		var that = this;
  		let us = JSON.parse(localStorage.getItem('currentUser'));
		this.globals.role = us.role;
		setTimeout(() => 
			{
				this.globals.getUrl = 'users';
			}
		,0);

		$('.select2').select2({dropdownAutoWidth:!0,width:"100%"});

		this.codifService.getTipoIdent()
			.subscribe(data => this.tipoident = data);
		this.codifService.getEspecialidades()
            .subscribe(data => this.especialidades = data);
        this.empresaService.getEmpresas()
        	.subscribe(data => {
        		this.empresas = data;
        		if(us.role != "ADMINISTRADOR") {
		        	setTimeout(() => 
					{
						$('#ID_EMPRESA').val(us.empresa_id).trigger('change');
						$('#ID_EMPRESA').prop('disabled', true);
					}
					,1000);
	        	}
        	}
        );

		this.UploadPhoto();
		this.UploadFirma();

		$('#data-table').on( 'click', '.btn-del', function () {
			that.deleteUser($(this).attr('date'));
		});

		$('#data-table').on( 'click', '.btn-edit', function () {
			that.fillPersonal($(this).attr('date'));
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
        });

        $('#NO_IDENTIFICACION').on( 'change', function () {
			that.getUserIdent($(this).val());
		});

		$('#USUARIO').on( 'change', function () {
			that.getUserUser($(this).val());
		});

		$('#CORREO').on( 'change', function () {
			that.getUserCorreo($(this).val());
		});

		$('.rol').on('change', function () {
			let roles: any = $(this).val();
			let fir = false;
			for(var i in roles) {
	        	var r = roles[i].split(" ");
	        	if(r[1] == "'PRESTADOR'") {
	        		fir = true;
	        	}
	        }
	        that.firma = fir;
		});
	}

	get f() { return this.userForm.controls; }

	getUserIdent(ident) {
		this.userService.getUserIdent(ident)
			.subscribe(data => {
				let da: any = data;
				if(da == false) {
					alert("Número de identificación en uso");
					$('#NO_IDENTIFICACION').focus();
					$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
					return false;
				}
				else
					return true;
			});
	}

	getUserUser(user) {
		this.userService.getUserUser(user)
			.subscribe(data => {
				let da: any = data;
				if(da == false) {
					alert("Usuario en uso");
					$('#USUARIO').focus();
					$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
					return false;
				}
				else
					return true;
			});
	}

	getUserCorreo(correo) {
		this.userService.getUserCorreo(correo)
			.subscribe(data => {
				let da: any = data;
				if(da == false) {
					alert("Correo en uso");
					$('#CORREO').focus();
					$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
					return false;
				}
				else
					return true;
			});
	}

	initForm() {
    	if(this.user_id != 0)
            this.userForm = this.formBuilder.group({
                ID_TIPO_IDEN: [''],
                NOMBRES: ['', [Validators.required]],
                APELLIDOS: ['', [Validators.required]],
                USUARIO: ['', [Validators.required]],
                NO_IDENTIFICACION: ['', [Validators.required]],
                CONTRASENA: [''],
                RCONTRASENA: [''],
                CORREO: ['', [Validators.email]],                
				rol: [''],
				ACTIVO: [''],
				VISIBLE: [''],
				ID_ESPECIALIDAD: [''],
				TARJETA: [''],
				ID_EMPRESA: [''],
				CONCURRENCIA: ['1'],
				FIRMATEXT: [''],
  	        });
  	    else
  	    	this.userForm = this.formBuilder.group({
                ID_TIPO_IDEN: [''],
                NOMBRES: ['', [Validators.required]],
                APELLIDOS: ['', [Validators.required]],
                USUARIO: ['', [Validators.required]],
                NO_IDENTIFICACION: ['', [Validators.required]],
                CONTRASENA: ['', Validators.required],
                RCONTRASENA: ['', Validators.required],
                CORREO: ['', [Validators.email]],                
				rol: [''],
				ACTIVO: [''],
				VISIBLE: [''],
				ID_ESPECIALIDAD: [''],
				TARJETA: [''],
				ID_EMPRESA: [''],
				CONCURRENCIA: ['1'],
				FIRMATEXT: [''],
  	        });
  	}

	fillTable() {
		var that = this;
    	return this.dtOptions = {
  	      	pageLength: 10,
  	      	autoWidth: !1,
            responsive: !0,
            "destroy": true,
        	language: {
          		"url": "src/assets/Spanish.json",
          		 searchPlaceholder: "Escriba parametro a filtrar..."
      		},
        	ajax: this.globals.apiUrl+'/users?empresa='+that.empresa_id,
        	columns: [
					{ title: 'Identificación', data: 'ID_USUARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  row.identificacion.COD_TIPO_IDENTIFICACION+row.NO_IDENTIFICACION;
					}},
        			{ title: 'Nombre y apellidos', data: 'ID_USUARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  row.NOMBRES+" "+row.APELLIDOS;
					}},
					{ title: 'Usuario', data: 'ID_USUARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-account"></i> '+row.USUARIO;
					}},
        			{ title: 'Correo', data: 'CORREO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				return  '<i class="zmdi zmdi-account-box-mail"></i> '+data;
					} },
        			{ title: 'Rol', data: 'ID_USUARIO', className: "align-middle", "render": function ( data, type, row, meta ) {
        				var html = '';
        				for(var i in row.roles) {
        					html += '<span class="badge badge-pill badge-info" style="margin-bottom: -5px;">'+row.roles[i].name+'</span></p>';
        				}
        				return  html;
					} }, 
        			{ title: 'Acción', data: 'ID_USUARIO', "render": function ( data, type, row, meta ) {
        				let editar = (row.roles[0].name != "ADMINISTRADOR") ? '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar usuario" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ' : '';
        				let eliminar = (row.roles[0].name != "ADMINISTRADOR") ? '<button date="'+data+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar usuario" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>' : '';
        				return editar + eliminar;
			}}],
			"columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "300px", "targets": 1 },
                { "width": "200px", "targets": 2 },
                { "width": "250px", "targets": 3 },
                { "width": "200px", "targets": 4 },
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
		this.userForm.get('NO_IDENTIFICACION').setValue('');
		this.userForm.get('NOMBRES').setValue('');
		this.userForm.get('APELLIDOS').setValue('');
		this.userForm.get('USUARIO').setValue('');
		this.userForm.get('CONTRASENA').setValue('');
		this.userForm.get('RCONTRASENA').setValue('');
		this.userForm.get('CORREO').setValue('');
		this.userForm.get('rol').setValue('');
        this.userForm.get('ACTIVO').setValue('');
        this.userForm.get('VISIBLE').setValue('');
        this.userForm.get('ID_ESPECIALIDAD').setValue('');
        this.userForm.get('TARJETA').setValue('');
        this.userForm.get('CONCURRENCIA').setValue('1');
        $('#activo').prop('checked', true);
        $('#visible').prop('checked', true);
		this.user_id = 0;
		this.rol = false;
		$('#rol').val('').trigger('change');
		$('#ID_TIPO_IDEN').val('').trigger('change');
		$('#ID_ESPECIALIDAD').val('').trigger('change');
		let us = JSON.parse(localStorage.getItem('currentUser'));
		if(us.role == "ADMINISTRADOR") {
			$('#ID_EMPRESA').val('').trigger('change');
			this.userForm.get('ID_EMPRESA').setValue('');
		}
		$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
		this.initForm();
		var drop = Dropzone.forElement("#photo");
 		if(drop.files.length > 0) {
		    drop.files[0].update = 1;
 			var file = drop.files[0];
 			drop.removeFile(file);
 			drop.files.pop();
		}
		var dropf = Dropzone.forElement("#firmas");
 		if(dropf.files.length > 0) {
		    dropf.files[0].update = 1;
 			var file = dropf.files[0];
 			dropf.removeFile(file);
 			dropf.files.pop();
		}
	}

	Registrar() {
		this.submitted = true;

        if (this.userForm.invalid) {
            return;
        }
        let roles: any = $('#rol').val();
        
        if(roles.length == 0) {
        	alert("Por favor, escoja el Rol");
        	return false;
        }
        else
        if($('#ID_TIPO_IDEN').val() == '') {
        	alert("Por favor, escoja el Tipo de Identificación");
        	return false;
        }
        else
        if($('#CONTRASENA').val() != $('#RCONTRASENA').val()) {
        	alert("Confirmación de contraseña incorrecta");
        	return false;
        }

        for(var i in roles) {
        	var r = roles[i].split(" ");
        	if(r[1] == "'PRESTADOR'" && ($('#ID_ESPECIALIDAD').val() == '' || $('#TARJETA').val() == '' || $('#CONCURRENCIA').val() == '')) {
        		alert("Por favor, debe escoger la especialidad, tarjeta y concurrencia para el rol de PRESTADOR");
        		return false;
        	}
        	else
        	if(r[1] != "'ADMINISTRADOR'" && $('#ID_EMPRESA').val() == '') {
        		alert("Por favor, debe escoger la empresa para este rol de usuario");
        		return false;
        	}
        }
        
        /*if($('#rol').val() == 'PRESTADOR') {
        	if($('#ID_ESPECIALIDAD').val() == '' || $('#TARJETA').val() == '' || $('#CONCURRENCIA').val() == '') {
        		alert("Por favor, debe escoger la especialidad, tarjeta y concurrencia para el PRESTADOR")
        		return false;
        	}
        }
        
        if($('#rol').val() != 'ADMINISTRADOR') {
        	if($('#ID_EMPRESA').val() == '') {
        		alert("Por favor, debe escoger la empresa para este rol de usuario")
        		return false;
        	}
        }*/
        if(this.user_id == 0) {
        	/*if(!confirm("Esta Seguro que desea Registrar el USUARIO?")) 
				return false;*/
        	var activo = $('#activo').prop('checked') == true ? 1 : 0;
        	var visible = $('#visible').prop('checked') == true ? 1 : 0;
        	this.userForm.get('rol').setValue($('#rol').val());
        	this.userForm.get('ACTIVO').setValue(activo);
        	this.userForm.get('VISIBLE').setValue(visible);
        	this.userForm.get('ID_TIPO_IDEN').setValue($('#ID_TIPO_IDEN').val());
        	this.userForm.get('ID_ESPECIALIDAD').setValue($('#ID_ESPECIALIDAD').val());
        	this.userForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
        	this.userForm.get('CONCURRENCIA').setValue($('#CONCURRENCIA').val());
        	var spl = ($('#firmas img').prop('src') != null ? $('#firmas img').prop('src').split("http://") : []);
        	var spl1 = ($('#firmas img').prop('src') != null ? $('#firmas img').prop('src').split("https://") : []);
        	if(spl.length > 0 || spl1.length > 0) {
        		//let ids: string = this.user_id.toString();
				//localStorage.setItem(ids, $('#firmas img').prop('src'));
				this.userForm.get('FIRMATEXT').setValue($('#firmas img').prop('src'));
			}
        	this.userService.crearUser(this.userForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Usuario creado");
					this.submitted = false;
					var drop = Dropzone.forElement("#photo");
			 		if(drop.files.length > 0) {
					    drop.files[0].update = 1;
			 			var file = drop.files[0];
			 			drop.removeFile(file);
			 			drop.files.pop();
					}
					var dropf = Dropzone.forElement("#firmas");
			 		if(dropf.files.length > 0) {
					    dropf.files[0].update = 1;
			 			var file = dropf.files[0];
			 			dropf.removeFile(file);
			 			dropf.files.pop();
					}
				},
				error => {
					this.showMessage(error.errors.email[0]);
				}
			);
        }
        else {
        	/*if(!confirm("Esta Seguro que desea Modificar el USUARIO?")) 
				return false;*/
			var activo = $('#activo').prop('checked') == true ? 1 : 0;
        	var visible = $('#visible').prop('checked') == true ? 1 : 0;
        	this.userForm.get('rol').setValue($('#rol').val());
        	this.userForm.get('ACTIVO').setValue(activo);
        	this.userForm.get('VISIBLE').setValue(visible);
        	this.userForm.get('ID_TIPO_IDEN').setValue($('#ID_TIPO_IDEN').val());
        	this.userForm.get('ID_ESPECIALIDAD').setValue($('#ID_ESPECIALIDAD').val());
        	this.userForm.get('ID_EMPRESA').setValue($('#ID_EMPRESA').val());
        	this.userForm.get('CONCURRENCIA').setValue($('#CONCURRENCIA').val());
        	var spl = ($('#firmas img').prop('src') != null ? $('#firmas img').prop('src').split("http://") : []);
        	var spl1 = ($('#firmas img').prop('src') != null ? $('#firmas img').prop('src').split("https://") : []);
        	if(spl.length > 0 || spl1.length > 0) {
        		//let ids: string = this.user_id.toString();
				//localStorage.setItem(ids, $('#firmas img').prop('src'));
				this.userForm.get('FIRMATEXT').setValue($('#firmas img').prop('src'));
			}
        	this.userService.updateUser(this.user_id, this.userForm.value)
				.subscribe(data => {
					this.clearAll();
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Usuario actualizado");
					this.submitted = false;
					var drop = Dropzone.forElement("#photo");
			 		if(drop.files.length > 0) {
					    drop.files[0].update = 1;
			 			var file = drop.files[0];
			 			drop.removeFile(file);
			 			drop.files.pop();
					}
					var dropf = Dropzone.forElement("#firmas");
			 		if(dropf.files.length > 0) {
					    dropf.files[0].update = 1;
			 			var file = dropf.files[0];
			 			dropf.removeFile(file);
			 			dropf.files.pop();
					}
				},
				error => {
					this.showMessage(error.errors.email[0]);
				}
			);
        }
	}

	fillPersonal(p) {
		var that = this;
		this.userService.getUser(p)
			.subscribe(data => {
				var user: any = data;
				this.user_id = user.ID_USUARIO;
				this.initForm();
				var roles = [];
				var ro = [];
				for(var i in user.roles) {
					let pos = (user.roles[i].name == "ADMIN" ? 1 : (user.roles[i].name == "PRESTADOR" ? 2 : (user.roles[i].name == "ENFERMERA" ? 3 : (user.roles[i].name == "CITAS" ? 4 : (user.roles[i].name == "FACTURACION" ? 5 : 6)))));
					roles.push(pos+": '"+user.roles[i].name+"'");
					ro.push(user.roles[i].name);
				}
				this.userForm.get('NO_IDENTIFICACION').setValue(user.NO_IDENTIFICACION);
				this.userForm.get('NOMBRES').setValue(user.NOMBRES);
				this.userForm.get('APELLIDOS').setValue(user.APELLIDOS);
				this.userForm.get('USUARIO').setValue(user.USUARIO);
				this.userForm.get('CONTRASENA').setValue('');
				this.userForm.get('RCONTRASENA').setValue('');
				this.userForm.get('CORREO').setValue(user.CORREO);
				this.userForm.get('rol').setValue(ro);
				this.userForm.get('ID_TIPO_IDEN').setValue(user.ID_TIPO_IDEN);
				this.userForm.get('TARJETA').setValue(user.TARJETA);
				if(user.empresa != null) {
					$('#ID_EMPRESA').val(user.empresa.ID_EMPRESA).trigger('change');
					this.userForm.get('ID_EMPRESA').setValue(user.empresa.ID_EMPRESA);
				}
				else {
					$('#ID_EMPRESA').val('').trigger('change');
					this.userForm.get('ID_EMPRESA').setValue('');
				}
				if(user.prestador != null) {
					this.userForm.get('ID_ESPECIALIDAD').setValue(user.prestador.ID_ESPECIALIDAD);
					this.userForm.get('CONCURRENCIA').setValue(user.prestador.CONCURRENCIA);
					if(user.prestador.FIRMA != null) {
			        	var mockFilef = { name: user.prestador.FIRMA, size: user.prestador.FIRMA_SIZE, isMock : true};
			        	var dropf = Dropzone.forElement("#firmas");
			        	if(dropf.files.length > 0) {
			        		dropf.files[0].update = 1;
	 						var filef = dropf.files[0];
	 						dropf.removeFile(filef);
	 						dropf.files.pop();
			        	}
						dropf.emit("addedfile", mockFilef);
						dropf.emit("thumbnail", mockFilef, that.globals.urlPhoto+"firmas/ID("+this.user_id+")"+user.prestador.FIRMA);
						dropf.emit("complete", mockFilef);
						dropf.files.push( mockFilef );
					}
					else
					{
						var dropf = Dropzone.forElement("#firmas");
	 					if(dropf.files.length > 0) {
	 						dropf.files[0].update = 1;
	 						var filef = dropf.files[0];
	 						dropf.removeFile(filef);
	 						dropf.files.pop();
	 					}
					}					
				}
				else
					this.userForm.get('ID_ESPECIALIDAD').setValue('');
				$('#rol').val(roles).trigger('change');
				$('#rol').select2({dropdownAutoWidth:!0,width:"100%",multiple: true});
				$('#ID_TIPO_IDEN').val(user.ID_TIPO_IDEN).trigger('change');
				if(user.prestador != null)
					$('#ID_ESPECIALIDAD').val(user.prestador.ID_ESPECIALIDAD).trigger('change');
				else
					$('#ID_ESPECIALIDAD').val('').trigger('change');
				$('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');
				$('#activo').prop('checked',user.ACTIVO);
				$('#visible').prop('checked', user.VISIBLE);
				if(user.FOTO != null) {
		        	var mockFile = { name: user.FOTO, size: user.photo_size, isMock : true};
		        	var drop = Dropzone.forElement("#photo");
		        	if(drop.files.length > 0) {
		        		drop.files[0].update = 1;
 						var file = drop.files[0];
 						drop.removeFile(file);
 						drop.files.pop();
		        	}
					drop.emit("addedfile", mockFile);
					drop.emit("thumbnail", mockFile, that.globals.urlPhoto+"photos/ID("+this.user_id+")"+user.FOTO);
					drop.emit("complete", mockFile);
					drop.files.push( mockFile );
				}
				else
				{
					var drop = Dropzone.forElement("#photo");
 					if(drop.files.length > 0) {
 						drop.files[0].update = 1;
 						var file = drop.files[0];
 						drop.removeFile(file);
 						drop.files.pop();
 					}
				}
				$('#collapseOne').collapse('show');
				$('#NO_IDENTIFICACION').focus();
				$('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
			}
		);
	}

	deleteUser(id) {
		if(confirm("Esta Seguro que desea eliminar el USUARIO?")) {
			this.userService.delUser(id)
				.subscribe(data => {
					this.table = $('#data-table').DataTable(this.fillTable());
					this.showMessage("Usuario eliminado");
					this.clearAll();
				}
			);
		}
	}

	/*readURL(input) {
		var that = this;
  		if (input[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            localStorage.setItem("imageStore", reader.result);
	        }
	        reader.readAsDataURL(input[0]);
	    }
	}*/

	UploadPhoto() {
  		var that = this;
  		var url = this.globals.apiUrl+"/user/photo";
		this.opt = {
			dictDefaultMessage: "Arrastre la imagen aqui",
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
				    $('#photo .dz-image').last().find('img').attr({width: '100%', height: '100%'});
				});
				this.on("success", function(file) {
				    $('#photo .dz-image').css({"width":"100%", "height":"auto"});
				})
			},
			removedfile: function(file) {
				var _ref;
				if(file.update != 1)
					that.userService.removePhoto(that.user_id, file.name)
					    .subscribe(data => {
					                
					    }
					);
				return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
			}
		};
		Dropzone.autoDiscover = false;
		this.drop = new Dropzone('#photo', this.opt);
  	}

  	UploadFirma() {
  		var that = this;
  		var url = this.globals.apiUrl+"/user/firma";
		this.optf = {
			dictDefaultMessage: "Arrastre la imagen aqui",
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
					//that.readURL(this.files);
				});
				this.on("thumbnail", function(file, dataUrl) {
				    $('#firmas .dz-image').last().find('img').attr({width: '100%', height: '100%'});
				});
				this.on("success", function(file) {
				    $('#firmas .dz-image').css({"width":"100%", "height":"auto"});
				})
			},
			removedfile: function(file) {
				var _ref;
				if(file.update != 1)
					that.userService.removeFirma(that.user_id, file.name)
					    .subscribe(data => {
					                
					    }
					);
				return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
			}
		};
		Dropzone.autoDiscover = false;
		this.dropf = new Dropzone('#firmas', this.optf);
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
