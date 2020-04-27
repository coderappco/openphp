<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autorizacion extends Model
{
    protected $table = 'CIT_AUTORIZACION';

    protected $primaryKey = 'ID_AUTORIZACION';

    public $timestamps = false;

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function servicios()
    {
        return $this->hasMany(AutorizacionServicio::class, 'ID_AUTORIZACION', 'ID_AUTORIZACION');
    }

    public function citaauto()
    {
        return $this->hasMany(CitaAuto::class, 'ID_AUTORIZACION', 'ID_AUTORIZACION');
    }
}
