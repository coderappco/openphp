<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoCita extends Model
{
    protected $table = 'CIT_CFG_TIPO_CITA';

    protected $primaryKey = 'ID_TIPO_CITA';

    public $timestamps = false;

    public function item()
    {
        return $this->belongsTo(Items::class, 'ID_ITEM', 'ID_ITEM');
    }

    public function registros()
    {
        return $this->hasMany(TipoCitaHistoria::class, 'ID_TIPO_CITA', 'ID_TIPO_CITA');
    }
}
