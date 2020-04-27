<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Items;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ItemController extends Controller
{

    public function getItems(){
        $items = Items::all();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($items),"recordsFiltered"=> count($items),'data' => $items]);
    }

    public function ListItems() {
        $items = Items::where(['SERVICIO' => 1])->get()->toArray();
        return response()->json($items);
    }

    public function Search(Request $request)
    {
        $search = (null !== $request->get('q')) ? $request->get('q') : '';
        $items = null;
        if($search != '')
            $items = Items::where(
                function($q) use ($search) {
                    $q->orwhere('COD_ITEM', 'like', "%$search%");
                    $q->orwhere('NOM_ITEM', 'like', "%$search%");
                    $q->orwhere('NOM_GENERICO', 'like', "%$search%");
                    $q->orwhere('NOM_COMERCIAL', 'like', "%$search%");
                })->where(['POS' => 0])->get();
        else
            $items = Items::where(['POS' => 0])->get();

        $resultado = [];
        foreach ($items as $key => $value) {
            $resultado[$key] = ['id' => $value['ID_ITEM'], 'text' => $value['NOM_ITEM']];
        }
        return response()->json(['results' => $resultado]);
    }

    public function getItem($id)
    {
        $item = Items::where(['ID_ITEM' => $id])->first();
        return response()->json($item);
    }

    public function createItem(Request $request)
    {
        $item = new Items(); 

        $item->COD_ITEM = $request->get('COD_ITEM');
        $item->NOM_ITEM = $request->get('NOM_ITEM');
        $item->COT_NTFS = $request->get('COT_NTFS');
        $item->COD_CUP = $request->get('COD_CUP');
        $item->COD_ISS = $request->get('COD_ISS');
        $item->COD_CUM = $request->get('COD_CUM');
        $item->NOM_GENERICO = $request->get('NOM_GENERICO');
        $item->NOM_COMERCIAL = $request->get('NOM_COMERCIAL');
        $item->PRES_ITEM = $request->get('PRES_ITEM');
        $item->POS = $request->get('POS');
        $item->CONCENTRACION = $request->get('CONCENTRACION');
        $item->CONTROL_MED = $request->get('CONTROL_MED');
        $item->MOD_ADM = $request->get('MOD_ADM');
        $item->FAC_SOAT = $request->get('FAC_SOAT');
        $item->VALOR_SOAT = $request->get('VALOR_SOAT');
        $item->FAC_ISS = $request->get('FAC_ISS');
        $item->VALOR_ISS = $request->get('VALOR_ISS');
        $item->VALOR_PARTICULAR = $request->get('VALOR_PARTICULAR');
        $item->ANIO = $request->get('ANIO');
        $item->MEDICAMENTO = $request->get('MEDICAMENTO');
        $item->SERVICIO = $request->get('SERVICIO');
        $item->EXAM_LAB = $request->get('EXAM_LAB');
        $item->INSUMO = $request->get('INSUMO');
        $item->EDAD_INICIAL = $request->get('EDAD_INICIAL');
        $item->UNID_EDAD_INICIAL = $request->get('UNID_EDAD_INICIAL');
        $item->EDAD_FINAL = $request->get('EDAD_FINAL');
        $item->UNID_EDAD_FINAL = $request->get('UNID_EDAD_FINAL');
        $item->VALOR_IVA = $request->get('VALOR_IVA');
        $item->VALOR_CREE = $request->get('VALOR_CREE');
        $item->GENERO = $request->get('GENERO');

        $item->save();
        
        return response()->json('Servicio registrado', 200 );
    }

    public function updateItem(Request $request, $id)
    {
        $item = Items::find($id);

        $item->COD_ITEM = $request->get('COD_ITEM');
        $item->NOM_ITEM = $request->get('NOM_ITEM');
        $item->COT_NTFS = $request->get('COT_NTFS');
        $item->COD_CUP = $request->get('COD_CUP');
        $item->COD_ISS = $request->get('COD_ISS');
        $item->COD_CUM = $request->get('COD_CUM');
        $item->NOM_GENERICO = $request->get('NOM_GENERICO');
        $item->NOM_COMERCIAL = $request->get('NOM_COMERCIAL');
        $item->PRES_ITEM = $request->get('PRES_ITEM');
        $item->POS = $request->get('POS');
        $item->CONCENTRACION = $request->get('CONCENTRACION');
        $item->CONTROL_MED = $request->get('CONTROL_MED');
        $item->MOD_ADM = $request->get('MOD_ADM');
        $item->FAC_SOAT = $request->get('FAC_SOAT');
        $item->VALOR_SOAT = $request->get('VALOR_SOAT');
        $item->FAC_ISS = $request->get('FAC_ISS');
        $item->VALOR_ISS = $request->get('VALOR_ISS');
        $item->VALOR_PARTICULAR = $request->get('VALOR_PARTICULAR');
        $item->ANIO = $request->get('ANIO');
        $item->MEDICAMENTO = $request->get('MEDICAMENTO');
        $item->SERVICIO = $request->get('SERVICIO');
        $item->EXAM_LAB = $request->get('EXAM_LAB');
        $item->INSUMO = $request->get('INSUMO');
        $item->EDAD_INICIAL = $request->get('EDAD_INICIAL');
        $item->UNID_EDAD_INICIAL = $request->get('UNID_EDAD_INICIAL');
        $item->EDAD_FINAL = $request->get('EDAD_FINAL');
        $item->UNID_EDAD_FINAL = $request->get('UNID_EDAD_FINAL');
        $item->VALOR_IVA = $request->get('VALOR_IVA');
        $item->VALOR_CREE = $request->get('VALOR_CREE');
        $item->GENERO = $request->get('GENERO');

        $item->save();

        return response()->json('Servicio Actualizado', 200 );
    }

    public function deleteItem($id)
    {
        $item = Items::find($id);
        $item->delete();
        return response()->json('Servicio Eliminado', 200 );
    }

    public function getItemsLab(){
        $items = Items::where(['EXAM_LAB' => 1])->get();
        return response()->json($items);
    }

    public function getItemsMed(){
        $items = Items::where(['MEDICAMENTO' => 1])->get();
        return response()->json($items);
    }

    public function getItemsServ(){
        $items = Items::where(['SERVICIO' => 1])->get();
        return response()->json($items);
    }
}
