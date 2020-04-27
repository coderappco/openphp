<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserEmpresa extends Model
{
    protected $table = 'CFG_USER_EMPRESA';

    protected $primaryKey = 'ID_USER_EMPRESA';

    public $timestamps = false;

    public function users()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_EMPRESA', 'ID_EMPRESA');
    }
}
