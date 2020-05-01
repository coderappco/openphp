import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Globals} from '../../globals';
/* Services */
import { PromocionService } from '../../services/promocion.service';
import { ToastMessageService } from '../../services/ToastMessage.service';

/**
 * @var global
 */
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
  public submitted = false;
  public showIsPregnant = false;
  dtOptions: any = {};
  empresa_id: any = 0;
  promotion_id: any = 0;

  constructor(private formBuilder: FormBuilder,
    private globals: Globals,
    private api: PromocionService, private toastCtrl: ToastMessageService) { }

  ngOnInit() {
    this.initForm();
    this.table = $('#data-table').DataTable(this.fillTable());
  }

  ngAfterViewInit(): void {
    var that = this;
    $('.select2').select2({ dropdownAutoWidth: !0, width: "100%" });
		setTimeout(() => {
			this.globals.getUrl = 'promocionprevencion/list';
    },0);
    
    /* Delete record */
    $('#data-table').on( 'click', '.btn-del', function () {
      that.deleteRecord($(this).attr('date'));
    });

    /* Edit Record */
    $('#data-table').on( 'click', '.btn-edit', function () {
			that.fillFormPromotion($(this).attr('date'));
		});
  }

  get f() { return this.promocionForm.controls; }

  /**
   * initForm
   */
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
      GESTANTES: [''],
      COD_SERVICIO: [''],
      NOM_SERVICIO: [''],
      COD_MEDICAMENTO: [''],
      NOM_MEDICAMENTO: ['']
    });
  }

  /**
   * saveNewRecord
   */
  saveNewRecord() {
    this.submitted = true;

    if(this.promocionForm.invalid){
      return;
    }

    if(this.promotion_id == 0){
      var isPregnant = 0;
      var activo   = $('#activo').prop('checked') == true ? 1 : 0;
      var gestante = $('#GESTANTES').prop('checked') == true ? 1 : 0;

      this.promocionForm.get('COD_PROGRAMA').setValue($('#COD_PROGRAMA').val());
      this.promocionForm.get('NOMBRE_PROGRAMA').setValue($('#NOMBRE_PROGRAMA').val());
      this.promocionForm.get('ACTIVO').setValue(activo);
      this.promocionForm.get('EDAD_INICIAL').setValue($('#EDAD_INICIAL').val());
      this.promocionForm.get('UNIDAD_EDAD_INICIAL').setValue($('#UNIDAD_EDAD_INICIAL').val());
      this.promocionForm.get('EDAD_FINAL').setValue($('#EDAD_FINAL').val());
      this.promocionForm.get('UNIDAD_EDAD_FINAL').setValue($('#UNIDAD_EDAD_FINAL').val());
      this.promocionForm.get('GENEROS').setValue($('#GENEROS option:selected').val());
      this.promocionForm.get('ZONA').setValue($('#ZONA option:selected').val());
      this.promocionForm.get('GESTANTES').setValue(gestante);

      this.api.createNewPromotion(this.promocionForm.value).subscribe(data => {
        if(data.success == true){
          this.toastCtrl.showMessage(data.msg);
          this.submitted = false;
          this.clearAll();
          this.table = $('#data-table').DataTable(this.fillTable());
        } else {
          this.toastCtrl.showMessage(data.msg);
        }
      });
    } else {
      var activo   = $('#activo').prop('checked') == true ? 1 : 0;
      var gestante = $('#GESTANTES').prop('checked') == true ? 1 : 0;

      this.promocionForm.get('COD_PROGRAMA').setValue($('#COD_PROGRAMA').val());
      this.promocionForm.get('NOMBRE_PROGRAMA').setValue($('#NOMBRE_PROGRAMA').val());
      this.promocionForm.get('ACTIVO').setValue(activo);
      this.promocionForm.get('EDAD_INICIAL').setValue($('#EDAD_INICIAL').val());
      this.promocionForm.get('UNIDAD_EDAD_INICIAL').setValue($('#UNIDAD_EDAD_INICIAL').val());
      this.promocionForm.get('EDAD_FINAL').setValue($('#EDAD_FINAL').val());
      this.promocionForm.get('UNIDAD_EDAD_FINAL').setValue($('#UNIDAD_EDAD_FINAL').val());
      this.promocionForm.get('GENEROS').setValue($('#GENEROS option:selected').val());
      this.promocionForm.get('ZONA').setValue($('#ZONA option:selected').val());
      this.promocionForm.get('GESTANTES').setValue(gestante);

      this.api.updatePromotion(this.promotion_id, this.promocionForm.value).subscribe(data => {
        if(data.success){
          this.toastCtrl.showMessage(data.msg);
          this.table = $('#data-table').DataTable(this.fillTable());
        } else {
          this.toastCtrl.showMessage(data.msg);
        }
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      });
    }
  }

  /**
   * fillTable
   */
  fillTable() {
		var that = this;
    return this.dtOptions = {
      pageLength: 10,
      autoWidth: true,
      responsive: true,
      "destroy": true,
      language: {
        "url": "src/assets/Spanish.json",
        searchPlaceholder: "Escriba parametro a filtrar..."
      },
      ajax: this.globals.apiUrl+'/promocionprevencion/list',
      columns: [
        {
          title: 'Código Programa', data: 'COD_PROG_PYP', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.COD_PROG_PYP;
          }
        },
        {
          title: 'Nom. del Programa', data: 'NOM_PROG_PYP', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.NOM_PROG_PYP;
          }
        },
        {
          title: 'Acción', data: 'COD_PROG_PYP', "render": function ( data, type, row, meta ) {
            let editar = '<button date="'+row.ID_PYP+'" class="btn btn-light btn--icon btn-sm btn-edit" title="Editar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
            let eliminar = '<button date="'+row.ID_PYP+'" class="btn btn-light btn--icon btn-sm btn-del" title="Eliminar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
            return editar + eliminar;
          }
        }
      ],
      "columnDefs": [
        { "width": "150px", "targets": 0 },
        { "width": "300px", "targets": 1 },
        { "width": "200px", "targets": 2 }
      ],
      dom: '<"dataTables__top"lfB>rt<"dataTables__bottom"ip><"clear">',
      buttons: [{
        extend: "excelHtml5",
        title: "Export Data"
      },
      {
        extend: "csvHtml5",
        title: "Export Data"
      },
      {
        extend: "print",
        title: "Material Admin"
      }],
      "initComplete": function () {
        $('[data-toggle="tooltip"]').tooltip();
        $(this).closest(".dataTables_wrapper").find(".dataTables__top").prepend('<div class="dataTables_buttons hidden-sm-down actions"><span class="actions__item zmdi zmdi-print" data-table-action="print" /><span class="actions__item zmdi zmdi-fullscreen" data-table-action="fullscreen" /><div class="dropdown actions__item"><i data-toggle="dropdown" class="zmdi zmdi-download" /><ul class="dropdown-menu dropdown-menu-right"><a href="" class="dropdown-item" data-table-action="excel">Excel (.xlsx)</a><a href="" class="dropdown-item" data-table-action="csv">CSV (.csv)</a></ul></div></div>')
      },
    };
  }

  /**
   * fillFormPromotion
   * @param id 
   */
  fillFormPromotion(id){
    this.api.getSinglePromotion(id).subscribe(data =>{
      var promotion:any = data.item;
      this.promotion_id = promotion.ID_PYP;
      $('#collapseOne').collapse('show');
      $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');

      this.promocionForm.get('COD_PROGRAMA').setValue(promotion.COD_PROG_PYP);
      this.promocionForm.get('NOMBRE_PROGRAMA').setValue(promotion.NOM_PROG_PYP);
      this.promocionForm.get('ACTIVO').setValue(promotion.ACTIVO);
      this.promocionForm.get('EDAD_INICIAL').setValue(promotion.EDAD_INICIAL);
      this.promocionForm.get('UNIDAD_EDAD_INICIAL').setValue(promotion.U_EDAD_INICIAL);
      this.promocionForm.get('EDAD_FINAL').setValue(promotion.EDAD_FINAL);
      this.promocionForm.get('UNIDAD_EDAD_FINAL').setValue(promotion.U_EDAD_FINAL);
      this.promocionForm.get('GENEROS').setValue(promotion.GENERO);
      this.promocionForm.get('ZONA').setValue(promotion.ZONA);
      this.promocionForm.get('GESTANTES').setValue(promotion.GESTANTE);
    });
  }

  /**
   * deleteRecord
   * @param id
   */
  deleteRecord(id) {
		if(confirm("Esta seguro que desea eliminar este registro?")) {
			this.api.deletePromotion(id)
				.subscribe(data => {
          if(data.success == true){
            this.toastCtrl.showMessage(data.msg);
            this.table = $('#data-table').DataTable(this.fillTable());
          } else {
            this.toastCtrl.showMessage(data.msg);
            this.clearAll();
          }
				}
			);
		}
	}

  /**
   * clearAll
   */
  clearAll() {
    $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
    this.promotion_id = 0;
		this.promocionForm.get('COD_PROGRAMA').setValue('');
		this.promocionForm.get('NOMBRE_PROGRAMA').setValue('');
		this.promocionForm.get('ACTIVO').setValue('');
		this.promocionForm.get('EDAD_INICIAL').setValue('');
		this.promocionForm.get('UNIDAD_EDAD_INICIAL').setValue('');
		this.promocionForm.get('EDAD_FINAL').setValue('');
		this.promocionForm.get('GENEROS').setValue('');
		this.promocionForm.get('ZONA').setValue('');
		this.promocionForm.get('GESTANTES').setValue('');
		this.promocionForm.get('COD_SERVICIO').setValue('');
		this.promocionForm.get('NOM_SERVICIO').setValue('');
		this.promocionForm.get('NOM_MEDICAMENTO').setValue('');
    $('#activo').prop('checked', true);
    $('#GENEROS').val('').trigger('change');
    $('#ZONA').val('').trigger('change');
		this.initForm();
	}
}
