<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TipoCita;
use App\Models\TipoCitaHistoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TipoCitaController extends Controller
{

    public function getTiposCitas(){
        $tipo = TipoCita::with(['item', 'registros.historia'])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($tipo),"recordsFiltered"=> count($tipo),'data' => $tipo]);
    }

    public function getTipoCita($id)
    {
        $tipo = TipoCita::with(['item', 'registros.historia'])->where(['ID_TIPO_CITA' => $id])->first();
        return response()->json($tipo);
    }

    public function ListTipoCita() {
        $tipos = TipoCita::with(['item', 'registros.historia'])->get();
        return response()->json($tipos);
    }

    public function createTipoCita(Request $request)
    {
        $tipo = new TipoCita();
        $tipo->NOM_TIPO_CITA = $request->get('NOM_TIPO_CITA');
        $tipo->FEC_CREACION = Carbon::now()->toDateTimeString();
        $tipo->ACTIVO = $request->get('ACTIVO');
        $tipo->ID_ITEM = $request->get('ID_ITEM');
        $tipo->save();

        $historias = $request->get('ID_HISTORIA');
        for($i = 0; $i < count($historias); $i++){
            $h = explode(" ", $historias[$i]);
            $tipoh = new TipoCitaHistoria();
            $tipoh->ID_TIPO_CITA = $tipo->ID_TIPO_CITA;
            $tipoh->ID_HISTORIA = $h[1];
            $tipoh->save();
        }
        return response()->json("Tipo de cita creado", 200);
    }

    public function updateTipoCita(Request $request, $id)
    {
        $tipo = TipoCita::find($id);
        $tipo->NOM_TIPO_CITA = $request->get('NOM_TIPO_CITA');
        $tipo->ACTIVO = $request->get('ACTIVO');
        $tipo->ID_ITEM = $request->get('ID_ITEM');
        $tipo->save();

        $tipo->registros()->delete();

        $historias = $request->get('ID_HISTORIA');
        for($i = 0; $i < count($historias); $i++){
            $h = explode(" ", $historias[$i]);
            $tipoh = new TipoCitaHistoria();
            $tipoh->ID_TIPO_CITA = $tipo->ID_TIPO_CITA;
            $tipoh->ID_HISTORIA = $h[1];
            $tipoh->save();
        }

        return response()->json("Tipo de cita actualizada", 200);
    }

    public function deleteTipoCita($id)
    {
        $grupo = TipoCita::find($id);
        $grupo->delete();
        return response()->json('Tipo de cita Eliminada', 200 );
    }
}
