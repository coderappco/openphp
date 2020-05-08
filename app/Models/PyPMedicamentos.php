<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 02/05/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PyPMedicamentos extends Model{
  protected $table      = 'PYP_MEDICAMENTOS';
  protected $primaryKey = 'ID_MEDICAMENTO';
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
    if($data->COD_MEDICAMENTO){
      return $query->where('COD_MEDICAMENTO', 'LIKE', "%{$data->COD_MEDICAMENTO}%");
    }
    if($data->NOM_MEDICAMENTO){
      return $query->where('NOM_MEDICAMENTO', 'LIKE', "%{$data->NOM_MEDICAMENTO}%");
    }
    return $query;
  }

  /**
   * getAllListRecords
   * @param null
   */
  public function getAllListRecords(){
    $query = $this
    ->selectRaw('ID_MEDICAMENTO, COD_MEDICAMENTO, NOM_MEDICAMENTO, ACTIVO, IS_ACTIVE, FEC_CREACION')
    ->FilterByActive()
    ->orderBy('ID_MEDICAMENTO', 'ASC')
    ->get();
    return $query;
  }

  /**
   * saveNewRecord
   * @param array $data
   * @return boolean true || false
   */
  public function saveNewRecord($data){
    $this->COD_MEDICAMENTO = $data->COD_MEDICAMENTO;
    $this->NOM_MEDICAMENTO = $data->NOM_MEDICAMENTO;

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
    ->selectRaw('ID_MEDICAMENTO, COD_MEDICAMENTO, NOM_MEDICAMENTO, ACTIVO, IS_ACTIVE, FEC_CREACION')
    ->FilterByActive()
    ->where('ID_MEDICAMENTO', $id)
    ->get()->first();
    return $query;
  }

  /**
   * updateRecord
   * @param array $data
   */
  public function updateRecord($data){
    $response = $this->find($data->ID_MEDICAMENTO);
    $response->COD_MEDICAMENTO = $data->COD_MEDICAMENTO;
    $response->NOM_MEDICAMENTO = $data->NOM_MEDICAMENTO;

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
    ->where('COD_MEDICAMENTO', $data->COD_MEDICAMENTO)
    ->FilterByActive()
    ->get()->first();

    if(count($query) > 0){
      return true;
    } else {
      return false;
    }
  }
}