<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoIdentificacion extends Model
{
    protected $table = 'CFG_TIPO_IDENTIFICACION';

    protected $primaryKey = 'ID_TIPO_IDENTIFICACION';

    public $timestamps = false;
}
