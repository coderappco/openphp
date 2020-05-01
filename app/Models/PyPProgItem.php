<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 29/04/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PyPProgItem extends Model{
  protected $table      = 'PYP_PROG_ITEM';
  protected $primaryKey = 'ID_PYP_PROG_ITEM';
  public $timestamps    = false;
  protected $SoftDelete = false;
}