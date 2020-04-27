<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminOrdenImport extends Model
{
    protected $table = 'FAC_ADMINISTRADORA_IMPORT';

    protected $primaryKey = 'ID_ADMIN_IMPORT';

    public $timestamps = false;

    public function administradora()
    {
        return $this->belongsTo(FAC_ADMINISTRADORA::class, 'ID_ADMINISTRADORA', 'ID_ADMINISTRADORA');
    }
}
