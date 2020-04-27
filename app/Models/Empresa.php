<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'CFG_EMPRESA';

    protected $primaryKey = 'ID_EMPRESA';

    public $timestamps = false;

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'ID_MUNICIPIO', 'ID_MUNICIPIO');
    }

    public function usuarios()
    {
        return $this->hasMany(UserEmpresa::class, 'ID_EMPRESA', 'ID_EMPRESA');
    }
}
