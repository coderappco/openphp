import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../globals';
import * as Dropzone from "src/assets/plantilla/vendors/bower_components/dropzone/dist/dropzone.js";
import { SortablejsOptions } from 'angular-sortablejs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

import { AdministradoraService } from '../../services/administradora.service';
import { ContratoService } from '../../services/contrato.service';
import { PacienteService } from '../../services/paciente.service';
import { CodifService } from '../../services/codif.service';

declare var $: any;

@Component({
  	selector: 'app-importar',
  	templateUrl: './importar.component.html',
  	styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {

	submitted = false;
  	importForm: FormGroup;
  	administradoras: any = [];
  	orden: any = [];
  	drop: any = '';
	opt: any = '';

	draggableItems = [];

	draggableOptions: SortablejsOptions = {
	    scroll: true,
	    scrollSensitivity: 100,
	};

  	constructor(private _loadingBar: SlimLoadingBarService, private formBuilder: FormBuilder, private globals: Globals, private adminService: AdministradoraService,
                private contratoService: ContratoService, private pacienteService: PacienteService, private codifService: CodifService) { }

  	ngOnInit() {
  		this.importForm = this.formBuilder.group({
            ID_ADMINISTRADORA: [''],
            CONTRATO: [''],
            SEPARADOR: [''],
            HEADER: [''],
            ORDEN: ['']
        });
  	}

  	ngAfterViewInit(): void {
  		var that = this;
		setTimeout(() => 
		{
			this.globals.getUrl = 'import';
		},0);
		$('.select2').select2({dropdownAutoWidth:!0,width:"100%",allowClear: true});

		this.adminService.getAdministradoras()
			.subscribe(data => this.administradoras = data);

		$('.select2.admin').on("change", function (e) {
            that.getContratos($(this).val());
            if($(this).val() != '' && $(this).val() != null)
	            that.adminService.getOrderI($(this).val())
	            	.subscribe(data => {
	            		let da: any = data;
		        		that.orden = da;  		
						var newOptions = '';
						that.draggableItems = [];
		        		for(var i in da) {
		        			newOptions += '<div class="col-sm-2 mb-3">' +
		        						'<div style="background-color: #FFFFFF;text-align: center;padding: 5px;border-radius: 2px;' +
		        						'box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);color: #5E5E5E;font-weight: 500;">' +
		        						'<div style="cursor: pointer;">'+da[i].desc+'</div>' +
		        						'</div></div>';
		        			that.draggableItems.push({ ident: da[i].ident, text: da[i].desc});	
		        		}
		        		$('#drag').html(newOptions);
	            	}
	            );
	        else {
	        	that.codifService.getOrden()
		        	.subscribe(data => {
		        		let da: any = data;
		        		that.orden = da;  		
						var newOptions = '';
						that.draggableItems = [];
		        		for(var i in da) {
		        			newOptions += '<div class="col-sm-2 mb-3">' +
		        						'<div style="background-color: #FFFFFF;text-align: center;padding: 5px;border-radius: 2px;' +
		        						'box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);color: #5E5E5E;font-weight: 500;">' +
		        						'<div style="cursor: pointer;">'+da[i].desc+'</div>' +
		        						'</div></div>';
		        			that.draggableItems.push({ ident: da[i].ident, text: da[i].desc});	
		        		}
		        		$('#drag').html(newOptions);
		        	}
		        );
	        }
        });

        this.codifService.getOrden()
        	.subscribe(data => {
        		let da: any = data;
        		this.orden = da;
        		for(var i in da) {
        			this.draggableItems.push({ ident: da[i].ident, text: da[i].desc});	
        		}
        	}
        );

        this.UploadPhoto();
	}

	get f() { return this.importForm.controls; }

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

    Importar() {
    	if($('#ID_ADMINISTRADORA').val() != '' && $('#CONTRATO').val() == '') {
    		alert("Por favor, si son paciente de una administradora debe escoger el contrato");
    		return false;
    	}
    	if(confirm("Esta seguro que desea importar los pacientes?")) {
    		this._loadingBar.progress = 50;
    		this._loadingBar.start(() => {
	            this._loadingBar.progress++;
	        });
	        this._loadingBar.stop();
	    	this.importForm.get('ID_ADMINISTRADORA').setValue($('#ID_ADMINISTRADORA').val());
	    	this.importForm.get('CONTRATO').setValue($('#CONTRATO').val());
	    	this.importForm.get('SEPARADOR').setValue($('#SEPARADOR').val());
	    	let header = $('#HEADER').prop('checked') == true ? 1 : 2;
	    	this.importForm.get('HEADER').setValue(header);
	    	this.importForm.get('ORDEN').setValue(this.draggableItems);
	    	this.pacienteService.importarArchivo(this.importForm.value)
				.subscribe(data => {
					let da: any = data;
					this._loadingBar.complete();
					alert("Se actualizaron " + da.update + " pacientes, y se crearon " + da.create + " nuevos pacientes");
					$('#ID_ADMINISTRADORA').val('').trigger('change');
					$('#SEPARADOR').val(1).trigger('change');
					$('#HEADER').prop('checked', false);
					this.importForm.get('SEPARADOR').setValue(1);
					var drop = Dropzone.forElement(".dropzone");
			        if(drop.files.length > 0) {
			            var file = drop.files[0];
			            drop.removeFile(file);
			            drop.files.pop();
			        }
			        this.codifService.getOrden()
			        	.subscribe(data => {
			        		let da: any = data;
			        		this.orden = da;  		
							var newOptions = '';
							this.draggableItems = [];
			        		for(var i in da) {
			        			newOptions += '<div class="col-sm-2 mb-3">' +
			        						'<div style="background-color: #FFFFFF;text-align: center;padding: 5px;border-radius: 2px;' +
			        						'box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);color: #5E5E5E;font-weight: 500;">' +
			        						'<div style="cursor: pointer;">'+da[i].desc+'</div>' +
			        						'</div></div>';
			        			this.draggableItems.push({ ident: da[i].ident, text: da[i].desc});	
			        		}
			        		$('#drag').html(newOptions);
			        	}
			        );
				},
				error => {
					alert(error);
					this._loadingBar.complete();
				}
			);
		}
    }

    UploadPhoto() {
  		var that = this;
  		var url = this.globals.apiUrl+"/pacientes/importar";
		this.opt = {
			dictDefaultMessage: "Arrastre el archivo aqui",
			uploadMultiple: false,
			parallelUploads: 1,
			maxFiles: 1,
			url: url,
			addRemoveLinks:true,
			acceptedFiles: ".txt,.csv",
			thumbnailWidth: 120,
    		thumbnailHeight: 120,
			init: function() {    
				this.on('addedfile', function(file) {
					if (this.files.length > 1) {
					   	this.removeFile(file);
					   	alert("Solo puede escoger una archivo");
					}
				});
			},
			removedfile: function(file) {
				var _ref;
				that.pacienteService.removeArchivo(file.name)
					.subscribe(data => {
					                
					}
				);
				return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
			}
		};
		Dropzone.autoDiscover = false;
		this.drop = new Dropzone('#archivo', this.opt);
  	}

}
