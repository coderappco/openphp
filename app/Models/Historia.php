<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historia extends Model
{
    protected $table = 'HISTORIA_CFG_VALIDACION';

    protected $primaryKey = 'ID_HISTORIA';

    public $timestamps = false;

    public function rango()
    {
        return $this->belongsTo(RangoEdades::class, 'ID_RANGO', 'ID_RANGO');
    }
}
