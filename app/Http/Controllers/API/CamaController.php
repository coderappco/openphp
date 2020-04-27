<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SedeCama;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CamaController extends Controller
{

    public function getCamas(Request $request){
        $datos = SedeCama::with(['sede.empresa']);
        if($request->get('empresa') != 0)
            $datos->whereHas('sede', function($q) use ($request) {
                $q->where('ID_EMPRESA', $request->get('empresa'));
            });
        $camas = $datos->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($camas),"recordsFiltered"=> count($camas),'data' => $camas]);
    }

    public function getCama($id)
    {
        $cama = SedeCama::with(['sede.empresa'])->where(['ID_SEDE_CAMA' => $id])->first();
        return response()->json($cama);
    }

    public function ListCamas(Request $request) {
        if($request->get('sede') != null)
            $cama = SedeCama::with(['sede.empresa'])->where(['ID_SEDE' => $request->get('sede')])->get();
        else
            $cama = SedeCama::with(['sede.empresa'])->get();
        return response()->json($cama);
    }

    public function createCama(Request $request)
    {
        $cama = new SedeCama(); 

        $cama->NUMERO = $request->get('NUMERO');
        $cama->PISO = $request->get('PISO');
        $cama->OBSERVACION = $request->get('OBSERVACION');
        $cama->URGENCIAS = $request->get('URGENCIAS');
        $cama->ID_SEDE = $request->get('ID_SEDE');

        $cama->save();
        
        return response()->json('Cama registrada', 200 );
    }

    public function updateCama(Request $request, $id)
    {
        $cama = SedeCama::find($id);

        $cama->NUMERO = $request->get('NUMERO');
        $cama->PISO = $request->get('PISO');
        $cama->OBSERVACION = $request->get('OBSERVACION');
        $cama->URGENCIAS = $request->get('URGENCIAS');
        $cama->ID_SEDE = $request->get('ID_SEDE');

        $cama->save();

        return response()->json('Cama Actualizada', 200 );
    }

    public function deleteCama($id)
    {
        $cama = SedeCama::find($id);
        $cama->delete();
        return response()->json('Cama Eliminada', 200 );
    }
}
