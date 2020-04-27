<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TipoIdentificacion;
use App\Models\Departamentos;
use App\Models\Municipios;
use App\Models\Especialidad;
use App\Models\EstadoCivil;
use App\Models\GrupoSanguineo;
use App\Models\Escolaridad;
use App\Models\Etnia;
use App\Models\Ocupacion;
use App\Models\Discapacidad;
use App\Models\Religion;
use App\Models\Regimen;
use App\Models\TipoAfiliado;
use App\Models\MotivoConsulta;
use App\Models\OrdenImport;
use App\Models\Parentesco;
use App\Models\Diagnosticos;
use App\Models\DiagnosticoOdonP;
use App\Models\DiagnosticoOdonH;
use App\Models\TratamientosOdonP;
use App\Models\TratamientosOdonH;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CodifController extends Controller
{

    public function getIdent() {
        $ident = TipoIdentificacion::all()->toArray();
        return response()->json($ident);
    }

    public function getDiagodon() {
        $odonto = DiagnosticoOdonP::with(['hijos'])->get();
        return response()->json($odonto);
    }

    public function getTratodon() {
        $trat = TratamientosOdonP::with(['hijos'])->get();
        return response()->json($trat);
    }

    public function getDptos() {
        $dptos = Departamentos::all()->toArray();
        return response()->json($dptos);
    }

    public function getMunicipios(Request $request) {
        if($request->input('dpto') == "null")
            $municipios = Municipios::with('dpto')->get();
        else
            $municipios = Municipios::with('dpto')->where('ID_DPTO', '=', $request->input('dpto'))->get();
        return response()->json($municipios);
    }

    public function getEspecialidades() {
        $espe = Especialidad::all()->toArray();
        return response()->json($espe);
    }

    public function getEstadoCivil() {
        $estado = EstadoCivil::all()->toArray();
        return response()->json($estado);
    }

    public function getGrupoSanguineo() {
        $grupo = GrupoSanguineo::all()->toArray();
        return response()->json($grupo);
    }

    public function getEscolaridad() {
        $escolaridad = Escolaridad::all()->toArray();
        return response()->json($escolaridad);
    }

    public function getEtnia() {
        $etnia = Etnia::all()->toArray();
        return response()->json($etnia);
    }

    public function getOcupacion() {
        $ocupacion = Ocupacion::all()->toArray();
        return response()->json($ocupacion);
    }

    public function getDiscapacidad() {
        $discapacidad = Discapacidad::all()->toArray();
        return response()->json($discapacidad);
    }

    public function getReligion() {
        $religion = Religion::all()->toArray();
        return response()->json($religion);
    }

    public function getRegimen() {
        $regimen = Regimen::all()->toArray();
        return response()->json($regimen);
    }

    public function getAfiliado() {
        $afiliado = TipoAfiliado::all()->toArray();
        return response()->json($afiliado);
    }

    public function getMotivoC() {
        $motivo = MotivoConsulta::all()->toArray();
        return response()->json($motivo);
    }

    public function getOrdenI() {
        $orden = OrdenImport::orderby('POS', 'ASC')->get();
        $resultado = [];
        for($i = 0; $i < count($orden); $i++) {
            $resultado[$i] = ['ident' => $orden[$i]->IDENTIFICADOR, 'desc' => $orden[$i]->DESCRIPCION];
        }
        return response()->json($resultado);
    }

    public function getParentescos() {
        $parentesco = Parentesco::all()->toArray();
        return response()->json($parentesco);
    }

    public function getDiagnosticos(Request $request) {
        $search = (null !== $request->get('q')) ? $request->get('q') : '';
        $pacientes = null;
        if($search != '')
            $diagnosticos = Diagnosticos::where(
                function($q) use ($search) {
                    $q->orwhere('COD_DIAGNOSTICO', 'like', "%$search%");
                    $q->orwhere('NOM_DIAGNOSTICO', 'LIKE', "%$search%");
                })->get();
        else
            $diagnosticos = Diagnosticos::all();

        $resultado = [];
        foreach ($diagnosticos as $key => $value) {
            $resultado[$key] = ['id' => $value['ID_DIAGNOSTICO'], 'text' => $value['COD_DIAGNOSTICO']." ".$value['NOM_DIAGNOSTICO']];
        }
        return response()->json(['results' => $resultado]);
    }

    public function getDiagnostico(Request $request) {
        $diagnostico = Diagnosticos::where(['ID_DIAGNOSTICO' => $request->get('id')])->first();
        return response()->json($diagnostico);
    }

    public function getOdontDiag($id) {
        $diag = DiagnosticoOdonH::find($id);
        return response()->json($diag);
    }

    public function getTratDiag($id) {
        $trat = TratamientosOdonH::find($id);
        return response()->json($trat);
    }

    public function getOdontDiagId(Request $request) {
        $diag = DiagnosticoOdonH::find($id);
        return response()->json($diag);
    }

    public function getDiagTrat(Request $request) {
        $diag = DiagnosticoOdonH::find($request->get('diag'));
        $trat = TratamientosOdonH::find($request->get('trat'));
        $resultado['diag'] = $diag;
        $resultado['trat'] = $trat;
        return response()->json($resultado);
    }
}
