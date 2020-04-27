<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'CIT_CITA';

    protected $primaryKey = 'ID_CITA';

    public $timestamps = false;

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function prestador()
    {
        return $this->belongsTo(UserPrestador::class, 'ID_PRESTADOR', 'ID_USER_PRESTADOR');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function servicio()
    {
        return $this->belongsTo(Items::class, 'ID_ITEM', 'ID_ITEM');
    }

    public function motivoc()
    {
        return $this->belongsTo(MotivoConsulta::class, 'ID_MOTIVO_CONSULTA', 'ID_MOTIVO_CONSULTA');
    }

    public function consultorio()
    {
        return $this->belongsTo(Consultorio::class, 'ID_CONSULTORIO', 'ID_CONSULTORIO');
    }

    public function autorizacion()
    {
        return $this->hasOne(CitaAuto::class, 'ID_CITA', 'ID_CITA');
    }

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'ID_AGENDA', 'ID_AGENDA');
    }
}
