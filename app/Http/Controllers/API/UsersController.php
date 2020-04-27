<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPrestador;
use App\Models\UserEmpresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UsersController extends Controller
{
    public function getUser($id)
    {
        $user = User::with(['roles', 'prestador.especialidad', 'empresa'])->where(['ID_USUARIO' => $id])->first();

        return response()->json($user);
    }

    public function getUsers(Request $request){
        $datos = User::with(['roles', 'empresa', 'identificacion']);
        if($request->get('empresa') != 0)
            $datos->whereHas('empresa', function($q) use ($request) {
                $q->where('ID_EMPRESA', $request->get('empresa'));
            });
        $users = $datos->get();
        return response()->json(["draw"=> 1, "recordsTotal"=> count($users),"recordsFiltered"=> count($users),'data' => $users]);
    }

    public function getUserIdent(Request $request) {
        if($request->get('ident') != null) {
            $user = User::where(['NO_IDENTIFICACION' => $request->get('ident')])->first();
            if($user != null)
                return response()->json(false);
            return response()->json(true);
        }
        else
        if($request->get('user') != null) {
            $user = User::where(['USUARIO' => $request->get('user')])->first();
            if($user != null)
                return response()->json(false);
            return response()->json(true);
        }
        else
        if($request->get('correo') != null) {
            $user = User::where(['CORREO' => $request->get('correo')])->first();
            if($user != null)
                return response()->json(false);
            return response()->json(true);
        }
    }

    public function getPrestadores(Request $request)
    {
        $search = (null !== $request->get('q')) ? $request->get('q') : '';
        $prestadores = null;
        if($search != '')
            $prestadores = User::with(['prestador','identificacion'])->role(['PRESTADOR'])->where(
                function($q) use ($search) {
                    $q->orwhere('NOMBRES', 'like', "%$search%");
                    $q->orwhere('APELLIDOS', 'like', "%$search%");
                    $q->orwhere('NO_IDENTIFICACION', 'like', "%$search%");
                })->get();
        else
            $prestadores = User::with(['prestador','identificacion'])->role(['PRESTADOR'])->get();

        $resultado = [];
        foreach ($prestadores as $key => $value) {
            $resultado[$key] = ['id' => $value['ID_USUARIO'], 'text' => $value['NOMBRES']." ".$value['APELLIDOS']];
        }
        return response()->json(['results' => $resultado]);
    }

    public function ListPrestadores(Request $request)
    {
        $prestadores = null;
        if($request->get('empresa') != 'null') {
            $presta = User::with(['prestador', 'empresa', 'identificacion'])->role(['PRESTADOR'])->get();
            $pos = 0;
            for($i = 0; $i < count($presta); $i++){
                if($presta[$i]->empresa != null && $presta[$i]->empresa->ID_EMPRESA == $request->get('empresa')) {
                    $prestadores[$pos] = $presta[$i];
                    $pos++;
                }
            }
        }
        else
            $prestadores = User::with(['prestador','identificacion'])->role(['PRESTADOR'])->get();

        return response()->json($prestadores);
    }

    public function logout(Request $request) {
        /*$client = ClientConect::where(['token' => $request->get('token')])->first();
        if($client != null) {
            ClientConect::where(['token' => $request->get('token')])->update(['offline' => Carbon::now()->format('Y-m-d H:i')]);
        }*/
        return response()->json("Usuario deslogueado", 200);
    }

    public function logins(Request $request) {

        $user = User::where(['USUARIO' => $request->get('usuario'), 'ACTIVO' => 1, 'VISIBLE' => 1])->first();
        if ($user != null) {
            if(Hash::check($request->get('password'), $user->CONTRASENA)) {
                $success['token'] = base64_encode($user->ID_USUARIO." ".$user->CORREO." ".Carbon::now()->format('Y-m-d H:i')." ".request()->ip());
                $success['user'] = $user;
                $success['role'] = $user->roles()->pluck('name');
                $existeadmin = false;
                for($i = 0; $i < count($user->roles()->pluck('name')); $i++) {
                    if($user->roles()->pluck('name')[$i] == "ADMINISTRADOR") {
                        $existeadmin = true;
                    }
                }
                if($existeadmin == false) {
                    $success['empresa_id'] = $user->empresa->ID_EMPRESA;
                    $success['empresa'] = $user->empresa->NOM_EMPRESA;
                }
                $success['url'] = '/boards';
                return response()->json($success, 200 );
            }
            else
                return response()->json( ['logins' => 'Usuario o Contrasena incorrectos'], 401 );
        }
        return response()->json( ['logins' => 'Usuario o Contrasena incorrectos'], 401 );
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if($request->input('CORREO') != null) {
            $userold = User::where('CORREO', '=', $request->input('CORREO'))->first();
            if($userold != null && $userold->ID_USUARIO != $user->ID_USUARIO) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error',
                    'errors' => ['email' => ['Correo en uso']],
                ], 422);
            }
        }
        $user->NOMBRES = $request->get('NOMBRES');
        $user->APELLIDOS = $request->get('APELLIDOS');
        $user->CORREO = $request->get('CORREO');
        $user->NO_IDENTIFICACION = $request->get('NO_IDENTIFICACION');
        $user->USUARIO = $request->get('USUARIO');
        $user->ID_TIPO_IDEN = $request->get('ID_TIPO_IDEN');
        $user->ACTIVO = $request->get('ACTIVO');
        $user->TARJETA = $request->get('TARJETA');
        $user->VISIBLE = $request->get('VISIBLE');
        if($request->get('CONTRASENA') != "")
            $user->CONTRASENA = Hash::make($request->get('CONTRASENA'));

        if ($handle = opendir('temp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'photos'; 
                    if($user->FOTO != null) {
                        if(file_exists($storeFolder.$ds."ID(".$id.")".$user->FOTO)) 
                            unlink($storeFolder.$ds."ID(".$id.")".$user->FOTO);
                    } 
                    $fileMoved = rename('temp'.$ds.$entry, $storeFolder.$ds."ID(".$id.")".$entry);
                    $user->FOTO = $entry;
                    $user->photo_size = filesize($storeFolder.$ds."ID(".$id.")".$entry);
                }
            }
            closedir($handle);
        }
        $user->save();

        $roles = $request->get('rol');
        $rol = [];
        $existepre = false;
        $existeadmin = false;
        for($i = 0; $i < count($roles); $i++){
            $r = explode(" ", $roles[$i]);
            $ro = explode("'", $r[1]);
            $rol[$i] = $ro[1];
            if($r[1] == "'PRESTADOR'") {
                $existepre = true;
            }
            if($r[1] == "'ADMINISTRADOR'") {
                $existeadmin = true;
            }
        }

        $user->syncRoles($rol);

        if($existepre == true) {
            $prestador = $user->prestador != null ? $user->prestador : new UserPrestador();
            $prestador->ID_USUARIO = $user->ID_USUARIO;
            $prestador->ID_ESPECIALIDAD = $request->get('ID_ESPECIALIDAD');
            $prestador->CONCURRENCIA = $request->get('CONCURRENCIA');
            $prestador->save();

            if ($handle = opendir('tempf')) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        $ds = DIRECTORY_SEPARATOR; 
                        $storeFolder = 'firmas'; 
                        if($prestador->FIRMA != null) {
                            if(file_exists($storeFolder.$ds."ID(".$id.")".$prestador->FIRMA)) 
                                unlink($storeFolder.$ds."ID(".$id.")".$prestador->FIRMA);
                        }   
                        $fileMoved = rename('tempf'.$ds.$entry, $storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                        $prestador->FIRMA = $entry;
                        $prestador->FIRMA_SIZE = filesize($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                        $prestador->FIRMA_TEXT = $request->get('FIRMATEXT');   
                        $prestador->save();
                    }
                }
                closedir($handle);
            }
        }
        else {
            $prestador = $user->prestador != null ? $user->prestador : null;
            if($prestador != null) {
                $ds = DIRECTORY_SEPARATOR; 
                $storeFolder = 'firmas'; 
                if($prestador->FIRMA != null) {
                    if(file_exists($storeFolder.$ds."ID(".$id.")".$prestador->FIRMA)) 
                        unlink($storeFolder.$ds."ID(".$id.")".$prestador->FIRMA);
                }
                $prestador->delete();
            }
        }

        if($existeadmin == false) {
            $empresa = $user->empresa != null ? $user->empresa : new UserEmpresa();
            $empresa->ID_USUARIO = $user->ID_USUARIO;
            $empresa->ID_EMPRESA = $request->get('ID_EMPRESA');
            $empresa->save();
        }
        else {
            $empresa = $user->empresa != null ? $user->empresa : null;
            if($empresa != null)
                $empresa->delete();
        }

        return response()->json('Usuario Actualizado', 200 );
    }

    public function createUser(Request $request)
    {
        $user = new User(); 

        $user->NOMBRES = $request->get('NOMBRES');
        $user->APELLIDOS = $request->get('APELLIDOS');
        $user->CORREO = $request->get('CORREO');
        $user->NO_IDENTIFICACION = $request->get('NO_IDENTIFICACION');
        $user->USUARIO = $request->get('USUARIO');
        $user->ID_TIPO_IDEN = $request->get('ID_TIPO_IDEN');
        $user->ACTIVO = $request->get('ACTIVO');
        $user->VISIBLE = $request->get('VISIBLE');
        $user->CONTRASENA = Hash::make($request->get('CONTRASENA'));
        $user->TARJETA = $request->get('TARJETA');

        $user->save();
        $roles = $request->get('rol');
        $rol = [];
        for($i = 0; $i < count($roles); $i++){
            $r = explode(" ", $roles[$i]);
            $ro = explode("'", $r[1]);
            $rol[$i] = $ro[1];
            if($r[1] == "'PRESTADOR'") {
                $prestador = new UserPrestador();
                $prestador->ID_USUARIO = $user->ID_USUARIO;
                $prestador->ID_ESPECIALIDAD = $request->get('ID_ESPECIALIDAD');
                $prestador->CONCURRENCIA = $request->get('CONCURRENCIA');
                $prestador->save();

                if ($handle = opendir('tempf')) {
                    while (false !== ($entry = readdir($handle))) {
                        if ($entry != "." && $entry != "..") {
                            $ds = DIRECTORY_SEPARATOR; 
                            $storeFolder = 'firmas';  
                            $fileMoved = rename('tempf'.$ds.$entry, $storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                            $prestador->FIRMA = $entry;
                            $prestador->FIRMA_SIZE = filesize($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                            $prestador->FIRMA_TEXT = $request->get('FIRMATEXT');    
                            $prestador->save();
                        }
                    }
                    closedir($handle);
                }
            }

            if($request->get('ID_EMPRESA') != null && $r[1] != "'ADMINISTRADOR'") {
                $empresa = new UserEmpresa();
                $empresa->ID_USUARIO = $user->ID_USUARIO;
                $empresa->ID_EMPRESA = $request->get('ID_EMPRESA');
                $empresa->save();
            }
        }
        $user->assignRole($rol);

        if ($handle = opendir('temp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR; 
                    $storeFolder = 'photos';  
                    $fileMoved = rename('temp'.$ds.$entry, $storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                    $user->FOTO = $entry;
                    $user->photo_size = filesize($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$entry);
                    $user->save();
                }
            }
            closedir($handle);
        }
        return response()->json("Usuario creado", 200 );
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if($user->FOTO != null) {
            $ds = DIRECTORY_SEPARATOR; 
            $storeFolder = 'photos';
            if(file_exists($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$user->FOTO)) 
                unlink($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$user->FOTO);
        } 
        if($user->prestador != null) {
            if($user->prestador->FIRMA != null) {
                $ds = DIRECTORY_SEPARATOR; 
                $storeFolder = 'firmas';
                if(file_exists($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$user->prestador->FIRMA)) 
                    unlink($storeFolder.$ds."ID(".$user->ID_USUARIO.")".$user->prestador->FIRMA);
                }
        }
        $user->delete();
        return response()->json('Usuario Eliminado', 200 );
    }

    public function photo(Request $request) {
        if ($handle = opendir('temp')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR;
                    unlink('temp'.$ds.$entry);
                }
            }
            closedir($handle);
        }
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'temp';         
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
        $storeFolder = 'temp';
        $targetPath = $storeFolder . $ds;
        $targetFile = $targetPath.$request->get("photo");
        if($request->get("id") == 0 && file_exists($targetFile)) {
            unlink($targetFile);
            return response()->json("Foto eliminada", 200);
        }
        else {
            $storeFolder = 'photos';
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath."ID(".$request->get("id").")".$request->get("photo");
            if(file_exists($targetFile)) {
                unlink($targetFile);
                if($request->get("id") != 0){
                    $personal = User::find($request->get("id"));
                    $personal->FOTO = null;
                    $personal->save();
                }
            }
            return response()->json("Foto eliminada", 200);
        }
    }

    public function firma(Request $request) {
        if ($handle = opendir('tempf')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    $ds = DIRECTORY_SEPARATOR;
                    unlink('tempf'.$ds.$entry);
                }
            }
            closedir($handle);
        }
        $ds = DIRECTORY_SEPARATOR; 
        $storeFolder = 'tempf';         
        if(!empty($_FILES)) {   
            $tempFile = $_FILES['file']['tmp_name'];     
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath.$_FILES['file']['name'];
            move_uploaded_file($tempFile,$targetFile);          
        }
        return response()->json("Firma asignada", 200);
    }

    public function removeFirmas(Request $request) {
        $ds = DIRECTORY_SEPARATOR;
        $storeFolder = 'tempf';
        $targetPath = $storeFolder . $ds;
        $targetFile = $targetPath.$request->get("firma");
        if($request->get("id") == 0 && file_exists($targetFile)) {
            unlink($targetFile);
            return response()->json("Firma eliminada", 200);
        }
        else {
            $storeFolder = 'firmas';
            $targetPath = $storeFolder . $ds;
            $targetFile = $targetPath."ID(".$request->get("id").")".$request->get("firma");
            if(file_exists($targetFile)) {
                unlink($targetFile);
                if($request->get("id") != 0){
                    $personal = UserPrestador::where(['ID_USUARIO' => $request->get("id")])->first();
                    $personal->FIRMA = null;
                    $personal->FIRMA_SIZE = null;    
                    $personal->save();
                }
            }
            return response()->json("Foto eliminada", 200);
        }
    }
}
