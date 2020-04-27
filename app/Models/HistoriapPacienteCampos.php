<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriapPacienteCampos extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_CAMPOS';

    protected $primaryKey = 'ID_HIST_PAC_CAMPOS';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }
}
