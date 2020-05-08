<?php
/**
 * Module: Promocion y Prevencion
 * Created at: 02/05/2020
 */
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PyPServicios;
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
    $services   = new PyPServicios();
    $getRecords = $services->getAllListRecords();

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
    $services = new PyPServicios();

    $form_data = [
      'COD_SERVICIO' => $request->get('COD_SERVICIO'),
      'NOM_SERVICIO' => $request->get('NOM_SERVICIO')
    ];

    $data  = (object)$form_data;
    /* save new record */
    $store = $services->saveNewRecord($data);
    
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
    $services  = new PyPServicios();
    $getRecord = $services->getSingleRecord($id);
    
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
    $services = new PyPServicios();

    $form_data = [
      'ID_SERVICIO'  => $id,
      'COD_SERVICIO' => $request->get('COD_SERVICIO'),
      'NOM_SERVICIO' => $request->get('NOM_SERVICIO')
    ];

    $data  = (object)$form_data;
    /* update record */
    $update = $services->updateRecord($data);

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
    $services    = new PyPServicios();

    try {
      if($services_id != ""){
        $data = [
          'id' => $services_id
        ];

        $data   = (object)$data;
        $delete = $services->deleteRecord($data);

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