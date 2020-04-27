<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPacienteOdonCons extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_ODONT_CONS';

    protected $primaryKey = 'ID_HIST_PAC_ODON_CONS';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }
}
