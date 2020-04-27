<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPacienteOdonTrat extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_ODON_TRAT';

    protected $primaryKey = 'ID_HIST_PAC_ODON_TRAT';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function tratamientos()
    {
        return $this->belongsTo(TratamientosOdonH::class, 'TRATAMIENTO', 'ID_TRAT_HIJO');
    }
}
