<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nolaborales extends Model
{
    protected $table = 'CIT_CFG_DIA_NO_LABORAL';

    protected $primaryKey = 'ID_DIA_NO_LABORAL';

    public $timestamps = false;

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'ID_SEDE', 'ID_SEDE');
    }
}
