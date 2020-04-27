<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Consultorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ConsultController extends Controller
{

    public function getConsultorios(Request $request){
        $datos = Consultorio::with(['sede.empresa', 'especialidad']);
        if($request->get('empresa') != 0)
            $datos->whereHas('sede', function($q) use ($request) {
                $q->where('ID_EMPRESA', $request->get('empresa'));
            });
        $consultorios = $datos->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($consultorios),"recordsFiltered"=> count($consultorios),'data' => $consultorios]);
    }

    public function getConsultorio($id)
    {
        $consultorio = Consultorio::with(['sede', 'especialidad'])->where(['ID_CONSULTORIO' => $id])->first();
        return response()->json($consultorio);
    }

    public function ListConsultorios(Request $request) {
        if($request->get('sede') != null)
            $consult = Consultorio::with(['sede', 'especialidad'])->where(['ID_SEDE' => $request->get('sede')])->get();
        else
            $consult = Consultorio::with(['sede', 'especialidad'])->get();
        return response()->json($consult);
    }

    public function createConsultorio(Request $request)
    {
        $consultorio = new Consultorio(); 

        $consultorio->NOM_CONSULTORIO = $request->get('NOM_CONSULTORIO');
        $consultorio->COD_CONSULTORIO = $request->get('COD_CONSULTORIO');
        $consultorio->ID_ESPECIALIDAD = $request->get('ID_ESPECIALIDAD');
        $consultorio->ID_SEDE = $request->get('ID_SEDE');
        $consultorio->PISO_CONSUL = $request->get('PISO_CONSUL') != null ? $request->get('PISO_CONSUL') : 1;

        $consultorio->save();
        
        return response()->json('Consultorio creado', 200 );
    }

    public function updateConsultorio(Request $request, $id)
    {
        $consultorio = Consultorio::find($id);

        $consultorio->NOM_CONSULTORIO = $request->get('NOM_CONSULTORIO');
        $consultorio->COD_CONSULTORIO = $request->get('COD_CONSULTORIO');
        $consultorio->ID_ESPECIALIDAD = $request->get('ID_ESPECIALIDAD');
        $consultorio->ID_SEDE = $request->get('ID_SEDE');
        $consultorio->PISO_CONSUL = $request->get('PISO_CONSUL') != null ? $request->get('PISO_CONSUL') : 1;

        $consultorio->save();

        return response()->json('Consultorio Actualizado', 200 );
    }

    public function deleteConsultorio($id)
    {
        $consultorio = Consultorio::find($id);
        $consultorio->delete();
        return response()->json('Consultorio Eliminado', 200 );
    }
}
