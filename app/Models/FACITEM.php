<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 02/05/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class FACITEM extends Model{
  protected $table      = 'FAC_ITEM';
  protected $primaryKey = 'ID_ITEM';
  public $timestamps    = false;
  protected $SoftDelete = false;

  /**
   * scopeFilterByActive
   */
  public function scopeFilterByActive($query, $data=null){
    return $query->where('ACTIVO', 1);
  }

  /**
   * scopeFilterByModule
   */
  public function scopeFilterByModule($query, $data=null){
    if($data->module == "SERVICIOS"){
      return $query->where('SERVICIO', 1)->where('MEDICAMENTO', 0);
    } else {
      return $query->where('MEDICAMENTO', 1)->where('SERVICIO', 0);
    }
  }

  /**
   * scopeFilterResult
   */
  public function scopeFilterResult($query, $data=null){
    if($data->COD_ITEM){
      return $query->where('COD_ITEM', 'LIKE', "%{$data->COD_ITEM}%");
    }
    if($data->NOM_ITEM){
      return $query->where('NOM_ITEM', 'LIKE', "%{$data->NOM_ITEM}%");
    }
    return $query;
  }

  /**
   * getAllListRecords
   * @param $module
   */
  public function getAllListRecords($module=null){
    $query = $this
    ->selectRaw('ID_ITEM, COD_ITEM, NOM_ITEM, ACTIVO, FEC_CREACION')
    ->FilterByModule($module)
    ->FilterByActive()
    ->orderBy('ID_ITEM', 'ASC')
    ->get();
    return $query;
  }

  /**
   * saveNewRecord
   * @param array $data
   * @return boolean true || false
   */
  public function saveNewRecord($module, $data){
    switch ($module) {
      case 'SERVICIOS':
        $this->COD_ITEM	= $data->COD_SERVICIO;
        $this->NOM_ITEM	= $data->NOM_SERVICIO;
        $this->SERVICIO	= 1;
        $this->MEDICAMENTO = 0;
    
        if($this->save()){
          return true;
        } else {
          return false;
        }
        break;
      case 'MEDICAMENTOS':
        $this->COD_ITEM	= $data->COD_MEDICAMENTO;
        $this->NOM_ITEM	= $data->NOM_MEDICAMENTO;
        $this->SERVICIO	= 0;
        $this->MEDICAMENTO = 1;
    
        if($this->save()){
          return true;
        } else {
          return false;
        }
        break;
      
      default:
        break;
    }
  }

  /**
   * getSingleRecord
   * @param int $id
   */
  public function getSingleRecord($module, $id){
    switch ($module) {
      case 'SERVICIOS':
        $query = $this
        ->selectRaw('ID_ITEM, COD_ITEM, NOM_ITEM, ACTIVO, FEC_CREACION')
        ->FilterByActive()
        ->where('ID_ITEM', $id)
        ->get()->first();
        return $query;
        break;

      case 'MEDICAMENTOS':
        $query = $this
        ->selectRaw('ID_ITEM, COD_ITEM, NOM_ITEM, ACTIVO, FEC_CREACION')
        ->FilterByActive()
        ->where('ID_ITEM', $id)
        ->get()->first();
        return $query;
        break;
      
      default:
        break;
    }
  }

  /**
   * updateRecord
   * @param array $data
   */
  public function updateRecord($module, $data){
    switch ($module) {
      case 'SERVICIOS':
        $response = $this->find($data->ID_SERVICIO);
        $response->COD_ITEM	= $data->COD_SERVICIO;
        $response->NOM_ITEM	= $data->NOM_SERVICIO;
    
        if($response->save()){
          return true;
        } else {
          return false;
        }
        break;
      case 'MEDICAMENTOS':
        $response = $this->find($data->ID_MEDICAMENTO);
        $response->COD_ITEM	= $data->COD_MEDICAMENTO;
        $response->NOM_ITEM	= $data->NOM_MEDICAMENTO;
    
        if($response->save()){
          return true;
        } else {
          return false;
        }
        break;
      
      default:
        break;
    }
  }

  /**
   * deleteRecord
   * @param array $data
   * @return boolean true || false
   */
  public function deleteRecord($module, $data){
    switch ($module) {
      case 'SERVICIOS':
        $response = $this->find($data->id);
        $response->ACTIVO = 0;
    
        if($response->save()){
          return true;
        } else {
          return false;
        }
        break;
      case 'MEDICAMENTOS':
        $response = $this->find($data->id);
        $response->ACTIVO = 0;
    
        if($response->save()){
          return true;
        } else {
          return false;
        }
        break;
      
      default:
        break;
    }
  }

  /**
   * checkIfCodeExist
   * @param array $data
   * @return boolean true || false
   */
  public function checkIfCodeExist($data){
    $query = $this
    ->where('COD_ITEM', $data->COD_ITEM)
    ->FilterByActive()
    ->get()->first();

    if(count($query) > 0){
      return true;
    } else {
      return false;
    }
  }
}