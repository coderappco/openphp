<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PacienteContrato extends Model
{
    protected $table = 'CFG_PACIENTE_CONTRATO';

    protected $primaryKey = 'ID_PAC_CONTRATO';

    public $timestamps = false;

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function contrato()
    {
        return $this->belongsTo(Contrato::class, 'ID_CONTRATO', 'ID_CONTRATO');
    }
}
