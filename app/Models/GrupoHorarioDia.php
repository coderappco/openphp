<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrupoHorarioDia extends Model
{
    protected $table = 'CFG_GRUPO_HORARIO_DIA';

    protected $primaryKey = 'ID_GRUPO_DIA';

    public $timestamps = false;

    public function grupo()
    {
        return $this->belongsTo(GrupoHorario::class, 'ID_GRUPO', 'ID_GRUPO');
    }
}
