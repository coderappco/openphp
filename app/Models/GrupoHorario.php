<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrupoHorario extends Model
{
    protected $table = 'CFG_GRUPO_HORARIO';

    protected $primaryKey = 'ID_GRUPO';

    public $timestamps = false;

    public function dias()
    {
        return $this->hasMany(GrupoHorarioDia::class, 'ID_GRUPO', 'ID_GRUPO');
    }
}
