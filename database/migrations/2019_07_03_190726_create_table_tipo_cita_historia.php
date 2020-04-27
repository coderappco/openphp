<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTipoCitaHistoria extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CFG_TIPO_CITA_FORMATO', function (Blueprint $table) {
            $table->increments('ID_TIPO_CITA_FORMATO');
            $table->integer('ID_TIPO_CITA')->unsigned(); //IDENTIFICADOR DE LA EMPRESA
            $table->integer('ID_HISTORIA')->unsigned(); //IDENTIFICADOR DE LA EMPRESA

            $table->foreign('ID_TIPO_CITA')->references('ID_TIPO_CITA')->on('CIT_CFG_TIPO_CITA')->onDelete('cascade');
            $table->foreign('ID_HISTORIA')->references('ID_HISTORIA')->on('HISTORIA_CFG_VALIDACION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_CFG_TIPO_CITA_FORMATO');
    }
}
