<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GrupoHorario;
use App\Models\GrupoHorarioDia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class GruposHController extends Controller
{

    public function getGruposH(){
        $grupos = GrupoHorario::with('dias')->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($grupos),"recordsFiltered"=> count($grupos),'data' => $grupos]);
    }

    public function getGrupoH($id)
    {
        $grupo = GrupoHorario::with('dias')->where(['ID_GRUPO' => $id])->first();
        return response()->json($grupo);
    }

    public function ListGruposH() {
        $grupos = GrupoHorario::with('dias')->get();
        return response()->json($grupos);
    }

    public function createGruposH(Request $request)
    {
        $grupo = new GrupoHorario();

        $grupo->NOM_GRUPO = $request->get('NOM_GRUPO');
        $grupo->save();

        $horarios = $request->get('GRUPO_HORARIO');
        for($i = 0; $i < count($horarios); $i++) {
            $dias = new GrupoHorarioDia();
            $dias->DIA = $horarios[$i]['dia'];
            $dias->HORA_INICIO = $horarios[$i]['horai'];
            $dias->HORA_FIN = $horarios[$i]['horaf'];
            $dias->ID_GRUPO = $grupo->ID_GRUPO;
            $dias->save();
        }
        return response()->json($grupo);
    }

    public function updateGruposH(Request $request, $id)
    {
        $grupo = GrupoHorario::find($id);
        $grupo->NOM_GRUPO = $request->get('NOM_GRUPO');
        $grupo->save();

        $horarios = $request->get('GRUPO_HORARIO');
        $grupo->dias()->delete();
        for($i = 0; $i < count($horarios); $i++) {
            $dias = new GrupoHorarioDia();
            $dias->DIA = $horarios[$i]['dia'];
            $dias->HORA_INICIO = $horarios[$i]['horai'];
            $dias->HORA_FIN = $horarios[$i]['horaf'];
            $dias->ID_GRUPO = $grupo->ID_GRUPO;
            $dias->save();
        }

        return response()->json($grupo->dias);
    }

    public function deleteGruposH($id)
    {
        $grupo = GrupoHorario::find($id);
        $grupo->delete();
        return response()->json('Grupo horario Eliminado', 200 );
    }
}
