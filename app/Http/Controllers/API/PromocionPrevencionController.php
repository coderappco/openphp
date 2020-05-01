<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PyPPrograma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PromocionPrevencionController extends Controller{
  /**
   * @var
   * default messages
   */
  public $create_message = "Registro agregado correctamente";
  public $update_message = "Los datos han sido actualizado correctamente";
  public $delete_message = "Registro eliminado correctamente";
  public $catch_message  = "Ocurrio un problema al momento de procesar tu solicitud";
  public $param_required = "El Id es requerido";

  /**
   * getAllPromotions
   */
  public function getAllPromotions(Request $request){
    $promotion  = new PyPPrograma();
    $getRecords = $promotion->getAllListRecords();

    if(count($getRecords) > 0){
      return response()->json(array("success" => true, "data" => $getRecords), 200);
    } else {
      return response()->json(array("success" => false, "data" => []), 200);
    }
  }
  
  /**
   * createNewPromotion
   */
  public function createNewPromotion(Request $request){
    $promotion = new PyPPrograma();

    $form_data = [
      'COD_PROG_PYP'   => $request->get('COD_PROGRAMA'),
      'NOM_PROG_PYP'   => $request->get('NOMBRE_PROGRAMA'),
      'ACTIVO'         => $request->get('ACTIVO'),
      'EDAD_INICIAL'   => $request->get('EDAD_INICIAL'),
      'U_EDAD_INICIAL' => $request->get('UNIDAD_EDAD_INICIAL'),
      'EDAD_FINAL'     => $request->get('EDAD_FINAL'),
      'U_EDAD_FINAL'   => $request->get('UNIDAD_EDAD_FINAL'),
      'GENERO'         => $request->get('GENEROS'),
      'ZONA'           => $request->get('ZONA'),
      'GESTANTE'       => $request->get('GESTANTES')
    ];

    $data  = (object)$form_data;
    /* save new record */
    $store = $promotion->saveNewRecord($data);
    
    if($store){
      return response()->json(array("success" => true, "msg" => $this->create_message), 201);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * getSinglePromotion
   */
  public function getSinglePromotion($id){
    $promotion = new PyPPrograma();
    $getRecord = $promotion->getSingleRecord($id);
    
    if($getRecord){
      return response()->json(array("success" => true, "item" => $getRecord), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * updatePromotion
   */
  public function updatePromotion(Request $request, $id){
    $promotion = new PyPPrograma();

    $form_data = [
      'ID_PYP'         => $id,
      'COD_PROG_PYP'   => $request->get('COD_PROGRAMA'),
      'NOM_PROG_PYP'   => $request->get('NOMBRE_PROGRAMA'),
      'ACTIVO'         => $request->get('ACTIVO'),
      'EDAD_INICIAL'   => $request->get('EDAD_INICIAL'),
      'U_EDAD_INICIAL' => $request->get('UNIDAD_EDAD_INICIAL'),
      'EDAD_FINAL'     => $request->get('EDAD_FINAL'),
      'U_EDAD_FINAL'   => $request->get('UNIDAD_EDAD_FINAL'),
      'GENERO'         => $request->get('GENEROS'),
      'ZONA'           => $request->get('ZONA'),
      'GESTANTE'       => $request->get('GESTANTES')
    ];

    $data  = (object)$form_data;
    /* update record */
    $update = $promotion->updateRecord($data);

    if($update){
      return response()->json(array("success" => true, "msg" => $this->update_message), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * deletePromotion
   */
  public function deletePromotion($id){
    $promotion_id = $id;
    $promotion    = new PyPPrograma();

    try {
      if($promotion_id != ""){
        $data = [
          'id' => $promotion_id
        ];

        $data   = (object)$data;
        $delete = $promotion->deleteRecord($data);

        /* delete record */
        if($delete){
          return response()->json(array("success" => true, "msg" => $this->delete_message), 200);
        } else {
          return response()->json(array("success" => false, "msg" => $delete), 200);
        }
      } else {
        return response()->json(array("success" => false, "msg" => $this->param_required), 200);
      }
    } catch (\Throwable $th) {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }
}