<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 02/05/2020
 */
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FACITEM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ServiciosPrevencionController extends Controller{
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
   * getAllServices
   */
  public function getAllServices(Request $request){
    $services = new FACITEM();
    $module   = "";
    $params = (object)$module;
    $params->module = "SERVICIOS";
    $getRecords = $services->getAllListRecords($params);

    if(count($getRecords) > 0){
      return response()->json(array("success" => true, "data" => $getRecords), 200);
    } else {
      return response()->json(array("success" => false, "data" => []), 200);
    }
  }
  
  /**
   * createNewServices
   */
  public function createNewServices(Request $request){
    $services = new FACITEM();

    $form_data = [
      'COD_SERVICIO' => $request->get('COD_SERVICIO'),
      'NOM_SERVICIO' => $request->get('NOM_SERVICIO')
    ];

    $data  = (object)$form_data;
    /* save new record */
    $store = $services->saveNewRecord("SERVICIOS", $data);
    
    if($store){
      return response()->json(array("success" => true, "msg" => $this->create_message), 201);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * getSingleServices
   */
  public function getSingleServices($id){
    $services  = new FACITEM();
    $getRecord = $services->getSingleRecord("SERVICIOS", $id);
    
    if($getRecord){
      return response()->json(array("success" => true, "item" => $getRecord), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * updateServices
   */
  public function updateServices(Request $request, $id){
    $services = new FACITEM();

    $form_data = [
      'ID_SERVICIO'  => $id,
      'COD_SERVICIO' => $request->get('COD_SERVICIO'),
      'NOM_SERVICIO' => $request->get('NOM_SERVICIO')
    ];

    $data  = (object)$form_data;
    /* update record */
    $update = $services->updateRecord("SERVICIOS", $data);

    if($update){
      return response()->json(array("success" => true, "msg" => $this->update_message), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * deleteServices
   */
  public function deleteServices($id){
    $services_id = $id;
    $services    = new FACITEM();

    try {
      if($services_id != ""){
        $data = [
          'id' => $services_id
        ];

        $data   = (object)$data;
        $delete = $services->deleteRecord("SERVICIOS", $data);

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