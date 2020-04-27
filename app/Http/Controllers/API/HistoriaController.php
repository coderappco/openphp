<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RangoEdades;
use App\Models\Historia;
use App\Models\HistoriaBasica;
use App\Models\Paciente;
use App\Models\Cita;
use App\Models\Items;
use App\Models\HistoriaPaciente;
use App\Models\HistoriapPacienteCampos;
use App\Models\HistoriaPacienteFamilia;
use App\Models\HistoriaPacienteExamenl;
use App\Models\HistoriaPacienteExamUrg;
use App\Models\HistoriaPacienteServicios;
use App\Models\HistoriaPacienteMedicamento;
use App\Models\HistoriaPacienteDiag;
use App\Models\HistoriaPacienteOdontograma;
use App\Models\HistoriaPacienteOdonTrat;
use App\Models\HistoriaPacienteOdonCons;
use App\Models\HistoriaPacienteIndice;
use App\Models\TipoCitaHistoria;
use App\Models\Diagnosticos;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HistoriaController extends Controller
{

    public function getHistorias(){
        $historia = Historia::with(['rango'])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($historia),"recordsFiltered"=> count($historia),'data' => $historia]);
    }

    public function getHistoria($id)
    {
        $historia = Historia::with(['rango'])->where(['ID_HISTORIA' => $id])->first();
        return response()->json($historia);
    }

    public function ListHistorias() {
        $historia = Historia::all();
        return response()->json($historia);
    }

    public function ListHistoriasCita(Request $request) {
        $cita = Cita::where(['ID_CITA' => $request->get('cita_id')])->first();
        $ids = [];
        $tipo_cita = $cita->ID_ESTADO_CITA;
        $hist = TipoCitaHistoria::where(['ID_TIPO_CITA' => $tipo_cita])->get();
        for($i = 0; $i < count($hist); $i++) {
            $ids[$i] = $hist[$i]->ID_HISTORIA;
        }
        $historias = Historia::whereIn('ID_HISTORIA', $ids)->get();
        return response()->json($historias);
    }

    public function updateHistoria(Request $request, $id)
    {
        if($id != 0) {
            $historia = Historia::find($id);
            $historia->ID_RANGO = $request->get('ID_RANGO');
            $historia->GENERO = $request->get('GENERO');
            $historia->save();
        }
        else {
            $historias = Historia::all();
            for($i = 0; $i < count($historias); $i++) {
                $historias[$i]->ID_RANGO = $request->get('ID_RANGO');
                $historias[$i]->GENERO = $request->get('GENERO');
                $historias[$i]->save();
            }
        }

        return response()->json("Historia actualizada", 200);
    }

    public function createHistoriaPaciente(Request $request)
    {
        $historiap = new HistoriaPaciente();
        $historiap->ID_PACIENTE = $request->get('PACIENTE');
        $historiap->ID_PARENTESCO = ($request->get('DATOSPACIENTE')[1][1] != '' && $request->get('DATOSPACIENTE')[1][0] == 'PARENTESCO' ? $request->get('DATOSPACIENTE')[1][1] : 23);
        $historiap->ID_USUARIO = $request->get('PRESTADOR');
        $historiap->ID_HISTORIA = $request->get('ID_HISTORIA');
        $historiap->FEC_DILIGENCIADA = Carbon::now()->toDateTimeString();
        $historiap->save();

        $datosh = $request->get('DATOSHISTORIA');
        for($i = 0; $i < count($datosh); $i++) {
            $historiacampos = new HistoriapPacienteCampos();
            $historiacampos->CAMPO = $datosh[$i][0];
            $historiacampos->VALOR = $datosh[$i][1];
            $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
            $historiacampos->save();
        }

        if(count($request->get('DATOS')) > 0 && $request->get('DATOSPACIENTE')[2][0] == 'PARENTESCO') {
            $paciente = Paciente::find($request->get('PACIENTE'));
            $paciente->ID_ESCOLARIDAD = $request->get('DATOSPACIENTE')[3][1];
            $paciente->ID_ETNIA = $request->get('DATOSPACIENTE')[7][1];
            $paciente->ID_OCUPACION = $request->get('DATOSPACIENTE')[6][1];
            $paciente->ID_DISCAPACIDAD = $request->get('DATOSPACIENTE')[4][1];
            $paciente->ID_RELIGION = $request->get('DATOSPACIENTE')[8][1];
            $paciente->GESTACION = $request->get('DATOSPACIENTE')[5][1];
            $paciente->DESPLAZADO = $request->get('DATOS')[0];
            $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
            $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
            $paciente->PENSIONADO = $request->get('DATOS')[1];
            $paciente->LGBTI = $request->get('DATOS')[2];
            $paciente->save();
            for($i = 9; $i < count($request->get('DATOSPACIENTE')) - 1; $i++) {
                if(!is_array($request->get('DATOSPACIENTE')[$i][1])) {
                    $historiacampos = new HistoriapPacienteCampos();
                    $historiacampos->CAMPO = $request->get('DATOSPACIENTE')[$i][0];
                    $historiacampos->VALOR = $request->get('DATOSPACIENTE')[$i][1];
                    $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                    $historiacampos->save();
                }
                else {
                    $diags = $request->get('DATOSPACIENTE')[$i][1];
                    for($j = 0; $j < count($diags); $j++) {
                        $diagnostico = new HistoriaPacienteDiag();
                        $diagnostico->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                        $diagnostico->CAMPO  = $request->get('DATOSPACIENTE')[$i][0];
                        $diagnostico->ID_DIAGNOSTICO = $diags[$j];
                        $diagnostico->save();
                    }
                }
            }
        }
        else
        if(count($request->get('DATOS')) > 0 && $request->get('DATOSPACIENTE')[2][0] != 'PARENTESCO') {
            $paciente = Paciente::find($request->get('PACIENTE'));
            $paciente->ID_ESCOLARIDAD = $request->get('DATOSPACIENTE')[2][1];
            $paciente->ID_ETNIA = $request->get('DATOSPACIENTE')[6][1];
            $paciente->ID_OCUPACION = $request->get('DATOSPACIENTE')[5][1];
            $paciente->ID_DISCAPACIDAD = $request->get('DATOSPACIENTE')[3][1];
            $paciente->ID_RELIGION = $request->get('DATOSPACIENTE')[7][1];
            $paciente->GESTACION = $request->get('DATOSPACIENTE')[4][1];
            $paciente->DESPLAZADO = $request->get('DATOS')[0];
            $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
            $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
            $paciente->PENSIONADO = $request->get('DATOS')[1];
            $paciente->LGBTI = $request->get('DATOS')[2];
            $paciente->save();
            for($i = 8; $i < count($request->get('DATOSPACIENTE')) - 1; $i++) {
                if(!is_array($request->get('DATOSPACIENTE')[$i][1])) {
                    $historiacampos = new HistoriapPacienteCampos();
                    $historiacampos->CAMPO = $request->get('DATOSPACIENTE')[$i][0];
                    $historiacampos->VALOR = $request->get('DATOSPACIENTE')[$i][1];
                    $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                    $historiacampos->save();
                }
                else {
                    $diags = $request->get('DATOSPACIENTE')[$i][1];
                    for($j = 0; $j < count($diags); $j++) {
                        $diagnostico = new HistoriaPacienteDiag();
                        $diagnostico->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                        $diagnostico->CAMPO  = $request->get('DATOSPACIENTE')[$i][0];
                        $diagnostico->ID_DIAGNOSTICO = $diags[$j];
                        $diagnostico->save();
                    }
                }
            }
        }

        $historiacampos = new HistoriapPacienteCampos();
        $historiacampos->CAMPO = $request->get('DATOSPACIENTE')[0][0];
        $historiacampos->VALOR = $request->get('DATOSPACIENTE')[0][1];
        $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
        $historiacampos->save();

        if($request->get('ID_CITA') != 0) {
            $cita = Cita::find($request->get('ID_CITA'));
            $cita->ID_ESTADO_CITA = 3;
            $cita->FEC_ESTADO = Carbon::now()->toDateTimeString();
            $cita->save();
        }

        if(null !== $request->get('FAMILIAS') && $request->get('FAMILIAS') != null) {
            $familias = $request->get('FAMILIAS');
            for($i = 0; $i < count($familias); $i++) {
                $familia = new HistoriaPacienteFamilia();
                $familia->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $familia->NOMBRE = $familias[$i]['nombre'];
                $familia->EDAD = $familias[$i]['edad'];
                $familia->ID_PARENTESCO = $familias[$i]['parentesco'];
                $familia->ID_OCUPACION = $familias[$i]['ocupacion'];
                $familia->save();
            }
        }

        if(null !== $request->get('ODONTOGRAMA') && $request->get('ODONTOGRAMA') != null) {
            for($i = 0; $i < count($request->get('ODONTOGRAMA')); $i++) {
                $odo = new HistoriaPacienteOdontograma();
                $odo->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $odo->CAMPO = $request->get('ODONTOGRAMA')[$i]['id'];
                $odo->NAME = $request->get('ODONTOGRAMA')[$i]['name'];
                $odo->DIAGNSOTICO = $request->get('ODONTOGRAMA')[$i]['diag'];
                $odo->DIENTE = $request->get('ODONTOGRAMA')[$i]['diente'];
                $odo->IMAGE = (isset($request->get('ODONTOGRAMA')[$i]['image']) ? $request->get('ODONTOGRAMA')[$i]['image'] : null);
                $odo->save();
            }
        }

        if(null !== $request->get('TRATAMIENTOS') && $request->get('TRATAMIENTOS') != null) {
            for($i = 0; $i < count($request->get('TRATAMIENTOS')); $i++) {
                $trat = new HistoriaPacienteOdonTrat();
                $trat->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $trat->CAMPO = $request->get('TRATAMIENTOS')[$i]['id'];
                $trat->NAME = $request->get('TRATAMIENTOS')[$i]['name'];
                $trat->TRATAMIENTO = $request->get('TRATAMIENTOS')[$i]['trat'];
                $trat->DIENTE = $request->get('TRATAMIENTOS')[$i]['diente'];
                $trat->IMAGE = (isset($request->get('TRATAMIENTOS')[$i]['image']) ? $request->get('TRATAMIENTOS')[$i]['image'] : null);
                $trat->OBSERVACION = (isset($request->get('TRATAMIENTOS')[$i]['obs']) ? $request->get('TRATAMIENTOS')[$i]['obs'] : null);
                $trat->EVOLUCION = (isset($request->get('TRATAMIENTOS')[$i]['evol']) ? $request->get('TRATAMIENTOS')[$i]['evol'] : 0);
                $trat->save();
            }
        }

        if(null !== $request->get('INDICE') && $request->get('INDICE') != null) {
            for($i = 0; $i < count($request->get('INDICE')); $i++) {
                $ind = new HistoriaPacienteIndice();
                $ind->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $ind->CAMPO = $request->get('INDICE')[$i][0];
                $ind->VALOR = $request->get('INDICE')[$i][1];
                $ind->save();
            }
        }

        if(null !== $request->get('CONSENTIMIENTOS') && $request->get('CONSENTIMIENTOS') != null) {
            for($i = 0; $i < count($request->get('CONSENTIMIENTOS')); $i++) {
                $cons = new HistoriaPacienteOdonCons();
                $cons->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $cons->CAMPO = $request->get('CONSENTIMIENTOS')[$i]['0'];
                $cons->VALOR = $request->get('CONSENTIMIENTOS')[$i]['1'];
                $cons->save();
            }
        }

        if(null !== $request->get('EXAMENES') && $request->get('EXAMENES') != null) {
            for($i = 0; $i < count($request->get('EXAMENES')); $i++) {
                $exm = new HistoriaPacienteExamUrg();
                $exm->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $exm->ID_ITEM = $request->get('EXAMENES')[$i]['id'];
                $exm->CANTIDAD = $request->get('EXAMENES')[$i]['cantidad'];
                $exm->save();
            }
        }

        if(null !== $request->get('SERVICIO') && $request->get('SERVICIO') != null) {
            for($i = 0; $i < count($request->get('SERVICIO')); $i++) {
                $serv = new HistoriaPacienteServicios();
                $serv->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $serv->ID_ITEM = $request->get('SERVICIO')[$i]['id'];
                $serv->CANTIDAD = $request->get('SERVICIO')[$i]['cantidad'];
                $serv->DESCRIPCION = $request->get('SERVICIO')[$i]['descripcion'];
                $serv->save();
            }
        }
        return response()->json("Historia creada", 200);
    }

    public function updateHistoriaPaciente(Request $request, $id)
    {
        $historiap = HistoriaPaciente::find($id);
        
        $historiap->ID_PACIENTE = $request->get('PACIENTE');
        $historiap->ID_PARENTESCO = ($request->get('DATOSPACIENTE')[1][1] != '' ? $request->get('DATOSPACIENTE')[1][1] : 23);
        $historiap->ID_USUARIO = $request->get('PRESTADOR');
        $historiap->ID_HISTORIA = $request->get('ID_HISTORIA');
        $historiap->save();

        $datosh = $request->get('DATOSHISTORIA');
        for($i = 0; $i < count($datosh); $i++) {
            $historiacampos = HistoriapPacienteCampos::where(['ID_HISTORIA_PACIENTE' => $historiap->ID_HISTORIA_PACIENTE, 'CAMPO' => $datosh[$i][0]])->first();
            $historiacampos->CAMPO = $datosh[$i][0];
            $historiacampos->VALOR = $datosh[$i][1];
            $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
            $historiacampos->save();
        }

        if(count($request->get('DATOS')) > 0 && $request->get('DATOSPACIENTE')[2][0] == 'PARENTESCO') {
            $paciente = Paciente::find($request->get('PACIENTE'));
            $paciente->ID_ESCOLARIDAD = $request->get('DATOSPACIENTE')[3][1];
            $paciente->ID_ETNIA = $request->get('DATOSPACIENTE')[7][1];
            $paciente->ID_OCUPACION = $request->get('DATOSPACIENTE')[6][1];
            $paciente->ID_DISCAPACIDAD = $request->get('DATOSPACIENTE')[4][1];
            $paciente->ID_RELIGION = $request->get('DATOSPACIENTE')[8][1];
            $paciente->GESTACION = $request->get('DATOSPACIENTE')[5][1];
            $paciente->DESPLAZADO = $request->get('DATOS')[0];
            $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
            $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
            $paciente->PENSIONADO = $request->get('DATOS')[1];
            $paciente->LGBTI = $request->get('DATOS')[2];
            $paciente->save();
            for($i = 9; $i < count($request->get('DATOSPACIENTE')) - 1; $i++) {
                if(!is_array($request->get('DATOSPACIENTE')[$i][1])) {
                    $historiacampos = HistoriapPacienteCampos::where(['ID_HISTORIA_PACIENTE' => $historiap->ID_HISTORIA_PACIENTE, 'CAMPO' => $request->get('DATOSPACIENTE')[$i][0]])->first();
                    $historiacampos->VALOR = $request->get('DATOSPACIENTE')[$i][1];
                    $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                    $historiacampos->save();
                }
                else {
                    $historiap->diagnosticos()->delete();
                    $diags = $request->get('DATOSPACIENTE')[$i][1];
                    for($j = 0; $j < count($diags); $j++) {
                        $diagnostico = new HistoriaPacienteDiag();
                        $diagnostico->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                        $diagnostico->CAMPO  = $request->get('DATOSPACIENTE')[$i][0];
                        $diagnostico->ID_DIAGNOSTICO = $diags[$j];
                        $diagnostico->save();
                    }
                }
            }
        }
        else
        if(count($request->get('DATOS')) > 0 && $request->get('DATOSPACIENTE')[2][0] != 'PARENTESCO') {
            $paciente = Paciente::find($request->get('PACIENTE'));
            $paciente->ID_ESCOLARIDAD = $request->get('DATOSPACIENTE')[2][1];
            $paciente->ID_ETNIA = $request->get('DATOSPACIENTE')[6][1];
            $paciente->ID_OCUPACION = $request->get('DATOSPACIENTE')[5][1];
            $paciente->ID_DISCAPACIDAD = $request->get('DATOSPACIENTE')[3][1];
            $paciente->ID_RELIGION = $request->get('DATOSPACIENTE')[7][1];
            $paciente->GESTACION = $request->get('DATOSPACIENTE')[4][1];
            $paciente->DESPLAZADO = $request->get('DATOS')[0];
            $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
            $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
            $paciente->PENSIONADO = $request->get('DATOS')[1];
            $paciente->LGBTI = $request->get('DATOS')[2];
            $paciente->save();
            for($i = 8; $i < count($request->get('DATOSPACIENTE')) - 1; $i++) {
                if(!is_array($request->get('DATOSPACIENTE')[$i][1])) {
                    $historiacampos = HistoriapPacienteCampos::where(['ID_HISTORIA_PACIENTE' => $historiap->ID_HISTORIA_PACIENTE, 'CAMPO' => $request->get('DATOSPACIENTE')[$i][0]])->first();
                    $historiacampos->VALOR = $request->get('DATOSPACIENTE')[$i][1];
                    $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                    $historiacampos->save();
                }
                else {
                    $historiap->diagnosticos()->delete();
                    $diags = $request->get('DATOSPACIENTE')[$i][1];
                    for($j = 0; $j < count($diags); $j++) {
                        $diagnostico = new HistoriaPacienteDiag();
                        $diagnostico->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                        $diagnostico->CAMPO  = $request->get('DATOSPACIENTE')[$i][0];
                        $diagnostico->ID_DIAGNOSTICO = $diags[$j];
                        $diagnostico->save();
                    }
                }
            }
        }

        $historiacampos = HistoriapPacienteCampos::where(['ID_HISTORIA_PACIENTE' => $historiap->ID_HISTORIA_PACIENTE, 'CAMPO' => $request->get('DATOSPACIENTE')[0][0]])->first();
        $historiacampos->VALOR = $request->get('DATOSPACIENTE')[0][1];
        $historiacampos->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
        $historiacampos->save();

        if(null !== $request->get('FAMILIAS') && $request->get('FAMILIAS') != null) {
            $familias = $request->get('FAMILIAS');
            $historiap->familiares()->delete();
            for($i = 0; $i < count($familias); $i++) {
                $familia = new HistoriaPacienteFamilia();
                $familia->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $familia->NOMBRE = $familias[$i]['nombre'];
                $familia->EDAD = $familias[$i]['edad'];
                $familia->ID_PARENTESCO = $familias[$i]['parentesco'];
                $familia->ID_OCUPACION = $familias[$i]['ocupacion'];
                $familia->save();
            }
        }
        else
        {
            if($historiap->familiares != null) {
                $historiap->familiares()->delete();
            }
        }

        if(null !== $request->get('ODONTOGRAMA') && $request->get('ODONTOGRAMA') != null) {
            for($i = 0; $i < count($request->get('ODONTOGRAMA')); $i++) {
                $odo = HistoriaPacienteOdontograma::where(['ID_HISTORIA_PACIENTE' => $id, 'CAMPO' => $request->get('ODONTOGRAMA')[$i]['id']])->first();
                $odo->ID_HISTORIA_PACIENTE = $id;
                $odo->CAMPO = $request->get('ODONTOGRAMA')[$i]['id'];
                $odo->NAME = $request->get('ODONTOGRAMA')[$i]['name'];
                $odo->DIAGNSOTICO = $request->get('ODONTOGRAMA')[$i]['diag'];
                $odo->DIENTE = $request->get('ODONTOGRAMA')[$i]['diente'];
                if(isset($request->get('ODONTOGRAMA')[$i]['image']))
                    $odo->IMAGE = $request->get('ODONTOGRAMA')[$i]['image'];
                $odo->save();
            }
        }

        if(null !== $request->get('TRATAMIENTOS') && $request->get('TRATAMIENTOS') != null) {
            for($i = 0; $i < count($request->get('TRATAMIENTOS')); $i++) {
                $trat = HistoriaPacienteOdonTrat::where(['ID_HISTORIA_PACIENTE' => $id, 'CAMPO' => $request->get('TRATAMIENTOS')[$i]['id']])->first();
                $trat->ID_HISTORIA_PACIENTE = $id;
                $trat->CAMPO = $request->get('TRATAMIENTOS')[$i]['id'];
                $trat->NAME = $request->get('TRATAMIENTOS')[$i]['name'];
                $trat->TRATAMIENTO = $request->get('TRATAMIENTOS')[$i]['trat'];
                $trat->DIENTE = $request->get('TRATAMIENTOS')[$i]['diente'];
                if(isset($request->get('TRATAMIENTOS')[$i]['image']))
                    $trat->IMAGE = $request->get('TRATAMIENTOS')[$i]['image'];
                $trat->save();
            }
        }

        if(null !== $request->get('INDICE') && $request->get('INDICE') != null) {
            $historiap->indice()->delete();
            for($i = 0; $i < count($request->get('INDICE')); $i++) {
                $odo = new HistoriaPacienteIndice();
                $odo->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $odo->CAMPO = $request->get('INDICE')[$i][0];
                $odo->VALOR = $request->get('INDICE')[$i][1];
                $odo->save();
            }
        }

        if(null !== $request->get('CONSENTIMIENTOS') && $request->get('CONSENTIMIENTOS') != null) {
            for($i = 0; $i < count($request->get('CONSENTIMIENTOS')); $i++) {
                $cons = HistoriaPacienteOdonCons::where(['ID_HISTORIA_PACIENTE' => $id, 'CAMPO' => $request->get('CONSENTIMIENTOS')[$i][0]])->first();
                $cons->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $cons->CAMPO = $request->get('CONSENTIMIENTOS')[$i]['0'];
                $cons->VALOR = $request->get('CONSENTIMIENTOS')[$i]['1'];
                $cons->save();
            }
        }

        if(null !== $request->get('EXAMENES') && $request->get('EXAMENES') != null) {
            $historiap->examenurg()->delete();
            for($i = 0; $i < count($request->get('EXAMENES')); $i++) {
                $exm = new HistoriaPacienteExamUrg();
                $exm->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $exm->ID_ITEM = $request->get('EXAMENES')[$i]['id'];
                $exm->CANTIDAD = $request->get('EXAMENES')[$i]['cantidad'];
                $exm->save();
            }
        }

        if(null !== $request->get('SERVICIO') && $request->get('SERVICIO') != null) {
            $historiap->servicio()->delete();
            for($i = 0; $i < count($request->get('SERVICIO')); $i++) {
                $serv = new HistoriaPacienteServicios();
                $serv->ID_HISTORIA_PACIENTE = $historiap->ID_HISTORIA_PACIENTE;
                $serv->ID_ITEM = $request->get('SERVICIO')[$i]['id'];
                $serv->CANTIDAD = $request->get('SERVICIO')[$i]['cantidad'];
                $serv->DESCRIPCION = $request->get('SERVICIO')[$i]['descripcion'];
                $serv->save();
            }
        }

        return response()->json("Historia clínica básica actualizada", 200);
    }

    public function getHistoriaPaciente($id) {
        $historia = HistoriaPaciente::with(['medicamento.items','laboratorio.items','familiares.ocupacion','familiares.parentesco','historia','parentesco','usuario.empresa.empresa','paciente.estadocivil','paciente.identificacion','paciente.etnia','paciente.discapacidad','odontrat.tratamientos','consentimientos',
                                            'paciente.municipio','paciente.escolaridad','paciente.religion','paciente.ocupacion','campos','paciente.contrato.contrato.administradora','usuario.prestador','diagnosticos.diagnostico','odontologia.diagnosticos','indice','examenurg.items','servicio.items'])->where(['ID_HISTORIA_PACIENTE' => $id])->first();
        $campos = $historia->campos;
        for($i = 0; $i < count($campos); $i++) {
            if(($campos[$i]->CAMPO == 'DIAGNOSTICO' || $campos[$i]->CAMPO == 'DIAGNOSTICOD' || $campos[$i]->CAMPO == 'DIAGNOSTICOF' || $campos[$i]->CAMPO == 'DIAGNOSTICOO' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOG' || $campos[$i]->CAMPO == 'DIAGNOSTICOSB' || $campos[$i]->CAMPO == 'DIAGNOSTICODI' || $campos[$i]->CAMPO == 'DIAGNOSTICOAN' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOMA' || $campos[$i]->CAMPO == 'DIAGNOSTICOEV' || $campos[$i]->CAMPO == 'DIAGNOSTICOFI' || $campos[$i]->CAMPO == 'DIAGNOSTICOPPAL' || 
                $campos[$i]->CAMPO == 'DIAGNOSTICOR1' || $campos[$i]->CAMPO == 'DIAGNOSTICOR2' || $campos[$i]->CAMPO == 'DIAGNOSTICOR3' || $campos[$i]->CAMPO == 'DIAGNOSTICOA' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOP' || $campos[$i]->CAMPO == 'DIAGNOSTICOPE' || $campos[$i]->CAMPO == 'DIAGNOSTICOT' || $campos[$i]->CAMPO == 'DIAGNOSTICOOT' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOPR' || $campos[$i]->CAMPO == 'DIAGNOSTICOHIST') && $campos[$i]->VALOR != '') {
                $diagnostico = Diagnosticos::find($campos[$i]->VALOR);
                $historia[$campos[$i]->CAMPO] = $diagnostico->COD_DIAGNOSTICO ." ". $diagnostico->NOM_DIAGNOSTICO;
            }
            else
            if(($campos[$i]->CAMPO == 'DIAGNOSTICO' || $campos[$i]->CAMPO == 'DIAGNOSTICOD' || $campos[$i]->CAMPO == 'DIAGNOSTICOF' || $campos[$i]->CAMPO == 'DIAGNOSTICOO' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOG' || $campos[$i]->CAMPO == 'DIAGNOSTICOSB' || $campos[$i]->CAMPO == 'DIAGNOSTICODI' || $campos[$i]->CAMPO == 'DIAGNOSTICOAN' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOMA' || $campos[$i]->CAMPO == 'DIAGNOSTICOEV' || $campos[$i]->CAMPO == 'DIAGNOSTICOFI' || $campos[$i]->CAMPO == 'DIAGNOSTICOPPAL' || 
                $campos[$i]->CAMPO == 'DIAGNOSTICOR1' || $campos[$i]->CAMPO == 'DIAGNOSTICOR2' || $campos[$i]->CAMPO == 'DIAGNOSTICOR3' || $campos[$i]->CAMPO == 'DIAGNOSTICOA' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOP' || $campos[$i]->CAMPO == 'DIAGNOSTICOPE' || $campos[$i]->CAMPO == 'DIAGNOSTICOT' || $campos[$i]->CAMPO == 'DIAGNOSTICOOT' ||
                $campos[$i]->CAMPO == 'DIAGNOSTICOPR' || $campos[$i]->CAMPO == 'DIAGNOSTICOHIST') && $campos[$i]->VALOR == '') {
                $historia[$campos[$i]->CAMPO] = '';
            }
        }

        /*if($historia->ID_HISTORIA == 20) {
            $odonfirst = HistoriaPaciente::with(['odontologia'])->where(['ID_PACIENTE' => $historia->ID_PACIENTE,'ID_HISTORIA' => 20])->where('ID_HISTORIA_PACIENTE', '<', $historia->ID_HISTORIA_PACIENTE)->orderby('ID_HISTORIA_PACIENTE', 'ASC')->get();
            if(count($odonfirst) > 0) {
                $historia['odontologiainc'] = $odonfirst[0]->odontologia;
            }
        }*/
        return response()->json($historia);
    }

    public function getHistoriasPacientes(Request $request)
    {
        $historias = HistoriaPaciente::with(['usuario','historia'])->where(['ID_PACIENTE' => $request->get('id_pac')])->orderby('FEC_DILIGENCIADA','DESC')->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($historias),"recordsFiltered"=> count($historias),'data' => $historias]);
    }

    public function getHistoriasPacientesEpi(Request $request)
    {
        $historias = HistoriaPaciente::with(['usuario','historia'])->where(['ID_PACIENTE' => $request->get('id_pac')])->whereIn('ID_HISTORIA', ['1','2','3','6','7','13','14','15','16','18','20','21','24','25','28','30','31','32','35','36','37','39','40','41','42','43','44'])->orderby('FEC_DILIGENCIADA','DESC')->get();
        return response()->json($historias);
    }

    public function getHistPacientesIdLab(Request $request)
    {
        $historias = HistoriaPaciente::with(['usuario','historia'])->where(['ID_PACIENTE' => $request->get('id')])->whereIn('ID_HISTORIA', ['1', '3', '41','43'])->orderby('FEC_DILIGENCIADA','DESC')->get();
        return response()->json($historias);
    }

    public function getHistsLab(Request $request)
    {
        $labs = HistoriaPacienteExamenl::with(['historiap','items'])->where(['ID_HISTORIA_PACIENTE' => $request->get('id_hist')])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($labs),"recordsFiltered"=> count($labs),'data' => $labs]);
    }

    public function createHistoriaLab(Request $request)
    {
        $lab = new HistoriaPacienteExamenl();

        $lab->ID_HISTORIA_PACIENTE = $request->get('HISTORIAEX');
        $lab->CANTIDAD = $request->get('CANTIDAD');
        $lab->OBSERVACIONES = $request->get('OBS');
        $lab->ID_ITEM = $request->get('ITEM');
        $lab->FECHA = Carbon::now()->toDateTimeString();

        $lab->save();

        return response()->json("Examen de laboratorio creado", 200);
    }

    public function updateHistoriaLab($id, Request $request)
    {
        $lab = HistoriaPacienteExamenl::find($id);

        $lab->ID_HISTORIA_PACIENTE = $request->get('HISTORIAEX');
        $lab->CANTIDAD = $request->get('CANTIDAD');
        $lab->OBSERVACIONES = $request->get('OBS');
        $lab->ID_ITEM = $request->get('ITEM');
        $lab->RESULTADO = $request->get('RESULTADO');

        $lab->save();

        return response()->json("Examen de laboratorio actualizado", 200);
    }

    public function delHistoriaLab($id)
    {
        $lab = HistoriaPacienteExamenl::find($id);

        $lab->delete();

        return response()->json("Examen de laboratorio eliminado", 200);
    }

    public function getLaboratorio($id) {
        $historia = HistoriaPacienteExamenl::with(['historiap','items'])->where(['ID_HIST_PAC_EXAMENL' => $id])->first();        
        return response()->json($historia);
    }

    public function getHistPacientesIdMed(Request $request)
    {
        $historias = HistoriaPaciente::with(['usuario','historia'])->where(['ID_PACIENTE' => $request->get('id')])->whereIn('ID_HISTORIA', ['43'])->orderby('FEC_DILIGENCIADA','DESC')->get();
        return response()->json($historias);
    }

    public function getHistsMed(Request $request)
    {
        $meds = HistoriaPacienteMedicamento::with(['historiap','items'])->where(['ID_HISTORIA_PACIENTE' => $request->get('id_hist')])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($meds),"recordsFiltered"=> count($meds),'data' => $meds]);
    }

    public function createHistoriaMed(Request $request)
    {
        $med = new HistoriaPacienteMedicamento();

        $med->ID_HISTORIA_PACIENTE = $request->get('HISTORIAEX');
        $med->CANTIDAD = $request->get('CANTIDAD');
        $med->OBSERVACIONES = $request->get('OBS');
        $med->FRECUENCIA = $request->get('FRECUENCIA');
        $med->DURACION = $request->get('DURACION');
        $med->DOSIS = $request->get('DOSIS');
        $med->ID_ITEM = $request->get('ITEM');

        $med->save();

        $item = Items::find($request->get('ITEM'));
        $item->PRES_ITEM = $request->get('PRESENTACION');
        $item->CONCENTRACION = $request->get('CONCENTRACION');
        $item->MOD_ADM = $request->get('ADMINISTRACION');

        $item->save();

        return response()->json("Medicamento solicitado", 200);
    }

    public function updateHistoriaMed($id, Request $request)
    {
        $med = HistoriaPacienteMedicamento::find($id);

        $med->ID_HISTORIA_PACIENTE = $request->get('HISTORIAEX');
        $med->CANTIDAD = $request->get('CANTIDAD');
        $med->OBSERVACIONES = $request->get('OBS');
        $med->FRECUENCIA = $request->get('FRECUENCIA');
        $med->DURACION = $request->get('DURACION');
        $med->DOSIS = $request->get('DOSIS');
        $med->ID_ITEM = $request->get('ITEM');

        $med->save();

        $item = Items::find($request->get('ITEM'));
        $item->PRES_ITEM = $request->get('PRESENTACION');
        $item->CONCENTRACION = $request->get('CONCENTRACION');
        $item->MOD_ADM = $request->get('ADMINISTRACION');

        $item->save();

        return response()->json("Medicamento actualizado", 200);
    }

    public function delHistoriaMed($id)
    {
        $med = HistoriaPacienteMedicamento::find($id);

        $med->delete();

        return response()->json("Medicamento eliminado", 200);
    }

    public function getMedicamento($id) {
        $historia = HistoriaPacienteMedicamento::with(['historiap','items'])->where(['ID_HIST_PAC_MEDICAMENTO' => $id])->first();        
        return response()->json($historia);
    }

    public function getHistoriaSignoV($id) {
        $historia = HistoriaPaciente::with(['historia','usuario.empresa.empresa','paciente.estadocivil','paciente.identificacion','paciente.etnia','paciente.discapacidad',
                                            'paciente.municipio','paciente.escolaridad','paciente.religion','paciente.ocupacion','campos','paciente.contrato.contrato.administradora','usuario.prestador'])->where(['ID_PACIENTE' => $id, 'ID_HISTORIA' => 27])->get();
        return response()->json($historia);
    }

    public function getHistoriaIds(Request $request) {
        $ids = explode(',',$request->get('ids'));

        if($ids[0] != 0)
        $historias = HistoriaPaciente::with(['medicamento.items','laboratorio.items','familiares.ocupacion','familiares.parentesco','historia','parentesco','usuario.empresa.empresa','paciente.estadocivil','paciente.identificacion','paciente.etnia','paciente.discapacidad','odontrat.tratamientos','consentimientos',
                                            'paciente.municipio','paciente.escolaridad','paciente.religion','paciente.ocupacion','campos','paciente.contrato.contrato.administradora','usuario.prestador','diagnosticos.diagnostico','odontologia.diagnosticos','indice','examenurg.items','servicio.items'])->whereIn('ID_HISTORIA_PACIENTE', $ids)->where(['ID_PACIENTE' => $request->get('pac')])->get();
        else
        $historias = HistoriaPaciente::with(['medicamento.items','laboratorio.items','familiares.ocupacion','familiares.parentesco','historia','parentesco','usuario.empresa.empresa','paciente.estadocivil','paciente.identificacion','paciente.etnia','paciente.discapacidad','odontrat.tratamientos','consentimientos',
                                            'paciente.municipio','paciente.escolaridad','paciente.religion','paciente.ocupacion','campos','paciente.contrato.contrato.administradora','usuario.prestador','diagnosticos.diagnostico','odontologia.diagnosticos','indice','examenurg.items','servicio.items'])->whereIn('ID_HISTORIA', ['1','2','3','6','7','13','14','15','16','18','20','21','24','25','28','30','31','32','35','36','37','39','40','41','42','43','44'])
                                            ->where(['ID_PACIENTE' => $request->get('pac')])->get();    
        for($j = 0; $j < count($historias); $j++) {
            $campos = $historias[$j]->campos;
            for($i = 0; $i < count($campos); $i++) {
                if(($campos[$i]->CAMPO == 'DIAGNOSTICO' || $campos[$i]->CAMPO == 'DIAGNOSTICOD' || $campos[$i]->CAMPO == 'DIAGNOSTICOF' || $campos[$i]->CAMPO == 'DIAGNOSTICOO' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOG' || $campos[$i]->CAMPO == 'DIAGNOSTICOSB' || $campos[$i]->CAMPO == 'DIAGNOSTICODI' || $campos[$i]->CAMPO == 'DIAGNOSTICOAN' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOMA' || $campos[$i]->CAMPO == 'DIAGNOSTICOEV' || $campos[$i]->CAMPO == 'DIAGNOSTICOFI' || $campos[$i]->CAMPO == 'DIAGNOSTICOPPAL' || 
                    $campos[$i]->CAMPO == 'DIAGNOSTICOR1' || $campos[$i]->CAMPO == 'DIAGNOSTICOR2' || $campos[$i]->CAMPO == 'DIAGNOSTICOR3' || $campos[$i]->CAMPO == 'DIAGNOSTICOA' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOP' || $campos[$i]->CAMPO == 'DIAGNOSTICOPE' || $campos[$i]->CAMPO == 'DIAGNOSTICOT' || $campos[$i]->CAMPO == 'DIAGNOSTICOOT' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOPR' || $campos[$i]->CAMPO == 'DIAGNOSTICOHIST') && $campos[$i]->VALOR != '') {
                    $diagnostico = Diagnosticos::find($campos[$i]->VALOR);
                    $historias[$j][$campos[$i]->CAMPO] = $diagnostico->COD_DIAGNOSTICO ." ". $diagnostico->NOM_DIAGNOSTICO;
                }
                else
                if(($campos[$i]->CAMPO == 'DIAGNOSTICO' || $campos[$i]->CAMPO == 'DIAGNOSTICOD' || $campos[$i]->CAMPO == 'DIAGNOSTICOF' || $campos[$i]->CAMPO == 'DIAGNOSTICOO' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOG' || $campos[$i]->CAMPO == 'DIAGNOSTICOSB' || $campos[$i]->CAMPO == 'DIAGNOSTICODI' || $campos[$i]->CAMPO == 'DIAGNOSTICOAN' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOMA' || $campos[$i]->CAMPO == 'DIAGNOSTICOEV' || $campos[$i]->CAMPO == 'DIAGNOSTICOFI' || $campos[$i]->CAMPO == 'DIAGNOSTICOPPAL' || 
                    $campos[$i]->CAMPO == 'DIAGNOSTICOR1' || $campos[$i]->CAMPO == 'DIAGNOSTICOR2' || $campos[$i]->CAMPO == 'DIAGNOSTICOR3' || $campos[$i]->CAMPO == 'DIAGNOSTICOA' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOP' || $campos[$i]->CAMPO == 'DIAGNOSTICOPE' || $campos[$i]->CAMPO == 'DIAGNOSTICOT' || $campos[$i]->CAMPO == 'DIAGNOSTICOOT' ||
                    $campos[$i]->CAMPO == 'DIAGNOSTICOPR' || $campos[$i]->CAMPO == 'DIAGNOSTICOHIST') && $campos[$i]->VALOR == '') {
                    $historias[$j][$campos[$i]->CAMPO] = '';
                }
            }

            /*if($historias[$j]->ID_HISTORIA == 20) {
                $odonfirst = HistoriaPaciente::with(['odontologia'])->where(['ID_PACIENTE' => $historias[$j]->ID_PACIENTE,'ID_HISTORIA' => 20])->where('ID_HISTORIA_PACIENTE', '<', $historias[$j]->ID_HISTORIA_PACIENTE)->orderby('ID_HISTORIA_PACIENTE', 'ASC')->get();
                if(count($odonfirst) > 0) {
                    $historias[$j]['odontologiainc'] = $odonfirst[0]->odontologia;
                }
            }*/
        }
        $user = User::with(['prestador'])->where(['ID_USUARIO' => $request->get('user')])->first();
        $historias[0]['presta'] = ($user->prestador != null ? $user : null);
        return response()->json($historias);
    }

    public function getDiente(Request $request) {
        $diente['diagnostico'] = HistoriaPacienteOdontograma::with(['diagnosticos'])->where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente')])->get();
        $diente['tratamiento'] = HistoriaPacienteOdonTrat::with(['tratamientos'])->where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente')])->get();
        return response()->json($diente);
    }

    public function delDiagt(Request $request) {

        if($request->get('diag') == 1) {
            $odon = HistoriaPacienteOdontograma::where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();
            $odon->DIAGNSOTICO = '0';
            $odon->IMAGE = null;
            $odon->save();

            $trat = HistoriaPacienteOdonTrat::where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();
            $trat->TRATAMIENTO = '0';
            $trat->OBSERVACION = null;
            $trat->EVOLUCION = 0;
            $trat->IMAGE = null;
            $trat->save();
        }
        else
        if($request->get('diag') == 0) {
            $trat = HistoriaPacienteOdonTrat::where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();
            $trat->TRATAMIENTO = '0';
            $trat->OBSERVACION = null;
            $trat->EVOLUCION = 0;
            $trat->IMAGE = null;
            $trat->save();
        }

        

        return response()->json("Diagnósticos y/o Tratamiento eliminado");
    }

    public function Evolucionar(Request $request) {
        $diente['tratamiento'] = HistoriaPacienteOdonTrat::with(['tratamientos'])->where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();
        $diente['diagnostico'] = HistoriaPacienteOdontograma::with(['diagnosticos'])->where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();

        return response()->json($diente);
    }

    public function UpdateEvolucionar(Request $request) {
        $tratamiento = HistoriaPacienteOdonTrat::with(['tratamientos'])->where(['ID_HISTORIA_PACIENTE' => $request->get('hist_id'), 'DIENTE' => $request->get('diente'), 'NAME' => $request->get('super')])->first();

        $tratamiento->OBSERVACION = $request->get('obs');
        $tratamiento->EVOLUCION = $request->get('fin');
        $tratamiento->TRATAMIENTO = $request->get('trat_id');
        $tratamiento->save();

        return response()->json("Tratamiento Evolucionado");
    }

}
