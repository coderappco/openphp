<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 29/04/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PyPProgContrato extends Model{
  protected $table      = 'PYP_PROG_CONTRATO';
  protected $primaryKey = 'ID_PYP_CONTRATO';
  public $timestamps    = false;
  protected $SoftDelete = false;
}