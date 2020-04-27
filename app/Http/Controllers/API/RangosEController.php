<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RangoEdades;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RangosEController extends Controller
{

    public function getRangosE(){
        $rangos = RangoEdades::all();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($rangos),"recordsFiltered"=> count($rangos),'data' => $rangos]);
    }

    public function getRangoE($id)
    {
        $rango = RangoEdades::find($id);
        return response()->json($rango);
    }

    public function ListRangosE() {
        $rangos = RangoEdades::all();
        return response()->json($rangos);
    }

    public function createRangoE(Request $request)
    {
        $rango = new RangoEdades();

        $rango->NOM_RANGO = $request->get('NOM_RANGO');
        $rango->EDAD_INICIAL = $request->get('EDAD_INICIAL');
        $rango->EDAD_FINAL = $request->get('EDAD_FINAL');
        $rango->EDAD_INICIAL_MESES = $request->get('EDAD_INICIAL_MESES');
        $rango->EDAD_FINAL_MESES = $request->get('EDAD_FINAL_MESES');
        $rango->save();

        return response()->json($rango);
    }

    public function updateRangoE(Request $request, $id)
    {
        $rango = RangoEdades::find($id);
        $rango->NOM_RANGO = $request->get('NOM_RANGO');
        $rango->EDAD_INICIAL = $request->get('EDAD_INICIAL');
        $rango->EDAD_FINAL = $request->get('EDAD_FINAL');
        $rango->EDAD_INICIAL_MESES = $request->get('EDAD_INICIAL_MESES');
        $rango->EDAD_FINAL_MESES = $request->get('EDAD_FINAL_MESES');
        $rango->save();

        return response()->json("Rango actualizado", 200);
    }

    public function deleteRangoE($id)
    {
        $rango = RangoEdades::find($id);
        $rango->delete();
        return response()->json('Rango de Edad Eliminado', 200 );
    }

}
