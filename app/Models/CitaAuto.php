<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CitaAuto extends Model
{
    protected $table = 'CIT_CITA_AUTORIZACION';

    protected $primaryKey = 'ID_CITA_AUTO';

    public $timestamps = false;

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'ID_CITA', 'ID_CITA');
    }

    public function autorizacion()
    {
        return $this->belongsTo(Autorizacion::class, 'ID_AUTORIZACION', 'ID_AUTORIZACION');
    }
}
