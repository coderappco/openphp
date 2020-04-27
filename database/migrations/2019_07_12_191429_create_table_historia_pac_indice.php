<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaPacIndice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE_INDICE', function (Blueprint $table) {
            $table->increments('ID_HIST_PAC_INDICE');
            $table->integer('ID_HISTORIA_PACIENTE')->unsigned();
            $table->string('CAMPO');
            $table->integer('VALOR')->nullable();

            $table->foreign('ID_HISTORIA_PACIENTE')->references('ID_HISTORIA_PACIENTE')->on('HISTORIA_CFG_PACIENTE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE_INDICE');
    }
}
