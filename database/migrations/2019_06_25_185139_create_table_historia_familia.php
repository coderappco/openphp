<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaFamilia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE_FAMILIA', function (Blueprint $table) {
            $table->increments('ID_HIST_PAC_FAMILIA');
            $table->integer('ID_HISTORIA_PACIENTE')->unsigned();
            $table->string('NOMBRE');
            $table->string('EDAD');
            $table->integer('ID_PARENTESCO')->unsigned();
            $table->integer('ID_OCUPACION')->unsigned();

            $table->foreign('ID_HISTORIA_PACIENTE')->references('ID_HISTORIA_PACIENTE')->on('HISTORIA_CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_PARENTESCO')->references('ID_PARENTESCO')->on('CFG_PARENTESCO');
            $table->foreign('ID_OCUPACION')->references('ID_OCUPACION')->on('CFG_OCUPACION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE_FAMILIA');
    }
}
