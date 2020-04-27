<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use App\Models\PacienteContrato;
use App\Models\OrdenImport;
use App\Models\TipoIdentificacion;
use App\Models\Municipios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PacienteController extends Controller
{

    public function getPacientes(){
        $pacientes = Paciente::with(['municipio.dpto','identificacion'])->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($pacientes),"recordsFiltered"=> count($pacientes),'data' => $pacientes]);
    }

    public function Search(Request $request)
    {
        $search = (null !== $request->get('q')) ? $request->get('q') : '';
        $pacientes = null;
        if($search != '')
            $pacientes = Paciente::with(['identificacion'])->where(
                function($q) use ($search) {
                    $q->orwhere('PRIMER_NOMBRE', 'like', "%$search%");
                    $q->orwhere('SEGUNDO_NOMBRE', 'like', "%$search%");
                    $q->orwhere('PRIMER_APELLIDO', 'like', "%$search%");
                    $q->orwhere('SEGUNDO_APELLIDO', 'like', "%$search%");
                    $q->orwhere('NUM_DOC', 'like', "%$search%");
                    $q->orwhere('ID_PACIENTE', '=', "$search");
                })->get();
        else
            $pacientes = Paciente::with(['identificacion'])->get();

        $resultado = [];
        foreach ($pacientes as $key => $value) {
            $nombre = $value['PRIMER_NOMBRE'] . ($value['SEGUNDO_NOMBRE'] != null ? " ".$value['SEGUNDO_NOMBRE'] : "");
            $apellidos = $value['PRIMER_APELLIDO'] . ($value['SEGUNDO_APELLIDO'] != null ? " ".$value['SEGUNDO_APELLIDO'] : "");
            $resultado[$key] = ['id' => $value['ID_PACIENTE'], 'text' => $value['identificacion']['COD_TIPO_IDENTIFICACION'].$value['NUM_DOC']." ".$nombre." ".$apellidos];
        }
        return response()->json(['results' => $resultado]);
    }

    public function ListPacientes() {
        $pacientes = Paciente::with(['municipio.dpto'])->get();
        return response()->json($pacientes);
    }

    public function getPaciente($id)
    {
        $arr = explode(',', $id);
        if(count($arr) == 1) {
            $paciente = Paciente::with(['identificacion','ocupacion','autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora','estadocivil'])->where(['ID_PACIENTE' => $id])->first();
            return response()->json($paciente);
        }
        else {
            $arreglo = [];
            $paciente = null;
            for($i = 0; $i < count($arr); $i++) {
                $paciente = Paciente::with(['identificacion','ocupacion','autorizacion.servicios.item','municipio.dpto','contrato.contrato.administradora','estadocivil'])->where(['ID_PACIENTE' => $arr[$i]])->first();
                $arreglo[$i] = $paciente;
                $paciente = null;
            }
            return response()->json($arreglo);
        }
    }

    public function getPNotificacion($id)
    {
        $paciente = Paciente::where(['ID_PACIENTE' => $id])->first();
        return response()->json($paciente->NOTIFICACION);
    }

    public function updatePNotificacion(Request $request, $id)
    {
        $paciente = Paciente::where(['ID_PACIENTE' => $id])->first();
        $paciente->NOTIFICACION = $request->get('noti');
        $paciente->save();
        return response()->json("Actualizada notificación", 200);
    }

    public function createPaciente(Request $request)
    {
        $paciente = new Paciente(); 

        $FECHA_NAC = $request->get('FECHA_NAC') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_NAC')) : null;
        $FECHA_AFIL = $request->get('FECHA_AFIL') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_AFIL')) : null;
        $FECHA_SISBEN = $request->get('FECHA_SISBEN') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_SISBEN')) : null;

        $paciente->ID_TIPO_DOC = $request->get('ID_TIPO_DOC');
        $paciente->NUM_DOC = $request->get('NUM_DOC');
        $paciente->FECHA_NAC = $request->get('FECHA_NAC') != null ? date('Y-m-d',strtotime($FECHA_NAC)) : null;
        $paciente->GENERO = $request->get('GENEROS');
        $paciente->PRIMER_NOMBRE = $request->get('PRIMER_NOMBRE');
        $paciente->SEGUNDO_NOMBRE = $request->get('SEGUNDO_NOMBRE');
        $paciente->PRIMER_APELLIDO = $request->get('PRIMER_APELLIDO');
        $paciente->SEGUNDO_APELLIDO = $request->get('SEGUNDO_APELLIDO');
        $paciente->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $paciente->ZONA = $request->get('ZONA');
        $paciente->BARRIO = $request->get('BARRIO');
        $paciente->TELEF = $request->get('TELEF');
        $paciente->MOVIL = $request->get('MOVIL');
        $paciente->CORREO = $request->get('CORREO');
        $paciente->DIREC_PACIENTE = $request->get('DIREC_PACIENTE');
        $paciente->ID_ESTADO_CIVIL = $request->get('ID_ESTADO_CIVIL');
        $paciente->ID_GRP_SANG = $request->get('ID_GRP_SANG');
        $paciente->ID_ESCOLARIDAD = $request->get('ID_ESCOLARIDAD');
        $paciente->ID_ETNIA = $request->get('ID_ETNIA');
        $paciente->ID_OCUPACION = $request->get('ID_OCUPACION');
        $paciente->ID_DISCAPACIDAD = $request->get('ID_DISCAPACIDAD');
        $paciente->ID_RELIGION = $request->get('ID_RELIGION');
        $paciente->GESTACION = ($request->get('GENEROS') != null && ($request->get('GENEROS') == 1 || $request->get('GENEROS') == 3) ? 2 : ( $request->get('GENEROS') == null ? 1 : $request->get('GESTACION')));
        $paciente->ID_TIPO_AFIL = $request->get('ID_TIPO_AFIL');
        $paciente->FECHA_AFIL = $request->get('FECHA_AFIL') != null ? date('Y-m-d',strtotime($FECHA_AFIL)) : null;
        $paciente->NUM_SISBEN = $request->get('NUM_SISBEN');
        $paciente->FECHA_SISBEN = $request->get('FECHA_SISBEN') != null ? date('Y-m-d',strtotime($FECHA_SISBEN)) : null;
        $paciente->ID_REGIMEN = $request->get('ID_REGIMEN');
        $paciente->DESPLAZADO = $request->get('DATOS')[0];
        $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
        $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
        $paciente->PENSIONADO = $request->get('DATOS')[1];
        $paciente->LGBTI = $request->get('DATOS')[2];
        $paciente->ACTIVO = $request->get('ACTIVO');
        $paciente->CONTRATO = $request->get('CONTRATO') != null ? 1 : 0;
        $paciente->NOTIFICACION = $request->get('NOTIFICACION');
        $paciente->COD_APORTANTE = $request->get('COD_APORTANTE');
        $paciente->NOM_APORTANTE = $request->get('NOM_APORTANTE');

        $paciente->save();

        if($request->get('CONTRATO') != null) {
            $pacientecontrato = new PacienteContrato();
            $pacientecontrato->ID_PACIENTE = $paciente->ID_PACIENTE;
            $pacientecontrato->ID_CONTRATO = $request->get('CONTRATO');
            $pacientecontrato->save();
        }

        if ($handle = opendir('tempp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'pacientes';  
                    $fileMoved = rename('tempp'.$ds.$entry, $storeFolder.$ds."ID(".$paciente->ID_PACIENTE.")".$entry);
                    $paciente->PHOTO = $entry;
                    $paciente->PHOTO_SIZE = filesize($storeFolder.$ds."ID(".$paciente->ID_PACIENTE.")".$entry);
                    $paciente->save();
                }
            }
            closedir($handle);
        }
        
        return response()->json('Paciente registrado', 200 );
    }

    public function updatePaciente(Request $request, $id)
    {
        $paciente = Paciente::find($id);
        $contrato = $paciente->contrato;

        $FECHA_NAC = ($request->get('FECHA_NAC') != null && $request->get('FECHA_NAC') != 'Invalid date') ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_NAC')) : null;
        $FECHA_AFIL = ($request->get('FECHA_AFIL') != null && $request->get('FECHA_AFIL') != 'Invalid date') ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_AFIL')) : null;
        $FECHA_SISBEN = ($request->get('FECHA_SISBEN') != null && $request->get('FECHA_AFIL') != 'Invalid date') ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_SISBEN')) : null;

        $paciente->ID_TIPO_DOC = $request->get('ID_TIPO_DOC');
        $paciente->NUM_DOC = $request->get('NUM_DOC');
        $paciente->FECHA_NAC = ($request->get('FECHA_NAC') != null && $request->get('FECHA_NAC') != 'Invalid date') ? date('Y-m-d',strtotime($FECHA_NAC)) : null;
        $paciente->GENERO = $request->get('GENEROS');
        $paciente->PRIMER_NOMBRE = $request->get('PRIMER_NOMBRE');
        $paciente->SEGUNDO_NOMBRE = $request->get('SEGUNDO_NOMBRE');
        $paciente->PRIMER_APELLIDO = $request->get('PRIMER_APELLIDO');
        $paciente->SEGUNDO_APELLIDO = $request->get('SEGUNDO_APELLIDO');
        $paciente->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $paciente->ZONA = $request->get('ZONA');
        $paciente->BARRIO = $request->get('BARRIO');
        $paciente->TELEF = $request->get('TELEF');
        $paciente->MOVIL = $request->get('MOVIL');
        $paciente->CORREO = $request->get('CORREO');
        $paciente->DIREC_PACIENTE = $request->get('DIREC_PACIENTE');
        $paciente->ID_ESTADO_CIVIL = $request->get('ID_ESTADO_CIVIL');
        $paciente->ID_GRP_SANG = $request->get('ID_GRP_SANG');
        $paciente->ID_ESCOLARIDAD = $request->get('ID_ESCOLARIDAD');
        $paciente->ID_ETNIA = $request->get('ID_ETNIA');
        $paciente->ID_OCUPACION = $request->get('ID_OCUPACION');
        $paciente->ID_DISCAPACIDAD = $request->get('ID_DISCAPACIDAD');
        $paciente->ID_RELIGION = $request->get('ID_RELIGION');
        $paciente->GESTACION = $request->get('GESTACION');
        $paciente->ID_TIPO_AFIL = $request->get('ID_TIPO_AFIL');
        $paciente->FECHA_AFIL = ($request->get('FECHA_AFIL') != null && $request->get('FECHA_AFIL') != 'Invalid date') ? date('Y-m-d',strtotime($FECHA_AFIL)) : null;
        $paciente->NUM_SISBEN = $request->get('NUM_SISBEN');
        $paciente->FECHA_SISBEN = ($request->get('FECHA_SISBEN') != null && $request->get('FECHA_AFIL') != 'Invalid date') ? date('Y-m-d',strtotime($FECHA_SISBEN)) : null;
        $paciente->ID_REGIMEN = $request->get('ID_REGIMEN');
        $paciente->DESPLAZADO = $request->get('DATOS')[0];
        $paciente->VIC_MALTRATO = $request->get('DATOS')[3];
        $paciente->VIC_CONF_ARMADO = $request->get('DATOS')[4];
        $paciente->PENSIONADO = $request->get('DATOS')[1];
        $paciente->LGBTI = $request->get('DATOS')[2];
        $paciente->ACTIVO = $request->get('ACTIVO');
        $paciente->CONTRATO = $request->get('CONTRATO') != null ? 1 : 0;
        $paciente->NOTIFICACION = $request->get('NOTIFICACION');
        $paciente->COD_APORTANTE = $request->get('COD_APORTANTE');
        $paciente->NOM_APORTANTE = $request->get('NOM_APORTANTE');

        if($request->get('CONTRATO') != null) {
            $pacientecontrato = $contrato != null ? $contrato : new PacienteContrato();
            $pacientecontrato->ID_PACIENTE = $paciente->ID_PACIENTE;
            $pacientecontrato->ID_CONTRATO = $request->get('CONTRATO');
            $pacientecontrato->save();
        }
        else {
            if($contrato != null)
                $contrato->delete();
        }

        if ($handle = opendir('tempp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'pacientes'; 
                    if($paciente->PHOTO != null) {
                        if(file_exists($storeFolder.$ds."ID(".$id.")".$paciente->PHOTO)) 
                            unlink($storeFolder.$ds."ID(".$id.")".$paciente->PHOTO);
                    } 
                    $fileMoved = rename('tempp'.$ds.$entry, $storeFolder.$ds."ID(".$id.")".$entry);
                    $paciente->PHOTO = $entry;
                    $paciente->PHOTO_SIZE = filesize($storeFolder.$ds."ID(".$id.")".$entry);
                }
            }
            closedir($handle);
        }
        $paciente->save();

        return response()->json('Paciente Actualizado', 200 );
    }

    public function updatePacienteFecha(Request $request, $id)
    {
        $paciente = Paciente::find($id);

        $FECHA_NAC = Carbon::createFromFormat('d/m/Y', $request->get('FECHA_NAC'));

        $paciente->FECHA_NAC = date('Y-m-d',strtotime($FECHA_NAC));
        $paciente->save();

        return response()->json('Paciente Actualizado', 200 );
    }

    public function createPacientec(Request $request)
    {
        $paciente = new Paciente(); 

        $FECHA_NAC = $request->get('FECHA_NAC') != null ? Carbon::createFromFormat('d/m/Y', $request->get('FECHA_NAC')) : null;

        $paciente->ID_TIPO_DOC = $request->get('ID_TIPO_DOC');
        $paciente->NUM_DOC = $request->get('NUM_DOC');
        $paciente->PRIMER_NOMBRE = $request->get('PRIMER_NOMBRE');
        $paciente->SEGUNDO_NOMBRE = $request->get('SEGUNDO_NOMBRE');
        $paciente->PRIMER_APELLIDO = $request->get('PRIMER_APELLIDO');
        $paciente->SEGUNDO_APELLIDO = $request->get('SEGUNDO_APELLIDO');
        $paciente->FECHA_NAC = $request->get('FECHA_NAC') != null ? date('Y-m-d',strtotime($FECHA_NAC)) : null;
        $paciente->ID_MUNICIPIO = $request->get('ID_MUNICIPIO');
        $paciente->ZONA = 1;
        $paciente->ID_ESTADO_CIVIL = $request->get('ID_ESTADO_CIVIL');
        $paciente->ID_GRP_SANG = $request->get('ID_GRP_SANG');
        $paciente->ID_ESCOLARIDAD = $request->get('ID_ESCOLARIDAD');
        $paciente->ID_ETNIA = $request->get('ID_ETNIA');
        $paciente->ID_OCUPACION = $request->get('ID_OCUPACION');
        $paciente->ID_DISCAPACIDAD = $request->get('ID_DISCAPACIDAD');
        $paciente->ID_RELIGION = $request->get('ID_RELIGION');
        $paciente->GESTACION = 2;
        $paciente->ID_TIPO_AFIL = $request->get('ID_TIPO_AFIL');
        $paciente->ID_REGIMEN = $request->get('ID_REGIMEN');
        $paciente->DESPLAZADO = 0;
        $paciente->VIC_MALTRATO = 0;
        $paciente->VIC_CONF_ARMADO = 0;
        $paciente->PENSIONADO = 0;
        $paciente->LGBTI = 0;
        $paciente->ACTIVO = 1;
        $paciente->CONTRATO = 0;
        $paciente->NOTIFICACION = 1;

        $paciente->save();
        
        return response()->json($paciente);
    }

    public function deletePaciente($id)
    {
        $paciente = Paciente::find($id);
        if($paciente->PHOTO != null) {
            $ds = DIRECTORY_SEPARATOR; 
            $storeFolder = 'pacientes';
            if(file_exists($storeFolder.$ds."ID(".$paciente->ID_PACIENTE.")".$paciente->PHOTO)) 
                unlink($storeFolder.$ds."ID(".$paciente->ID_PACIENTE.")".$paciente->PHOTO);
        } 
        $paciente->delete();
        return response()->json('Paciente Eliminado', 200 );
    }

    public function Importar(Request $request) {
        if ($handle = opendir('importar')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR;
                    unlink('importar'.$ds.$entry);
                }
            }
            closedir($handle);
        }
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'importar';         
        if(!empty($_FILES)) {   
            $tempFile = $_FILES['file']['tmp_name'];     
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath.$_FILES['file']['name'];
            move_uploaded_file($tempFile,$targetFile);          
        }
        return response()->json("Fichero Cargado", 200);
    }

    public function removeArchivos(Request $request) {
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'importar';
        $targetPath = $storeFolder . $ds;
        $targetFile = $targetPath.$request->get("name");
        if(file_exists($targetFile)) {
            unlink($targetFile);
            return response()->json("Archivo Eliminado", 200);
        }
    }

    public function importarArchivos(Request $request) {
        $archivo = '';
        $update = 0;
        $create = 0;
        $orden = 0;
        $header = $request->get('HEADER') == 2 ? false : true;
        if ($handle = opendir('importar')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'importar';  
                    $archivo = $ds.$storeFolder.$ds.$entry;
                }
            }
            closedir($handle);
        }
        if($archivo != '') {
            $orden = $request->get('ORDEN');
            $pos = 0;
            for($i = 0; $i < count($orden); $i++) {
                if($orden[$i]['ident'] == 'NUM_DOC') {
                    $pos = $i;
                    break;
                }
            }
            $separador = $request->get('SEPARADOR') == 1 ? ',' : ';';
            if($request->get('ID_ADMINISTRADORA') == '' || $request->get('ID_ADMINISTRADORA') == null) {
                foreach(file(public_path().$archivo) as $line) {
                    if($header == false) {
                        $datos = explode($separador, $line);
                        $paciente = Paciente::where(['NUM_DOC' => $datos[$pos]])->first();
                        if($paciente != null)
                            $update++;
                        else
                            $create++;
                        $paciente = $paciente != null ? $paciente : new Paciente();
                        for($i = 0; $i < count($orden); $i++) {
                            $key = $orden[$i]['ident'];
                            if($key != 'ID_TIPO_DOC' && $key != 'FECHA_NAC' && $key != 'GENERO' && $key != 'ID_MUNICIPIO' && $key != 'ZONA' && $key != 'MUNICIPIO') {
                                $paciente->$key = $datos[$i];
                            }
                            else
                            if($key == 'ID_TIPO_DOC') {
                                $tipo = TipoIdentificacion::where(['COD_TIPO_IDENTIFICACION' => $datos[$i]])->first();
                                $paciente->$key = $tipo->ID_TIPO_IDENTIFICACION;
                            }
                            else
                            if($key == 'FECHA_NAC') {
                                $fecha_nac = Carbon::createFromFormat('d/m/Y', $datos[$i]);
                                $paciente->$key = date('Y-m-d',strtotime($fecha_nac));
                            }
                            else
                            if($key == 'GENERO')
                                $paciente->$key = $datos[$i] == 'M' ? 1 : ($datos[$i] == 'F' ? 2 : 3);
                            else
                            if($key == 'ZONA')
                                $paciente->$key = ($datos[$i] == 'U' || $datos[$i] == 'BARRIO ZONA URBANA') ? 1 : 2;
                            else
                            if($key == 'ID_MUNICIPIO') {
                                $muni = Municipios::where(['NOM_MUNICIPIO' => $datos[$i]])->first();
                                $paciente->$key = $muni != null ? $muni->ID_MUNICIPIO : 1127;
                            }
                            else
                            if($key == 'ID_MUNICIPIO') {
                                $muni = Municipios::where(['COD_MUNICIPIO' => $datos[$i]])->first();
                                $paciente->$key = $muni != null ? $muni->ID_MUNICIPIO : 1127;
                            }
                            else
                            if($key == 'MUNICIPIO') {
                                $muni = Municipios::where(['NOM_MUNICIPIO' => $datos[$i]])->first();
                                $paciente->ID_MUNICIPIO = $muni != null ? $muni->ID_MUNICIPIO : 1127;
                            }
                        }
                        $paciente->ID_ESTADO_CIVIL = 6;
                        $paciente->ID_GRP_SANG = 1;
                        $paciente->ID_ESCOLARIDAD = 1;
                        $paciente->ID_ETNIA = 6;
                        $paciente->ID_OCUPACION = 511;
                        $paciente->ID_DISCAPACIDAD = 5;
                        $paciente->ID_RELIGION = 6;
                        $paciente->GESTACION = 2;
                        $paciente->ID_TIPO_AFIL = 7;
                        $paciente->ID_REGIMEN = 5;
                        $paciente->DESPLAZADO = 0;
                        $paciente->VIC_MALTRATO = 0;
                        $paciente->VIC_CONF_ARMADO = 0;
                        $paciente->PENSIONADO = 0;
                        $paciente->LGBTI = 0;
                        $paciente->ACTIVO = 1;
                        $paciente->CONTRATO = 1;
                        $paciente->NOTIFICACION = 1;     

                        $paciente->save();
                    }
                    else
                        $header = false;
                }
            }
            else {
                foreach(file(public_path().$archivo) as $line) {
                    if($header == false) {
                        $datos = explode($separador, $line);
                        $paciente = Paciente::where(['NUM_DOC' => $datos[$pos]])->first();
                        if($paciente != null)
                            $update++;
                        else
                            $create++;
                        $paciente = $paciente != null ? $paciente : new Paciente();
                        for($i = 0; $i < count($orden); $i++) {
                            if($i == count($datos))
                                break;
                            $key = $orden[$i]['ident'];
                            if($key != 'ID_TIPO_DOC' && $key != 'FECHA_NAC' && $key != 'GENERO' && $key != 'ID_MUNICIPIO' && $key != 'ZONA' && $key != 'DEPARTAMENTO' && $key != 'MUNICIPIO' 
                                && $key != 'FECHA_AFIL' && $key != 'GRUPO_P' && $key != 'GRUPO_P_DESC' && $key != 'NIVEL_SISIBEN' && $key != 'FICHA_SISIBEN' && $key != 'PUNTAJE_SISIBEN' 
                                && $key != 'DESC_ESTADO_CIVIL' && $key != 'DESC_DISCAPACIDAD' && $key != 'TIPO_DISCAPACIDAD' && $key != 'DISCAPACIDAD' && $key != 'DESC_TIPO_DISCAPACIDAD' && $key != 'MUNICIPIO'
                                && $key != 'DESC_ETNIA' && $key != 'COD_PARENTESCO' && $key != 'DESC_PARENTESCO' && $key != 'TIPO_AFILIADO'  && $key != 'DESC_TIPO_AFILIADO' && $key != 'EDAD' && $key != 'ESTADO'
                                && $key != 'MODALIDAD' && $key != 'TIP_DOC_BDUA' && $key != 'NUM_DOC_BDUA' && $key != 'AFL_ID' && $key != 'ID_ESTADO_CIVIL' && $key != 'COD_ADMIN' && $key != 'AUTO') {
                                $paciente->$key = $datos[$i];
                            }
                            else
                            if($key == 'ID_TIPO_DOC') {
                                $tipo = TipoIdentificacion::where(['COD_TIPO_IDENTIFICACION' => $datos[$i]])->first();
                                $paciente->$key = $tipo->ID_TIPO_IDENTIFICACION;
                            }
                            else
                            if($key == 'FECHA_NAC') {
                                $day = explode('-', $datos[$i]);
                                if(count($day) > 1)
                                    $fecha_nac = Carbon::parse($datos[$i+1]);
                                else
                                    $fecha_nac = Carbon::createFromFormat('d/m/Y', $datos[$i]);
                                $paciente->$key = date('Y-m-d',strtotime($fecha_nac));
                            }
                            else
                            if($key == 'GENERO')
                                $paciente->$key = $datos[$i] == 'M' ? 1 : ($datos[$i] == 'F' ? 2 : 3);
                            else
                            if($key == 'ZONA')
                                $paciente->$key = ($datos[$i] == 'U' || $datos[$i] == 'BARRIO ZONA URBANA') ? 1 : 2;
                            else
                            if($key == 'ID_MUNICIPIO') {
                                $muni = Municipios::where(['COD_MUNICIPIO' => $datos[$i]])->first();
                                $paciente->$key = $muni != null ? $muni->ID_MUNICIPIO : 1127;
                            }
                            else
                            if($key == 'MUNICIPIO') {
                                $muni = Municipios::where(['NOM_MUNICIPIO' => $datos[$i]])->first();
                                $paciente->ID_MUNICIPIO = $muni != null ? $muni->ID_MUNICIPIO : 1127;
                            }
                            else
                            if($key == 'FECHA_AFIL') {
                                $day = explode('-', $datos[$i]);
                                if(count($day) > 1)
                                    $fecha_afil = Carbon::parse($datos[$i]);
                                else
                                    $fecha_afil = Carbon::createFromFormat('d/m/Y', $datos[$i]);
                                $paciente->$key = date('Y-m-d',strtotime($fecha_afil));
                            }
                            else
                            if($key == 'ID_ESTADO_CIVIL') {
                                $str = $datos[$i];
                                if(strlen($str) == 1 && ($str >= 1 && $str <= 6))
                                    $paciente->$key = $datos[$i];
                            }
                        }
                        $paciente->ID_GRP_SANG = 1;
                        $paciente->ID_ESCOLARIDAD = 1;
                        $paciente->ID_OCUPACION = 511;
                        $paciente->ID_DISCAPACIDAD = 5;
                        $paciente->ID_RELIGION = 6;
                        $paciente->GESTACION = 2;
                        $paciente->ID_TIPO_AFIL = 7;
                        $paciente->ID_REGIMEN = 5;
                        $paciente->DESPLAZADO = 0;
                        $paciente->VIC_MALTRATO = 0;
                        $paciente->VIC_CONF_ARMADO = 0;
                        $paciente->PENSIONADO = 0;
                        $paciente->LGBTI = 0;
                        $paciente->ACTIVO = 1;
                        $paciente->CONTRATO = 0;
                        $paciente->NOTIFICACION = 1;
                        $paciente->ID_ETNIA = ($paciente->ID_ETNIA != null & $paciente->ID_ETNIA != null) ? $paciente->ID_ETNIA : 6;
                        $paciente->ID_ESTADO_CIVIL = ($paciente->ID_ESTADO_CIVIL != '' && $paciente->ID_ESTADO_CIVIL != null) ? $paciente->ID_ESTADO_CIVIL : 6;
                        $paciente->save();

                        $contrato = $request->get('CONTRATO');
                        $pacientecontrato = PacienteContrato::where(['ID_PACIENTE' => $paciente->ID_PACIENTE, 'ID_CONTRATO' => $contrato])->first();
                        $pacientecontrato = $pacientecontrato != null ? $pacientecontrato : new PacienteContrato();
                        $pacientecontrato->ID_PACIENTE = $paciente->ID_PACIENTE;
                        $pacientecontrato->ID_CONTRATO = $contrato;
                        $pacientecontrato->save();
                    }
                    else
                        $header = false;
                }
            }
            if ($handle = opendir('importar')) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        $ds = DIRECTORY_SEPARATOR; 
                        $storeFolder = 'importar';  
                        unlink($storeFolder.$ds.$entry);
                    }
                }
                closedir($handle);
            }
            return response()->json(['update' => $update, 'create' => $create], 200);
        }
        else
            return response()->json("Fichero no Cargado", 500);
    }

    public function photos(Request $request) {
        if ($handle = opendir('tempp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR;
                    unlink('tempp'.$ds.$entry);
                }
            }
            closedir($handle);
        }
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'tempp';         
        if(!empty($_FILES)) {   
            $tempFile = $_FILES['file']['tmp_name'];     
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath.$_FILES['file']['name'];
            move_uploaded_file($tempFile,$targetFile);          
        }
        return response()->json("Foto asignada", 200);
    }

    public function removePhoto(Request $request) {
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'tempp';
        $targetPath = $storeFolder . $ds;
        $targetFile = $targetPath.$request->get("photo");
        if($request->get("id") == 0 && file_exists($targetFile)) {
            unlink($targetFile);
            return response()->json("Foto Eliminada", 200);
        }
        else {
            $storeFolder = 'pacientes';
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath."ID(".$request->get("id").")".$request->get("photo");
            if(file_exists($targetFile)) {
                unlink($targetFile);
                if($request->get("id") != 0){
                    $paciente = Paciente::find($request->get("id"));
                    $paciente->PHOTO = null;
                    $paciente->PHOTO_SIZE = null;
                    $paciente->save();
                }
            }
            return response()->json("Foto Eliminada", 200);
        }
    }
}
