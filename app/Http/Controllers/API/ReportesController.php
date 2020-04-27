<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportesController extends Controller
{
    public function getReporteCita(Request $request)
    {
        $citas = Cita::with(['paciente.discapacidad','paciente.etnia', 'consultorio.sede','servicio','paciente.identificacion', 'prestador.usuario.empresa.empresa.municipio', 'motivoc', 'paciente.contrato.contrato.administradora']);
        if($request->get('pres') != '')
            $citas->whereHas('prestador', function($q) use ($request) {
                $q->where('ID_USUARIO', $request->get('pres'));
            });
        if($request->get('admin') != '')
            $citas->whereHas('paciente.contrato.contrato', function($q) use ($request) {
                $q->where('ID_ADMINISTRADORA', $request->get('admin'));
            });
        if($request->get('motivo') != '')
            $citas->where(['ID_MOTIVO_CONSULTA' => $request->get('motivo')]);
        if($request->get('estado') != 0)
            $citas->where(['ID_ESTADO_CITA' => $request->get('estado')]);
        if($request->get('fecha') != '') {
            $fechas = explode(' a', $request->get('fecha'));
            $from = date('Y-m-d',strtotime(Carbon::createFromFormat('d/m/Y', $fechas[0])->subDay()));
            $fin = explode('a ', $request->get('fecha'));
            $to = date('Y-m-d',strtotime(Carbon::createFromFormat('d/m/Y', $fin[1])->addDay()));
            $citas->whereBetween('FEC_CITA', [$from, $to]);
        }
        $citas->whereHas('paciente', function($q) use ($request) {
            $q->where('ACTIVO', $request->get('paciente'));
            $q->orderby('PRIMER_NOMBRE', 'ASC');
        });

        $citas->whereHas('prestador.usuario.empresa', function($q) use ($request) {
            $q->where('ID_EMPRESA', $request->get('empresa'));
        });

        $resultado = $citas->get();
        
        return response()->json($resultado);
    }

    public function getReporteCitaT(Request $request)
    {
        $citas = Cita::with(['paciente.discapacidad','paciente.etnia', 'consultorio.sede','servicio','paciente.identificacion', 'prestador.usuario.empresa.empresa.municipio', 'motivoc', 'paciente.contrato.contrato.administradora']);
        if($request->get('pres') != '')
            $citas->whereHas('prestador', function($q) use ($request) {
                $q->where('ID_USUARIO', $request->get('pres'));
            });
        if($request->get('admin') != '')
            $citas->whereHas('paciente.contrato.contrato', function($q) use ($request) {
                $q->where('ID_ADMINISTRADORA', $request->get('admin'));
            });
        if($request->get('motivo') != '')
            $citas->where(['ID_MOTIVO_CONSULTA' => $request->get('motivo')]);
        if($request->get('estado') != 0)
            $citas->where(['ID_ESTADO_CITA' => $request->get('estado')]);
        if($request->get('fecha') != '') {
            $fechas = explode(' a', $request->get('fecha'));
            $from = date('Y-m-d',strtotime(Carbon::createFromFormat('d/m/Y', $fechas[0])->subDay()));
            $fin = explode('a ', $request->get('fecha'));
            $to = date('Y-m-d',strtotime(Carbon::createFromFormat('d/m/Y', $fin[1])->addDay()));
            $citas->whereBetween('FEC_CITA', [$from, $to]);
        }
        $citas->whereHas('paciente', function($q) use ($request) {
            $q->where('ACTIVO', $request->get('paciente'));
            $q->orderby('PRIMER_NOMBRE', 'ASC');
        });

        $citas->whereHas('prestador.usuario.empresa', function($q) use ($request) {
            $q->where('ID_EMPRESA', $request->get('empresa'));
        });

        $resultado = $citas->get();
        
        return response()->json(["draw"=> 1, "recordsTotal"=> count($resultado),"recordsFiltered"=> count($resultado),'data' => $resultado]);
    }
}
