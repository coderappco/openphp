<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPrestador extends Model
{
    protected $table = 'CFG_USER_PRESTADOR';

    protected $primaryKey = 'ID_USER_PRESTADOR';

    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'ID_ESPECIALIDAD', 'ID_ESPECIALIDAD');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'ID_PRESTADOR', 'ID_USER_PRESTADOR');
    }

    public function agenda()
    {
        return $this->hasMany(Agenda::class, 'ID_USER_PRESTADOR', 'ID_USER_PRESTADOR');
    }
}
