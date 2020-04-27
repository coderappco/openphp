<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    protected $table = 'CFG_EMPRESA_SEDE';

    protected $primaryKey = 'ID_SEDE';

    public $timestamps = false;

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'ID_MUNICIPIO', 'ID_MUNICIPIO');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'ID_EMPRESA', 'ID_EMPRESA');
    }

    public function laborales() {
        return $this->hasMany(Nolaborales::class, 'ID_SEDE', 'ID_SEDE');
    }

    public function agenda() {
        return $this->hasMany(Agenda::class, 'ID_SEDE', 'ID_SEDE');
    }
}
