<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPacienteDiag extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_DIAG';

    protected $primaryKey = 'ID_HIST_PAC_DIAG';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function diagnostico()
    {
        return $this->belongsTo(Diagnosticos::class, 'ID_DIAGNOSTICO', 'ID_DIAGNOSTICO');
    }
}
