import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import {CodifService} from '../../../services/codif.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	unidad: string;
	codigo: string;
	search: FormGroup;

  	constructor(/*private codifService: CodifService,*/ private formBuilder: FormBuilder) { }

  	ngOnInit() {
  		/*this.codifService.getDatosUnidad()
			.subscribe(data => {
				let dato: any = data;
				this.unidad = dato.datos[1].descripcion;
				this.codigo = dato.datos[1].codigo;
			}
		);*/

		this.search = this.formBuilder.group({
			search: [''],
		});
  	}

}
