<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    protected $table = 'CFG_AGENDA';

    protected $primaryKey = 'ID_AGENDA';

    public $timestamps = false;

    public function grupo()
    {
        return $this->belongsTo(GrupoHorario::class, 'ID_GRUPO', 'ID_GRUPO');
    }

    public function prestador()
    {
        return $this->belongsTo(UserPrestador::class, 'ID_USER_PRESTADOR', 'ID_USER_PRESTADOR');
    }

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'ID_SEDE', 'ID_SEDE');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'ID_AGENDA', 'ID_AGENDA');
    }
}
