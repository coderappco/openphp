<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoCitaHistoria extends Model
{
    protected $table = 'CIT_CFG_TIPO_CITA_FORMATO';

    protected $primaryKey = 'ID_TIPO_CITA_FORMATO';

    public $timestamps = false;

    public function historia()
    {
        return $this->belongsTo(Historia::class, 'ID_HISTORIA', 'ID_HISTORIA');
    }

    public function tipo()
    {
        return $this->belongsTo(TipoCita::class, 'ID_TIPO_CITA', 'ID_TIPO_CITA');
    }
}
