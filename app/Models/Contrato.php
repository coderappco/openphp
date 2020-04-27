<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{
    protected $table = 'FAC_CONTRATO';

    protected $primaryKey = 'ID_CONTRATO';

    public $timestamps = false;

    public function administradora()
    {
        return $this->belongsTo(Administradora::class, 'ID_ADMINISTRADORA', 'ID_ADMINISTRADORA');
    }

    public function paciente()
    {
        return $this->hasMany(PacienteContrato::class, 'ID_CONTRATO', 'ID_CONTRATO');
    }
}
