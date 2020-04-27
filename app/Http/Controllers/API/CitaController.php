<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Paciente;
use App\Models\UserPrestador;
use App\Models\CitaAuto;
use App\Models\AutorizacionServicio;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CitaController extends Controller
{

    public function getCitas(Request $request){
        $prestador = UserPrestador::with(['agenda.citas.consultorio', 'agenda.sede.laborales', 'agenda.grupo.dias', 'especialidad', 'usuario','citas.paciente.contrato.contrato.administradora', 'citas.prestador.usuario', 'citas.prestador.especialidad', 'citas.usuario', 'citas.servicio', 'citas.motivoc'])
                                ->where(['ID_USUARIO' => $request->get('prestador')])->first();
        $agenda = null;
        $agendas = null;
        $existe = false;
        $pos = 0;
        $cant = 0;
        if($prestador->agenda == null) {
            $agenda = new Agenda();
            $agenda->ID_GRUPO = 1;
            $agenda->ID_SEDE = $request->get('sede');
            $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
            $agenda->DURACION = $request->get('duracion');
            $agenda->ID_CONSULTORIO = 0;
            $agenda->save();
        }
        else {
            $agendas = $prestador->agenda;            
            for($a = 0; $a < count($agendas); $a++) {
                if($agendas[$a]->ID_SEDE == $request->get('sede')) {
                    $existe = true;
                    $pos = $a;
                }
            }            
            if($existe == false) {
                $agenda = new Agenda();
                $agenda->ID_GRUPO = 1;
                $agenda->ID_SEDE = $request->get('sede');
                $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
                $agenda->DURACION = $request->get('duracion');
                $agenda->ID_CONSULTORIO = 0;
                $agenda->save();
            }
        }
        $actual = $existe == false ? $agenda : $agendas[$pos];
        $especialidad = $prestador->especialidad->ESPECIALIDAD;
        $nomp = $prestador->usuario->NOMBRES;
        $apellp = $prestador->usuario->APELLIDOS;
        $citas = $actual->citas;
        $resultado = [];
        $dias = [];
        $horarios = [];
        $duracion = $request->get('duracion');
        if($existe == true) {
            $actual->DURACION = $duracion;
            $actual->save();
        }
        for($i = 0; $i < count($citas); $i++) {
            if($citas[$i]->ID_ESTADO_CITA != 5) {
                $nombre = $citas[$i]->paciente->PRIMER_NOMBRE . ($citas[$i]->paciente->SEGUNDO_NOMBRE != null ? " ".$citas[$i]->paciente->SEGUNDO_NOMBRE : "");
                $apellido = $citas[$i]->paciente->PRIMER_APELLIDO . ($citas[$i]->paciente->SEGUNDO_APELLIDO != null ? " ".$citas[$i]->paciente->SEGUNDO_APELLIDO : "");
                $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citas[$i]->FEC_CITA)),date('i',strtotime($citas[$i]->FEC_CITA))+$duracion,0,date('m',strtotime($citas[$i]->FEC_CITA)),date('d',strtotime($citas[$i]->FEC_CITA)),date('Y',strtotime($citas[$i]->FEC_CITA))));
                $administradora = $citas[$i]->paciente->contrato != null ? $citas[$i]->paciente->contrato->contrato->administradora->NOM_ADMINISTRADORA : "Particular";
                $resultado[$cant] = [
                    'ids' => $citas[$i]->ID_CITA,
                    'title' => "Identidad: ".$citas[$i]->paciente->NUM_DOC." - Nombre: ".$nombre." ".$apellido." - Servicio: ".$citas[$i]->servicio->NOM_ITEM." - Motivo: ".$citas[$i]->motivoc->NOM_MOTIVO_CONSULTA." - Consultorio: " . $citas[$i]->consultorio->NOM_CONSULTORIO . " - Administradora: " . $administradora . " - Prestador: " . $nomp." ".$apellp,
                    'start' => $citas[$i]->FEC_CITA,
                    'end' => $end,
                    'allDay' => false,
                    'className' => ($citas[$i]->ID_ESTADO_CITA == 1 ? 'bg-teal' : ($citas[$i]->ID_ESTADO_CITA == 2 ? 'bg-light-blue' : ($citas[$i]->ID_ESTADO_CITA == 3 ? 'bg-amber' : 'bg-red'))),
                    'consultorio' => $citas[$i]->ID_CONSULTORIO
                ];
                $cant++;
            }
        }
        $nolaborales = $actual->sede->laborales;
        for($i = 0; $i < count($nolaborales); $i++) {
            $dias[$i] = $nolaborales[$i]->FEC_NO_LABORAL;
            $resultado[count($resultado)] = [
                'start' => $nolaborales[$i]->FEC_NO_LABORAL.' 00:00:00',
                'end' => $nolaborales[$i]->FEC_NO_LABORAL.' 24:00:00',
                'overlap' => false,
                'rendering' => 'background',
                'color' => '#c0c0c0',
                'disabled' => true,
            ];
        }
        $horarios = $actual->grupo->dias;
        return response()->json(['horarios' => $horarios,'dias' => $dias,'resultado' => $resultado, 'especialidad' => $especialidad, 
                                'prestador' => $nomp." ".$apellp, 'id' => $prestador->ID_USER_PRESTADOR, 'grupo' => $actual->grupo->ID_GRUPO,
                                'agenda' => $actual->ID_AGENDA, 'duracion' => $duracion, 'concurrencia' => $prestador->CONCURRENCIA, 'consult' => $actual->ID_CONSULTORIO]);
    }

    public function getCitasStatus(Request $request){
        $prestador = UserPrestador::with(['agenda.citas.consultorio', 'agenda.sede.laborales', 'agenda.grupo.dias', 'especialidad', 'usuario','citas.paciente.contrato.contrato.administradora', 'citas.prestador.usuario', 'citas.prestador.especialidad', 'citas.usuario', 'citas.servicio', 'citas.motivoc'])
                                ->where(['ID_USUARIO' => $request->get('prestador')])->first();
        $agenda = null;
        $agendas = null;
        $existe = false;
        $pos = 0;
        $cant = 0;
        if($prestador->agenda == null) {
            $agenda = new Agenda();
            $agenda->ID_GRUPO = 1;
            $agenda->ID_SEDE = $request->get('sede');
            $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
            $agenda->DURACION = $request->get('duracion');
            $agenda->ID_CONSULTORIO = 0;
            $agenda->save();
        }
        else {
            $agendas = $prestador->agenda;            
            for($a = 0; $a < count($agendas); $a++) {
                if($agendas[$a]->ID_SEDE == $request->get('sede')) {
                    $existe = true;
                    $pos = $a;
                }
            }            
            if($existe == false) {
                $agenda = new Agenda();
                $agenda->ID_GRUPO = 1;
                $agenda->ID_SEDE = $request->get('sede');
                $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
                $agenda->DURACION = $request->get('duracion');
                $agenda->ID_CONSULTORIO = 0;
                $agenda->save();
            }
        }
        $actual = $existe == false ? $agenda : $agendas[$pos];
        $especialidad = $prestador->especialidad->ESPECIALIDAD;
        $nomp = $prestador->usuario->NOMBRES;
        $apellp = $prestador->usuario->APELLIDOS;
        $citas = $actual->citas;
        $resultado = [];
        $dias = [];
        $horarios = [];
        $duracion = $request->get('duracion');
        if($existe == true) {
            $actual->DURACION = $duracion;
            $actual->save();
        }
        for($i = 0; $i < count($citas); $i++) {
            if($citas[$i]->ID_ESTADO_CITA == $request->get('status')) {
                $nombre = $citas[$i]->paciente->PRIMER_NOMBRE . ($citas[$i]->paciente->SEGUNDO_NOMBRE != null ? " ".$citas[$i]->paciente->SEGUNDO_NOMBRE : "");
                $apellido = $citas[$i]->paciente->PRIMER_APELLIDO . ($citas[$i]->paciente->SEGUNDO_APELLIDO != null ? " ".$citas[$i]->paciente->SEGUNDO_APELLIDO : "");
                $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citas[$i]->FEC_CITA)),date('i',strtotime($citas[$i]->FEC_CITA))+$duracion,0,date('m',strtotime($citas[$i]->FEC_CITA)),date('d',strtotime($citas[$i]->FEC_CITA)),date('Y',strtotime($citas[$i]->FEC_CITA))));
                $administradora = $citas[$i]->paciente->contrato != null ? $citas[$i]->paciente->contrato->contrato->administradora->NOM_ADMINISTRADORA : "Particular";
                $resultado[$cant] = [
                    'ids' => $citas[$i]->ID_CITA,
                    'title' => "Identidad: ".$citas[$i]->paciente->NUM_DOC." - Nombre: ".$nombre." ".$apellido." - Servicio: ".$citas[$i]->servicio->NOM_ITEM." - Motivo: ".$citas[$i]->motivoc->NOM_MOTIVO_CONSULTA." - Consultorio: " . $citas[$i]->consultorio->NOM_CONSULTORIO . " - Administradora: " . $administradora . " - Prestador: " . $nomp." ".$apellp,
                    'start' => $citas[$i]->FEC_CITA,
                    'end' => $end,
                    'allDay' => false,
                    'className' => ($citas[$i]->ID_ESTADO_CITA == 1 ? 'bg-teal' : ($citas[$i]->ID_ESTADO_CITA == 2 ? 'bg-light-blue' : ($citas[$i]->ID_ESTADO_CITA == 3 ? 'bg-amber' : 'bg-red'))),
                    'consultorio' => $citas[$i]->ID_CONSULTORIO
                ];
                $cant++;
            }
        }
        $nolaborales = $actual->sede->laborales;
        for($i = 0; $i < count($nolaborales); $i++) {
            $dias[$i] = $nolaborales[$i]->FEC_NO_LABORAL;
            $resultado[count($resultado)] = [
                'start' => $nolaborales[$i]->FEC_NO_LABORAL.' 00:00:00',
                'end' => $nolaborales[$i]->FEC_NO_LABORAL.' 24:00:00',
                'overlap' => false,
                'rendering' => 'background',
                'color' => '#c0c0c0',
                'disabled' => true,
            ];
        }
        $horarios = $actual->grupo->dias;
        return response()->json(['horarios' => $horarios,'dias' => $dias,'resultado' => $resultado, 'especialidad' => $especialidad, 
                                'prestador' => $nomp." ".$apellp, 'id' => $prestador->ID_USER_PRESTADOR, 'grupo' => $actual->grupo->ID_GRUPO,
                                'agenda' => $actual->ID_AGENDA, 'duracion' => $duracion, 'concurrencia' => $prestador->CONCURRENCIA, 'consult' => $actual->ID_CONSULTORIO]);
    }

    public function getCitasPrestador(Request $request){
        $prestador = UserPrestador::with(['agenda.citas.consultorio', 'agenda.sede.laborales', 'agenda.grupo.dias', 'especialidad', 'usuario','citas.paciente', 'citas.prestador.usuario', 'citas.prestador.especialidad', 'citas.usuario', 'citas.servicio', 'citas.motivoc'])
                                ->where(['ID_USUARIO' => $request->get('prestador')])->first();
        $agenda = null;
        $agendas = null;
        $existe = false;
        $pos = 0;
        $cant = 0;
        if($prestador->agenda == null) {
            return response()->json(['presta' => $prestador]);
        }
        $agendas = $prestador->agenda;  
        $citas = null;
        $resultado = [];        
        for($a = 0; $a < count($agendas); $a++) {
            $citas = $agendas[$a]->citas;
            for($i = 0; $i < count($citas); $i++) {
                if($citas[$i]->ID_ESTADO_CITA != 5) {
                    $nombre = $citas[$i]->paciente->PRIMER_NOMBRE . ($citas[$i]->paciente->SEGUNDO_NOMBRE != null ? " ".$citas[$i]->paciente->SEGUNDO_NOMBRE : "");
                    $apellido = $citas[$i]->paciente->PRIMER_APELLIDO . ($citas[$i]->paciente->SEGUNDO_APELLIDO != null ? " ".$citas[$i]->paciente->SEGUNDO_APELLIDO : "");
                    $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citas[$i]->FEC_CITA)),date('i',strtotime($citas[$i]->FEC_CITA))+$agendas[$a]->DURACION,0,date('m',strtotime($citas[$i]->FEC_CITA)),date('d',strtotime($citas[$i]->FEC_CITA)),date('Y',strtotime($citas[$i]->FEC_CITA))));
                    $administradora = $citas[$i]->paciente->contrato != null ? $citas[$i]->paciente->contrato->contrato->administradora->NOM_ADMINISTRADORA : "Particular";
                    $resultado[$cant] = [
                        'ids' => $citas[$i]->ID_CITA,
                        'title' => "Identidad: ".$citas[$i]->paciente->NUM_DOC." - Nombre: ".$nombre." ".$apellido." - Servicio: ".$citas[$i]->servicio->NOM_ITEM." - Motivo: ".$citas[$i]->motivoc->NOM_MOTIVO_CONSULTA." - Consultorio: " . $citas[$i]->consultorio->NOM_CONSULTORIO . " - Administradora: " . $administradora . " - Prestador: " . $prestador->usuario->NOMBRES." ".$prestador->usuario->APELLIDOS,
                        'start' => $citas[$i]->FEC_CITA,
                        'end' => $end,
                        'allDay' => false,
                        'className' => ($citas[$i]->ID_ESTADO_CITA == 1 ? 'bg-teal' : ($citas[$i]->ID_ESTADO_CITA == 2 ? 'bg-light-blue' : ($citas[$i]->ID_ESTADO_CITA == 3 ? 'bg-amber' : 'bg-red'))),
                        'consultorio' => $citas[$i]->ID_CONSULTORIO
                    ];
                    $cant++;
                }
            }
        }
        $especialidad = $prestador->especialidad->ESPECIALIDAD;
        $nomp = $prestador->usuario->NOMBRES;
        $apellp = $prestador->usuario->APELLIDOS;
        return response()->json(['presta' => $prestador, 'resultado' => $resultado, 'especialidad' => $especialidad, 
                                'prestador' => $nomp." ".$apellp, 'id' => $prestador->ID_USER_PRESTADOR, 'concurrencia' => $prestador->CONCURRENCIA]);
    }

    public function getCitasPrestadorFecha(Request $request){
        $fecha = Carbon::createFromFormat('d/m/Y', $request->get('fecha'));
        $citas = Cita::with(['paciente', 'prestador'])->where(['ID_ESTADO_CITA' => 1])->whereDate('FEC_CITA', '=', date('Y-m-d',strtotime($fecha)));
        $citas->whereHas('prestador', function($q) use ($request) {
            $q->where(['ID_USUARIO' => $request->get('prestador')]);
        });

        $citas = $citas->orderby('FEC_CITA', 'ASC')->get();
        return response()->json($citas);
    }

    public function getCita($id)
    {
        $cita = Cita::with(['paciente.identificacion','consultorio.sede','autorizacion.autorizacion', 'paciente.estadocivil', 'prestador.usuario', 'prestador.especialidad', 'servicio', 'motivoc'])->where(['ID_CITA' => $id])->first();
        return response()->json($cita);
    }

    public function createCita(Request $request)
    {
        if(!is_array($request->get('ID_PACIENTE'))) {
            $cita = new Cita(); 

            $cita->ID_PACIENTE = $request->get('ID_PACIENTE');
            $cita->ID_PRESTADOR = $request->get('ID_PRESTADOR');
            $cita->ID_USUARIO = $request->get('ID_USUARIO');
            $cita->ID_ITEM = $request->get('SERVICIO');
            $cita->ID_MOTIVO_CONSULTA = $request->get('ID_MOTIVO_CONSULTA');
            $cita->FEC_CITA = $request->get('FEC_CITA');
            $cita->FEC_ESTADO = Carbon::now()->toDateTimeString();
            $cita->FEC_SOLICITUD = Carbon::now()->toDateTimeString();
            $cita->FEC_ASIGNACION_CITA = Carbon::now()->toDateTimeString();
            $cita->ID_ESTADO_CITA = 1;
            $cita->ID_MEDIO_SOLICITUD = 1;
            $cita->OBS_CITA = $request->get('OBS_CITA');
            $cita->ID_AGENDA = $request->get('ID_AGENDA');
            $cita->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
            $cita->TIPO_CITA = $request->get('TIPO_CITA');

            $cita->save();

            if($request->get('ID_AUTORIZACION') != null) {
                $auto = new CitaAuto();
                $auto->ID_AUTORIZACION = $request->get('ID_AUTORIZACION');
                $auto->ID_CITA = $cita->ID_CITA;
                $auto->save();

                $auto = AutorizacionServicio::where(['ID_AUTORIZACION' => $request->get('ID_AUTORIZACION'),
                                                    'ID_ITEM' => $request->get('SERVICIO')])->first();
                $auto->NUM_SESIONES_PEND = $auto->NUM_SESIONES_PEND - 1;
                $auto->NUM_SESIONES_REAL = $auto->NUM_SESIONES_REAL + 1;
                $auto->save();
            }

            $agenda = Agenda::find($request->get('ID_AGENDA'));
            $agenda->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
            $agenda->save();

            $paciente = Paciente::with(['autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora'])->where(['ID_PACIENTE' => $request->get('ID_PACIENTE')])->first();
            $paciente->id_cita = $cita->ID_CITA;
            $paciente->prestador = $cita->prestador->usuario->NOMBRES . " " . $cita->prestador->usuario->APELLIDOS;
            
            return response()->json($paciente, 200 );
        }
        else {
            $autorizacion = [];
            $pac = [];
            if($request->get('ID_AUTORIZACION') != null)
                $autorizacion = explode(',', $request->get('ID_AUTORIZACION'));
            for($i = 0; $i < count($request->get('ID_PACIENTE')); $i++) {
                $cita = new Cita(); 

                $cita->ID_PACIENTE = $request->get('ID_PACIENTE')[$i];
                $cita->ID_PRESTADOR = $request->get('ID_PRESTADOR');
                $cita->ID_USUARIO = $request->get('ID_USUARIO');
                $cita->ID_ITEM = $request->get('SERVICIO');
                $cita->ID_MOTIVO_CONSULTA = $request->get('ID_MOTIVO_CONSULTA');
                $cita->FEC_CITA = $request->get('FEC_CITA');
                $cita->FEC_ESTADO = Carbon::now()->toDateTimeString();
                $cita->FEC_SOLICITUD = Carbon::now()->toDateTimeString();
                $cita->FEC_ASIGNACION_CITA = Carbon::now()->toDateTimeString();
                $cita->ID_ESTADO_CITA = 1;
                $cita->ID_MEDIO_SOLICITUD = 1;
                $cita->OBS_CITA = $request->get('OBS_CITA');
                $cita->ID_AGENDA = $request->get('ID_AGENDA');
                $cita->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
                $cita->TIPO_CITA = $request->get('TIPO_CITA');

                $cita->save();

                if($request->get('ID_AUTORIZACION') != null) {
                    $auto = new CitaAuto();
                    $auto->ID_AUTORIZACION = $autorizacion[$i];
                    $auto->ID_CITA = $cita->ID_CITA;
                    $auto->save();

                    $auto = AutorizacionServicio::where(['ID_AUTORIZACION' => $autorizacion[$i],
                                                        'ID_ITEM' => $request->get('SERVICIO')])->first();
                    $auto->NUM_SESIONES_PEND = $auto->NUM_SESIONES_PEND - 1;
                    $auto->NUM_SESIONES_REAL = $auto->NUM_SESIONES_REAL + 1;
                    $auto->save();
                }

                $paciente = Paciente::with(['autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora'])->where(['ID_PACIENTE' => $request->get('ID_PACIENTE')[$i]])->first();
                $paciente->id_cita = $cita->ID_CITA;
                $paciente->prestador = $cita->prestador->usuario->NOMBRES . " " . $cita->prestador->usuario->APELLIDOS;
                $pac[$i] = $paciente;
            }
            $agenda = Agenda::find($request->get('ID_AGENDA'));
            $agenda->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
            $agenda->save();
            return response()->json($pac, 200 );
        }
    }

    public function updateCitat(Request $request, $id)
    {
        $cita = Cita::find($id); 

        $cita->ID_MOTIVO_CONSULTA = $request->get('ID_MOTIVO_CONSULTA');
        $cita->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
        $cita->TIPO_CITA = $request->get('TIPO_CITA');
        $cita->ID_ESTADO_CITA = $request->get('ID_ESTADO_CITA');

        $cita->save();

        $agenda = Agenda::find($cita->ID_AGENDA);
        $agenda->ID_CONSULTORIO = $request->get('ID_CONSULTORIO');
        $agenda->save();

        $paciente = Paciente::with(['autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora'])->where(['ID_PACIENTE' => $request->get('ID_PACIENTE')])->first();
        $paciente->id_cita = $cita->ID_CITA;
        $paciente->prestador = $cita->prestador->usuario->NOMBRES . " " . $cita->prestador->usuario->APELLIDOS;
        
        return response()->json($paciente);
    }

    public function updateCitaEstado(Request $request, $id)
    {
        $cita = Cita::find($id); 

        $cita->ID_ESTADO_CITA = $request->get('ID_ESTADO_CITA');

        $cita->save();

        $paciente = Paciente::with(['autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora'])->where(['ID_PACIENTE' => $request->get('ID_PACIENTE')])->first();
        $paciente->id_cita = $cita->ID_CITA;
        $paciente->servicio = $cita->servicio->NOM_ITEM;
        $paciente->motivo = $cita->motivoc->NOM_MOTIVO_CONSULTA;
        $paciente->consultorio = $cita->consultorio->NOM_CONSULTORIO;
        $paciente->prestador = $cita->prestador->usuario->NOMBRES . " " . $cita->prestador->usuario->APELLIDOS;
        
        return response()->json($paciente);
    }

    public function updateCita(Request $request, $id)
    {
        $cita = Cita::find($id);
        $cita->FEC_CITA = $request->get('start');
        $cita->save();

        return response()->json('Cita Actualizada', 200 );
    }

    public function deleteCita($id, Request $request)
    {
        $cita = Cita::with(['autorizacion.autorizacion.servicios.item'])->where(['ID_CITA' => $id])->first();
        if($cita->autorizacion != null) {
            $item = $cita->ID_ITEM;
            $servicios = $cita->autorizacion->autorizacion->servicios;
            for($i = 0; $i < count($servicios); $i++) {
                if($servicios[$i]->ID_ITEM == $item) {
                    $servicios[$i]->NUM_SESIONES_PEND = $servicios[$i]->NUM_SESIONES_PEND + 1;
                    $servicios[$i]->NUM_SESIONES_REAL = $servicios[$i]->NUM_SESIONES_REAL - 1;
                    $servicios[$i]->save();
                }
            }
        }
        $cita->ID_ESTADO_CITA = 5;
        $cita->OBS_CITA = $request->get('observ');
        $cita->save();
        //$cita->delete();
        return response()->json('Cita cancelada', 200 );
    }

    public function updateAgenda(Request $request, $id)
    {
        $agenda = Agenda::find($id);
        $agenda->DURACION = $request->get('dur');
        $agenda->save();

        $especialidad = $agenda->prestador->especialidad->ESPECIALIDAD;
        $nomp = $agenda->prestador->usuario->NOMBRES;
        $apellp = $agenda->prestador->usuario->APELLIDOS;
        $resultado = [];
        $dias = [];
        $horarios = [];
        $nolaborales = $agenda->sede->laborales;
        $duracion = $request->get('dur');
        $citas = $agenda->citas;
        $cant = 0;
        for($i = 0; $i < count($citas); $i++) {
            if($citas[$i]->ID_ESTADO_CITA != 5) {
                $nombre = $citas[$i]->paciente->PRIMER_NOMBRE . ($citas[$i]->paciente->SEGUNDO_NOMBRE != null ? " ".$citas[$i]->paciente->SEGUNDO_NOMBRE : "");
                $apellido = $citas[$i]->paciente->PRIMER_APELLIDO . ($citas[$i]->paciente->SEGUNDO_APELLIDO != null ? " ".$citas[$i]->paciente->SEGUNDO_APELLIDO : "");
                $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citas[$i]->FEC_CITA)),date('i',strtotime($citas[$i]->FEC_CITA))+$duracion,0,date('m',strtotime($citas[$i]->FEC_CITA)),date('d',strtotime($citas[$i]->FEC_CITA)),date('Y',strtotime($citas[$i]->FEC_CITA))));
                $administradora = $citas[$i]->paciente->contrato != null ? $citas[$i]->paciente->contrato->contrato->administradora->NOM_ADMINISTRADORA : "Particular";
                $resultado[$cant] = [
                    'ids' => $citas[$i]->ID_CITA,
                    'title' => "Identidad: ".$citas[$i]->paciente->NUM_DOC." - Nombre: ".$nombre." ".$apellido." - Servicio: ".$citas[$i]->servicio->NOM_ITEM." - Motivo: ".$citas[$i]->motivoc->NOM_MOTIVO_CONSULTA." - Consultorio: " . $citas[$i]->consultorio->NOM_CONSULTORIO . " - Administradora: " . $administradora . " - Prestador: " . $nomp." ".$apellp,
                    'start' => $citas[$i]->FEC_CITA,
                    'end' => $end,
                    'allDay' => false,
                    'className' => ($citas[$i]->ID_ESTADO_CITA == 1 ? 'bg-teal' : ($citas[$i]->ID_ESTADO_CITA == 2 ? 'bg-light-blue' : ($citas[$i]->ID_ESTADO_CITA == 3 ? 'bg-amber' : 'bg-red'))),
                    'consultorio' => $citas[$i]->ID_CONSULTORIO
                ];
                $cant++;
            }
        }
        for($i = 0; $i < count($nolaborales); $i++) {
            $dias[$i] = $nolaborales[$i]->FEC_NO_LABORAL;
            $resultado[count($resultado)] = [
                'start' => $nolaborales[$i]->FEC_NO_LABORAL.' 00:00:00',
                'end' => $nolaborales[$i]->FEC_NO_LABORAL.' 24:00:00',
                'overlap' => false,
                'rendering' => 'background',
                'color' => '#c0c0c0',
                'disabled' => true,
            ];
        }
        $horarios = $agenda->grupo->dias;
        return response()->json(['resultado' => $resultado, 'horarios' => $horarios,'dias' => $dias,'especialidad' => $especialidad, 'prestador' => $nomp." ".$apellp,
                                'id' => $agenda->ID_USER_PRESTADOR, 'grupo' => $agenda->grupo->ID_GRUPO, 'agenda' => $agenda->ID_AGENDA, 'duracion' => $duracion, 'concurrencia' => $agenda->prestador->CONCURRENCIA, 'consult' => $agenda->ID_CONSULTORIO]);
    }

    public function delAgenda(Request $request){
        $agenda = Agenda::with('citas')->where(['ID_AGENDA' => $request->get('agenda')])->first();
        if($agenda->citas != null)
            $agenda->citas()->delete();

        $agenda->ID_GRUPO = $request->get('grupo');
        $agenda->DURACION = $request->get('duracion');
        $agenda->save();

        $especialidad = $agenda->prestador->especialidad->ESPECIALIDAD;
        $nomp = $agenda->prestador->usuario->NOMBRES;
        $apellp = $agenda->prestador->usuario->APELLIDOS;
        $resultado = [];
        $dias = [];
        $horarios = [];
        $nolaborales = $agenda->sede->laborales;
        $duracion = $request->get('duracion');
        for($i = 0; $i < count($nolaborales); $i++) {
            $dias[$i] = $nolaborales[$i]->FEC_NO_LABORAL;
            $resultado[$i] = [
                'start' => $nolaborales[$i]->FEC_NO_LABORAL.' 00:00:00',
                'end' => $nolaborales[$i]->FEC_NO_LABORAL.' 24:00:00',
                'overlap' => false,
                'rendering' => 'background',
                'color' => '#c0c0c0',
                'disabled' => true,
            ];
        }
        $horarios = $agenda->grupo->dias;
        return response()->json(['resultado' => $resultado, 'horarios' => $horarios,'dias' => $dias,'especialidad' => $especialidad, 'prestador' => $nomp." ".$apellp,
                                'id' => $agenda->ID_USER_PRESTADOR, 'grupo' => $request->get('grupo'), 'agenda' => $agenda->ID_AGENDA, 'duracion' => $duracion, 'concurrencia' => $agenda->prestador->CONCURRENCIA, 'consult' => $agenda->ID_CONSULTORIO]);
    }

    public function trasladarCitas(Request $request)
    {
        $resultado = [];
        $j = 0;
        $end = '';
        if($request->get('TODOS') == 1) {
            $fecha = Carbon::createFromFormat('d/m/Y', $request->get('DIA'));
            $citas = Cita::with(['paciente', 'prestador'])->where(['ID_ESTADO_CITA' => 1])->whereDate('FEC_CITA', '=', date('Y-m-d',strtotime($fecha)));

            $citas->whereHas('prestador', function($q) use ($request) {
                $q->where(['ID_USUARIO' => $request->get('USUARIO')]);
            });

            $citas = $citas->orderby('FEC_CITA', 'ASC')->get();

            for($i = 0; $i < count($citas); $i++) {
                $citasp = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($citas[$i]->FEC_CITA))]);
                $citasp->whereHas('prestador', function($q) use ($request) {
                    $q->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                });
                $citasp = $citasp->first();
                if($citasp != null) {
                    $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citasp->FEC_CITA)),date('i',strtotime($citasp->FEC_CITA))-$citasp->agenda->DURACION,0,date('m',strtotime($citasp->FEC_CITA)),date('d',strtotime($citasp->FEC_CITA)),date('Y',strtotime($citasp->FEC_CITA))));
                    $citasp1 = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($end))]);
                    $citasp1->whereHas('prestador', function($q1) use ($request) {
                        $q1->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                    });
                    $citasp1 = $citasp1->first();
                    if($citasp1 != null) {
                        $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citasp->FEC_CITA)),date('i',strtotime($citasp->FEC_CITA))+$citasp->agenda->DURACION,0,date('m',strtotime($citasp->FEC_CITA)),date('d',strtotime($citasp->FEC_CITA)),date('Y',strtotime($citasp->FEC_CITA))));
                        $citasp2 = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($end))]);
                        $citasp2->whereHas('prestador', function($q2) use ($request) {
                            $q2->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                        });
                        $citasp2 = $citasp2->first();
                        if($citasp2 != null) {
                            $resultado[$j] = $citasp;
                            $j++;
                        }
                        else {
                            $this->Trasladar($request->get('PRESTADOR'),$citas[$i],$end);
                        }
                    }
                    else {
                        $this->Trasladar($request->get('PRESTADOR'),$citas[$i],$end);
                    }
                }
                else {
                    $this->Trasladar($request->get('PRESTADOR'),$citas[$i],null);
                }
            }
            return response()->json($resultado, 200 );
        }
        else {
            $citas = $request->get('CITAS');
            $resultado = [];
            $j = 0;
            $end = '';
            for($i = 0; $i < count($citas); $i++) {
                $cita = Cita::find($citas[$i]);
                $citasp = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($cita->FEC_CITA))]);
                $citasp->whereHas('prestador', function($q) use ($request) {
                    $q->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                });
                $citasp = $citasp->first();
                if($citasp != null) {
                    $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citasp->FEC_CITA)),date('i',strtotime($citasp->FEC_CITA))-$citasp->agenda->DURACION,0,date('m',strtotime($citasp->FEC_CITA)),date('d',strtotime($citasp->FEC_CITA)),date('Y',strtotime($citasp->FEC_CITA))));
                    $citasp1 = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($end))]);
                    $citasp1->whereHas('prestador', function($q1) use ($request) {
                        $q1->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                    });
                    $citasp1 = $citasp1->first();
                    if($citasp1 != null) {
                        $end = date('Y-m-d H:i:s',mktime(date('H',strtotime($citasp->FEC_CITA)),date('i',strtotime($citasp->FEC_CITA))+$citasp->agenda->DURACION,0,date('m',strtotime($citasp->FEC_CITA)),date('d',strtotime($citasp->FEC_CITA)),date('Y',strtotime($citasp->FEC_CITA))));
                        $citasp2 = Cita::with(['paciente', 'prestador', 'agenda'])->where(['FEC_CITA' => date('Y-m-d H:i',strtotime($end))]);
                        $citasp2->whereHas('prestador', function($q2) use ($request) {
                            $q2->where(['ID_USUARIO' => $request->get('PRESTADOR')]);
                        });
                        $citasp2 = $citasp2->first();
                        if($citasp2 != null) {
                            $resultado[$j] = $cita;
                            $j++;
                        }
                        else {
                            $this->Trasladar($request->get('PRESTADOR'),$cita,$end);
                        }
                    }
                    else {
                        $this->Trasladar($request->get('PRESTADOR'),$cita,$end);
                    }
                }
                else {
                    $this->Trasladar($request->get('PRESTADOR'),$cita,null);
                }
            }
            return response()->json($resultado, 200 );
        }
    }

    function Trasladar($prestador_id, $cita, $end) {
        $prestador = UserPrestador::with(['agenda.citas.consultorio', 'agenda.sede.laborales', 'agenda.grupo.dias', 'especialidad', 'usuario','citas.paciente.contrato.contrato.administradora', 'citas.prestador.usuario', 'citas.prestador.especialidad', 'citas.usuario', 'citas.servicio', 'citas.motivoc'])
                                ->where(['ID_USUARIO' => $prestador_id])->first();
        $agenda = null;
        $agendas = null;
        $existe = false;
        $pos = 0;
        $cant = 0;
        if($prestador->agenda == null) {
            $agenda = new Agenda();
            $agenda->ID_GRUPO = 1;
            $agenda->ID_SEDE = $cita->consultorio->sede->ID_SEDE;
            $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
            $agenda->DURACION = 15;
            $agenda->save();
        }
        else {
            $agendas = $prestador->agenda;            
            for($a = 0; $a < count($agendas); $a++) {
                if($agendas[$a]->ID_SEDE == $cita->consultorio->sede->ID_SEDE) {
                    $existe = true;
                    $pos = $a;
                }
            }            
            if($existe == false) {
                $agenda = new Agenda();
                $agenda->ID_GRUPO = 1;
                $agenda->ID_SEDE = $cita->consultorio->sede->ID_SEDE;
                $agenda->ID_USER_PRESTADOR = $prestador->ID_USER_PRESTADOR;
                $agenda->DURACION = 15;
                $agenda->save();
            }
        }
        $actual = $existe == false ? $agenda : $agendas[$pos];
        $cita->ID_PRESTADOR = $prestador->ID_USER_PRESTADOR;
        $cita->ID_AGENDA = $actual->ID_AGENDA;
        if($end != null)
            $cita->FEC_CITA = $end;
        $cita->save();
    }

    public function SearchCitas(Request $request){
        $citas = Cita::with(['paciente.identificacion', 'agenda.sede.empresa', 'prestador.usuario']);
        if($request->get('id_empresa') != 0) {
            $citas->whereHas('agenda.sede.empresa', function($q) use ($request) {
                $q->where(['ID_EMPRESA' => $request->get('id_empresa')]);
            });
        }
        $citas->whereHas('paciente', function($q) use ($request) {
            $q->orderby('PRIMER_NOMBRE');
        });
        $datos = $citas->where(['ID_ESTADO_CITA' => 1])->orderby('FEC_CITA', 'DESC')->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($datos),"recordsFiltered"=> count($datos),'data' => $datos]);
    }
}
