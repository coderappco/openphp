<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultorio extends Model
{
    protected $table = 'CFG_EMP_SEDE_CONSULTORIO';

    protected $primaryKey = 'ID_CONSULTORIO';

    public $timestamps = false;

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'ID_SEDE', 'ID_SEDE');
    }

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'ID_ESPECIALIDAD', 'ID_ESPECIALIDAD');
    }
}
