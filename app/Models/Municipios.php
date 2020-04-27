<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipios extends Model
{
    protected $table = 'CFG_MUNICIPIOS';

    protected $primaryKey = 'ID_MUNICIPIO';

    public function empresa()
    {
        return $this->hasMany(Empresa::class, 'ID_MUNICIPIO', 'ID_MUNICIPIO');
    }

    public function dpto()
    {
        return $this->belongsTo(Departamentos::class, 'ID_DPTO', 'ID_DPTO');
    }
}
