import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../../globals';
import { UserService } from '../../../services/usuario.service';
import { RangoseService } from '../../../services/rangose.service';
import { HistoriasService } from '../../../services/historias.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	
	name: string = '';
	email: string = '';
	role: string = '';
	unidad: string;
	codigo: string;
	foto: any = 'assets/img/users1.png';
	submitted = false;
	historiaForm: FormGroup;
	rangos: any = [];
	historias: any = [];
	edadesForm: FormGroup;

	constructor(private formBuilder: FormBuilder, private historiasService: HistoriasService, private rangoseService: RangoseService, private route: ActivatedRoute, private router: Router, public globals: Globals, private userService: UserService) {}

	ngOnInit() {
		let us = JSON.parse(localStorage.getItem('currentUser'));
		this.name = us.user.NOMBRES;
		this.email = us.user.CORREO;	
		this.role = us.role;
		if(us.user.FOTO != null)
			this.foto = this.globals.urlPhoto+"photos/ID("+us.user.ID_USUARIO+")"+us.user.FOTO;
		this.initForm();
	}	

	ngAfterViewInit(): void {
		var that = this;
        $('.select2').select2({dropdownAutoWidth:!0,width:"100%"});
        $('#ID_HISTORIA').on("change", function (e) {
        	if($(this).val() != null && $(this).val() != '')
	        	that.historiasService.getHistoria($(this).val())
	        		.subscribe(data => {
	        			let da: any = data;
	        			let rango = (da.ID_RANGO != null && da.ID_RANGO != '') ? da.ID_RANGO : '';
	        			let genero = (da.GENERO != null && da.GENERO != '') ? da.GENERO : '';
	        			$('#ID_RANGO').val(rango).trigger('change');
						$('#GENERO').val(genero).trigger('change');
	        		}
	        	);
        });
    }

	logout() {
		//let us = JSON.parse(localStorage.getItem('currentUser'));
		localStorage.removeItem('currentUser');
		this.globals.isLogued = false;
		this.router.navigate(['/login']);
		/*this.userService.logout(us.token)
			.subscribe(data => {
				localStorage.removeItem('currentUser');
				this.globals.isLogued = false;
				this.router.navigate(['/login']);
			}
		);*/
	}

	get f() { return this.edadesForm.controls; }

	initForm() {
        this.historiaForm = this.formBuilder.group({
            ID_HISTORIA: [''],
            ID_RANGO: [''],
            GENERO: [''],
        });
        this.edadesForm = this.formBuilder.group({
            NOM_RANGO: ['', [Validators.required]],
            EDAD_INICIAL: [0, [Validators.required]],
            EDAD_FINAL: [''],
            EDAD_INICIAL_MESES: [''],
            EDAD_FINAL_MESES: [''],
  	    });
    }

	Historias() {
		$('[data-toggle="tooltip"]').tooltip();
		this.rangoseService.getRangosE()
			.subscribe(data => {
				let da: any = data;
				this.rangos = da;
				this.historiasService.listHistorias()
					.subscribe(data => {
						let hi: any = data;
						this.historias = hi;
					})
			}
		);
		$('#historia_modal').modal('show');
	}

	CrearRango() {
		$('#historia_modal').modal('hide');
		setTimeout(() => 
		{
			$('#rango_modal').modal('show');
		},500);
	}

	CancelHistoria() {
		$('#historia_modal').modal('hide');
		this.historiaForm.get('ID_HISTORIA').setValue('');
		this.historiaForm.get('ID_RANGO').setValue('');
		this.historiaForm.get('GENERO').setValue('');
		$('#ID_RANGO').val('').trigger('change');
		$('#ID_HISTORIA').val('').trigger('change');
		$('#GENERO').val('').trigger('change');
	}

	CancelRango() {
		$('#rango_modal').modal('hide');
		setTimeout(() => 
		{
			$('#historia_modal').modal('show');
		},500);
	}

	UpdateHistoria() {
        if($('#GENERO').val() == '' || $('#GENERO').val() == null) {
        	alert("Por favor, debe escoger el GENERO");
        	return false;
        }
        if($('#ID_RANGO').val() == '' || $('#ID_RANGO').val() == null) {
        	alert("Por favor, debe escoger el rango de EDAD");
        	return false;
        }
        if($('#ID_HISTORIA').val() == '' || $('#ID_HISTORIA').val() == null) {
        	alert("Por favor, debe escoger la HISTORIA a modificar");
        	return false;
        }
        if(!confirm("Esta Seguro que desea Modificar la validación de la historia?")) 
			return false;
		this.historiaForm.get('ID_HISTORIA').setValue($('#ID_HISTORIA').val());
		this.historiaForm.get('ID_RANGO').setValue($('#ID_RANGO').val());
		this.historiaForm.get('GENERO').setValue($('#GENERO').val());
		this.historiasService.updateHistoria($('#ID_HISTORIA').val(),this.historiaForm.value)
			.subscribe(data => {
				$('#historia_modal').modal('hide');
				this.historiaForm.get('ID_HISTORIA').setValue('');
				this.historiaForm.get('ID_RANGO').setValue('');
				this.historiaForm.get('GENERO').setValue('');
				$('#ID_RANGO').val('').trigger('change');
				$('#ID_HISTORIA').val('').trigger('change');
				$('#GENERO').val('').trigger('change');
				this.showMessage("Historia actulizada");
			}
		);
	}

	RegistrarRango() {
		this.submitted = true;

        if (this.edadesForm.invalid) {
            return;
        }

        let edadim = $('#edadim').prop('checked') == true ? 1 : 0;
        let edadfm = $('#edadfm').prop('checked') == true ? 1 : 0;
        this.edadesForm.get('EDAD_INICIAL_MESES').setValue(edadim);
        this.edadesForm.get('EDAD_FINAL_MESES').setValue(edadfm);

        if(!confirm("Esta Seguro que desea Agregar el rango de edad?")) 
			return false;
        this.rangoseService.crearRangoE(this.edadesForm.value)
            .subscribe(data => {
            	let da: any = data;
                var newOptions = '<option value="'+ da.ID_RANGO +'">'+ da.NOM_RANGO +'</option>';
                var html = $('#ID_RANGO').html();
                $('#ID_RANGO').html(html+newOptions).select2({dropdownAutoWidth:!0,width:"100%"});
                $('#ID_RANGO').val(da.ID_RANGO).trigger('change');
              	this.showMessage("Rango de edad asignado");
              	this.submitted = false;
              	this.edadesForm.get('NOM_RANGO').setValue('');
		      	this.edadesForm.get('EDAD_INICIAL').setValue(0);
		      	this.edadesForm.get('EDAD_FINAL').setValue('');
		      	$('#rango_modal').modal('hide');
				setTimeout(() => 
				{
					$('#historia_modal').modal('show');
				},500);
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
