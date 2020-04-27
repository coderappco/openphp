<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Nolaborales;
use App\Models\Sede;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class NoLaboralesController extends Controller
{

    public function getNolaborales(Request $request){
        $datos = Nolaborales::with('sede.empresa');
        if($request->get('empresa') != 0)
            $datos->whereHas('sede', function($q) use ($request) {
                $q->where('ID_EMPRESA', $request->get('empresa'));
            });
        $nolaborales = $datos->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($nolaborales),"recordsFiltered"=> count($nolaborales),'data' => $nolaborales]);
    }

    public function getNolaboral($id)
    {
        $nolaboral = Nolaborales::with('sede')->where(['ID_DIA_NO_LABORAL' => $id])->first();
        return response()->json($nolaboral);
    }

    public function createNolaboral(Request $request)
    {
        $day = Carbon::createFromFormat('d/m/Y', $request->get('FEC_NO_LABORAL'));
        if($request->get('ID_SEDE') == 'todas') {
            if($request->get('ID_EMPRESA') != '')
                $sedes = Sede::where(['ID_EMPRESA' => $request->get('ID_EMPRESA')])->get();
            else
                $sedes = Sede::all();
            for($i = 0; $i < count($sedes); $i++) {
                $nolaboral = new Nolaborales();
                $nolaboral->FEC_NO_LABORAL = date('Y-m-d',strtotime($day));
                $nolaboral->ID_SEDE = $sedes[$i]['ID_SEDE'];
                $nolaboral->save();
            }
        }
        else {
            $nolaboral = new Nolaborales();
            $nolaboral->FEC_NO_LABORAL = date('Y-m-d',strtotime($day));
            $nolaboral->ID_SEDE = $request->get('ID_SEDE');
            $nolaboral->save();
        }
        
        return response()->json('Día feriado creado', 200 );
    }

    public function updateNolaboral(Request $request, $id)
    {
        $day = Carbon::createFromFormat('d/m/Y', $request->get('FEC_NO_LABORAL'));
        if($request->get('ID_SEDE') == 'todas') {
            if($request->get('ID_EMPRESA') != '')
                $sedes = Sede::where(['ID_EMPRESA' => $request->get('ID_EMPRESA')])->get();
            else
                $sedes = Sede::all();
            for($i = 0; $i < count($sedes); $i++) {
                $nolaboral = new Nolaborales();
                $nolaboral->FEC_NO_LABORAL = date('Y-m-d',strtotime($day));
                $nolaboral->ID_SEDE = $sedes[$i]['ID_SEDE'];
                $nolaboral->save();
            }
        }
        else {
            $nolaboral = Nolaborales::find($id);
            $nolaboral->FEC_NO_LABORAL = date('Y-m-d',strtotime($day));
            $nolaboral->ID_SEDE = $request->get('ID_SEDE');
            $nolaboral->save();
        }

        return response()->json('Día feriado Actualizado', 200 );
    }

    public function deleteNolaboral($id)
    {
        $nolaboral = Nolaborales::find($id);
        $nolaboral->delete();
        return response()->json('Día feriado Eliminado', 200 );
    }
}
