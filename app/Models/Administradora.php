<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administradora extends Model
{
    protected $table = 'FAC_ADMINISTRADORA';

    protected $primaryKey = 'ID_ADMINISTRADORA';

    public $timestamps = false;

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'ID_MUNICIPIO', 'ID_MUNICIPIO');
    }

    public function identificacion()
    {
        return $this->hasOne(TipoIdentificacion::class, 'ID_TIPO_IDENTIFICACION', 'ID_TIPO_DOCUMENTO');
    }
}
