<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SedeCama extends Model
{
    protected $table = 'CFG_EMPRESA_SEDE_CAMA';

    protected $primaryKey = 'ID_SEDE_CAMA';

    public $timestamps = false;

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'ID_SEDE', 'ID_SEDE');
    }
}
