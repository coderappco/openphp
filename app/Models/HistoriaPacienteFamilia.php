<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPacienteFamilia extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE_FAMILIA';

    protected $primaryKey = 'ID_HIST_PAC_FAMILIA';

    public $timestamps = false;

    public function historiap()
    {
        return $this->belongsTo(HistoriaPaciente::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function parentesco()
    {
        return $this->belongsTo(Parentesco::class, 'ID_PARENTESCO', 'ID_PARENTESCO');
    }

    public function ocupacion()
    {
        return $this->belongsTo(Ocupacion::class, 'ID_OCUPACION', 'ID_OCUPACION');
    }
}
