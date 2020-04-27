<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPacienteOdontograma extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_ODONTOGRAMA';

    protected $primaryKey = 'ID_HIST_PAC_ODONT';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function diagnosticos()
    {
        return $this->belongsTo(DiagnosticoOdonH::class, 'DIAGNSOTICO', 'ID_DIAG_HIJO');
    }
}
