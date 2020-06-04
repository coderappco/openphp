<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 29/04/2020
 */
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PyPPrograma extends Model{
  protected $table      = 'PYP_PROGRAMA';
  protected $primaryKey = 'ID_PYP';
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
    if($data->COD_PROG_PYP){
      return $query->where('COD_PROG_PYP', 'LIKE', "%{$data->COD_PROG_PYP}%");
    }
    if($data->COD_PROG_PYP){
      return $query->where('NOM_PROG_PYP', 'LIKE', "%{$data->NOM_PROG_PYP}%");
    }
    return $query;
  }

  /**
   * getAllListRecords
   * @param null
   */
  public function getAllListRecords(){
    $query = $this
    ->selectRaw('ID_PYP, COD_PROG_PYP, NOM_PROG_PYP, ACTIVO, FEC_CREACION')
    ->FilterByActive()
    ->orderBy('ID_PYP', 'ASC')
    ->get();
    return $query;
  }

  /**
   * saveNewRecord
   * @param array $data
   * @return boolean true || false
   */
  public function saveNewRecord($data){
    $this->COD_PROG_PYP = $data->COD_PROG_PYP;
    $this->NOM_PROG_PYP = $data->NOM_PROG_PYP;
    $this->ACTIVO	      = 1;

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
    ->selectRaw('ID_PYP, COD_PROG_PYP, NOM_PROG_PYP, ACTIVO, FEC_CREACION')
    ->FilterByActive()
    ->where('ID_PYP', $id)
    ->get()->first();
    return $query;
  }

  /**
   * updateRecord
   * @param array $data
   */
  public function updateRecord($data){
    $response = $this->find($data->ID_PYP);
    $response->COD_PROG_PYP = $data->COD_PROG_PYP;
    $response->NOM_PROG_PYP = $data->NOM_PROG_PYP;

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
    ->where('COD_PROG_PYP', $data->COD_PROG_PYP)
    ->FilterByActive()
    ->get()->first();

    if(count($query) > 0){
      return true;
    } else {
      return false;
    }
  }
}