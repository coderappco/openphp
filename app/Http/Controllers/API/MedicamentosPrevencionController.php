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

class MedicamentosPrevencionController extends Controller{
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
   * getAllMedicines
   */
  public function getAllMedicines(Request $request){
    $medicines  = new FACITEM();
    $module   = "";
    $params = (object)$module;
    $params->module = "MEDICAMENTOS";
    $getRecords = $medicines->getAllListRecords($params);

    if(count($getRecords) > 0){
      return response()->json(array("success" => true, "data" => $getRecords), 200);
    } else {
      return response()->json(array("success" => false, "data" => []), 200);
    }
  }
  
  /**
   * createNewMedicine
   */
  public function createNewMedicine(Request $request){
    $medicines = new FACITEM();

    $form_data = [
      'COD_MEDICAMENTO' => $request->get('COD_MEDICAMENTO'),
      'NOM_MEDICAMENTO' => $request->get('NOM_MEDICAMENTO')
    ];

    $data  = (object)$form_data;
    /* save new record */
    $store = $medicines->saveNewRecord("MEDICAMENTOS", $data);
    
    if($store){
      return response()->json(array("success" => true, "msg" => $this->create_message), 201);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * getSingleMedicine
   */
  public function getSingleMedicine($id){
    $medicines = new FACITEM();
    $getRecord = $medicines->getSingleRecord("MEDICAMENTOS", $id);
    
    if($getRecord){
      return response()->json(array("success" => true, "item" => $getRecord), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * updateMedicine
   */
  public function updateMedicine(Request $request, $id){
    $medicines = new FACITEM();

    $form_data = [
      'ID_MEDICAMENTO'  => $id,
      'COD_MEDICAMENTO' => $request->get('COD_MEDICAMENTO'),
      'NOM_MEDICAMENTO' => $request->get('NOM_MEDICAMENTO')
    ];

    $data  = (object)$form_data;
    /* update record */
    $update = $medicines->updateRecord("MEDICAMENTOS", $data);

    if($update){
      return response()->json(array("success" => true, "msg" => $this->update_message), 200);
    } else {
      return response()->json(array("success" => false, "msg" => $this->catch_message), 200);
    }
  }

  /**
   * deleteMedicine
   */
  public function deleteMedicine($id){
    $medicines_id = $id;
    $medicines    = new FACITEM();

    try {
      if($medicines_id != ""){
        $data = [
          'id' => $medicines_id
        ];

        $data   = (object)$data;
        $delete = $medicines->deleteRecord("MEDICAMENTOS", $data);

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