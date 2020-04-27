<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaExamenLaboratorio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE_EXAMENL', function (Blueprint $table) {
            $table->increments('ID_HIST_PAC_EXAMENL');
            $table->integer('ID_HISTORIA_PACIENTE')->unsigned();
            $table->integer('CANTIDAD');
            $table->string('OBSERVACIONES');
            $table->integer('ID_ITEM')->unsigned();

            $table->foreign('ID_HISTORIA_PACIENTE')->references('ID_HISTORIA_PACIENTE')->on('HISTORIA_CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_ITEM')->references('ID_ITEM')->on('FAC_ITEM');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE_EXAMENL');
    }
}
