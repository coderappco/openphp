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
  serviciosForm: FormGroup;
  medicamentosForm: FormGroup;
  table: any = '';
  tableServices: any = '';
  tableMedicines: any = '';
  public lista: Array<object> = [];
  public submitted = false;
  public showIsPregnant:boolean = false;
  dtOptions: any = {};
  empresa_id: any = 0;
  promotion_id: any = 0;
  services_id: any = 0;
  medicines_id: any = 0;

  constructor(private formBuilder: FormBuilder,
    private globals: Globals,
    private api: PromocionService, private toastCtrl: ToastMessageService) { }

  ngOnInit() {
    this.initForm();
    this.initFormServices();
    this.initFormMedicines();
    this.table = $('#data-table').DataTable(this.fillTable());
    this.tableServices = $('#data-table-services').DataTable(this.fillTableServices());
    this.tableMedicines = $('#data-table-medicines').DataTable(this.fillTableMedicines());

    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        console.log(target)
        if(target == "#datosb"){
          $($.fn.dataTable.tables( true ) ).css('width', '100%');
          $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
        }
        if(target == "#infog"){
          $($.fn.dataTable.tables( true ) ).css('width', '100%');
          $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
        }
        if(target == "#contratos"){
          $($.fn.dataTable.tables( true ) ).css('width', '100%');
          $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
        }
    } );
  }

  ngAfterViewInit(): void {
    var that = this;
    $('.select2').select2({ dropdownAutoWidth: !0, width: "100%" });

    $('#GENEROS').on("select2:select", function (e) {
      if($(this).val() == 1 || $(this).val() == 3){
        this.showIsPregnant = false;
      }
      if($(this).val() == 2) {
        this.showIsPregnant = true;
      }
    });
    
		setTimeout(() => {
			this.globals.getUrl = 'promocionprevencion/list';
			this.globals.getUrl = 'serviciosprevencion/list';
			this.globals.getUrl = 'medicamentosprevencion/list';
    },0);
    
    /* Delete record */
    $('#data-table').on( 'click', '.btn-del', function () {
      that.deleteRecord($(this).attr('date'));
    });

    /* Edit Record */
    $('#data-table').on( 'click', '.btn-edit', function () {
			that.fillFormPromotion($(this).attr('date'));
    });
    
    $('#data-table-services').on( 'click', '.btn-del-services', function () {
      that.deleteRecordServices($(this).attr('date'));
    });

    $('#data-table-services').on( 'click', '.btn-edit-services', function () {
			that.fillFormService($(this).attr('date'));
    });

    $('#data-table-medicines').on( 'click', '.btn-del-medicines', function () {
      that.deleteRecordMedicines($(this).attr('date'));
    });

    $('#data-table-medicines').on( 'click', '.btn-edit-medicines', function () {
			that.fillFormMedicine($(this).attr('date'));
    });
  }

  get f() { return this.promocionForm.controls; }
  get fs() { return this.serviciosForm.controls; }
  get fm() { return this.medicamentosForm.controls; }

  /**
   * initForm
   */
  initForm() {
    this.promocionForm = this.formBuilder.group({
      COD_PROGRAMA: ['', [Validators.required]],
      NOMBRE_PROGRAMA: [''],
      ACTIVO: [''],
      EDAD_INICIAL: ['', [Validators.required]],
      UNIDAD_EDAD_INICIAL: [''],
      EDAD_FINAL: ['', [Validators.required]],
      UNIDAD_EDAD_FINAL: [''],
      GENEROS: [''],
      ZONA: [''],
      GESTANTES: ['']
    });
  }

  initFormServices() {
    this.serviciosForm = this.formBuilder.group({
      COD_SERVICIO: [''],
      NOM_SERVICIO: ['']
    });
  }

  initFormMedicines() {
    this.medicamentosForm = this.formBuilder.group({
      COD_MEDICAMENTO: ['', [Validators.required]],
      NOM_MEDICAMENTO: ['', [Validators.required]]
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
          this.clearAll("PROGRAMA");
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
   * saveNewServices
   */
  saveNewServices() {
    if(this.serviciosForm.invalid){
      return;
    }

    if(this.services_id == 0){
      this.serviciosForm.get('COD_SERVICIO').setValue($('#COD_SERVICIO').val());
      this.serviciosForm.get('NOM_SERVICIO').setValue($('#NOM_SERVICIO').val());

      this.api.createNewServices(this.serviciosForm.value).subscribe(data => {
        if(data.success == true){
          this.toastCtrl.showMessage(data.msg);
          this.clearAll("SERVICIOS");
          this.tableServices = $('#data-table-services').DataTable(this.fillTableServices());
        } else {
          this.toastCtrl.showMessage(data.msg);
        }
      });
    } else {
      this.serviciosForm.get('COD_SERVICIO').setValue($('#COD_SERVICIO').val());
      this.serviciosForm.get('NOM_SERVICIO').setValue($('#NOM_SERVICIO').val());

      this.api.updateServices(this.services_id, this.serviciosForm.value).subscribe(data => {
        if(data.success){
          this.toastCtrl.showMessage(data.msg);
          this.tableServices = $('#data-table-services').DataTable(this.fillTableServices());
        } else {
          this.toastCtrl.showMessage(data.msg);
        }
        $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      });
    }
  }

  /**
   * saveNewMedicines
   */
  saveNewMedicines() {
    if(this.medicamentosForm.invalid){
      return;
    }

    if(this.medicines_id == 0){
      this.medicamentosForm.get('COD_MEDICAMENTO').setValue($('#COD_MEDICAMENTO').val());
      this.medicamentosForm.get('NOM_MEDICAMENTO').setValue($('#NOM_MEDICAMENTO').val());

      this.api.createNewMedicine(this.medicamentosForm.value).subscribe(data => {
        if(data.success == true){
          this.toastCtrl.showMessage(data.msg);
          this.clearAll("MEDICAMENTOS");
          this.tableMedicines = $('#data-table-medicines').DataTable(this.fillTableMedicines());
        } else {
          this.toastCtrl.showMessage(data.msg);
        }
      });
    } else {
      this.medicamentosForm.get('COD_MEDICAMENTO').setValue($('#COD_MEDICAMENTO').val());
      this.medicamentosForm.get('NOM_MEDICAMENTO').setValue($('#NOM_MEDICAMENTO').val());

      this.api.updateMedicine(this.medicines_id, this.medicamentosForm.value).subscribe(data => {
        if(data.success){
          this.toastCtrl.showMessage(data.msg);
          this.tableMedicines = $('#data-table-medicines').DataTable(this.fillTableMedicines());
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
          title: 'Fecha de Alta', data: 'FEC_CREACION', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.FEC_CREACION;
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
        { "width": "200px", "targets": 2 },
        { "width": "200px", "targets": 3 }
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
   * fillTableServices
   */
  fillTableServices() {
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
      ajax: this.globals.apiUrl+'/serviciosprevencion/list',
      columns: [
        {
          title: 'Código Servicio', data: 'COD_SERVICIO', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.COD_SERVICIO;
          }
        },
        {
          title: 'Nom. del Servicio', data: 'NOM_SERVICIO', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.NOM_SERVICIO;
          }
        },
        {
          title: 'Fecha de Alta', data: 'FEC_CREACION', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.FEC_CREACION;
          }
        },
        {
          title: 'Acción', data: 'COD_SERVICIO', "render": function ( data, type, row, meta ) {
            let editar = '<button date="'+row.ID_SERVICIO+'" class="btn btn-light btn--icon btn-sm btn-edit-services" title="Editar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
            let eliminar = '<button date="'+row.ID_SERVICIO+'" class="btn btn-light btn--icon btn-sm btn-del-services" title="Eliminar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
            return editar + eliminar;
          }
        }
      ],
      "columnDefs": [
        { "width": "150px", "targets": 0 },
        { "width": "300px", "targets": 1 },
        { "width": "200px", "targets": 2 },
        { "width": "200px", "targets": 3 }
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
   * fillTableMedicines
   */
  fillTableMedicines() {
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
      ajax: this.globals.apiUrl+'/medicamentosprevencion/list',
      columns: [
        {
          title: 'Código Medicamento', data: 'COD_MEDICAMENTO', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.COD_MEDICAMENTO;
          }
        },
        {
          title: 'Nom. del Medicamento', data: 'NOM_MEDICAMENTO', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.NOM_MEDICAMENTO;
          }
        },
        {
          title: 'Fecha de Alta', data: 'FEC_CREACION', className: "align-middle", "render": function ( data, type, row, meta ) {
            return row.FEC_CREACION;
          }
        },
        {
          title: 'Acción', data: 'COD_MEDICAMENTO', "render": function ( data, type, row, meta ) {
            let editar = '<button date="'+row.ID_MEDICAMENTO+'" class="btn btn-light btn--icon btn-sm btn-edit-medicines" title="Editar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-edit"></i></button> ';
            let eliminar = '<button date="'+row.ID_MEDICAMENTO+'" class="btn btn-light btn--icon btn-sm btn-del-medicines" title="Eliminar registro" data-toggle="tooltip"><i class="actions__item zmdi zmdi-delete"></i></button>';
            return editar + eliminar;
          }
        }
      ],
      "columnDefs": [
        { "width": "150px", "targets": 0 },
        { "width": "300px", "targets": 1 },
        { "width": "200px", "targets": 2 },
        { "width": "200px", "targets": 3 }
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
   * fillFormService
   * @param id 
   */
  fillFormService(id){
    this.api.getSingleServices(id).subscribe(data =>{
      var services:any = data.item;
      this.services_id = services.ID_SERVICIO;
      $('#collapseOne').collapse('show');
      $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');

      this.serviciosForm.get('COD_SERVICIO').setValue(services.COD_SERVICIO);
      this.serviciosForm.get('NOM_SERVICIO').setValue(services.NOM_SERVICIO);
    });
  }

  /**
   * fillFormMedicine
   * @param id 
   */
  fillFormMedicine(id){
    this.api.getSingleMedicine(id).subscribe(data =>{
      var medicine:any = data.item;
      this.medicines_id = medicine.ID_MEDICAMENTO;
      $('#collapseOne').collapse('show');
      $('html, body').animate({ scrollTop: $('#foco').offset().top }, 'slow');
      $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Actualizar');

      this.medicamentosForm.get('COD_MEDICAMENTO').setValue(medicine.COD_MEDICAMENTO);
      this.medicamentosForm.get('NOM_MEDICAMENTO').setValue(medicine.NOM_MEDICAMENTO);
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
            this.clearAll("PROGRAMA");
          }
				}
			);
		}
  }
  
  /**
   * deleteRecordServices
   * @param id
   */
  deleteRecordServices(id) {
		if(confirm("Esta seguro que desea eliminar este registro?")) {
			this.api.deleteServices(id)
				.subscribe(data => {
          if(data.success == true){
            this.toastCtrl.showMessage(data.msg);
            this.tableServices = $('#data-table-services').DataTable(this.fillTableServices());
          } else {
            this.toastCtrl.showMessage(data.msg);
            this.clearAll("SERVICIOS");
          }
				}
			);
		}
  }
  
  /**
   * deleteRecordMedicines
   * @param id
   */
  deleteRecordMedicines(id) {
		if(confirm("Esta seguro que desea eliminar este registro?")) {
			this.api.deleteMedicine(id)
				.subscribe(data => {
          if(data.success == true){
            this.toastCtrl.showMessage(data.msg);
            this.tableMedicines = $('#data-table-medicines').DataTable(this.fillTableMedicines());
          } else {
            this.toastCtrl.showMessage(data.msg);
            this.clearAll("MEDICAMENTOS");
          }
				}
			);
		}
	}

  /**
   * clearAll
   */
  clearAll(module:string) {
    switch (module) {
      case "PROGRAMA":
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
        $('#activo').prop('checked', true);
        $('#GENEROS').val('').trigger('change');
        $('#ZONA').val('').trigger('change');
        this.initForm();
        break;

      case "SERVICIOS":
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        this.services_id = 0;
        this.serviciosForm.get('COD_SERVICIO').setValue('');
        this.serviciosForm.get('NOM_SERVICIO').setValue('');
        this.initFormServices();
        break;

      case "MEDICAMENTOS":
        $('.btn-addp').html('<i class="zmdi zmdi-floppy"></i> Registrar');
        this.medicines_id = 0;
        this.medicamentosForm.get('COD_MEDICAMENTO').setValue('');
        this.medicamentosForm.get('NOM_MEDICAMENTO').setValue('');
        this.initFormMedicines();
        break;
    
      default:
        break;
    }
	}
}
