<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Sede;
use App\Models\Consultorio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EmpresaController extends Controller
{

    public function getEmpresas(){
        $empresa = Empresa::with('municipio.dpto')->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($empresa),"recordsFiltered"=> count($empresa),'data' => $empresa]);
    }

    public function ListEmpresas() {
        $empresas = Empresa::all()->toArray();
        return response()->json($empresas);
    }

    public function getEmpresa($id)
    {
        $empresa = Empresa::with('municipio.dpto')->where(['ID_EMPRESA' => $id])->first();
        return response()->json($empresa);
    }

    public function createEmpresa(Request $request)
    {
        $empresa = new Empresa(); 

        $empresa->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $empresa->NUM_TRIBUTARIO = $request->get('NUM_TRIBUTARIO');
        $empresa->NOM_EMPRESA = $request->get('NOM_EMPRESA');
        $empresa->NUM_DOC_REP_LEGAL = $request->get('NUM_DOC_REP_LEGAL');
        $empresa->NOM_REP_LEGAL = $request->get('NOM_REP_LEGAL');
        $empresa->DIREC_EMP = $request->get('DIREC_EMP');
        $empresa->CORREO = $request->get('CORREO');
        $empresa->TELEF = $request->get('TELEF');
        $empresa->WEBSITE = $request->get('WEBSITE');

        $empresa->save();

        if ($handle = opendir('templ')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'logos';  
                    $fileMoved = rename('templ'.$ds.$entry, $storeFolder.$ds."ID(".$empresa->ID_EMPRESA.")".$entry);
                    $empresa->LOGO_EMP = $entry;
                    $empresa->LOGO_SIZE = filesize($storeFolder.$ds."ID(".$empresa->ID_EMPRESA.")".$entry);
                    $empresa->save();
                }
            }
            closedir($handle);
        }

        $sede = new Sede();

        $sede->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $sede->NOM_SEDE = 'SEDE PRINCIPAL';
        $sede->COD_SEDE = $request->get('NUM_TRIBUTARIO');
        $sede->DIREC_SEDE = $request->get('DIREC_EMP');
        $sede->TELEF = $request->get('TELEF');
        $sede->ID_EMPRESA = $empresa->ID_EMPRESA;

        $sede->save();

        $consultorio = new Consultorio(); 

        $consultorio->NOM_CONSULTORIO = 'CONSULTORIO PRINCIPAL';
        $consultorio->COD_CONSULTORIO = $request->get('NUM_TRIBUTARIO');
        $consultorio->ID_ESPECIALIDAD = 112;
        $consultorio->ID_SEDE = $sede->ID_SEDE;
        $consultorio->PISO_CONSUL = 1;

        $consultorio->save();
        
        return response()->json('Empresa creada', 200 );
    }

    public function updateEmpresa(Request $request, $id)
    {
        $empresa = Empresa::find($id);

        $empresa->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $empresa->NUM_TRIBUTARIO = $request->get('NUM_TRIBUTARIO');
        $empresa->NOM_EMPRESA = $request->get('NOM_EMPRESA');
        $empresa->NUM_DOC_REP_LEGAL = $request->get('NUM_DOC_REP_LEGAL');
        $empresa->NOM_REP_LEGAL = $request->get('NOM_REP_LEGAL');
        $empresa->DIREC_EMP = $request->get('DIREC_EMP');
        $empresa->CORREO = $request->get('CORREO');
        $empresa->TELEF = $request->get('TELEF');
        $empresa->WEBSITE = $request->get('WEBSITE');

        if ($handle = opendir('templ')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'logos'; 
                    if($empresa->LOGO_EMP != null) {
                        if(file_exists($storeFolder.$ds."ID(".$id.")".$empresa->LOGO_EMP)) 
                            unlink($storeFolder.$ds."ID(".$id.")".$empresa->LOGO_EMP);
                    } 
                    $fileMoved = rename('templ'.$ds.$entry, $storeFolder.$ds."ID(".$id.")".$entry);
                    $empresa->LOGO_EMP = $entry;
                    $empresa->LOGO_SIZE = filesize($storeFolder.$ds."ID(".$id.")".$entry);
                }
            }
            closedir($handle);
        }
        $empresa->save();

        return response()->json('Empresa Actualizada', 200 );
    }

    public function deleteEmpresa($id)
    {
        $empresa = Empresa::where(['ID_EMPRESA' => $id])->first();
        if($empresa->usuarios != null) {
            for($i = 0; $i < count($empresa->usuarios); $i++) {
                $user = User::find($empresa->usuarios[$i]['ID_USUARIO']);
                $user->delete();
            } 
        }
        if($empresa->LOGO_EMP != null) {
            $ds = DIRECTORY_SEPARATOR; 
            $storeFolder = 'logos';
            if(file_exists($storeFolder.$ds."ID(".$empresa->ID_EMPRESA.")".$empresa->LOGO_EMP)) 
                unlink($storeFolder.$ds."ID(".$empresa->ID_EMPRESA.")".$empresa->LOGO_EMP);
        } 
        $empresa->delete();
        return response()->json('Empresa Eliminada', 200 );
    }

    public function logo(Request $request) {
        if ($handle = opendir('templ')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR;
                    unlink('templ'.$ds.$entry);
                }
            }
            closedir($handle);
        }
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'templ';         
        if(!empty($_FILES)) {   
            $tempFile = $_FILES['file']['tmp_name'];     
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath.$_FILES['file']['name'];
            move_uploaded_file($tempFile,$targetFile);          
        }
        return response()->json("Logo asignado", 200);
    }

    public function removeLogo(Request $request) {
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'templ';
        $targetPath = $storeFolder . $ds;
        $targetFile = $targetPath.$request->get("logo");
        if($request->get("id") == 0 && file_exists($targetFile)) {
            unlink($targetFile);
            return response()->json("Logo Eliminado", 200);
        }
        else {
            $storeFolder = 'logos';
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath."ID(".$request->get("id").")".$request->get("logo");
            if(file_exists($targetFile)) {
                unlink($targetFile);
                if($request->get("id") != 0){
                    $empresa = Empresa::find($request->get("id"));
                    $empresa->LOGO_EMP = null;
                    $empresa->LOGO_SIZE = null;
                    $empresa->save();
                }
            }
            return response()->json("Logo Eliminado", 200);
        }
    }
}
