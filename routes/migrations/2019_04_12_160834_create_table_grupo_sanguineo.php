<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableGrupoSanguineo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_GRUPO_SANGUINEO', function (Blueprint $table) {
            $table->increments('ID_GRP_SANG');
            $table->string('COD_GRP_SANG');
            $table->string('NOM_GRP_SANG');
            $table->boolean('ACTIVO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_GRUPO_SANGUINEO');
    }
}
