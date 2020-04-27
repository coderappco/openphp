<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MotivoConsulta extends Model
{
    protected $table = 'CIT_CFG_MOTIVO_CONSULTA';

    protected $primaryKey = 'ID_MOTIVO_CONSULTA';

    public $timestamps = false;
}
