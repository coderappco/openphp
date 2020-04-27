<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TratamientosOdonH extends Model
{
    protected $table = 'CFG_TRAT_ODON_HIJO';

    protected $primaryKey = 'ID_TRAT_HIJO';

    public function padre()
    {
        return $this->belongsTo(TratamientosOdonP::class, 'ID_TRAT_PADRE', 'ID_TRAT_PADRE');
    }

    public function historia()
    {
        return $this->HasMany(HistoriaPacienteOdonTrat::class, 'TRATAMIENTO', 'ID_TRAT_HIJO');
    }
}
