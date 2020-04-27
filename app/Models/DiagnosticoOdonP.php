<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiagnosticoOdonP extends Model
{
    protected $table = 'CGF_DIAG_ODON_PADRE';

    protected $primaryKey = 'ID_DIAG_PADRE';

    public function hijos()
    {
        return $this->hasMany(DiagnosticoOdonH::class, 'ID_DIAG_PADRE', 'ID_DIAG_PADRE');
    }
}
