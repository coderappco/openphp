<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiagnosticoOdonH extends Model
{
    protected $table = 'CGF_DIAG_ODON_HIJO';

    protected $primaryKey = 'ID_DIAG_HIJO';

    public function padre()
    {
        return $this->belongsTo(DiagnosticoOdonP::class, 'ID_DIAG_PADRE', 'ID_DIAG_PADRE');
    }
}
