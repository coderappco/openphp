<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriapacienteMedicamento extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_MEDICAMENTO';

    protected $primaryKey = 'ID_HIST_PAC_MEDICAMENTO';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function items()
    {
        return $this->belongsTo(Items::class, 'ID_ITEM', 'ID_ITEM');
    }
}
