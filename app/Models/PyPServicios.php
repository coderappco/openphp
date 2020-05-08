<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 02/05/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PyPServicios extends Model{
  protected $table      = 'PYP_SERVICIOS';
  protected $primaryKey = 'ID_SERVICIO';
  public $timestamps    = false;
  protected $SoftDelete = false;

  /**
   * scopeFilterByActive
   */
  public function scopeFilterByActive($query, $data=null){
    return $query->where('IS_ACTIVE', 1);
  }

  /**
   * scopeFilterResult
   */
  public function scopeFilterResult($query, $data=null){
    if($data->COD_SERVICIO){
      return $query->where('COD_SERVICIO', 'LIKE', "%{$data->COD_SERVICIO}%");
    }
    if($data->NOM_SERVICIO){
      return $query->where('NOM_SERVICIO', 'LIKE', "%{$data->NOM_SERVICIO}%");
    }
    return $query;
  }

  /**
   * getAllListRecords
   * @param null
   */
  public function getAllListRecords(){
    $query = $this
    ->selectRaw('ID_SERVICIO, COD_SERVICIO, NOM_SERVICIO, ACTIVO, IS_ACTIVE, FEC_CREACION')
    ->FilterByActive()
    ->orderBy('ID_SERVICIO', 'ASC')
    ->get();
    return $query;
  }

  /**
   * saveNewRecord
   * @param array $data
   * @return boolean true || false
   */
  public function saveNewRecord($data){
    $this->COD_SERVICIO	= $data->COD_SERVICIO;
    $this->NOM_SERVICIO	= $data->NOM_SERVICIO;

    if($this->save()){
      return true;
    } else {
      return false;
    }
  }

  /**
   * getSingleRecord
   * @param int $id
   */
  public function getSingleRecord($id){
    $query = $this
    ->selectRaw('ID_SERVICIO, COD_SERVICIO, NOM_SERVICIO, ACTIVO, IS_ACTIVE, FEC_CREACION')
    ->FilterByActive()
    ->where('ID_SERVICIO', $id)
    ->get()->first();
    return $query;
  }

  /**
   * updateRecord
   * @param array $data
   */
  public function updateRecord($data){
    $response = $this->find($data->ID_SERVICIO);
    $response->COD_SERVICIO	= $data->COD_SERVICIO;
    $response->NOM_SERVICIO	= $data->NOM_SERVICIO;

    if($response->save()){
      return true;
    } else {
      return false;
    }
  }

  /**
   * deleteRecord
   * @param array $data
   * @return boolean true || false
   */
  public function deleteRecord($data){
    $response = $this->find($data->id);
    $response->IS_ACTIVE = 0;

    if($response->save()){
      return true;
    } else {
      return false;
    }
  }

  /**
   * checkIfCodeExist
   * @param array $data
   * @return boolean true || false
   */
  public function checkIfCodeExist($data){
    $query = $this
    ->where('COD_SERVICIO', $data->COD_SERVICIO)
    ->FilterByActive()
    ->get()->first();

    if(count($query) > 0){
      return true;
    } else {
      return false;
    }
  }
}