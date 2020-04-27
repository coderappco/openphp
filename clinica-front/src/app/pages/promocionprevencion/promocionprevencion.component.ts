import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-promocionprevencion',
  templateUrl: './promocionprevencion.component.html',
  styleUrls: ['./promocionprevencion.component.css']
})
export class PromocionprevencionComponent implements OnInit {
  promocionForm: FormGroup;
  table: any = '';
  public lista: Array<object> = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  get f() { return this.promocionForm.controls; }

  initForm() {
    this.promocionForm = this.formBuilder.group({
      COD_PROGRAMA: [''],
      NOMBRE_PROGRAMA: [''],
      ACTIVO: [''],
      EDAD_INICIAL: [''],
      UNIDAD_EDAD_INICIAL: [''],
      EDAD_FINAL: [''],
      UNIDAD_EDAD_FINAL: [''],
      GENEROS: [''],
      ZONA: [''],
      gestantes: [''],
      COD_SERVICIO: [''],
      NOM_SERVICIO: [''],
      COD_MEDICAMENTO: [''],
      NOM_MEDICAMENTO: ['']

    });
  }

  ngAfterViewInit(): void {
    $('.select2').select2({ dropdownAutoWidth: !0, width: "100%" });
  }

  agregar() {
    this.lista.push({ codigo: 'qqq', nombre: 'zzzzz' });

  }
}
