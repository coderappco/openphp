<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Sede;
use App\Models\Consultorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SedeController extends Controller
{

    public function getSedes(Request $request){
        $datos = Sede::with(['municipio.dpto', 'empresa']);
        if($request->get('empresa') != 0)
            $datos->whereHas('empresa', function($q) use ($request) {
                $q->where('ID_EMPRESA', $request->get('empresa'));
            });
        $sedes = $datos->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($sedes),"recordsFiltered"=> count($sedes),'data' => $sedes]);
    }

    public function ListSedes(Request $request) {
        if($request->get('empresa') != 'null')
            $sedes = Sede::where(['ID_EMPRESA' => $request->get('empresa')])->get();
        else
            $sedes = Sede::all()->toArray();
        return response()->json($sedes);
    }

    public function getSede($id)
    {
        $sede = Sede::with(['municipio.dpto', 'empresa'])->where(['ID_SEDE' => $id])->first();
        return response()->json($sede);
    }

    public function createSede(Request $request)
    {
        $sede = new Sede(); 

        $sede->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $sede->NOM_SEDE = $request->get('NOM_SEDE');
        $sede->COD_SEDE = $request->get('COD_SEDE');
        $sede->DIREC_SEDE = $request->get('DIREC_SEDE');
        $sede->TELEF = $request->get('TELEF');
        $sede->ID_EMPRESA = $request->get('ID_EMPRESA');

        $sede->save();

        $consultorio = new Consultorio(); 

        $consultorio->NOM_CONSULTORIO = 'CONSULTORIO PRINCIPAL';
        $consultorio->COD_CONSULTORIO = $request->get('COD_SEDE');
        $consultorio->ID_ESPECIALIDAD = 112;
        $consultorio->ID_SEDE = $sede->ID_SEDE;
        $consultorio->PISO_CONSUL = 1;

        $consultorio->save();
        
        return response()->json('Sede creada', 200 );
    }

    public function updateSede(Request $request, $id)
    {
        $sede = Sede::find($id);

        $sede->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $sede->NOM_SEDE = $request->get('NOM_SEDE');
        $sede->COD_SEDE = $request->get('COD_SEDE');
        $sede->DIREC_SEDE = $request->get('DIREC_SEDE');
        $sede->TELEF = $request->get('TELEF');
        $sede->ID_EMPRESA = $request->get('ID_EMPRESA');

        $sede->save();

        return response()->json('Sede Actualizada', 200 );
    }

    public function deleteSede($id)
    {
        $sede = Sede::find($id);
        $sede->delete();
        return response()->json('Sede Eliminada', 200 );
    }
}
