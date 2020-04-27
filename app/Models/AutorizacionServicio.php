<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutorizacionServicio extends Model
{
    protected $table = 'CIT_AUTORIZACION_SERVICIO';

    protected $primaryKey = 'ID_AUTORIZACION_SERV';

    public $timestamps = false;

    public function item()
    {
        return $this->belongsTo(Items::class, 'ID_ITEM', 'ID_ITEM');
    }
}
