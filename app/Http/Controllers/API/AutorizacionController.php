<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Autorizacion;
use App\Models\AutorizacionServicio;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AutorizacionController extends Controller
{

    public function getAutorizaciones(){
        $auto = Autorizacion::with(['paciente.identificacion', 'servicios.item'])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($auto),"recordsFiltered"=> count($auto),'data' => $auto]);
    }

    public function Search(Request $request)
    {
        $search = (null !== $request->get('q')) ? $request->get('q') : '';
        $pacientes = null;
        if($search != '')
            $pacientes = Paciente::where(
                function($q) use ($search) {
                    $q->orwhere('PRIMER_NOMBRE', 'like', "%$search%");
                    $q->orwhere('SEGUNDO_NOMBRE', 'like', "%$search%");
                    $q->orwhere('PRIMER_APELLIDO', 'like', "%$search%");
                    $q->orwhere('SEGUNDO_APELLIDO', 'like', "%$search%");
                    $q->orwhere('NUM_DOC', 'like', "%$search%");
                })->get();
        else
            $pacientes = Paciente::all();

        $resultado = [];
        foreach ($pacientes as $key => $value) {
            $nombre = $value['PRIMER_NOMBRE'] . ($value['SEGUNDO_NOMBRE'] != null ? " ".$value['SEGUNDO_NOMBRE'] : "");
            $apellidos = $value['PRIMER_APELLIDO'] . ($value['SEGUNDO_APELLIDO'] != null ? " ".$value['SEGUNDO_APELLIDO'] : "");
            $resultado[$key] = ['id' => $value['ID_PACIENTE'], 'text' => $nombre." ".$apellidos];
        }
        return response()->json(['results' => $resultado]);
    }

    public function getAutorizacion($id)
    {
        $auto = Autorizacion::with(['paciente', 'servicios.item'])->where(['ID_AUTORIZACION' => $id])->first();
        return response()->json($auto);
    }

    public function createAutorizacion(Request $request)
    {
        $auto = new Autorizacion(); 

        $FECHA = $request->get('FEC_AUTORIZACION') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FEC_AUTORIZACION')) : null;

        $auto->ID_PACIENTE = $request->get('ID_PACIENTE');
        $auto->NUM_AUTORIZACION = $request->get('NUM_AUTORIZACION');
        $auto->FEC_AUTORIZACION = $request->get('FEC_AUTORIZACION') != null ? date('Y-m-d',strtotime($FECHA)) : null;
        $auto->CERRADA = 0;
        $auto->ID_USUARIO_CREADOR = $request->get('ID_USUARIO_CREADOR');
        $auto->FEC_CREACION = Carbon::now()->toDateTimeString();
        $auto->FACTURADA = 0;

        $auto->save();
        $servicios = $request->get('SERVICIOS');
        for($i = 0; $i < count($servicios); $i++) {
            $serv = new AutorizacionServicio();
            $serv->NUM_SESION_AUT = $servicios[$i][1];
            $serv->NUM_SESIONES_PEND = $servicios[$i][1];
            $serv->NUM_SESIONES_REAL = 0;
            $serv->ID_ITEM = $servicios[$i][0];
            $serv->ID_AUTORIZACION = $auto->ID_AUTORIZACION;

            $serv->save();
        }
        
        return response()->json('Autorización registrada', 200 );
    }

    public function createAutorizacions(Request $request)
    {
        $auto = new Autorizacion(); 

        $FECHA = $request->get('FEC_AUTORIZACION') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FEC_AUTORIZACION')) : null;

        $auto->ID_PACIENTE = $request->get('ID_PACIENTES');
        $auto->NUM_AUTORIZACION = $request->get('NUM_AUTORIZACION');
        $auto->FEC_AUTORIZACION = $request->get('FEC_AUTORIZACION') != null ? date('Y-m-d',strtotime($FECHA)) : null;
        $auto->CERRADA = 0;
        $auto->ID_USUARIO_CREADOR = $request->get('ID_USUARIO_CREADOR');
        $auto->FEC_CREACION = Carbon::now()->toDateTimeString();
        $auto->FACTURADA = 0;

        $auto->save();

        $serv = new AutorizacionServicio();
        $serv->NUM_SESION_AUT = $request->get('NUM_SESION_AUT');
        $serv->NUM_SESIONES_PEND = $request->get('NUM_SESION_AUT');
        $serv->NUM_SESIONES_REAL = 0;
        $serv->ID_ITEM = $request->get('ID_ITEM');
        $serv->ID_AUTORIZACION = $auto->ID_AUTORIZACION;

        $serv->save();
        
        return response()->json('Autorización registrada', 200 );
    }

    public function updateAutorizacion(Request $request, $id)
    {
        $auto = Autorizacion::find($id);

        $FECHA = $request->get('FEC_AUTORIZACION') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FEC_AUTORIZACION')) : null;

        $auto->ID_PACIENTE = $request->get('ID_PACIENTE');
        $auto->NUM_AUTORIZACION = $request->get('NUM_AUTORIZACION');
        $auto->FEC_AUTORIZACION = $request->get('FEC_AUTORIZACION') != null ? date('Y-m-d',strtotime($FECHA)) : null;
        $auto->CERRADA = 0;
        $auto->ID_USUARIO_CREADOR = $request->get('ID_USUARIO_CREADOR');
        //$auto->FEC_CREACION = Carbon::now()->toDateTimeString();
        $auto->FACTURADA = 0;

        $auto->save();

        $auto->servicios()->delete();

        $servicios = $request->get('SERVICIOS');
        for($i = 0; $i < count($servicios); $i++) {
            $serv = new AutorizacionServicio();
            $serv->NUM_SESION_AUT = $servicios[$i][1];
            $serv->NUM_SESIONES_PEND = $servicios[$i][1];
            $serv->NUM_SESIONES_REAL = $servicios[$i][1];
            $serv->ID_ITEM = $servicios[$i][0];
            $serv->ID_AUTORIZACION = $auto->ID_AUTORIZACION;

            $serv->save();
        }

        return response()->json('Servicio Actualizado', 200 );
    }

    public function deleteAutorizacion($id)
    {
        $auto = Autorizacion::find($id);
        $auto->delete();
        return response()->json('Autorización Eliminada', 200 );
    }
}
