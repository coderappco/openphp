<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ContratoController extends Controller
{

    public function getContratos(){
        $contratos = Contrato::with('administradora')->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($contratos),"recordsFiltered"=> count($contratos),'data' => $contratos]);
    }

    public function ListContratos() {
        $contratos = Contrato::all()->toArray();
        return response()->json($contratos);
    }

    public function getContrato($id)
    {
        $contrato = Contrato::with('administradora')->where(['ID_CONTRATO' => $id])->first();
        return response()->json($contrato);
    }

    public function getAdminContrato(Request $request)
    {
        $contrato = Contrato::where(['ID_ADMINISTRADORA' => $request->get('admin')])->get();
        return response()->json($contrato);
    }

    public function createContrato(Request $request)
    {
        $contrato = new Contrato(); 
        
        $fechas = explode(' a', $request->get('FEC_INICIO'));
        $fin = explode(' ', $fechas[1]);

        $inicio = Carbon::createFromFormat('d/m/Y', $fechas[0]);
        $final = Carbon::createFromFormat('d/m/Y', $fin[1]);
        $contrato->ID_ADMINISTRADORA = $request->get('ID_ADMINISTRADORA');
        $contrato->COD_CONTRATO = $request->get('COD_CONTRATO');
        $contrato->NOM_CONTRATO = $request->get('NOM_CONTRATO');
        $contrato->FEC_INICIO = date('Y-m-d',strtotime($inicio));
        $contrato->FEC_FINAL = date('Y-m-d',strtotime($final));
        $contrato->ID_REGIMEN = $request->get('ID_REGIMEN');
        $contrato->TIPO_PAGO = $request->get('TIPO_PAGO');
        $contrato->TIPO_FACTURA = $request->get('TIPO_FACTURA');
        $contrato->NUM_AFILIADO = $request->get('NUM_AFILIADO');
        $contrato->VALOR_TOTAL = $request->get('VALOR_TOTAL');
        $contrato->VALOR_ALERTA = $request->get('VALOR_ALERTA');
        $contrato->VALOR_MENSUAL = $request->get('VALOR_MENSUAL');
        $contrato->VALOR_MENSUAL_VAL = $request->get('VALOR_MENSUAL_VAL');
        $contrato->OBS_CONTRATO = $request->get('OBS_CONTRATO');

        $contrato->save();
        
        return response()->json('Contrato creado', 200 );
    }

    public function updateContrato(Request $request, $id)
    {
        $contrato = Contrato::find($id);

        $fechas = explode(' a', $request->get('FEC_INICIO'));
        $fin = explode(' ', $fechas[1]);

        $inicio = Carbon::createFromFormat('d/m/Y', $fechas[0]);
        $final = Carbon::createFromFormat('d/m/Y', $fin[1]);
        $contrato->ID_ADMINISTRADORA = $request->get('ID_ADMINISTRADORA');
        $contrato->COD_CONTRATO = $request->get('COD_CONTRATO');
        $contrato->NOM_CONTRATO = $request->get('NOM_CONTRATO');
        $contrato->FEC_INICIO = date('Y-m-d',strtotime($inicio));
        $contrato->FEC_FINAL = date('Y-m-d',strtotime($final));
        $contrato->ID_REGIMEN = $request->get('ID_REGIMEN');
        $contrato->TIPO_PAGO = $request->get('TIPO_PAGO');
        $contrato->TIPO_FACTURA = $request->get('TIPO_FACTURA');
        $contrato->NUM_AFILIADO = $request->get('NUM_AFILIADO');
        $contrato->VALOR_TOTAL = $request->get('VALOR_TOTAL');
        $contrato->VALOR_ALERTA = $request->get('VALOR_ALERTA');
        $contrato->VALOR_MENSUAL = $request->get('VALOR_MENSUAL');
        $contrato->VALOR_MENSUAL_VAL = $request->get('VALOR_MENSUAL_VAL');
        $contrato->OBS_CONTRATO = $request->get('OBS_CONTRATO');

        $contrato->save();

        return response()->json('Contrato Actualizado', 200 );
    }

    public function deleteContrato($id)
    {
        $contrato = Contrato::find($id);
        $contrato->delete();
        return response()->json('Contrato Eliminado', 200 );
    }
}
