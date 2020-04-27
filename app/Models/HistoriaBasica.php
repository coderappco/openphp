<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaBasica extends Model
{
    protected $table = 'HISTORIA_CFG_BASICA';

    protected $primaryKey = 'ID_HISTORIA_BASICA';

    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function parentesco()
    {
        return $this->belongsTo(Parentesco::class, 'ID_PARENTESCO', 'ID_PARENTESCO');
    }
}
