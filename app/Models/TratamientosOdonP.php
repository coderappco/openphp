<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TratamientosOdonP extends Model
{
    protected $table = 'CFG_TRAT_ODON_PADRE';

    protected $primaryKey = 'ID_TRAT_PADRE';

    public function hijos()
    {
        return $this->hasMany(TratamientosOdonH::class, 'ID_TRAT_PADRE', 'ID_TRAT_PADRE');
    }
}
