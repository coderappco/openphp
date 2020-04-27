<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMotivoConsulta extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CFG_MOTIVO_CONSULTA', function (Blueprint $table) {
            $table->increments('ID_MOTIVO_CONSULTA');
            $table->string('NOM_MOTIVO_CONSULTA');
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
        Schema::dropIfExists('CIT_CFG_MOTIVO_CONSULTA');
    }
}
