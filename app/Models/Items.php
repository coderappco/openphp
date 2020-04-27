<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Items extends Model
{
    protected $table = 'FAC_ITEM';

    protected $primaryKey = 'ID_ITEM';

    public $timestamps = false;
}
