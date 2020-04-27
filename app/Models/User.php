<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    use Notifiable;
    use HasRoles;

    protected $table = 'user';

    protected $primaryKey = 'ID_USUARIO';

    public function getAuthPassword()
    {
      	return $this->CONTRASENA;
    }

    public function prestador()
    {
        return $this->hasOne(UserPrestador::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function empresa()
    {
        return $this->hasOne(UserEmpresa::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function identificacion()
    {
        return $this->hasOne(TipoIdentificacion::class, 'ID_TIPO_IDENTIFICACION', 'ID_TIPO_IDEN');
    }
}
