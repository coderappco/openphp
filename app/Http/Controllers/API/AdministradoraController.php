<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Administradora;
use App\Models\AdminOrdenImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdministradoraController extends Controller
{

    public function getAdministradoras(){
        $administradoras = Administradora::with(['municipio.dpto','identificacion'])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($administradoras),"recordsFiltered"=> count($administradoras),'data' => $administradoras]);
    }

    public function ListAdministradoras() {
        $administradoras = Administradora::all()->toArray();
        return response()->json($administradoras);
    }

    public function getAdministradora($id)
    {
        $administradora = Administradora::with('municipio.dpto')->where(['ID_ADMINISTRADORA' => $id])->first();
        return response()->json($administradora);
    }

    public function createAdministradora(Request $request)
    {
        $administradora = new Administradora(); 

        $administradora->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $administradora->COD_ADMINISTRADORA = $request->get('COD_ADMINISTRADORA');
        $administradora->NOM_ADMINISTRADORA = $request->get('NOM_ADMINISTRADORA');
        $administradora->ID_TIPO_DOCUMENTO = $request->get('ID_TIPO_DOCUMENTO');
        $administradora->NUM_TRIB = $request->get('NUM_TRIB');
        $administradora->NUM_IDEN_REP_LEGAL = $request->get('NUM_IDEN_REP_LEGAL');
        $administradora->NOM_REP_LEGAL = $request->get('NOM_REP_LEGAL');
        $administradora->DIREC_ADMINISTRADORA = $request->get('DIREC_ADMINISTRADORA');
        $administradora->CORREO = $request->get('CORREO');
        $administradora->TELEF = $request->get('TELEF');
        $administradora->WEBSITE = $request->get('WEBSITE');
        $administradora->TIPO_ADMINISTRADORA = $request->get('TIPO_ADMINISTRADORA');

        $administradora->save();
        
        return response()->json('Administradora creada', 200 );
    }

    public function updateAdministradora(Request $request, $id)
    {
        $administradora = Administradora::find($id);

        $administradora->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $administradora->COD_ADMINISTRADORA = $request->get('COD_ADMINISTRADORA');
        $administradora->NOM_ADMINISTRADORA = $request->get('NOM_ADMINISTRADORA');
        $administradora->ID_TIPO_DOCUMENTO = $request->get('ID_TIPO_DOCUMENTO');
        $administradora->NUM_TRIB = $request->get('NUM_TRIB');
        $administradora->NUM_IDEN_REP_LEGAL = $request->get('NUM_IDEN_REP_LEGAL');
        $administradora->NOM_REP_LEGAL = $request->get('NOM_REP_LEGAL');
        $administradora->DIREC_ADMINISTRADORA = $request->get('DIREC_ADMINISTRADORA');
        $administradora->CORREO = $request->get('CORREO');
        $administradora->TELEF = $request->get('TELEF');
        $administradora->WEBSITE = $request->get('WEBSITE');
        $administradora->TIPO_ADMINISTRADORA = $request->get('TIPO_ADMINISTRADORA');

        $administradora->save();

        return response()->json('Administradora Actualizada', 200 );
    }

    public function deleteAdministradora($id)
    {
        $administradora = Administradora::find($id);
        $administradora->delete();
        return response()->json('Administradora Eliminada', 200 );
    }

    public function getOrderI(Request $request){
        $order = AdminOrdenImport::where(['ID_ADMINISTRADORA' => $request->get('admin')])->orderby('POS', 'ASC')->get();
        $resultado = [];
        for($i = 0; $i < count($order); $i++) {
            $resultado[$i] = ['ident' => $order[$i]->IDENTIFICADOR, 'desc' => $order[$i]->DESCRIPCION];
        }
        if(count($order) == 0) {
            $ds = DIRECTORY_SEPARATOR;
            $j = 0;
            foreach(file(public_path().$ds.'ordenadmin.txt') as $line) {
                $datos = explode(',', $line);
                $ordenadmin = new AdminOrdenImport();
                $ordenadmin->ID_ADMINISTRADORA = $request->get('admin');
                $ordenadmin->IDENTIFICADOR = $datos[0];
                $ordenadmin->POS = $datos[1];
                $ordenadmin->DESCRIPCION = $datos[2];
                $ordenadmin->save();
                $resultado[$j] = ['ident' => $ordenadmin->IDENTIFICADOR, 'desc' => $ordenadmin->DESCRIPCION];
                $j++;
            }
        }
        return response()->json($resultado);
    }
}
